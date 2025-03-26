import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import moment from 'moment';
import 'react-calendar-heatmap/dist/styles.css';
import Loader from '../../../components/loading';
import axiosInstance from '../../../config/api';

const CalendarHeatmapComponent = () => {
  const minStartDate = moment().subtract(1, 'year').format('YYYY-MM-DD');
  const [startDate, setStartDate] = useState<string>(minStartDate);
  const [endDate, setEndDate] = useState<string>(moment().add('1', 'days').format('YYYY-MM-DD'));
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHeatmapData = async (start: string, end: string) => {
    try {
      setLoading(true);
    const {data: {result} } = await axiosInstance.get('/analysis-service/analysis/journal-frequency', {params: {start_date: startDate, end_date: endDate}})
    const formatedData = result.map(item => ({
      date: moment(item.day).format('YYYY-MM-DD'),
      count: parseInt(item.count)
    }))

    setLoading(false)
    return formatedData
    } catch (error) {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchHeatmapData(startDate, endDate).then(setData);
    }
  }, [startDate, endDate]);

  return (
    <div className="p-4  mx-auto">
      <h2 className="text-2xl font-bold mb-4">Calendar Heatmap</h2>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <div>
          <label className="mr-2 font-medium">Start Date:</label>
          <input
            type="date"
            value={startDate}
            max={minStartDate}
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
        <CalendarHeatmap
          startDate={new Date(startDate)}
          endDate={new Date(endDate)}
          values={data}
          classForValue={(value) => {
            if (!value) return 'color-empty';
            return `color-github-${value.count}`;
          }}
          tooltipDataAttrs={(value) => ({
            'data-tip': `${value.date}: ${value.count} contributions`,
          })}
          styles= {{heigth: '1000px'}}
        />
      )}
    </div>
  );
};

export default CalendarHeatmapComponent;
