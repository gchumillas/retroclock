import React from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import { useNavigate } from 'react-router-native'
import { useTranslation } from 'react-i18next'
import { useKeepAwake } from 'expo-keep-awake'
import { StatusBar } from 'expo-status-bar'
import {
  PALETTE, SUPPORTED_LANGUAGES, FALLBACK_LANGUAGE, GAP
} from '~/src/constants'
import {
  useTimeColor,
  useTimeFormat,
  useShowSeconds,
  useShowDate,
  useShowBattery,
  useTimeFont
} from '~/src/store/hooks'
import { useBatteryLevel } from '~/src/libs/battery'
import { useOrientation } from '~/src/libs/orientation'
import dayjs from '~/src/libs/dayjs'
import ModalMenu, { MenuItem } from '~/src/components/ModalMenu'
import IconButton from '~/src/components/buttons/IconButton'
import BatteryIcon from '~/src/components/BatteryIcon'
import TimeDisplay from '~/src/components/displays/TimeDisplay'
import DateDisplay from '../components/displays/DateDisplay'
import SettingsIcon from '~/assets/icons/settings-icon.svg'

const HomePage = () => {
  useKeepAwake()
  const { t, i18n } = useTranslation('home')
  const navigate = useNavigate()
  const orientation = useOrientation()
  const level = useBatteryLevel()
  const [showModalMenu, setShowModalMenu] = React.useState(false)
  const [time, setTime] = React.useState(dayjs())
  const { timeColor } = useTimeColor()
  const { timeFont } = useTimeFont()
  const { timeFormat } = useTimeFormat()
  const { showSeconds } = useShowSeconds()
  const { showDate } = useShowDate()
  const { showBattery } = useShowBattery()

  React.useEffect(() => {
    const lang = i18n.resolvedLanguage
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      dayjs.locale(lang)
    } else {
      dayjs.locale(FALLBACK_LANGUAGE)
    }
  }, [i18n.resolvedLanguage])

  React.useEffect(() => {
    const updateTime = () => setTime(dayjs())
    const i = setInterval(() => updateTime(), 333)
    updateTime()
    return () => clearInterval(i)
  }, [])

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.display}>
        <TimeDisplay
          value={time}
          color={timeColor}
          format={timeFormat}
          showSeconds={showSeconds}
          font={timeFont}
        />
        {showDate && (
          <DateDisplay value={time} color={timeColor} style={styles.date} />
        )}
        {showBattery && <BatteryIcon value={100 * level} color={timeColor} />}
      </View>
      {orientation == 'portrait' && (
        <IconButton
          icon={<SettingsIcon width={36} height={32} fill={timeColor} />}
          onPress={() => setShowModalMenu(true)}
        />
      )}
      <ModalMenu open={showModalMenu} onClose={() => setShowModalMenu(false)}>
        <MenuItem
          label={t`preferences`}
          onPress={() => navigate('/settings')}
        />
        <MenuItem
          label={t`fonts`}
          onPress={() => navigate('/fonts')}
        />
        <MenuItem
          label={t`colors`}
          onPress={() => navigate('/colors')}
        />
      </ModalMenu>
      <StatusBar hidden />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: PALETTE.black
  },
  display: {
    alignItems: 'center',
    paddingHorizontal: 4 * GAP
  },
  date: {
    marginBottom: 1.5 * GAP
  }
})

export default HomePage