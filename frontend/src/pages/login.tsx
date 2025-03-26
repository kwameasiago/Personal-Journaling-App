import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ReusableForm from '../components/form';
import axiosInstance from '../config/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false)
  
  const formData = [
    {
      placeholder: 'Username',
      type: 'text',
      name: 'username',
      value:  '',
      onChange: () => { }
    },
    {
      placeholder: 'password',
      type: 'password',
      name: 'password',
      value: '',
      onChange: () => { }
    }
  ]

  const onSubmit = async (e:any) => {
    e.preventDefault()
    setLoader(true)
    try {
      const formData = new FormData(e.target);
      const username = formData.get('username');
      const password = formData.get('password');
      if (username === '' || password === '') {
        toast.error('Username and password required')
        setLoader(false)
        return 
      }
      const {data}: any = await axiosInstance.post('/users-service/users/login', { username, password })
      localStorage.setItem('token', data.jwtToken)
      setLoader(false)
      navigate('/');
    } catch (error) {
      toast.error('Username or password incorrect')
      setLoader(false)
    }

  }

  return (
    <div className='flex flex-row'>
      <div className='basis-2/4 flex items-center justify-center h-screen bg-blue-100'>
        <div>
          <h1 className='text-4xl font-bold text-center'>Login</h1>
          <ReusableForm onSubmit={onSubmit} inputs={formData} loader={loader} submitText='Login'/>
          <p>Dont have an acount <Link to="/register" className="text-blue-900">
          Register
        </Link></p>
        </div>
      </div>
      <div className='basis-2/4 flex items-center justify-center h-screen bg-slate-900'>
        <h1 className='text-blue-100 text-6xl'>Personal Journal App</h1>
      </div>
      <ToastContainer />
    </div>

  );
};

export default Login;
