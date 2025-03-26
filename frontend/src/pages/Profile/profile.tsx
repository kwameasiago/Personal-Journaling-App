import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthWrapper from '../../components/authWrapper';
import Nav from '../../components/Nav';
import axiosInstance from '../../config/api';
import Loader from '../../components/loading';
import { ToastContainer, toast } from 'react-toastify';
import SessionListItem from './components/Session:ListItem';
import InfiniteScrollList from '../../components/endlessScroll';

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  useEffect(() => {
    axiosInstance.get('/users-service/users/me')
      .then(({ data }) => {
        setUser(data.user)
      })
  }, [])

  const updateProfile = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    try {
      
      if (password == '') {
        await axiosInstance.put('users-service/users/me', { username })
        toast.success('Profile updated')
        setTimeout(
          () => {
            window.location.reload();
          }, 1000)
      }else{
        await axiosInstance.put('users-service/users/me', { username, password })
        toast.success('Profile updated')
        localStorage.removeItem('token')
        setTimeout(
          () => {
            navigate('/login');
          }, 1000)
      }

    } catch (error) {
      toast.error('Error updating profile')
    }
  }
  if (user == null) {
    return <Loader />
  }
  return (
    <AuthWrapper>
      <Nav />
      <div className='flex justify-center align-center m-5'>
        <div>
          <form onSubmit={updateProfile} action=''>
            <input type='text' defaultValue={user.username} placeholder='username' name='username' className='bg-transparent rounded-lg placeholder:text-xl border border-slate-500  p-2 m-2' />
            <input type='password' placeholder='password' name='password' className='bg-transparent rounded-lg placeholder:text-xl border border-slate-500  p-2 m-2' />
            <button type='submit' className='text-white bg-slate-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Update</button>
          </form>
        </div>
      </div>
      <h1 className='text-3xl font-bold text-center'>Session logs</h1>
      <div className='flex justify-center'>

        <InfiniteScrollList
          fetchUrl='/users-service/users/sessions'
          item_key='sessions'
          renderItem={item => <SessionListItem item={item} />}
          pageSize={10}
        />
      </div>
      <ToastContainer />
    </AuthWrapper>
  );
};

export default Profile;
