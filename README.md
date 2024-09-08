# Twitter Clone

This project is a clone of Twitter that mimics many of the core functionalities of the platform. Users can create accounts, follow others, post, comment, like, and interact with notifications. It provides a modern user interface and real-time features, offering an engaging social media experience.

## Features

- **User Authentication**: Users can sign up, log in, and manage their accounts securely with JWT-based authentication.
- **Follow System**: Follow other users and receive suggestions for accounts to follow.
- **Posts and Interactions**: Post tweets, comment on them, like posts, and engage with real-time notifications.
- **Profile Management**: Update profile information, including profile and cover pictures, with media stored on Cloudinary.
- **Real-Time Notifications**: Get instant updates for likes, comments, and follows.

## Tech Stack

- **Frontend**:
  - ReactJS with Vite
  - TailwindCSS
  - DaisyUI
  - React Router
  - Hot Toast
  - React Icons
- **Backend**:
  - Node.js
  - Express
  - Cloudinary (for media storage)
  - JWT (JSON Web Tokens) for authentication
  - Mongoose (MongoDB)

## Getting Started

To get the project running on your local machine, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/twitter-clone.git
cd twitter-clone

## 2. API Setup
Create a .env file in the api directory with the following environment variables:

MONGO_URI=mongodb+srv:<your_mongodb_URI>
JWT_SECRET_KEY=<your_jwt_secret_key>
PORT=<Your_port_number>
CLOUDINARY_API_SECRET=<your_cloudinary_secret>
CLOUDINARY_API_KEY=<your_cloudinary_key>
CLOUDINARY_NAME=<your_cloudinary_name>


Install the dependencies and start the API server:

cd ../api
npm install
nodemon app.js



## 3. Client Setup
Navigate to the client directory and install the necessary dependencies:
cd client
npm install
npm run dev


















