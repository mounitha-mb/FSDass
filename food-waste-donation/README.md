# FoodShare - Food Waste Donation App

This is a simple full-stack mini project for a college Full Stack Development assignment.

## Project Structure

food-waste-donation/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── donor-dashboard.html
│   ├── add-food.html
│   ├── available-food.html
│   ├── receiver-dashboard.html
│   ├── my-donations.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       ├── auth.js
│       ├── donor.js
│       └── receiver.js
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── models/
│   │   ├── User.js
│   │   ├── Food.js
│   │   └── Request.js
│   └── routes/
│       ├── authRoutes.js
│       ├── foodRoutes.js
│       └── requestRoutes.js
└── README.md

## Features

- Home page with landing UI
- Register page
- Login page
- Donor dashboard and add food form
- Available food page
- Receiver dashboard and request list
- My donations page
- MongoDB database models
- Express REST APIs with Mongoose

## Run Locally

1. Open the backend folder:

   cd backend

2. Install dependencies:

   npm install

3. Start MongoDB locally.

4. Start the backend server:

   npm start

5. Open the frontend pages in your browser.
