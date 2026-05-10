import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;

      if (error) {
        setError(error.message);
      }

      setSession(data.session);
      setIsInitialized(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setIsInitialized(true);
      },
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      return { data, error: null, needsEmailVerification: !data.session };
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to sign up.");
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      return { error: null };
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to sign out.");
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: { displayName?: string }) => {
    try {
      setLoading(true);
      setError(null);

      const updates: any = {};

      if (data.displayName !== undefined) {
        updates.display_name = data.displayName;
      }

      const { data: updatedUser, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      if (updatedUser.user) {
        setSession((prev) =>
          prev ? { ...prev, user: updatedUser.user } : null,
        );
      }

      return { data: updatedUser, error: null };
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Unable to update profile.",
      );
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    loading,
    isInitialized,
    error,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
  };
}
