import { useState, useEffect } from 'react';

export function useVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch videos
  }, []);

  return { videos, loading };
}
