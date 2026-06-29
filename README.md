    # Second Brain

    A full-stack web application for managing and sharing your personal knowledge base. Save notes, YouTube videos, and tweets in one place, organize them by type, and share your brain with others.

    ## Tech Stack

    ### Frontend
    - **React 19** with TypeScript
    - **Vite** for fast builds
    - **Tailwind CSS** for styling
    - **react-router-dom v7** for routing
    - **axios** for HTTP requests

    ### Backend
    - **Node.js** with Express (ESM)
    - **TypeScript** for type safety
    - **MongoDB** with Mongoose for data persistence
    - **JWT** for authentication
    - **bcryptjs** for password hashing
    - **Zod** for request validation

    ## Project Structure

    ```
    SecondBrain/
    ├── frontend/
    │   ├── src/
    │   │   ├── components/          # Reusable React components
    │   │   │   ├── Button.tsx
    │   │   │   ├── Card.tsx
    │   │   │   ├── CreateContentModel.tsx
    │   │   │   ├── Navbar.tsx
    │   │   │   ├── ProtectedRoute.tsx
    │   │   │   ├── ShareLinkModal.tsx
    │   │   │   ├── SideBar.tsx
    │   │   ├── context/
    │   │   │   └── AuthContext.tsx  # Auth state management
    │   │   ├── icons/               # SVG icon components
    │   │   ├── pages/
    │   │   │   ├── Dashboard.tsx    # Main content management
    │   │   │   ├── Login.tsx
    │   │   │   ├── Signup.tsx
    │   │   │   ├── SharedBrain.tsx  # Public shared brain view
    │   │   ├── App.tsx
    │   │   ├── main.tsx
    │   │   └── index.css
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── vite.config.ts
    │
    ├── backend/
    │   ├── src/
    │   │   ├── index.ts             # Main API routes
    │   │   ├── db.ts                # Mongoose models
    │   │   ├── config.ts            # Configuration
    │   │   ├── middleware.ts        # Auth middleware
    │   │   └── utils.ts             # Utility functions
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── .env                     # Environment variables
    │
    └── README.md
    ```

    ## Features

    ### Authentication
    - User signup and login with bcrypt password hashing
    - JWT-based session management
    - Protected routes (Dashboard)
    - Persistent login via localStorage

    ### Content Management
    - **Create** notes, YouTube videos, and tweet links
    - **Read** all content in a filterable dashboard
    - **Update** existing content with prefilled modal
    - **Delete** content with optimistic UI updates
    - Filter content by type (All, Notes, Videos, Tweets)

    ### Sharing
    - Generate shareable links for your entire brain
    - Atomic upsert prevents duplicate share links
    - Public read-only view of shared brains (no auth required)
    - Copy share link or open directly

    ### Embeds & Rich Content
    - **YouTube**: Parses video ID from various URL formats and embeds player
    - **Twitter**: Normalizes x.com → twitter.com and loads Twitter widget
    - **Notes**: Simple text content with formatting

    ## Getting Started

    ### Prerequisites
    - Node.js (v16+)
    - npm or yarn
    - MongoDB (local or cloud)

    ### Installation

    1. **Clone the repository**
    ```bash
    git clone https://github.com/haideralyy01/secondbrain.git
    cd SecondBrain
    ```

    2. **Backend setup**
    ```bash
    cd backend
    npm install
    ```

    3. **Create `.env` file in backend root**
    ```
    PORT=3000
    DB_CONNECTION_STRING=mongodb://localhost:27017/secondbrain
    JWT_SECRET=your_secret_key_here
    ```

    4. **Frontend setup**
    ```bash
    cd ../frontend
    npm install
    ```

    ## Running the Application

    ### Development

    1. **Start backend server**
    ```bash
    cd backend
    npm run dev
    ```
    Server runs on `http://localhost:3000`

    2. **Start frontend dev server** (in another terminal)
    ```bash
    cd frontend
    npm run dev
    ```
    Frontend runs on `http://localhost:8080` (or displayed in terminal)

    ### Production Build

    **Frontend**
    ```bash
    cd frontend
    npm run build
    ```
    Outputs to `frontend/dist/`

    **Backend**
    ```bash
    cd backend
    npm run build
    ```
    Outputs to `backend/dist/`

    ## API Endpoints

    ### Authentication
    - `POST /api/v1/signup` - Register new user (name, email, password)
    - `POST /api/v1/signin` - Login user (email, password)

    ### Content Management
    - `POST /api/v1/content` - Create content (title, type, link, body)
    - `GET /api/v1/contents` - Fetch user's all content
    - `PUT /api/v1/content/:id` - Update content by ID
    - `DELETE /api/v1/content/:id` - Delete content by ID

    ### Sharing
    - `POST /api/v1/brain/share` - Generate/get share link
    - `GET /api/v1/brain/:shareLink` - Get public shared brain content

    All protected endpoints require `Authorization: <JWT_TOKEN>` header.

    ## Data Models

    ### User
    ```
    {
    name: String,
    email: String (unique),
    password: String (bcrypt hashed)
    }
    ```

    ### Content
    ```
    {
    _id: ObjectId,
    userId: ObjectId (ref: User),
    title: String,
    type: "youtube" | "twitter" | "note",
    link: String,
    body: String,
    tags: [ObjectId]
    }
    ```

    ### Link (Share)
    ```
    {
    _id: ObjectId,
    userId: ObjectId (unique),
    hash: String
    }
    ```

    ## Key Features Implementation

    ### Delete with Optimistic Update
    Deletes immediately show on UI while API call happens in background; reverts if API fails.

    ### Edit with Prefill
    Modal opens with existing content pre-filled; `PUT` API updates content and replaces in dashboard.

    ### Atomic Share Link
    Uses MongoDB upsert to prevent race conditions when creating/retrieving share links.

    ### Validation
    Both frontend and backend validate inputs:
    - Frontend: Real-time user feedback
    - Backend: Zod schemas ensure data integrity

    ## Error Handling
    - Form validation errors displayed to user
    - API errors surfaced with meaningful messages
    - Optimistic updates revert on backend failure
    - 404 errors for missing shared brains

    ## Browser Support
    Modern browsers with ES2020+ support (Chrome, Firefox, Safari, Edge)

    ## Future Enhancements
    - Full-text search across content
    - Tags and advanced filtering
    - Collaborate on shared brains
    - Email notifications
    - Dark mode
    - Mobile app

    ## Contributing
    1. Fork the repository
    2. Create a feature branch (`git checkout -b feature/your-feature`)
    3. Commit changes (`git commit -m 'feat: description'`)
    4. Push to branch (`git push origin feature/your-feature`)
    5. Open a Pull Request

    ## License
    MIT License - feel free to use this project for personal or commercial purposes.

    ## Contact
    For questions or feedback, please open an issue on GitHub.
