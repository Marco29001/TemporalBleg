import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

let tempConfig = [];

function Parameter(props) {
  const {config, zIndex, setListConfig, configSelected} = props;
  const [listOptions, setListOptions] = useState([]);
  const [openOptions, setOpenOptions] = useState(false);
  const [option, setOption] = useState(null);

  const changeOption = selectValue => {
    setOption(selectValue(option));
    config.options.map(obj => {
      if (obj.id == selectValue(option)) {
        if (!tempConfig.some(t => t.configId == config.id)) {
          tempConfig.push({
            configId: config.id,
            id: configSelected.id,
            gatewaySensorId: configSelected.gatewaySensorId,
            VariableSensorTypeId: obj.variableSensorTypeId,
            GeotabCode: obj.code,
            VaraibleSensorGeotabDiagnosticId: obj.geotabDiagnosticId,
          });
        } else {
          const newtempConfig = tempConfig.filter(
            c => c.configId !== config.id,
          );
          tempConfig = newtempConfig;
          tempConfig.push({
            configId: config.id,
            id: configSelected.id,
            gatewaySensorId: configSelected.gatewaySensorId,
            VariableSensorTypeId: obj.variableSensorTypeId,
            GeotabCode: obj.code,
            VaraibleSensorGeotabDiagnosticId: obj.geotabDiagnosticId,
          });
        }
      }
    });
    setListConfig(tempConfig);
  };

  useEffect(() => {
    tempConfig = [];
    const tempOptions = [];
    let tempOption = null;
    config.options.map(option => {
      if (
        option.geotabDiagnosticId ==
        configSelected.varaibleSensorGeotabDiagnosticId
      ) {
        tempOption = option.id;
      }

      tempOptions.push({
        label: option.description,
        value: option.id,
      });
    });
    setListOptions(tempOptions);
    setOption(tempOption);
  }, []);

  return (
    <View style={Styles.mainParameter}>
      <Text style={Styles.txtTitleParameter}>
        {config.name + ' - ' + config.unit}
      </Text>
      <DropDownPicker
        listMode="SCROLLVIEW"
        zIndex={zIndex}
        open={openOptions}
        value={option}
        items={listOptions}
        setOpen={setOpenOptions}
        setValue={selectValue => changeOption(selectValue)}
      />
    </View>
  );
}

const Styles = StyleSheet.create({
  mainParameter: {height: 80},
  txtTitleParameter: {
    fontSize: 16,
    color: '#00317F',
    marginTop: 15,
    marginBottom: 10,
  },
});

export default Parameter;
