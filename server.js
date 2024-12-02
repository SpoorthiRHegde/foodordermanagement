const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

let menu = [];
let orders = [];

app.post('/menu', (req, res) => {
    const { name, price, category } = req.body;

    if (!name || !price || !category) {
        return res.status(400).send('All fields (name, price, category) are required.');
    }
    if (price <= 0) {
        return res.status(400).send('Price must be a positive number.');
    }

    const menuItem = { id: uuidv4(), name, price, category };
    menu.push(menuItem);

    res.status(201).send({ message: 'Menu item added.', menuItem });
});

app.get('/menu', (req, res) => {
    res.send(menu);
});


app.post('/orders', (req, res) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).send('Order must contain a list of item IDs.');
    }

    const validItems = items.every(itemId => menu.find(item => item.id === itemId));
    if (!validItems) {
        return res.status(400).send('One or more item IDs are invalid.');
    }

    const order = {
        id: uuidv4(),
        items,
        status: 'Preparing',
        createdAt: new Date(),
    };
    orders.push(order);

    res.status(201).send({ message: 'Order placed.', order });
});

app.get('/orders/:id', (req, res) => {
    const { id } = req.params;
    const order = orders.find(order => order.id === id);

    if (!order) {
        return res.status(404).send('Order not found.');
    }

    res.send(order);
});

let orderHistoryStack = []; 


function updateOrderStatus(order, newStatus) {

    orderHistoryStack.push({ orderId: order.id, status: order.status });

    order.status = newStatus;
}

app.get('/order-history', (req, res) => {
    res.send(orders);  
});

cron.schedule('*/1 * * * *', () => {
    orders.forEach(order => {
        if (order.status === 'Preparing') {
            updateOrderStatus(order, 'Out for Delivery');
        } else if (order.status === 'Out for Delivery') {
            updateOrderStatus(order, 'Delivered');
        }
    });
});

const lastStatusChange = orderHistoryStack.pop();
console.log(lastStatusChange);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
