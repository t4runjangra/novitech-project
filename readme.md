# TaskFlow - MERN Stack Task Management System

**TaskFlow** is a full-stack web application designed to help users organize, track, and manage their daily productivity. Built using the **MERN stack** (MongoDB, Express, React, Node.js), it features a modern, responsive UI with advanced state management and secure authentication.

---

## 🚀 Key Features

- **Full CRUD Operations**: Create, Read, Update, and Delete tasks seamlessly.
- **Secure Authentication**: User registration and login powered by **JWT (JSON Web Tokens)** and encrypted passwords.
- **Dynamic Dashboard**: Real-time task status toggling (Pending/Completed) without page refreshes.
- **Advanced Filtering**: A dedicated sidebar allows users to filter tasks by "All," "Pending," or "Completed" status.
- **Theme Management**: Integrated **Dark/Light Mode** support using React Context API and Tailwind CSS.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views with a custom hamburger menu.
- **Professional UI**: Smooth staggered animations using **Framer Motion** and toast notifications for user feedback.

---

## 🛠️ Tech Stack

### Frontend

- **React.js**: Functional components and Hooks.
- **Tailwind CSS**: Utility-first styling for a custom, clean look.
- **Framer Motion**: For premium entry and exit animations.
- **Lucide React**: High-quality SVG icons.

### Backend

- **Node.js & Express.js**: RESTful API architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database schema.
- **JWT**: Secure stateless authentication.
- **Bcrypt**: Password hashing for security.

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js installed
- MongoDB Atlas account or local MongoDB installation

### 1. Clone the repository

```bash
git clone https://github.com/t4runjangra/novitech-project.git
cd taskflow
```

### 2. Backend Setup

```bash
cd backend
npm install
```

- Create a .env file in the backend folder and add:

```
MONGO_URI=your_mongodb_connection_string
PORT = 3000
CORS_ORIGIN = http://localhost:5173
ACCESS_TOKEN_SECRET = YOUR_SECRET_KEY
ACCESS_TOKEN_EXPIRY = 1d
REFRES_TOKEN_SECRET = YOUR_SECRET_KEY
REFRES_TOKEN_EXPIRY = 10d
JWT_SECRET = YOUR_SECRET_KEY
```

* Start the server: 
``` npm start ```


### 3. Frontend Setup
``` bash 
cd ../frontend
npm install
npm run dev
```

## 📂 Project Structure
* ```/frontend``` : React components, Context API, and Tailwind styles.
* ```/backend``` :  API routes, Controller logic, and Database models.



## 📝 License
This project was developed as part of the Navio Tech Solution Internship Program.
