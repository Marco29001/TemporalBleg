import { useSelector, useDispatch } from 'react-redux'
import { createDialog, resetDialog } from '../redux/slices/dialog'

let resolveCallback

function useDialog() {
  const dialogState = useSelector(state => state.dialog)
  const dispatcher = useDispatch()

  const onAcceptDialog = () => {
    dispatcher(resetDialog())
    resolveCallback(true)
  }

  const onCancelDialog = () => {
    dispatcher(resetDialog())
    resolveCallback(false)
  }

  const optionDialog = config => {
    dispatcher(createDialog(config))
    return new Promise((res, rej) => {
      resolveCallback = res
    })
  }

  const showDialog = async (
    config,
    action = () => null,
    cancelAction = () => null,
  ) => {
    const isAccept = await optionDialog(config)

    if (isAccept) {
      action()
    } else {
      cancelAction()
    }
  }

  return {
    dialogState,
    showDialog,
    onAcceptDialog,
    onCancelDialog,
  }
}

export default useDialog
