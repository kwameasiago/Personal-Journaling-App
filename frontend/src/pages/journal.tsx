import React from 'react';
import AuthWrapper from '../components/authWrapper';

const Journal: React.FC = () => {
  return (
    <AuthWrapper>
    <div className='flex flex-row'>
      <div className='basis-2/4 flex items-center justify-center h-screen bg-blue-100'>
        
      </div>
      <div className='basis-2/4 flex items-center justify-center h-screen bg-slate-900'>
        <h1 className='text-blue-100 text-6xl'>Personal Journal App</h1>
      </div>
    </div>
    </AuthWrapper>
  );
};

export default Journal
