const express = require("express");
const app = express();
const helmet =require('helmet');
const rateLimit = require('express-rate-limit')
const cors = require('cors');

// @ts-ignore
const limiter = rateLimit({
	windowMs: 60 * 1000, 
	max: 100, 
	standardHeaders: true, 
    message: 'Too many requests, please try again later.',
    })

app.use(limiter)
app.use(express.json());
app.use('/', helmet());
app.use('/', cors());
app.use(express.urlencoded({ extended: true }));

app.get('/healthcheck', (req, res) => {
	res.json({
		uptime: process.uptime(),
		timestamp: new Date()
	})
})
//Route Imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const cart = require('./routes/cartRoute');
const coupon = require('./routes/couponRoute');
const giftcard = require('./routes/giftcardRoute');
const auth = require('./routes/authRoute');
const rzr = require('./routes/razorpayRoute');

app.use('/api/v1/product', product);
app.use('/api/v1/user', user);
app.use('/api/v1/order', order);
app.use('/api/v1/cart', cart);
app.use('/api/v1/coupon', coupon);
app.use('/api/v1/giftcard', giftcard); 
app.use('/api/v1/razorpay', rzr); 
app.use('/api/v1/auth', auth); 


module.exports = app;