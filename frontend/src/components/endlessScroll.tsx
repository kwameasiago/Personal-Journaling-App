import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosInstance from '../config/api';
import Loader from './loading';

interface InfiniteScrollListProps<T> {
  fetchUrl: string;
  renderItem: (item: T) => React.ReactNode;
  pageSize?: number;
  item_key?: string;
}

function InfiniteScrollList<T>({
  fetchUrl,
  renderItem,
  pageSize = 10,
  item_key = 'journals'
}: InfiniteScrollListProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Use a ref to store pages that have already been fetched.
  const fetchedPagesRef = useRef<Set<number>>(new Set());

  const fetchData = async () => {
    // Prevent fetching if already in progress
    if (isLoading) return;

    // Check if this page has been processed already
    // if (fetchedPagesRef.current.has(page)) return;

    setIsLoading(true);
    try {
      const res = await axiosInstance.get(fetchUrl, {
        params: { limit: pageSize, page }
      });
      const data = res.data[item_key];

      if (data && data.length > 0) {
        // Mark this page as processed
        fetchedPagesRef.current.add(page);

        // Update items only if this page hasn't been added before
        
      
        setItems((prev) => {
          const existingIds = new Set(prev.map(item => item.id));
        const filteredData = data.filter(item => !existingIds.has(item.id));
          return [...prev, ...filteredData]
        });
        setPage((prev) => prev + 1);

      } else {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setIsLoading(false);
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
      loader={<Loader />}
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
