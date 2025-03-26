// InfiniteScrollList.tsx
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosInstance from '../config/api';


interface InfiniteScrollListProps<T> {
  fetchUrl: string;
  renderItem: (item: T) => React.ReactNode;
  pageSize?: number;
}

function InfiniteScrollList<T>({
  fetchUrl,
  renderItem,
  pageSize = 10,
}: InfiniteScrollListProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const res: T[] = await axiosInstance.get(fetchUrl, {params:{limit: pageSize, page}});
      let data = res.data.journals
      if (data && data.length > 0) {
        console.log(data)
        setItems((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>No more items to show.</b>
        </p>
      }
    >
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item)}
        </div>
      ))}
    </InfiniteScroll>
  );
}

export default InfiniteScrollList;
