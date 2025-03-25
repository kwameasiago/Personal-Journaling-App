import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableForm from '../components/form';
import axiosInstance from '../config/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({
    username: '',
    password: ''
  })
  const formData = [
    {
      placeholder: 'usernmae',
      type: 'text',
      name: 'username',
      value: formValue.username || '',
      onChange: () => { }
    },
    {
      placeholder: 'password',
      type: 'password',
      name: 'password',
      value: formValue.password || '',
      onChange: () => { }
    }
  ]

  const onSubmit = async (e:any) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.target);
      const username = formData.get('username');
      const password = formData.get('password');
      if (username === '' || password === '') {
        alert('User name and password required')
      }
      const data: any = await axiosInstance.post('/users-service/users/register', { username, password })
      localStorage.setItem('token', data.jwtToken)
      navigate('/');
    } catch (error) {
      console.log(error)
      alert('Password or username is incorrect')
    }

  }

  return (
    <div className='flex flex-row'>
      <div className='basis-2/4 flex items-center justify-center h-screen bg-blue-100'>
        <div>
          <h1 className='text-4xl font-bold text-center'>Register</h1>
          <ReusableForm onSubmit={onSubmit} inputs={formData} />
        </div>
      </div>
      <div className='basis-2/4 flex items-center justify-center h-screen bg-slate-900'>
        <h1 className='text-blue-100 text-6xl'>Personal Journal App</h1>
      </div>
    </div>

  );
};

export default Register;
