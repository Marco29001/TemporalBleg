import React, {useEffect} from 'react';
import Signal0 from '../assets/icons/icon_signal0.svg';
import Signal1 from '../assets/icons/icon_signal1.svg';
import Signal2 from '../assets/icons/icon_signal2.svg';
import Signal3 from '../assets/icons/icon_signal3.svg';
import Signal4 from '../assets/icons/icon_signal4.svg';

function SignalComp({signalRssi, size}) {
  return signalRssi <= 55 ? (
    <Signal4 width={size} height={size} />
  ) : signalRssi > 55 && signalRssi <= 67 ? (
    <Signal3 width={size} height={size} />
  ) : signalRssi > 67 && signalRssi <= 80 ? (
    <Signal2 width={size} height={size} />
  ) : signalRssi > 80 && signalRssi < 90 ? (
    <Signal1 width={size} height={size} />
  ) : (
    <Signal0 width={size} height={size} />
  );
}

export default SignalComp;
