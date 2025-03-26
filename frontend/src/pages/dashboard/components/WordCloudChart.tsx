import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Cloud from 'react-d3-cloud';
import axiosInstance from '../../../config/api';

const WordCloudChart = () => {
  const defaultStart = moment().subtract(1, 'year').format('YYYY-MM-DD');
  const defaultEnd = moment().add(1, 'days').format('YYYY-MM-DD');

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (start, end) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/analysis-service/analysis/word-cloud', {
        params: { start_date: start, end_date: end },
      });

      const formattedData = response.data.result.map(item => ({
        text: item.text,
        value: Math.round(item.value),
      }));
      setWords(formattedData);
    } catch (error) {
      setWords([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);


  const fontSizeMapper = word => Math.sqrt(word.value) * 10;

  const rotate = word => 0;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Word Cloud</h2>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <div>
          <label className="mr-2 font-medium">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded p-1"
          />
        </div>
        <div>
          <label className="mr-2 font-medium">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded p-1"
          />
        </div>
      </div>
      {loading ? (
        <div className="text-center">Loading data...</div>
      ) : (
        <div style={{ height: 500, width: '100%' }}>
          <Cloud
            data={words}
            fontSizeMapper={fontSizeMapper}
            rotate={rotate}
            padding={5}
          />
        </div>
      )}
    </div>
  );
};

export default WordCloudChart;
