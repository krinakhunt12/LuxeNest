# LuxeNest - Premium Architectural Hardware & Interior Solutions

LuxeNest is a high-end e-commerce platform dedicated to premium architectural hardware, furniture, and interior solutions. The project features a sophisticated user interface with a navy and gold theme, real-time admin dashboards, and comprehensive order management.

## 🚀 Live Links

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Documentation (Swagger)**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 🛠 Tech Stack

### Frontend
- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS** (Premium styling)
- **Zustand** (State management)
- **Lucide React** (Icons)
- **i18next** (Internationalization: English & Hindi)
- **React Router 6**

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose**
- **Swagger UI** (API Documentation)
- **JWT** (Authentication)
- **Multer & Cloudinary** (Image handling)
- **XLSX** (Bulk product uploads)

---

## 📦 Project Structure

```text
LuxeNest/
├── Frontend/          # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components (Admin & User)
│   │   ├── services/    # API service layers
│   │   ├── store/       # Zustand state stores
│   │   └── i18n/        # Translation files
│   └── ...
└── Backend/           # Node.js + Express + MongoDB
    ├── src/
    │   ├── controllers/ # Request handlers
    │   ├── models/      # Mongoose schemas
    │   ├── routes/      # API endpoints
    │   └── middlewares/ # Auth & validation
    └── server.js      # Entry point
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 2. Backend Setup
```bash
cd Backend
npm install
# Create a .env file based on .env.example
npm run dev
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## 📄 API Documentation
The API is documented using Swagger. Once the backend is running, visit:
`http://localhost:5000/api-docs`

Features included in documentation:
- **Auth**: Login, Register, Profile
- **Shop**: Products, Categories, Search
- **Orders**: Create, Cancel (for users), and Status updates (for admins)
- **Admin**: Dashboard stats, User management

---

## 🌟 Key Features
- **Premium UI/UX**: Navy and gold theme with smooth micro-interactions.
- **Admin Dashboard**: Real-time sales reporting and inventory analytics.
- **Order Management**: Users can cancel orders before shipping; Admins can generate professional invoices.
- **Bulk Import**: Admin can upload thousands of products via Excel.
- **Internationalization**: Full support for English and Hindi.
- **Proactive AI Assistant**: Integrated AI to help users navigate the shop.

---

## 🤝 Contributing
1. Fork the repo
2. Create your branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request
