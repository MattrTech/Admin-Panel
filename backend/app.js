const express = require("express");
const app = express();

app.use(express.json());

//Route Imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const cart = require('./routes/cartRoute');
const coupon = require('./routes/couponRoute');
const giftcard = require('./routes/giftcardRoute');

app.use('/api/v1/product', product);
app.use('/api/v1/user', user);
app.use('/api/v1/order', order);
app.use('/api/v1/cart', cart);
app.use('/api/v1/coupon', coupon);
app.use('/api/v1/giftcard', giftcard); 

module.exports = app;