import React, {useState} from 'react';
import ReusableForm from '../components/form';

const Login: React.FC = () => {
    const [formValue, setFormValue] = useState({
        username: '',
        password: ''
    })
    const formData = [
        {
            placeholder:'usernmae',
            type: 'text',
            value: formValue.username || '',
            onChange: () => {}
        },
        {
            placeholder:'password',
            type: 'password',
            value: formValue.password || '',
            onChange: () => {}
        }
    ]
  return (
    <div className='flex flex-row'>
      <div className='basis-2/4 flex items-center justify-center h-screen bg-blue-100'>
      <div>
      <h1 className='text-4xl font-bold text-center'>Login</h1>
      <ReusableForm onSubmit={() => {}} inputs={formData}/>
      </div>
      </div>
      <div className='basis-2/4 flex items-center justify-center h-screen bg-slate-900'>
        <h1 className='text-blue-100 text-6xl'>Personal Journal App</h1>
      </div>
    </div>
    
  );
};

export default Login;
