const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

console.log(process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    phNumber: String,
    username: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    inOrder: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, address, phNumber, username, password } = req.body;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username taken" });
        }
        
        const user = new User({
            firstName,
            lastName,
            address,
            phNumber,
            username,
            password,
            role: 'user'
        });
        
        await user.save();
        res.json({ success: true, userId: user._id });
    } catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username, password });
        
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        res.json({ 
            success: true, 
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

app.post("/driver/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username, password, role: 'driver' });
        
        if (!user) {
            return res.status(401).json({ error: "Invalid driver credentials" });
        }
        
        res.json({ 
            success: true, 
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: 'driver'
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Driver login failed" });
    }
});

app.get("/profile/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            inOrder: user.inOrder
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

const orderSchema = new mongoose.Schema({
    ingredients: { type: [String], required: true },
    status: { type: String, enum: ['pending', 'accepted', 'delivered'], default: 'pending' },
    address: String,
    userId: String
});

const Order = mongoose.model('Order', orderSchema);

app.post("/order", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.body.userId,
            { inOrder: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        const order = new Order({
            ingredients: req.body.ingredients,
            address: user.address,
            userId: user._id
        });
        await order.save();

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, orderId: order._id });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ success: false, message: "Failed to create order" });
    }
});

app.get("/orders/pending", async (req, res) => {
    try {
        const orders = await Order.find({ status: 'pending' });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching pending orders:", error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
});

app.post("/order/accept", async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.body.orderId,
            { status: 'accepted' },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const driver = await User.findByIdAndUpdate(
            req.body.driverId,
            { inOrder: true },
            { new: true }
        );
        
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }
        
        res.json({ success: true, order });
    } catch (error) {
        console.error("Order acceptance error:", error);
        res.status(500).json({ success: false, message: "Failed to accept order" });
    }
});

app.post("/order/deliver", async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.body.orderId,
            { status: 'delivered' },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const user = await User.findByIdAndUpdate(
            order.userId,
            { inOrder: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, order });
    } catch (error) {
        console.error("Order delivery error:", error);
        res.status(500).json({ success: false, message: "Failed to deliver order" });
    }
});

app.get("/order/status/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        
        res.json({ status: order.status, order });
    } catch (error) {
        console.error("Order status check error:", error);
        res.status(500).json({ success: false, message: "Failed to check order status" });
    }
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
