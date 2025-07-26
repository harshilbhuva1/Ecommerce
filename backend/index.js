const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');

const app = express();

// ✅ Trust proxy for proper secure cookies in deployment (Render/Netlify)
app.set('trust proxy', 1);

// ✅ CORS setup to allow frontend domain
app.use(cors({
    origin: process.env.REACT_APP_FRONTEND_URL,  // e.g., https://your-frontend.onrender.com
    credentials: true,  // allow sending cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Body parser & cookie middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Sample cookie test route (you can remove later)
app.get("/api/set-cookie", (req, res) => {
    res.cookie("sampleToken", "my-sample-token", {
        httpOnly: true,
        secure: true,          // needed for SameSite=None
        sameSite: 'None',      // allow frontend-backend on different domain
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.json({ message: "Cookie set!" });
});

// ✅ All other routes
app.use("/api", router);

// ✅ Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("✅ Connected to MongoDB");
        console.log(`✅ Server running on port ${PORT}`);
    });
});
