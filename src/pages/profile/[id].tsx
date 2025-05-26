// src/pages/profile/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Listing {
  id: string;
  title: string;
  price: number;
  images: string[];
  condition: string;
  category: string;
}

export default function SellerProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, 'listings'),
      where('sellerId', '==', id),
      where('status', '==', 'available')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[];

      setListings(docs);
    });

    return () => unsubscribe();
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Seller Profile</h1>
      <p className="text-center text-gray-500 mb-8">User ID: <span className="font-mono">{id}</span></p>

      {listings.length === 0 ? (
        <p className="text-center text-gray-600">This seller has no active listings.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map(listing => (
            <div key={listing.id} className="border rounded overflow-hidden shadow hover:shadow-lg transition">
              <img src={listing.images?.[0]} alt={listing.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="font-semibold truncate">{listing.title}</h2>
                <p className="text-sm text-gray-500">{listing.category} • {listing.condition}</p>
                <p className="text-blue-600 font-bold mt-2">${listing.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
