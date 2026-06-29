# 🧠 Second Brain

A full-stack web application for managing and sharing your personal knowledge base. Save notes, YouTube videos, and tweets in one place, organize them by type, and share your brain with others.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- **Save anything** — notes, YouTube videos, and tweets in one place
- **Filter by type** — view All, Notes, Videos, or Tweets instantly
- **Edit & Delete** — full CRUD with optimistic UI updates
- **Share your brain** — generate a public read-only link for others
- **Rich embeds** — YouTube player and Twitter widget auto-loaded
- **Secure auth** — JWT + bcrypt, persisted via localStorage

---

## 🛠 Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 19 + TypeScript | UI framework |
| Vite | Fast dev builds |
| Tailwind CSS | Styling |
| react-router-dom v7 | Routing |
| axios | HTTP requests |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express (ESM) | Server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Zod | Request validation |

---

## 📁 Project Structure

```
SecondBrain/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── CreateContentModel.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── ShareLinkModal.tsx
│   │   │   └── SideBar.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # Auth state management
│   │   ├── icons/                    # SVG icon components
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         # Main content management
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── SharedBrain.tsx       # Public shared brain view
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── index.ts                  # Main API routes & server entry
│   │   ├── db.ts                     # Mongoose models
│   │   ├── config.ts                 # Configuration
│   │   ├── middleware.ts             # Auth middleware
│   │   └── utils.ts                  # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                          # Environment variables (never commit)
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone the repository

```bash
git clone https://github.com/haideralyy01/secondbrain.git
cd SecondBrain
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` root:

```env
PORT=3000
DB_CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/secondbrain?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
```

> ⚠️ **Never commit your `.env` file.** Make sure `.env` is in your `.gitignore`.

> 💡 For local MongoDB use: `mongodb://localhost:27017/secondbrain`

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

---

## ▶️ Running the Application

### Development

Start the backend (in one terminal):

```bash
cd backend
npm run dev
```
Backend runs at `http://localhost:3000`

Start the frontend (in another terminal):

```bash
cd frontend
npm run dev
```
Frontend runs at `http://localhost:8080`

> 💡 Make sure your backend allows CORS from `http://localhost:8080` in development.

### Production Build

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend
cd backend
npm run build
# Output: backend/dist/
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/signup` | `{ name, email, password }` | Register new user |
| POST | `/api/v1/signin` | `{ email, password }` | Login and get JWT |

### Content

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/content` | ✅ | Create content |
| GET | `/api/v1/contents` | ✅ | Get all user content |
| PUT | `/api/v1/content/:id` | ✅ | Update content by ID |
| DELETE | `/api/v1/content/:id` | ✅ | Delete content by ID |

### Sharing

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/brain/share` | ✅ | Generate/get share link |
| GET | `/api/v1/brain/:shareLink` | ❌ | Get public shared brain |

> All protected endpoints require the header: `Authorization: <JWT_TOKEN>`

---

## 🗄 Data Models

### User
```ts
{
  name: String,
  email: String,       // unique
  password: String     // bcrypt hashed
}
```

### Content
```ts
{
  _id: ObjectId,
  userId: ObjectId,    // ref: User
  title: String,
  type: "youtube" | "twitter" | "note",
  link: String,
  body: String,
  tags: [ObjectId]
}
```

### Link (Share)
```ts
{
  _id: ObjectId,
  userId: ObjectId,    // unique
  hash: String
}
```

---

## ⚙️ Key Implementation Details

**Optimistic Delete** — Content disappears from the UI immediately; reverts automatically if the API call fails.

**Edit with Prefill** — The edit modal opens pre-populated with existing content and sends a `PUT` request on save.

**Atomic Share Link** — MongoDB upsert prevents race conditions when generating share links.

**Dual Validation** — Zod schemas on the backend + real-time feedback on the frontend ensure data integrity end-to-end.

---

## 🔭 Future Enhancements

- [ ] Full-text search across content
- [ ] Tags and advanced filtering
- [ ] Collaborative shared brains
- [ ] Email notifications
- [ ] Dark mode
- [ ] Mobile app

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: your description'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use for personal or commercial purposes.

---

## 📬 Contact

For questions or feedback, please [open an issue on GitHub](https://github.com/haideralyy01/secondbrain/issues).
