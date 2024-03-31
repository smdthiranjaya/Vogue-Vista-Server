const express = require('express');
const { Pool } = require('pg');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

app.post('/users/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); 
  
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

            const token = jwt.sign({ userId: user.id }, 'YourSecretKey', { expiresIn: '1h' });
            res.json({ token, userId: user.id });

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

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
      const userData = await pool.query(
          'SELECT id::text, email, name, address FROM users WHERE id = $1',
          [id]
      );
      if (userData.rows.length > 0) {
          res.json(userData.rows[0]);
      } else {
          res.status(404).send('User not found');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, address } = req.body;
  
  try {
      const updateUser = await pool.query(
          'UPDATE users SET name = $1, email = $2, address = $3 WHERE id = $4 RETURNING *',
          [name, email, address, id]
      );
      if (updateUser.rows.length > 0) {
          res.json(updateUser.rows[0]);
      } else {
          res.status(404).send('User not found');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});


app.post('/cart/add', async (req, res) => {
  const { userId, productId, quantity, color, size, price, name , imageUrl} = req.body;
  
  try {
      let cartResult = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (cartResult.rows.length === 0) {
          cartResult = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
      }
      const cartId = cartResult.rows[0].id;

      const newItem = await pool.query(
          'INSERT INTO cart_items (cart_id, product_id, quantity, color, size, price, name, imageUrl) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
          [cartId, productId, quantity, color, size, price, name, imageUrl]
      );
      res.json(newItem.rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.delete('/cart/item/:itemId', async (req, res) => {
  const { itemId } = req.params;

  try {
      const deleteResult = await pool.query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [itemId]);

      if (deleteResult.rows.length === 0) {
          return res.status(404).send('Item not found');
      }

      res.json({ message: 'Item removed', item: deleteResult.rows[0] });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.post('/order/create', async (req, res) => {
  const { userId, address, cardNumber, totalAmount, createdAt, status, items } = req.body;
  
  try {
      const serializedItems = JSON.stringify(items); // Serialize items to a JSON string

      // Insert the order, including serialized items, into the orders table
      const insertResult = await pool.query(
          'INSERT INTO orders (user_id, address, card_number, total_amount, created_at, status, items_details) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
          [userId, address, cardNumber, totalAmount, createdAt, status, serializedItems]
      );

      const orderId = insertResult.rows[0].id;

      res.status(201).json({ message: "Order successfully created", orderId: orderId });
  } catch (err) {
      console.error('Error creating order:', err);
      res.status(500).send('Server error');
  }
});



app.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
      const cart = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
      if (cart.rows.length === 0) {
          return res.status(404).json({ message: 'Cart not found' });
      }
      
      const items = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cart.rows[0].id]);
      
      return res.json({
          ...cart.rows[0],
          items: items.rows
      });
  } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
  }
});

app.get('/products', async (req, res) => {
  const { category, price, sort, search } = req.query;
  let query = 'SELECT * FROM products';
  let conditions = [];
  let queryParams = [];
  
  if (category) {
      conditions.push('category = $1');
      queryParams.push(category);
  }

  if (search) {
    conditions.push('LOWER(name) LIKE LOWER($' + (queryParams.length + 1) + ')');
    queryParams.push(`%${search}%`);
  }
  
  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

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

app.get('/special-offers', async (req, res) => {
  const query = 'SELECT * FROM products WHERE is_special_offer = true ORDER BY created_at DESC LIMIT 5';

  try {
      const result = await pool.query(query);
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});


app.post('/addproducts', async (req, res) => {
    try {
      const { name, description, price, category, color, size, imageUrl } = req.body;
      const query = `
        INSERT INTO products(name, description, price, category, color, size, imageUrl)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;`; // SQL query to insert data and return the inserted row
  
      // Execute the query
      const result = await pool.query(query, [name, description, price, category, color, size, imageUrl]);
  
      // Send the inserted product as the response
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

// app.get('/products/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//       const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
//       const imagesResult = await pool.query('SELECT image_url FROM product_images WHERE product_id = $1', [id]);
//       const product = productResult.rows[0];
//       product.images = imagesResult.rows.map(row => row.image_url);
//       res.json(product);
//   } catch (err) {
//       console.error(err);
//       res.status(500).send('Server error');
//   }
// });


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
