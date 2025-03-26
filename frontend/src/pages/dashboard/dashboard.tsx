import React from 'react';
import AuthWrapper from '../../components/authWrapper';
import Nav from '../../components/Nav';
import CalendarHeatmapComponent from './components/heatmap';
import CategoryDistributionChart from './components/categoryDistribution';
import WordLengthLineChart from './components/WordLengthLineChart';
import WordLengthByCategoryBarChart from './components/WordLengthByCategoryBarChart';
import TimeOfDayDistributionBarChart from './components/TimeOfDayDistributionBarChart';

const Dashboard: React.FC = () => {
  return (
    <AuthWrapper>
      <Nav />
      <div className="grid  gap-0">
        <div className="p-4">
          <CalendarHeatmapComponent />
        </div>
      </div>

      <div className="grid grid-cols-[30%_40%_30%] gap-0">
      <div className="p-4">
          <WordLengthByCategoryBarChart />
        </div>
        <div className="p-4">
          <WordLengthLineChart />
        </div>
        <div className="p-4">
        <CategoryDistributionChart />
        </div>
      </div>

      <div className='grid  grid-cols-[60%_40%] gap-0'>
      <div className="p-4">
        <TimeOfDayDistributionBarChart />
        </div>
        <div className="p-4">
          <CategoryDistributionChart />
        </div>
      </div>


    </AuthWrapper>
  );
};

export default Dashboard
