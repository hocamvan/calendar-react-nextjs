type CalendarEvent = {
  id: number
  start: Date
  duration: number
  end: Date
}

type Column = {
  id: number
  events: CalendarEvent[]
}

type Group = {
  id: number
  columns: Column[]
}

const transformEvent = (event: {id: number; start: string; duration: number}): CalendarEvent => {
  const [h, m] = event.start.split(':')

  const date = new Date('2024-01-01')
  date.setHours(Number(h), Number(m), 0, 0)

  return {
    ...event,
    start: date,
    end: new Date(date.getTime() + event.duration * 60 * 1000),
  }
}

const areEventsOverlapping = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
  const startEvent1 = event1.start.getTime()
  const endEvent1 = event1.end.getTime()
  const startEvent2 = event2.start.getTime()
  const endEvent2 = event2.end.getTime()

  if (
    (startEvent2 >= startEvent1 && startEvent2 < endEvent1) ||
    (startEvent1 >= startEvent2 && startEvent1 < endEvent2)
  ) {
    return true
  }

  return false
}

// Find a group of events overlappings who has at least one event overlaps the target event
const findGroupEventsOverlappings = (event: CalendarEvent, groups: Group[]) => {
  for (const group of groups) {
    for (const column of group.columns) {
      for (const eventInColumn of column.events) {
        const isEventOverlapped = areEventsOverlapping(event, eventInColumn)

        if (isEventOverlapped) {
          return group
        }
      }
    }
  }
}

// In a group, find the appropriate column who has any event overlap to add the event to.
const findColumnOfEvents = (event: CalendarEvent, group: Group) => {
  for (const column of group.columns) {
    let isOverlap = false

    for (const eventInColumn of column.events) {
      const isEventOverlapped = areEventsOverlapping(event, eventInColumn)
      if (isEventOverlapped) {
        isOverlap = true
        break
      }
    }

    if (!isOverlap) {
      return column
    }
  }
}

export const createDataStructure = (
  source: Array<{id: number; start: string; duration: number}>,
) => {
  const groups: Group[] = []

  // 0. Transform orderer the events
  const dataOrdered = source
    .map((e) => transformEvent(e))
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  for (const event of dataOrdered) {
    // 1. Find the group of events which are overlapped
    //   - if we find the group, select this group
    //   - if we cannot find a group, create a new group and select that group
    let group = findGroupEventsOverlappings(event, groups)
    if (!group) {
      group = {id: groups.length + 1, columns: []}
      groups.push(group)
    }

    // 2. Find the column (inside the previously founded group)
    //   - if the column is found, select this column
    //   - if we cannot find a column, create a new column and select that column
    let column = findColumnOfEvents(event, group)
    if (!column) {
      column = {id: group.columns.length + 1, events: []}
      group.columns.push(column)
    }

    // 3. Add the event to the column
    column.events.push(event)
  }

  return groups
}
