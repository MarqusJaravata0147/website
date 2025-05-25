# 🏒 SidelineSwap Clone Marketplace

This is a full-stack web application that replicates the core features of [SidelineSwap](https://sidelineswap.com), a peer-to-peer marketplace where users can buy and sell sports gear. This version is being built first for web, then expanded to mobile (React Native).

---

## 🔧 Project Stack

- **Frontend**: Next.js (Pages Router) + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Auth**: Firebase Email/Password + Google (coming soon)
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage (image uploads)
- **Payments**: Stripe (planned)
- **Profanity Filter**: bad-words npm package
- **File Uploads**: Firebase Storage (max 6 images per listing)
- **UUID Generator**: `uuid` for listing and image IDs

---

## ✅ Features Implemented

### ✅ Web Platform (MVP Phase)
- [x] Firebase setup with `.env.local`
- [x] Login page (`/login`) with email + password
- [x] Register page (`/register`) with email + password
- [x] Firebase Auth integration
- [x] `create-listing.tsx` page:
  - Form validation
  - Profanity filter
  - Price limits ($1–$10,000 CAD)
  - Category + condition dropdowns
  - Max 6 image uploads (Firebase Storage)
  - Listing saved in Firestore under `/listings`

---

## 🧠 Listing Schema (Firestore)

```ts
{
  title: string;               // Max 100 chars, no profanity
  description: string;         // Max 2000 chars
  category: string;            // Predefined options
  brand: string;               // Optional
  size: string;                // Optional
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  price: number;               // Between 1 and 10000
  images: string[];            // Uploaded image URLs
  sellerId: string;            // Firebase Auth UID
  createdAt: Timestamp;
  status: 'available' | 'sold';
}
```

---

## 📂 Project Structure

```bash
D:\swapp\website\
├── src/
│   ├── pages/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── create-listing.tsx
│   ├── lib/
│   │   └── firebase.ts
│   └── styles/
│       └── globals.css
├── .env.local          # Firebase keys (not committed)
├── .gitignore
├── README.md
├── tailwind.config.js
└── package.json
```

---

## 🚀 How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/sidelineswap-clone.git
   cd sidelineswap-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase project and add `.env.local` with:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

4. Run dev server:
   ```bash
   npm run dev
   ```

5. Visit:
   ```
   http://localhost:3000/login
   ```

---

## 🔁 Git & Commit Workflow

1. Use detailed commit messages:
   ```bash
   git add .
   git commit -m "Add create-listing form with Firebase upload and validation"
   ```

2. Push to GitHub:
   ```bash
   git push -u origin main
   ```

---

## 📅 Next Steps (Planned)

- [ ] Public listings page with filter/sort
- [ ] Individual listing page with buy button
- [ ] Profile page to view seller's items
- [ ] Stripe integration for “Buy Now”
- [ ] Admin flag/review system
- [ ] React Native mobile app (Phase 2)

---

## 🙋‍♂️ Author

**Marqus Jaravata**  
Mississauga, Ontario  
🛠 Computer Engineering Tech (Humber, 2024)

---

## 📜 License

MIT – build your own clone, improve it, and sell some gear.