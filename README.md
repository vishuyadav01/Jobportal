# HireSphere — AI-Powered Job Portal

HireSphere is a modern, full-stack recruitment platform built with the MERN stack. It features AI-powered resume analysis, smart job matching, and a seamless experience for both candidates and recruiters.

## 🚀 Features

### For Candidates
- **AI Resume Analysis**: Upload your resume to get an ATS score, missing skills, and personalized improvement suggestions using Gemini AI.
- **Job Search**: Browse and filter jobs by location, type, and experience level.
- **Application Tracking**: Manage and track all your applications in one dashboard.
- **Profile Management**: Maintain a professional profile with skills and resume storage.

### For Recruiters
- **Job Management**: Create, edit, and delete job postings.
- **Applicant Management**: Review candidates, view resumes, and update application statuses (Accept/Reject).
- **Dashboard Stats**: Track active jobs and total applicants.

### For Admins
- **Platform Overview**: Monitor all users and job listings.
- **Moderation**: Delete spam jobs or manage user accounts.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Redux Toolkit, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose.
- **Authentication**: JWT, bcrypt.js.
- **Storage**: Cloudinary (for resumes).
- **AI Integration**: Google Gemini API.

## 📦 Getting Started

### Prerequisites
- Node.js installed
- MongoDB (local or Atlas)
- Cloudinary Account
- Google Gemini API Key

### Installation

1. **Clone the project**
   ```bash
   git clone <repository-url>
   cd hiresphere
   ```

2. **Backend Setup**
   - Go to the `server` directory.
   - Create a `.env` file (copy from root `.env` template).
   - Fill in your `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY` credentials, and `GEMINI_API_KEY`.
   - Run `npm install`.
   - Start dev server: `npm run dev`.

3. **Frontend Setup**
   - Go to the `client` directory.
   - Run `npm install`.
   - Create a `.env` file and set `VITE_API_URL=http://localhost:5000/api`.
   - Start dev server: `npm run dev`.

## 📂 Project Structure

```text
hire-sphere/
├── client/          # React + Vite Frontend
├── server/          # Express + Node Backend
└── .env             # Global Environment Variables
```

## 🛡️ Security
- Password hashing with bcrypt.
- Secure JWT-based authentication.
- Role-based Access Control (RBAC).
- File upload validation (Multer).
