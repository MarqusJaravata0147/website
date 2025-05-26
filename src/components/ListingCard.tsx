// src/components/ListingCard.tsx

import Link from 'next/link';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  image?: string;
  condition?: string;
  category?: string;
}

export default function ListingCard({
  id,
  title,
  price,
  image,
  condition,
  category
}: ListingCardProps) {
  return (
    <Link href={`/listing/${id}`}>
      <div className="cursor-pointer border rounded-md overflow-hidden shadow hover:shadow-lg transition">
        <img
          src={image || '/placeholder.jpg'}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="font-semibold truncate">{title}</h2>
          <p className="text-sm text-gray-500">
            {category || 'Unknown'} • {condition || 'Condition unknown'}
          </p>
          <p className="text-blue-600 font-bold mt-2">${price}</p>
        </div>
      </div>
    </Link>
  );
}
