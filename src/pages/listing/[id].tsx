// src/pages/listing/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Listing {
  title: string;
  description: string;
  category: string;
  brand?: string;
  size?: string;
  condition: string;
  price: number;
  images: string[];
  sellerId: string;
  createdAt: any;
  status: string;
}

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      const ref = doc(db, 'listings', id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setListing(snap.data() as Listing);
      } else {
        alert('Listing not found');
        router.push('/listings');
      }

      setLoading(false);
    };

    fetchListing();
  }, [id, router]);

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (!listing) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Image Carousel */}
        <div>
          <img
            src={listing.images?.[0] || '/placeholder.jpg'}
            alt={listing.title}
            className="w-full h-96 object-cover rounded-md"
          />
          {/* Placeholder: future image carousel for multiple images */}
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <p className="text-gray-600">{listing.category} • {listing.condition}</p>
          {listing.brand && <p className="text-gray-500">Brand: {listing.brand}</p>}
          {listing.size && <p className="text-gray-500">Size: {listing.size}</p>}
          <p className="text-blue-600 text-xl font-bold">${listing.price}</p>

          <p className="text-sm text-gray-500">Seller ID: {listing.sellerId}</p>
          {/* TODO: Link to /profile/[sellerId] once profile page is built */}

          <p className="pt-4">{listing.description}</p>

          {/* 🔒 Placeholder for “Buy Now” button */}
          <button
            className="bg-green-600 text-white px-6 py-2 mt-6 rounded disabled:opacity-50"
            disabled
          >
            Buy Now (Coming Soon)
          </button>

          {/* 🔒 Placeholder for “Message Seller” feature */}
          <button
            className="bg-gray-800 text-white px-6 py-2 mt-2 rounded disabled:opacity-50"
            disabled
          >
            Message Seller (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
