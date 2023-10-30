import React from 'react';
import DidcomToast from './ToastComponents/DidcomToast';

export const didcomToastConfig = {
  didcomInfoToast: ({text1, props}) => (
    <DidcomToast
      image={require('./assets_didcom_toast/icons/icoInformacion.png')}
      color={'#3053AB'}
      message={props.message}
    />
  ),
  didcomSuccessToast: ({text1, props}) => (
    <DidcomToast
      image={require('./assets_didcom_toast/icons/icoExito.png')}
      color={'#00CD39'}
      message={props.message}
    />
  ),
  didcomWarningToast: ({text1, props}) => (
    <DidcomToast
      image={require('./assets_didcom_toast/icons/icoAlerta.png')}
      color={'#FFD25C'}
      message={props.message}
    />
  ),
  didcomErrorToast: ({text1, props}) => (
    <DidcomToast
      image={require('./assets_didcom_toast/icons/icoAlerta2.png')}
      color={'#FF2734'}
      message={props.message}
    />
  ),
};
