# Secure File Sharing API

## Overview

This is a secure file-sharing system that allows different types of users to upload and download files. The system provides separate roles for **Operation Users (Ops Users)** and **Client Users**. Ops Users can upload specific file types (pptx, docx, and xlsx), while Client Users can view a list of files, receive secure download links, and download the files.

The application provides REST APIs for:

1. User authentication (Signup, Login).
2. File upload (only for Ops Users).
3. File download (secure, for Client Users).
4. List all uploaded files.

## Features

- **Ops User** can upload files (pptx, docx, and xlsx only).
- **Client User** can sign up, login, view files, and download them via secure URLs.
- Secure, encrypted URLs are provided for file download.
- Access to file download URLs is restricted to the corresponding Client User.
- JWT authentication for secure access.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer
- **Email Verification**: Nodemailer (for email verification)
- **Environment Variables**: dotenv
- **Cors**: To handle cross-origin requests
- **File Encryption**: JWT for secure file links

## Project Setup

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (https://nodejs.org)
- npm (comes with Node.js)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sairamdasari7/Secure-File-Sharing-API-App.git
   cd secure-file-sharing

2. Install dependencies:

    ```bash
    npm install

3. Create a .env file in the root of the project and add the following variables:

4. env

    PORT=5000
    MONGO_URI=mongodb://localhost:27017/secure-file-sharing
    JWT_SECRET=your-jwt-secret
    EMAIL_HOST=smtp.your-email-provider.com
    EMAIL_PORT=587
    EMAIL_USER=your-email@example.com
    EMAIL_PASS=your-email-password

   - Ensure you replace the placeholders with actual values.

- Create the uploads directory: Make sure that the uploads directory exists in the root of the project to store the uploaded files:


    ```bash
      mkdir uploads
    
 ### Run the application:

    ```bash
      npm start
      
  - The API will be running on http://localhost:5000.

### API Endpoints
  #### Authentication
    POST /api/auth/register
    Register a new user (Client User).

  Request body: { "email": "user@example.com", "password": "password" }
  Response: { "message": "Please verify your email" }
  POST /api/auth/login
  Log in a user (both Client User and Ops User).

  Request body: { "email": "user@example.com", "password": "password" }
  Response: { "token": "jwt-token" }
  GET /api/auth/verify/

- Verify email using the token sent during registration.

### File Operations
  POST /api/files/upload (Ops User Only)
  Upload a file (pptx, docx, or xlsx only).

  Request body (multipart/form-data): file
  Response: { "message": "File uploaded successfully", "file": { ... } }
  GET /api/files/list (Client User Only)
  List all uploaded files.
  
  Response: [ { "filename": "file1.pptx", "uploadedBy": { "email": "ops@example.com" } }, { ... } ]
  GET /api/files/generate-link/
  (Client User Only)
  Generate a secure, encrypted download link for a file.

  Response: { "download-link": "http://localhost:5000/api/files/download/{token}", "message": "success" }
  GET /api/files/download/
  (Client User Only)
  Download a file using the encrypted URL.
  
  Response: File download.

### How It Works

- Ops User can upload files (pptx, docx, xlsx) by logging in as an Ops User.
- Client User can sign up and log in. They can then view all uploaded files and request secure download links.
- Once the Client User requests a download, they receive a secure URL that is valid for 15 minutes.
- The file can only be downloaded if the Client User is authenticated with the correct token.
