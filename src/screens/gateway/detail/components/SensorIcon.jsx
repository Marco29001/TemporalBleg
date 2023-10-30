import AnalogInput from '../../../../assets/icons/sensors/icon_analogInput.svg';
import Angle from '../../../../assets/icons/sensors/icon_angle.svg';
import Current from '../../../../assets/icons/sensors/icon_current.svg';
import DigitalInput from '../../../../assets/icons/sensors/icon_digitalInput.svg';
import FuelLevel from '../../../../assets/icons/sensors/icon_fuelLevel.svg';
import MagneticContact from '../../../../assets/icons/sensors/icon_magneticContact.svg';
import Pressure from '../../../../assets/icons/sensors/icon_pressure.svg';
import TemperatureHumidity from '../../../../assets/icons/sensors/icon_temperature_humidity.svg';
import Temperature from '../../../../assets/icons/sensors/icon_temperature.svg';
import TemperatureProbe from '../../../../assets/icons/sensors/icon_temperatureProbe.svg';
import Tires from '../../../../assets/icons/sensors/icon_tires.svg';
import Voltage from '../../../../assets/icons/sensors/icon_voltage.svg';
import BlegIcon from '../../../../assets/icons/customIcons/BlegIcon';

function SensorIcon({idType, size, fill}) {
  return idType == 1 ? (
    <TemperatureHumidity width={size} height={size} fill={fill} />
  ) : idType == 2 ? (
    <DigitalInput width={size} height={size} fill={fill} />
  ) : idType == 3 ? (
    <AnalogInput width={size} height={size} fill={fill} />
  ) : idType == 4 ? (
    <MagneticContact width={size} height={size} fill={fill} />
  ) : idType == 5 ? (
    <Temperature width={size} height={size} fill={fill} />
  ) : idType == 6 ? (
    <TemperatureProbe width={size} height={size} fill={fill} />
  ) : idType == 7 ? (
    <Voltage width={size} height={size} fill={fill} />
  ) : idType == 8 ? (
    <Pressure width={size} height={size} fill={fill} />
  ) : idType == 10 ? (
    <Current width={size} height={size} fill={fill} />
  ) : idType == 12 ? (
    <FuelLevel width={size} height={size} fill={fill} />
  ) : (
    <BlegIcon name="icon_sensor" color={'#003180'} size={30} />
  );
}

export default SensorIcon;
