import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReusableForm from '../components/form';
import axiosInstance from '../config/api';
import { ToastContainer, toast } from 'react-toastify';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false)
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
        toast.error('Username and password required')
        setLoader(false)
        return 
      }
      const data: any = await axiosInstance.post('/users-service/users/register', { username, password })
      localStorage.setItem('token', data.jwtToken)
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
          <h1 className='text-4xl font-bold text-center'>Register</h1>
          <ReusableForm onSubmit={onSubmit} inputs={formData} submitText="Register" loader={loader}/>
          <p>Already have an account <Link to="/login" className="text-blue-900">
          Login
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

export default Register;
