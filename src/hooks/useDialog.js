import {useSelector, useDispatch} from 'react-redux';
import {createDialog, resetDialog} from '../redux/slices/dialog';

let resolveCallback;
function useDialog() {
  const dialogState = useSelector(store => store.dialog);
  const dispatcher = useDispatch();

  const onAcceptDialog = () => {
    cancelDialog();
    resolveCallback(true);
  };

  const onCancelDialog = () => {
    cancelDialog();
    resolveCallback(false);
  };

  const acceptDialog = config => {
    dispatcher(createDialog(config));
    return new Promise((res, rej) => {
      resolveCallback = res;
    });
  };

  const cancelDialog = () => {
    dispatcher(resetDialog());
  };

  return {dialogState, acceptDialog, onAcceptDialog, onCancelDialog};
}

export default useDialog;
