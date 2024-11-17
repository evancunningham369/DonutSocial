# **Donut Social**

A full-stack social networking platform where users can connect, share updates, and engage with others. Donut Social allows users to create accounts, log in via Google or email, and post updates in a sleek, interactive feed.

---

## **Table of Contents**
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Authentication Details](#authentication-details)
- [Future Enhancements](#future-enhancements)
- [Contact](#contact)

---

## **Features**
- **User Authentication**:
  - Local login with email and password.
  - Google Sign-In via OAuth 2.0.
- **Users can**:
  - like posts
  - delete posts
  - follow users
- **Interactive Feed**:
  - Post creation and display.
  - Filter posts by liked, following, and your own posts.
- **User Profile**:
  - Upload user profile pictures.
- **Responsive Design(In-Progress)**:
  - Optimized for desktop and mobile screens.

---

## **Tech Stack**
### **Front-End**:
- React
- HTML5, CSS3
- JavaScript (ES6+)

### **Back-End**:
- Node.js
- Express
- PostgreSQL

## **Creating a Post**
- Navigate to the "Create Post" form.
- Enter your message and click submit.
- The post will appear on the feed.

## **Authentication Details**
This project uses Google OAuth 2.0 for seamless login:

1. **Client Side**:
   - User clicks "Sign in with Google."
   - Google redirects back with an ID token.

2. **Server Side**:
   - The ID token is verified using the Google OAuth 2.0 client library.
   - Upon successful verification, user data is stored in the database or used to create a session.

**Future Enhancements**:
- Real-Time Updates:
  - Use WebSockets or Firebase for real-time post updates.
- User messaging
- Notifications:
  - Notify users when someone likes or comments on their posts.

### **Packages and Tools**:
- Bcrypt for password hashing
- OAuth 2.0 for Google authentication
- RESTful API for database interaction
- GitHub and Azure Cloud for development and deployment
  
## **Contact**
For any questions or feedback, feel free to reach out:
- **Email**: evancunningham369@yahoo.com
  
---

## **Installation**
Follow these steps to set up and run the project locally:

(Work In Progress)
