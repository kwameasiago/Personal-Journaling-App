import React from 'react';

const SessionListItem = ({ item }) => {
  return (
    <div className='p-5 shadow-lg'>
      <p><strong>Device:</strong> {item.device}</p>
      <p><strong>Created At:</strong> {new Date(item.created_at).toLocaleString()}</p>
    </div>
  );
};

export default SessionListItem;
