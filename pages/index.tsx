import {useMemo} from 'react'
import {FormattedTime} from 'react-intl'
import {type NextPage} from 'next'
import data from '@/data/input.json'
import {createDataStructure} from '@/lib/calendar'
import styles from '@/styles/event-card.module.css'

const Calendar: NextPage = () => {
  const dataStructured = useMemo(() => createDataStructure(data), [])

  return (
    <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
      {dataStructured.map((group) =>
        group.columns.map((column, index) =>
          column.events.map((elm) => (
            <div
              key={elm.id}
              className={styles.root}
              style={{
                left: `${(100 * index) / group.columns.length}%`,
                width: `${100 / group.columns.length}%`,
                top: `${(100 * ((elm.start.getHours() - 9) * 60 + elm.start.getMinutes())) / 720}%`,
                height: `${(100 * elm.duration) / 720}%`,
              }}
            >
              Event {elm.id} : {elm.duration} minutes (<FormattedTime value={elm.start} /> -{' '}
              <FormattedTime value={elm.end} />)
            </div>
          )),
        ),
      )}
    </div>
  )
}

export default Calendar
