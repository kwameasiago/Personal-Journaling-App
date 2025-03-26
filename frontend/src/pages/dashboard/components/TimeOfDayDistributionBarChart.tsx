import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axiosInstance from '../../../config/api';
import Loader from '../../../components/loading';

const TimeOfDayDistributionBarChart = () => {
  const defaultStart = moment().subtract(1, 'year').format('YYYY-MM-DD');
  const defaultEnd = moment().add(1, 'days').format('YYYY-MM-DD');

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (start, end) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/analysis-service/analysis/time-of-day-distribution', {
        params: { start_date: start, end_date: end },
      });
      
      const chartData = response.data.result.map(item => ({
        timeOfDay: item.timeOfDay,
        count: Number(item.count),
      }));
      setData(chartData);
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Time of Day Distribution</h2>
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
        <Loader />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="timeOfDay" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TimeOfDayDistributionBarChart;
