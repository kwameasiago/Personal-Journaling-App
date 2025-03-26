import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import axiosInstance from '../../../config/api';
import Loader from '../../../components/loading';

const WordLengthLineChart = () => {
  // Set default dates: one month ago until today
  const defaultStart = moment().subtract(1, 'year').format('YYYY-MM-DD');
  const defaultEnd = moment().add(1, 'days').format('YYYY-MM-DD');

  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);
  const [data, setData] = useState<{ day: string; totalLength: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (start: string, end: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/analysis-service/analysis/word-length', {
        params: { start_date: start, end_date: end },
      });

      const chartData = response.data.result.map((item: any) => ({
        day: moment(item.day).format('YYYY-MM-DD'),
        totalLength: Number(item.totalLength),
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
      <h2 className="text-2xl font-bold mb-4">Word Length Over Time</h2>
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
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalLength" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WordLengthLineChart;
