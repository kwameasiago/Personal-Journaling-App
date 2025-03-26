import React from 'react';
import ReusableForm from '../../../components/form';
import axiosInstance from '../../../config/api';
import { ToastContainer, toast } from 'react-toastify';

const CreateJournal: React.FC = () => {
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

  const formatTags = (tags) => {
    if(tags.length > 0){
        return tags.split(',').map(tag => ({name: tag})) 
    }
    else{
        return []
    }
  } 
  const onSubmit=  async (e:any) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.target);
      const title = formData.get('title');
      const content = formData.get('content');
      const tags = formData.get('tags');
      const data: any = await axiosInstance.post('/journals-service/journals', { title, content, tags: formatTags(tags)})
      toast.success('Journal created')
      setTimeout(
        () => {
          window.location.reload();
        }, 1000)
    } catch (error) {
      toast.error('Error saving journal')
    }
  }

  return (
    <div>
    <ReusableForm onSubmit={onSubmit} inputs={formData} loader={false} submitText='Submit Journal'/>
    <ToastContainer />
    </div>
  );
};

export default CreateJournal
