// src/pages/create-listing.tsx

import { useState } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';
import { Filter } from 'bad-words';
import { v4 as uuidv4 } from 'uuid';

const categories = [
  "Baseball", "Basketball", "Football", "Soccer",
  "Hockey", "Lacrosse", "Golf", "Tennis",
  "Wrestling", "Skating", "Volleyball", "Boxing"
];

const conditions = [
  "New", "Used - Like New", "Used - Good", "Used - Fair"
];

function CreateListing() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const filter = new Filter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (!auth.currentUser) throw new Error("You must be logged in.");

      if (
        !title || !description || !category || !condition || !price || images.length === 0
      ) throw new Error("Please fill all required fields.");

      if (filter.isProfane(title) || filter.isProfane(description)) {
        throw new Error("Please remove inappropriate language.");
      }

      if (!categories.includes(category)) {
        throw new Error("Invalid category.");
      }

      if (!conditions.includes(condition)) {
        throw new Error("Invalid condition.");
      }

      if (images.length > 6) throw new Error("Max 6 images allowed.");
      if (Number(price) <= 0 || Number(price) > 10000) throw new Error("Invalid price.");

      const imageUrls: string[] = [];
      const listingId = uuidv4();

      for (const file of images) {
        const fileRef = ref(storage, `listings/${auth.currentUser.uid}/${listingId}/${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        imageUrls.push(url);
      }

      const docRef = await addDoc(collection(db, 'listings'), {
        title,
        description,
        category,
        brand,
        size,
        condition,
        price: Number(price),
        images: imageUrls,
        sellerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        status: 'available'
      });

      alert('Listing created!');
      router.push(`/listing/${docRef.id}`);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create a Listing</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="w-full border px-4 py-2" placeholder="Title*" maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full border px-4 py-2" placeholder="Description*" maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} />
        
        <select className="w-full border px-4 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category*</option>
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>

        <input className="w-full border px-4 py-2" placeholder="Brand (optional)" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <input className="w-full border px-4 py-2" placeholder="Size (e.g., M, 10)" value={size} onChange={(e) => setSize(e.target.value)} />

        <select className="w-full border px-4 py-2" value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">Select Condition*</option>
          {conditions.map(c => <option key={c}>{c}</option>)}
        </select>

        <input className="w-full border px-4 py-2" type="number" placeholder="Price (CAD)*" value={price} onChange={(e) => setPrice(e.target.value)} />

        <input className="w-full" type="file" multiple accept="image/*" onChange={(e) => {
          if (e.target.files) setImages(Array.from(e.target.files));
        }} />

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 font-semibold"
        >
          {uploading ? 'Uploading...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}
import withAuth from '@/lib/withAuth';
export default withAuth(CreateListing);
