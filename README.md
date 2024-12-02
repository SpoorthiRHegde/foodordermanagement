# foodordermanagement

Overview
The backend provides APIs to:
Manage restaurant menus.
Handle customer orders.
Simulate order status updates for food delivery services.


Features
Add Menu Items: Include name, price, and category.
Place Orders: Select multiple items from the menu.
Track Order Status: Automatically update over time.


Requirements
Endpoints:
POST /menu: Add or update menu items.
GET /menu: Retrieve the menu list.
POST /orders: Place an order with selected menu items.
GET /orders/:id: Fetch specific order details.
Update Status (CRON Job): Automate order status transitions:
Preparing → Out for Delivery → Delivered


Data Validation:
Ensure menu item fields are valid:
Price: Must be positive.
Category: Must match predefined options.
Validate order requests to confirm item IDs exist.


Solution Design:
Use a queue to manage order statuses and processing.
Store menu items and orders in separate in-memory arrays or collections.
Integrate node-cron for simulating periodic status updates.
