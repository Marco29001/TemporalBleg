import {useEffect, useState} from 'react';

function useSearch(key, key2, data) {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(data);
  }, [data]);

  const onChangeSearch = text => {
    setSearch(text);

    if (text) {
      setFiltered(
        data.filter(
          item =>
            item[key].toString().toLowerCase().includes(text.toLowerCase()) ||
            item[key2].toString().toLowerCase().includes(text.toLowerCase()),
        ),
      );
    } else {
      setFiltered(data);
    }
  };

  return {
    search,
    filtered,
    onChangeSearch,
  };
}

export default useSearch;
