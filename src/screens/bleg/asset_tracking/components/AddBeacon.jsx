import React, { useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { Checkbox, RadioButton } from 'react-native-paper'
import { i18n } from '../../../../assets/locale/i18n'

function AddBeacon({ open, setOpen, sensorTypes, handleAddNewBeacon }) {
  const [sensorType, setSensorType] = useState(null)
  const [variablesSensorTypes, setVariablesSensorTypes] = useState([])
  const [variableIdentifier, setVariableIdentifier] = useState(null)
  const [variableSelected, setVariableSelected] = useState(null)
  const [isFocus, setIsFocus] = useState(false)
  const [isIdentifier, setIsIdentifier] = useState(false)

  const handleChangeSensorType = item => {
    const identifier = item.variablesSensorType.find(
      x => x.name == null && x.nameEn == null,
    )
    let variableSensorType = []

    if (identifier) {
      variableSensorType = item.variablesSensorType.filter(x => x.name != null)
      setVariableIdentifier(identifier)
    } else {
      setVariableIdentifier(null)
      variableSensorType = item.variablesSensorType
    }

    setSensorType(item)
    setVariablesSensorTypes(variableSensorType)
  }

  const handleSelectIdentifier = () => {
    setIsIdentifier(!isIdentifier)
  }

  const handleSave = () => {
    if ((!sensorType || !variableSelected) && !isIdentifier) return

    const variable =
      variableSelected == null ? variableIdentifier : variableSelected

    handleAddNewBeacon(sensorType, variable)
    setSensorType(null)
    setVariablesSensorTypes([])
    setVariableSelected(null)
    setVariableIdentifier(null)
    setOpen(false)
  }

  const handleCancel = () => {
    setSensorType(null)
    setVariablesSensorTypes([])
    setVariableSelected(null)
    setVariableIdentifier(null)
    setOpen(false)
  }

  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View style={styles.mainContainer}>
        <View style={styles.centerModalContainer}>
          <View style={styles.selectTypeContainer}>
            {/* Types of sensor */}
            <Text style={styles.txtTitleField}>
              {i18n.t('AssetTracker.TypesSensor')}
            </Text>
            <Dropdown
              style={[
                styles.dropdown,
                { borderColor: isFocus ? '#00317F' : 'grey' },
              ]}
              placeholderStyle={styles.textDropDown}
              selectedTextStyle={styles.textDropDown}
              data={sensorTypes}
              maxHeight={300}
              labelField={i18n._locale == 'es' ? 'name' : 'nameEn'}
              valueField={i18n._locale == 'es' ? 'name' : 'nameEn'}
              placeholder={i18n.t('AssetTracker.SelectTypeSensor')}
              searchPlaceholder={i18n.t('AssetTracker.Search' + '...')}
              value={sensorType}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => handleChangeSensorType(item)}
            />
            {/* Variable identifier*/}
            {variableIdentifier && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  color="#003180"
                  status={isIdentifier ? 'checked' : 'unchecked'}
                  onPress={handleSelectIdentifier}
                />
                <Text style={styles.txtTitleField}>
                  {i18n.t('AssetTracker.UseIdentifier')}
                </Text>
              </View>
            )}
            {/* List of variables */}
            {variablesSensorTypes.length != 0 && !isIdentifier && (
              <View style={styles.variablesContainer}>
                <Text style={styles.txtTitleField}>
                  {i18n.t('AssetTracker.Variables')}
                </Text>
                {variablesSensorTypes.map(variable => {
                  if (!variable.name) return null

                  return (
                    <View key={variable.id} style={styles.variableItem}>
                      <RadioButton
                        color="#003180"
                        value={variable.id}
                        status={
                          variableSelected?.id === variable.id
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() => {
                          setVariableSelected(variable)
                        }}
                      />
                      <Text style={styles.txtTitleField}>
                        {i18n._locale == 'es' ? variable.name : variable.nameEn}
                      </Text>
                    </View>
                  )
                })}
              </View>
            )}
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.btnOptionAccept}
              onPress={handleSave}>
              <Text style={styles.txtButtonOption}>
                {i18n.t('AssetTracker.Add')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnOptionCancel}
              onPress={handleCancel}>
              <Text style={styles.txtButtonOption}>
                {i18n.t('AssetTracker.Cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centerModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  //dropdown
  selectTypeContainer: {
    flex: 1,
  },
  dropdown: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginLeft: 10,
  },
  textDropDown: { fontSize: 16 },
  //variables
  variablesContainer: {
    flex: 1,
    padding: 5,
  },
  variableItem: { flexDirection: 'row', alignItems: 'center' },
  //options
  optionsContainer: {
    flex: 0.3,
    justifyContent: 'center',
  },
  btnOptionAccept: {
    height: 50,
    backgroundColor: '#003180',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOptionCancel: {
    height: 50,
    backgroundColor: '#97A4B0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtButtonOption: { fontSize: 16, color: '#FFFFFF' },
})

export default AddBeacon
