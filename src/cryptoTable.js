import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CryptoTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch data using async/await
  const fetchData = async () => {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
    );
    setData(response.data);
  };

  // Fetch data using .then
  const fetchDataThen = () => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
      )
      .then((response) => {
        setData(response.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filtered data based on search
  const filteredData = data.filter((crypto) =>
    crypto.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle sorting
  const handleSort = (key) => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(order);

    const sortedData = [...data].sort((a, b) => {
      if (key === 'market_cap' || key === 'price_change_percentage_24h') {
        return order === 'asc'
          ? a[key] - b[key]
          : b[key] - a[key];
      } else {
        return order === 'asc'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
    });
    setData(sortedData);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={handleSearch}
      />
      <button onClick={() => handleSort('market_cap')}>Sort By Mkt Cap</button>
      <button onClick={() => handleSort('price_change_percentage_24h')}>
        Sort by Percentage
      </button>
      <table>
        <tbody>
          {filteredData.map((crypto) => (
            <tr key={crypto.id}>
                 <td>
                <img src={crypto.image} alt={crypto.name} width="30" height="30" />
              </td>
              <td>{crypto.name}</td>
              <td>{crypto.symbol}</td>
              <td>${crypto.current_price}</td>
              <td>{crypto.total_volume}</td>
              <td className={crypto.price_change_percentage_24h > 0 ? 'positive' : 'negative'}>
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>Mkt cap : ${crypto.market_cap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
