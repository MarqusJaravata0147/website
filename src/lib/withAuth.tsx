// src/lib/withAuth.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import type { ComponentType, JSX } from 'react'; // ✅ Add this

export default function withAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthenticated(true);
        } else {
          router.push('/login');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) return <p className="text-center py-12">Checking login...</p>;
    if (!authenticated) return null;

    return <WrappedComponent {...props} />;
  };
}

