const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

const orderSchema = new mongoose.Schema({
    ingredients: { type: [String], required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

app.post("/order", async (req, res) => {
    try {
        const order = new Order({
            ingredients: req.body.ingredients
        });
        await order.save();
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
        
        res.json({ success: true, order });
    } catch (error) {
        console.error("Order acceptance error:", error);
        res.status(500).json({ success: false, message: "Failed to accept order" });
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
