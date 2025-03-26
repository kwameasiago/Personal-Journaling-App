import React, {useState, useEffect} from 'react';
import ReusableForm from '../../../components/form';
import axiosInstance from '../../../config/api';
import { ToastContainer, toast } from 'react-toastify';
import Input from '../../../components/inputs';

const EditJournal: React.FC = ({item, setCurrentItem}) => {
    const [formData, setFormData]  = useState({
        title: '',
        content: ''
    })

    useEffect(() => {
        setFormData({
            title: item.title,
            content: item.content
        })
    },[item])

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
      const data: any = await axiosInstance.put(`/journals-service/journals/${item.id}`, { title, content, tags: []})
      toast.success('Journal updated')
      setTimeout(
        () => {
          window.location.reload();
        }, 1000)
    } catch (error) {
      toast.error('Error editing journal')
    }
  }

  return (
    <div>
    <form onSubmit={onSubmit} action='' className='flex flex-col w-[546px] p-5'>
        <input 
        type='text' 
        name='title' 
        onChange={(e) => {
            setFormData({
                ...formData,
                title: e.target.value
            })
        }}
        className='bg-transparent rounded-lg placeholder:text-xl border border-slate-700  p-4 m-2'
        value={formData.title} />
        <textarea 
        name="content"
        rows='10' 
        onChange={(e) => {
            setFormData({
                ...formData,
                content: e.target.value
            })
        }}
        value={formData.content}
        className='bg-transparent rounded-lg placeholder:text-xl border border-slate-700  p-4 m-2'        >
            
        </textarea>
        <div className="flex  space-x-2 ">
        <div>
              <button className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded" onClick={() => setCurrentItem(null)}>
                Cancel
              </button>
            </div>
            <div>
              <button className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded" >
                Edit Journal
              </button>
            </div>
          </div>

    </form>
    <ToastContainer />
    </div>
  );
};

export default EditJournal
