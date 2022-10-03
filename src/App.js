import React from 'react'
import { NativeRouter, Routes, Route } from 'react-router-native'
import { Provider } from 'react-redux'
import { useFonts } from 'expo-font'
import {
  ShareTechMono_400Regular as shareTechMono400Regular
} from '@expo-google-fonts/share-tech-mono'
import { getConfig } from './providers/cache'
import {
  useTimeFormat, useShowSeconds, useShowDate, useShowBattery
} from './store/hooks'
import Loading from './components/Loading'
import HomePage from './pages/HomePage'
import SettingsPage from './pages/SettingsPage'
import FontsPage from './pages/FontsPage'
import './intl'
import store from './store'

const AppLoader = () => {
  const [fontsLoaded] = useFonts({ shareTechMono400Regular })
  const [configLoading, setConfigLoading] = React.useState(false)
  const [_timeFormat, setTimeFormat] = useTimeFormat()
  const [_showSeconds, setShowSeconds] = useShowSeconds()
  const [_showDate, setShowDate] = useShowDate()
  const [_showBattery, setShowBattery] = useShowBattery()

  React.useEffect(() => {
    setConfigLoading(true)
    getConfig()
      .then((config) => {
        setTimeFormat(config.timeFormat)
        setShowSeconds(config.showSeconds)
        setShowDate(config.showDate)
        setShowBattery(config.showBattery)
      })
      .finally(() => {
        setConfigLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!fontsLoaded || configLoading) {
    return <Loading />
  }

  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/fonts" element={<FontsPage />} />
      </Routes>
    </NativeRouter>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <AppLoader />
    </Provider>
  )
}

export default App