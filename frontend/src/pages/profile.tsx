import React, { useState } from 'react';
import ReusableForm from '../components/form';
import AuthWrapper from '../components/authWrapper';
import Nav from '../components/Nav';

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
    <AuthWrapper>
      <Nav />
      <div className='flex flex-row'>

        <div className='basis-6/6 flex items-center justify-center'>
          <div>
            <h1 className='text-4xl font-bold text-center'>Update profile</h1>
            <ReusableForm
              inputs={formData}
              onSubmit={() => { }}
              width={546}
            />
          </div>
        </div>

      </div>
    </AuthWrapper>
  );
};

export default Profile;
