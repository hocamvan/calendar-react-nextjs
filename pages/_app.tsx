import type {AppProps} from 'next/app'
import {IntlProvider} from 'react-intl'
import '@/styles/globals.css'

const App = ({Component, pageProps}: AppProps) => {
  return (
    <IntlProvider locale='fr' timeZone='Europe/Paris'>
      <Component {...pageProps} />
    </IntlProvider>
  )
}

export default App
