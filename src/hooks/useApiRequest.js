import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {createLogout} from '../redux/slices/logout';
import ErrorManager from '../utils/ErrorManager';

function useApiRequest() {
  let controller = null;
  const dispatcher = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callEndpoint = async request => {
    let response = null;
    controller = request.controller;

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable === false) {
        cancelEndpoint();
      }
    });

    const timeout = setTimeout(() => {
      cancelEndpoint();
    }, 60000 * 5);

    resetError();
    setLoading(true);
    try {
      const responseServer = await request.call;
      response = responseServer.data;
    } catch (e) {
      let status = e?.response?.status ?? -1;
      console.log('error', e);
      if (status == 401) {
        dispatcher(createLogout({open: true, unauthorized: true}));
      } else {
        console.log('el error es', typeof e?.response?.data?.message);
        let message = e?.response?.data?.message ?? ErrorManager(status);
        setError({status, message});
      }
    } finally {
      clearTimeout(timeout);
      unsubscribe();
      setLoading(false);
    }

    return response;
  };

  const resetError = () => {
    setError(null);
  };

  const cancelEndpoint = () => {
    setLoading(false);
    controller && controller.abort();
  };

  useEffect(() => {
    return () => {
      cancelEndpoint();
    };
  }, []);

  return {loading, error, callEndpoint, resetError, cancelEndpoint};
}

export default useApiRequest;
