import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { i18n } from '../assets/locale/i18n'

function DiagnosticDropDown({ variable, type, setListDiagnostics }) {
  const [diagnostics, setDiagnostics] = useState([])
  const [diagnostic, setDiagnostic] = useState(null)
  const [isFocus, setIsFocus] = useState(false)

  const handleChangeDiagnostic = SelectDiagnostic => {
    setDiagnostic(SelectDiagnostic)
    console.log(variable)

    setListDiagnostics(prevState => {
      const newState = prevState
      const searchDiagnostic = newState.find(
        item => item.id == SelectDiagnostic.variableSensorTypeId,
      )

      if (searchDiagnostic) {
        searchDiagnostic.variableSensorTypeId =
          SelectDiagnostic.variableSensorTypeId
        searchDiagnostic.GeotabCode = SelectDiagnostic.code
        searchDiagnostic.VaraibleSensorGeotabDiagnosticId = SelectDiagnostic.id
      } else {
        const newDiagnostic = {
          id:
            type == 'insert'
              ? SelectDiagnostic.variableSensorTypeId
              : variable.blegSensorMapingId,
          BlegSensorId: type == 'insert' ? 0 : variable.sensorId,
          variableSensorTypeId: SelectDiagnostic.variableSensorTypeId,
          geotabCode: SelectDiagnostic.code,
          varaibleSensorGeotabDiagnosticId: SelectDiagnostic.id,
        }

        newState.push(newDiagnostic)
      }

      return newState
    })
  }

  useEffect(() => {
    if (type == 'edit') {
      let searchCurrentDiagnostic = variable.diagnostics.find(
        item => item.id == variable.currentDiagnosticId,
      )
      console.log(
        'diagnosticos',
        variable.diagnostics,
        'current',
        variable.currentDiagnosticId,
      )
      setDiagnostic(searchCurrentDiagnostic)
    }
    setDiagnostics(variable.diagnostics)
  }, [])

  return (
    <View>
      <Text style={styles.txtTitleParameter}>
        {i18n._locale == 'es' ? variable.name : variable.nameEn} {' - '}
        {variable.unit}
      </Text>
      <Dropdown
        style={[styles.dropdown, { borderColor: isFocus ? '#00317F' : 'grey' }]}
        placeholderStyle={styles.textDropDown}
        selectedTextStyle={styles.textDropDown}
        data={diagnostics}
        maxHeight={150}
        labelField="description"
        valueField="description"
        placeholder={i18n.t('SensorRegister.SelectParameter')}
        searchPlaceholder={i18n.t('SensorRegister.Search') + '...'}
        value={diagnostic}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => handleChangeDiagnostic(item)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  txtTitleParameter: {
    fontSize: 16,
    color: '#00317F',
    marginVertical: 15,
  },
  dropdown: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  textDropDown: { fontSize: 16 },
})

export default DiagnosticDropDown
