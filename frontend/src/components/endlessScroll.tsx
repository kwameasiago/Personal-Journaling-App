// InfiniteScrollList.tsx
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
// import { fetchItems } from './dataFetcher';
const fetchItems =  async (fetch: any, page: number, pageSize: number)=> {return []}

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
      const data: T[] = await fetchItems(fetchUrl, page, pageSize);
      if (data && data.length > 0) {
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
