# GoPratle — Event Requirement Posting Platform

A production-grade **Event Requirement Posting Flow** built for the Full-Stack Developer Intern Technical Assignment at **GoPratle**.

The application allows event organizers to post specialized requirements for **Event Planners**, **Performers / Artists**, and **Event Crew Members** through an adaptive 4-step dynamic workflow backed by Node.js, Express, MongoDB, and Next.js.

---

## 🌟 Key Highlights & Design Decisions

1. **Lightweight Emerald & Serif Aesthetic**: Styled with a fresh, clean light-mode theme featuring serif typography (`ui-serif`), emerald/mint accents, rounded-full pill buttons, and soft card drop shadows matching the brand identity.
2. **Dynamic Morphing Workflow**: Selecting **Planner**, **Performer**, or **Crew** in Step 1 dynamically reconfigures Steps 2 and 3 with category-specific questions.
3. **Zero Stale Data Pollution**: Switching categories automatically resets mismatched fields so old/incompatible data is never persisted to MongoDB.
4. **Local Draft Persistence**: User progress is saved in `localStorage`. Accidental page refreshes or tab closures will never wipe entered data.
5. **Real-time Live Requirement Pass**: A responsive side ticket dynamically updates on every keystroke, complete with a 1-click **"Fill Demo"** button for quick testing.
6. **Polymorphic MongoDB Schema**: Standardized base event attributes paired with typed sub-documents (`categoryDetails` and `additionalDetails`), validated via Zod on both client and server.
7. **Recruiter Requirements Explorer (`/requirements`)**: A dedicated feed allowing reviewers to browse all posted requirements, filter by category, search by location/title, and inspect the raw MongoDB JSON documents.

---

## 🏗️ Architecture & Tech Stack

```
GoPratle/
├── frontend/                   # Next.js (App Router, TypeScript, Tailwind CSS, Lucide, Zod)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # 4-Step Interactive Wizard
│   │   │   ├── requirements/   # Recruiter Explorer & Feed
│   │   │   ├── layout.tsx      # Root Layout with Capsule Navbar
│   │   │   └── globals.css     # Emerald Theme & Serif Styling
│   │   ├── components/
│   │   │   ├── wizard/         # Step1Basics, Step2CategoryScope, Step3Logistics, Step4Review
│   │   │   ├── Stepper.tsx     # 4-Step Progress Stepper
│   │   │   ├── LiveSummaryCard.tsx # Real-time Event Ticket Preview
│   │   │   └── Navbar.tsx      # Floating Capsule Navigation Bar
│   │   ├── hooks/              # useRequirementWizard state machine
│   │   ├── types/              # Unified TypeScript definitions
│   │   └── lib/                # API client, Zod validation & constants
│   ├── .env.local.example
│   └── package.json
│
├── backend/                    # Node.js + Express + TypeScript + Mongoose + Zod
│   ├── src/
│   │   ├── models/             # Mongoose Polymorphic Requirement Model
│   │   ├── controllers/        # CRUD Handlers & Aggregations
│   │   ├── routes/             # REST Endpoints (/api/requirements)
│   │   ├── validators/         # Strict Zod Schemas & SuperRefine rules
│   │   ├── middleware/         # Zod & Mongoose Error Handlers
│   │   ├── config/             # MongoDB connection with auto-reconnect
│   │   ├── scripts/            # Automated API verification test suite
│   │   └── index.ts            # Server entry point with CORS & logging
│   ├── .env.example
│   └── package.json
```

---

## 📋 4-Step Flow & Field Matrix

### Step 1: Universal Event Basics
- **Event Name**: Text input (min 3 chars, max 120 chars)
- **Event Type**: Dropdown (`Wedding`, `Corporate`, `Concert`, `Private Party`, `Festival`, `Other`)
- **Event Duration**: Toggle between `Single Day Event` and `Multi-Day Range`
- **Start & End Dates**: HTML date pickers with validation enforcing `endDate >= startDate`
- **Location**: City / Region input
- **Venue**: Optional venue name/address
- **Category Selector**: 3 high-contrast cards (`Event Planner`, `Performer / Artist`, `Event Crew`)

### Step 2: Role Requirements (Category-Specific)
- **Planner**: Expected guest scale (`< 100`, `100 - 300`, `300 - 800`, `800+`), planning services checklist (`Full Planning`, `Day-of Coordination`, `Vendor Management`, `Decor Styling`, `Hospitality`), aesthetic vision textarea.
- **Performer**: Act type dropdown (`DJ`, `Live Band`, `Singer`, `Solo Instrumentalist`, `Dancer`, `MC / Host`), genre/style input, set duration slider (`15` to `360` mins), number of artists on stage.
- **Crew**: Dynamic crew role manager with custom headcount (`Sound Engineer`, `Videographer`, `Lighting Tech`, `Stagehand`, `Security`), experience level dropdown, equipment handling arrangement.

### Step 3: Logistics & Budget (Category-Specific)
- **Planner**: Estimated budget in INR (₹), catering coordination toggle, logistics notes.
- **Performer**: Artist fee budget in INR (₹), sound system provision toggle (*Venue Provided* vs *Artist Brings*), tech rider textarea, green room notes.
- **Crew**: Compensation structure toggle (*Flat Daily Rate* vs *Hourly Rate*), rate amount in INR (₹), shift call time (`08:30 AM`), shift duration, special instructions.

### Step 4: Review Details & Submission
- Structured summary breakdown with inline **"Edit"** buttons jumping directly back to any previous step.
- Disabled submission button during network request to prevent duplicate submissions.
- Celebratory confetti burst on success.
- Generated **MongoDB Requirement ID** with 1-click **Copy** button.
- Toggleable **"Inspect Raw MongoDB Document"** drawer proving real-time database persistence.

---

## 🔌 API Specification

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Backend status, uptime, and MongoDB connection state |
| `POST` | `/requirements` | Strictly validates and persists new requirement |
| `GET` | `/requirements` | Lists requirements with `?category=`, `?search=`, and pagination |
| `GET` | `/requirements/:id` | Retrieves single requirement document by ID |
| `GET` | `/requirements/stats`| Aggregated count of requirements grouped by category |

#### Sample `POST /api/requirements` Payload
```json
{
  "eventName": "Neon Horizons Campus Music Fest",
  "eventType": "concert",
  "isMultiDay": false,
  "startDate": "2027-05-15T00:00:00.000Z",
  "endDate": "2027-05-15T00:00:00.000Z",
  "location": "Bengaluru, Karnataka",
  "venue": "Manpho Convention Center",
  "category": "performer",
  "categoryDetails": {
    "performanceType": "dj",
    "genreOrStyle": "Melodic Techno & High-Energy EDM",
    "durationMinutes": 120,
    "performerCount": 2
  },
  "additionalDetails": {
    "budget": 75000,
    "soundSystemProvided": true,
    "technicalRider": "Pioneer CDJ-3000 x 3, DJM-900NXS2 mixer",
    "hospitalityNotes": "Airport pickup and green room refreshments"
  }
}
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js** >= v18.0.0
- **MongoDB** (running locally on port 27017 or a MongoDB Atlas URI)

### 1. Clone & Setup Backend
```bash
cd backend
npm install
cp .env.example .env

# Start backend dev server (Runs on port 5000)
npm run dev
```

### 2. Verify Backend API
In another terminal, run the automated test suite:
```bash
cd backend
npm run test:api
# Runs 9 automated assertions verifying health, schemas, rejections, listings & stats
```

### 3. Setup & Start Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local

# Start Next.js dev server (Runs on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Edge Cases Handled

1. **Category Switching Sanitization**: Changing from *Planner* to *Crew* immediately purges old planner fields, preventing invalid data from reaching MongoDB.
2. **Date Boundaries**: Multi-day events validate that `endDate >= startDate`. Direct API submissions with invalid dates return HTTP 400 with specific field error pointers.
3. **Draft Recovery**: Form state continuously synchronizes to `localStorage` so accidental tab closures do not destroy entered progress.
4. **Duplicate Click Protection**: Submission button locks during the API request to prevent accidental duplicate documents in the database.
5. **Network Resilience**: If the backend is unreachable, the review screen preserves all form data and offers a one-click Retry action with descriptive error guidance.

---

## 📹 Walkthrough Video & Live Deployment

- **Live Application:** [Deploying to Vercel...]
- **Live Backend API:** [https://gopratle-backend-csi5.onrender.com/api](https://gopratle-backend-csi5.onrender.com/api)
- **Walkthrough Video:** [Recording link will be added here]

---

## 📄 License
MIT License. Built for the GoPratle Full-Stack Developer Internship Technical Evaluation.

