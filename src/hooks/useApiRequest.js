import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {createLogout} from '../redux/slices/logout';

function useApiRequest() {
  let controller = null;
  const dispatcher = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({status: null, value: false, e: null});

  const callEnpoint = async request => {
    let response = null;
    controller = request.controller;

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable === false) {
        cancelEnpoint();
      }
    });

    const timeout = setTimeout(() => {
      cancelEnpoint();
    }, 60000);

    resetError();
    setLoading(true);
    try {
      const responseServer = await request.call;
      response = responseServer.data;
      clearTimeout(timeout);
      unsubscribe();
    } catch (e) {
      clearTimeout(timeout);
      unsubscribe();
      setLoading(false);
      setError({status: e?.response?.status || -1, value: true, e: e});
      if (e?.response?.status == 401) {
        dispatcher(createLogout({open: true, unauthorized: true}));
      }
    }

    setLoading(false);
    return response;
  };

  const resetError = () => {
    setError({status: null, value: false});
  };

  const cancelEnpoint = () => {
    setLoading(false);
    controller && controller.abort();
  };

  useEffect(() => {
    return () => {
      cancelEnpoint();
    };
  }, []);

  return {loading, error, callEnpoint, resetError, cancelEnpoint};
}

export default useApiRequest;
