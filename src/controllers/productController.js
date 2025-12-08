import { pool } from "../config/db.js";

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// CREATE PRODUCT (ADMIN ONLY)
export const createProduct = async (req, res) => {
  const { name, description, price, image_url, stock, category } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, description, price, image_url, stock, category) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, price, image_url, stock, category]
    );

    res.status(201).json({ message: "Product created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// UPDATE PRODUCT (ADMIN ONLY)
export const updateProduct = async (req, res) => {
  const { name, description, price, image_url, stock, category } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE products SET name=?, description=?, price=?, image_url=?, stock=?, category=? WHERE id=?",
      [name, description, price, image_url, stock, category, req.params.id]
    );

    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id=?", [req.params.id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};
