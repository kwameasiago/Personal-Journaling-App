import React, {useState} from 'react';
import AuthWrapper from '../../components/authWrapper';
import Nav from '../../components/Nav';
import CreateJournal from './components/createJournal';
import InfiniteScrollList from '../../components/endlessScroll';
import JournalListItem from './components/journalListItem.';
import EditJournal from './components/editJournal';

const Journal: React.FC = () => {
  const [currentItem, setCurrentItem] = useState(null)
  const reset = () => {
    setCurrentItem(null)
  }
  return (
    <AuthWrapper>
      <Nav />
      <div className="space-y-0">
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 flex justify-between items-center">
        <h1 className='text-2xl font-bold text-start'>{currentItem == null?'Create new': `Edit: ${currentItem.title}`}</h1> 
        <button
        disabled={currentItem === null}
        onClick={reset}
        className={`text-white bg-slate-700  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:${currentItem != null?'bg-blue-600': 'bg-blue-300'}  focus:outline-none dark:focus:ring-blue-800`}
        >Create new</button>
        </div>
      </div>
      <div className="grid grid-cols-[70%_30%] gap-0">
        
        <div className="p-4">
          <InfiniteScrollList 
          fetchUrl='/journals-service/journals'
          renderItem={item => <JournalListItem item={item} setCurrentItem={item => {
            setCurrentItem(item)
          }}/>}
          pageSize={5}
          />
        </div>
        <div className="p-4">
        {currentItem == null?<CreateJournal />: <EditJournal item={currentItem} setCurrentItem={setCurrentItem}/>}
        </div>
      </div>
      </div>
    </AuthWrapper>
  );
};

export default Journal
