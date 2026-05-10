import { useEffect, useState } from "react";

export function useVideos() {
  const [videos, _setVideos] = useState([]);
  const [loading, _setLoading] = useState(true);

  useEffect(() => {
    // Fetch videos
  }, []);

  return { videos, loading };
}
