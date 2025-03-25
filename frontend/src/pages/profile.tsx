import React, { useState } from 'react';
import ReusableForm from '../components/form';

const Profile: React.FC = () => {
  const [formValue, setFormValue] = useState({
    username: '',
    password: ''
  })
  const onChange = (e: any) => {
    console.log(e.target.value)
  }
  const formData = [
    {
      placeholder: 'username',
      type: 'text',
      value: formValue.username || '',
      onChange
    },
    {
      placeholder: 'password',
      type: 'password',
      value: formValue.username || '',
      onChange
    },
  ]
  return (
    <div className='flex flex-row'>
      
      <div className='basis-2/6 flex items-center justify-center'>
      <div>
      <h1 className='text-4xl font-bold text-center'>Update profile</h1>
        <ReusableForm
          inputs={formData}
          onSubmit={() => { }}
          width={546}
        />
        </div>
      </div>
      <div className='basis-4/6 flex items-center justify-center h-screen bg-slate-100'>
        <h1 className='text-blue-100 text-6xl'>Personal Journal App</h1>
      </div>

    </div>
  );
};

export default Profile;
