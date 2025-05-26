// src/pages/listings.tsx

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ListingCard from '@/components/ListingCard';

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
}

const categories = [
  "All", "Baseball", "Basketball", "Football", "Soccer",
  "Hockey", "Lacrosse", "Golf", "Tennis",
  "Wrestling", "Skating", "Volleyball", "Boxing"
];

const conditions = [
  "All", "New", "Used - Like New", "Used - Good", "Used - Fair"
];

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');

  useEffect(() => {
    let baseQuery = collection(db, 'listings');
    let q = query(baseQuery, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[];
      setListings(docs);
    });

    return () => unsubscribe();
  }, []);

  const filtered = listings.filter(listing => {
    return (
      (selectedCategory === 'All' || listing.category === selectedCategory) &&
      (selectedCondition === 'All' || listing.condition === selectedCondition)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Browse Listings</h1>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <select className="border px-4 py-2" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <select className="border px-4 py-2" value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)}>
          {conditions.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(listing => (
  <ListingCard
    key={listing.id}
    id={listing.id}
    title={listing.title}
    price={listing.price}
    image={listing.images?.[0]}
    category={listing.category}
    condition={listing.condition}
  />
))}
        </div>
      )}
    </div>
  );
}
