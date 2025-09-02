import 'dotenv/config'; 

import express from 'express';
import cookieParser from "cookie-parser"
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use("/api/payments", paymentRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
