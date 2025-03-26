import React from 'react';
import axiosInstance from '../../../config/api';
import { ToastContainer, toast } from 'react-toastify';

interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface JournalItem {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

interface JournalItemProps {
  item: JournalItem;
  setCurrentItem: () => void
}

const JournalListItem: React.FC<JournalItemProps> = ({ item, setCurrentItem }) => {

  const deleteJournal = (id) => async () => {
    try {
      const res = await axiosInstance.delete(`journals-service/journals/${id}`)
      toast.success('Journal deleted')
      setTimeout(
        () => {
          window.location.reload();
        }, 1000)
    } catch (error) {
      toast.success('Unable to delete journal')
    }
  }
  return (
    <div className="p-4  rounded-lg shadow-lg m-2">
      <div className='grid grid-cols-1 gap-0 items-center'>
        <div className='flex justify-between  items-center'>
          <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
          <div className="text-sm text-gray-500 mb-4 text-right">
            Created: {new Date(item.created_at).toLocaleString()}
          </div>


        </div>
        <div className="text-sm text-gray-500 mb-4 text-left">
          <p className="text-gray-700 mb-4">{item.content}</p>
        </div>
      </div>
      {item.tags && item.tags.length > 0 && (
        <div className='flex justify-between'>
          <div className='flex flex-start'>
            <h3 className="font-semibold mb-2">Tags:</h3>
            <div className="flex flex-start gap-2">
              {item.tags.map(tag => (
                <span
                  key={tag.id}
                  className=" items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex  space-x-2 ">
            <div>
              <button className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded" onClick={() => setCurrentItem(item)}>
                Edit
              </button>
            </div>
            <div>
              <button className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded" onClick={deleteJournal(item.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      <ToastContainer />
    </div>
  );
};

export default JournalListItem
