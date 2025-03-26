import React from 'react';
import AuthWrapper from '../components/authWrapper';
import ReusableForm from '../components/form';
import Nav from '../components/Nav';
import axiosInstance from '../config/api';
import InfiniteScrollList from '../components/endlessScroll';

const Journal: React.FC = () => {
  const formData = [
    {
      placeholder: 'title',
      type: 'text',
      name: 'title',
      value:  '',
      onChange: () => { }
    },
    {
      placeholder: 'content',
      type: 'textarea',
      name: 'content',
      value:  '',
      onChange: () => { },
      additionalClass: ''
    },
    {
      placeholder: 'tags (comma seppareted)',
      type: 'text',
      name: 'tags',
      value:  '',
      onChange: () => { }
    },
  ]
  const onSubmit=  async (e:any) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.target);
      const title = formData.get('title');
      const content = formData.get('content');
      const tags = formData.get('tags');
      console.log(title, content)
      const data: any = await axiosInstance.post('/journals-service/journals', { title, content, tags: tags.split(',').map(tag => ({name: tag})) })
      alert('journal saved ')
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthWrapper>
      <Nav />
    <div className='flex flex-row'>
      <div className='basis-4/6 flex items-start justify-start h-screen bg-blue-100'>
      <div>
      <h1 className='text-blue-900 text-2xl p-2'>Create Journal</h1>
      <ReusableForm onSubmit={onSubmit} inputs={formData} loader={false}/>
      </div>
      </div>
      <div className='basis-2/6 flex items-start justify-start h-screen bg-blue-100'>
      <div>
      <h1 className='text-blue-900 text-2xl p-2'>Journal list</h1>
        
      </div>
      </div>
    </div>
    
    </AuthWrapper>
  );
};

export default Journal
