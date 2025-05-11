
import { useState } from 'react';
import { User } from '@/types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  return { user, setUser, loading, setLoading };
};
