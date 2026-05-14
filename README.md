# HireSphere — Modern Job Portal

HireSphere is a modern, full-stack recruitment platform built with the MERN stack. It features smart job matching and a seamless experience for both candidates and recruiters.

## 🚀 Features

### For Candidates
- **Job Search**: Browse and filter jobs by location, type, and experience level.
- **Application Tracking**: Manage and track all your applications in one dashboard.
- **Profile Management**: Maintain a professional profile with skills and resume storage.

### For Recruiters
- **Job Management**: Create, edit, and delete job postings.
- **Applicant Management**: Review candidates, view resumes, and update application statuses (Accept/Reject).
- **Dashboard Stats**: Track active jobs and total applicants.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Redux Toolkit, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose.
- **Authentication**: JWT, bcrypt.js.
- **Storage**: Cloudinary (for resumes).

## 📦 Getting Started

### Prerequisites
- Node.js installed
- MongoDB (local or Atlas)
- Cloudinary Account

### Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/vishuyadav01/Jobportal.git
   cd Jobportal
   ```

2. **Backend Setup**
   - Go to the `server` directory.
   - Create a `.env` file.
   - Fill in your `MONGO_URI`, `JWT_SECRET`, and `CLOUDINARY` credentials. (CORS is pre-configured for the live frontend).
   - Run `npm install`.
   - Start dev server: `npm run dev`.

3. **Frontend Setup**
   - Go to the `client` directory.
   - Run `npm install`.
   - Note: The Backend API URL is pre-configured in `src/api/axios.js`.
   - Start dev server: `npm run dev`.

## 📂 Project Structure

```text
Jobportal/
├── client/          # React + Vite Frontend
├── server/          # Express + Node Backend
└── .env             # Global Environment Variables
```

## 🛡️ Security
- Password hashing with bcrypt.
- Secure JWT-based authentication.
- Role-based Access Control (RBAC).
- File upload validation (Multer).
