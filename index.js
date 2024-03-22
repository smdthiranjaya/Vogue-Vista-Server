const express = require('express');
const { Pool } = require('pg');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Note: only use this for Heroku's free tier
  }
});

app.post('/users/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); // Use bcrypt to hash the password
  
  try {
      const newUser = await pool.query(
          'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
          [email, hashedPassword, name]
      );
      res.json(newUser.rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userResult.rows.length > 0) {
          const user = userResult.rows[0];
          if (bcrypt.compareSync(password, user.password_hash)) {
              // Generate JWT token
              const token = jwt.sign({ userId: user.id }, 'YourSecretKey', { expiresIn: '1h' });
              res.json({ token });
          } else {
              res.status(401).send('Invalid credentials');
          }
      } else {
          res.status(404).send('User not found');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.post('/cart/add', async (req, res) => {
  const { userId, productId, quantity } = req.body; // Assuming the request includes userId or obtained from token
  
  try {
      // First, ensure there's a cart for this user
      let cartResult = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (cartResult.rows.length === 0) {
          // If not, create a new cart
          cartResult = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
      }
      const cartId = cartResult.rows[0].id;

      // Then, add the item to the cart
      const newItem = await pool.query(
          'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
          [cartId, productId, quantity]
      );
      res.json(newItem.rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});


app.post('/cart/remove', async (req, res) => {
  const { cartItemId } = req.body; // Assuming the request includes the ID of the cart item to remove
  
  try {
      await pool.query('DELETE FROM cart_items WHERE id = $1', [cartItemId]);
      res.send('Item removed from cart');
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.get('/cart', async (req, res) => {
  const { userId } = req.query; // Assuming the request includes userId or obtained from token
  
  try {
      const cartResult = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (cartResult.rows.length > 0) {
          const cartId = cartResult.rows[0].id;
          const itemsResult = await pool.query(
              'SELECT ci.quantity, p.id, p.name, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1',
              [cartId]
          );
          res.json(itemsResult.rows);
      } else {
          res.status(404).send('Cart not found');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});


app.get('/products', async (req, res) => {
  const { category, price, sort } = req.query;
  // Add SQL query logic to filter and sort based on the parameters
  // Example:
  let query = 'SELECT * FROM products';
  let conditions = [];
  let queryParams = [];
  
  if (category) {
      conditions.push('category = $1');
      queryParams.push(category);
  }
  // Similar for price or any other filters
  
  if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
  }

  // Sorting logic, e.g., sort by price
  if (sort) {
      query += ' ORDER BY price ' + (sort === 'asc' ? 'ASC' : 'DESC');
  }
  
  try {
      const result = await pool.query(query, queryParams);
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});


app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      const imagesResult = await pool.query('SELECT image_url FROM product_images WHERE product_id = $1', [id]);
      const product = productResult.rows[0];
      product.images = imagesResult.rows.map(row => row.image_url);
      res.json(product);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
