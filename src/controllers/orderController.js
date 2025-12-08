import { pool } from "../config/db.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  const { items, total_amount } = req.body;
  const userId = req.user.id;

  try {
    // Insert into orders table
    const [orderResult] = await pool.query(
      "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
      [userId, total_amount]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    res.status(201).json({ message: "Order created", orderId });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// GET USER ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// GET ORDER BY ID
// GET ORDER BY ID (User)
export const getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const [order] = await pool.query("SELECT * FROM orders WHERE id = ?", [
      orderId,
    ]);

    if (order.length === 0)
      return res.status(404).json({ message: "Order not found" });

    // JOIN order items + product data
    const [items] = await pool.query(
      `
      SELECT 
        oi.id,
        oi.product_id,
        p.name AS product_name,
        p.image_url,
        oi.quantity,
        oi.price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      `,
      [orderId]
    );

    res.json({
      order: order[0],
      items,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// export const getOrderById = async (req, res) => {
//   const orderId = req.params.id;

//   try {
//     const [order] = await pool.query("SELECT * FROM orders WHERE id = ?", [
//       orderId,
//     ]);

//     if (order.length === 0)
//       return res.status(404).json({ message: "Order not found" });

//     const [items] = await pool.query(
//       "SELECT * FROM order_items WHERE order_id = ?",
//       [orderId]
//     );

//     res.json({ order: order[0], items });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", err });
//   }
// };

// ADMIN → GET ALL ORDERS
// ADMIN → GET FULL ORDER DETAILS 
export const getAllOrders = async (req, res) => {
  try {
    // 1️⃣ Fetch order basic info + user info
    const [orders] = await pool.query(`
      SELECT 
        o.id,
        o.user_id,
        o.total_amount,
        o.status,
        o.created_at,
        u.name AS user_name,
        u.email AS user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    // 2️⃣ Fetch items for each order
    for (let order of orders) {
      const [items] = await pool.query(
        `
        SELECT 
          oi.product_id,
          p.name AS product_name,
          oi.quantity,
          oi.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
        `,
        [order.id]
      );

      order.items = items;  // attach items to each order
    }

    res.json(orders);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", err });
  }
};


// ADMIN → UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  try {
    await pool.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, orderId]
    );

    res.json({ message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};
