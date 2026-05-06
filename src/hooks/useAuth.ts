import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth status
  }, []);

  return { user };
}
