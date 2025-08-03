# Adicloud – Adidas Ignite Asset Request System

## Project Overview and Goals

A.D.I.Cloud is a web-based platform developed for Adidas as part of the Ignite Selection Process. The system allows internal users to browse, request, and manage access to marketing and promotional assets. The core objective is to streamline asset approval and request tracking through an intuitive interface for both users and administrators.

Key goals:
- Enable users to view digital assets by category.
- Allow users to submit requests for asset usage.
- Provide admins with tools to approve or reject requests.
- Notify users and admins via email of important status changes.

---

##  DEPLOY

"Render" for deploy Static site and Web Service (API)
"MongoDB" for database
"Cloudinary" for storage

--->  https://adicloud-hxf9.onrender.com/

##  Setup Instructions for Local Host

  ### Backend Setup (Node.js + Express + MongoDB + Cloudinary)

1. Clone the repo and navigate to `adicloud-backend`:
- `git clone https://github.com/your-username/adicloud.git`
- `cd adicloud/adicloud-backend`
   
3. Install dependencies:
  `npm install`

4. Create a .env file and add the following:
- `MONGO_URI=your_mongodb_uri`
- `JWT_SECRET=your_jwt_secret`
- `CLOUDINARY_CLOUD_NAME=your_cloud_name`
- `CLOUDINARY_API_KEY=your_api_key`
- `CLOUDINARY_API_SECRET=your_api_secret`
- `EMAIL_USER=your_email@example.com`
- `EMAIL_PASS=your_email_password_or_app_password`

4. Start the backend `npm start`

  ### Frontend Setup 
  
1. Navigate to the frontend folder:
   `cd ../adicloud-frontend`
2. Install dependencies
   `npm install`
3. Start the frontend
   `npm start`

##  Technologies Used

- Frontend: React, Axios, React Router DOM
- Backend: Express, MongoDB (Mongoose), JWT, Bcrypt
- Cloud: Cloudinary (for file storage), Nodemailer (for email notifications), Render (for deployment)
- Security: Authentication via JWT, Admin middleware



