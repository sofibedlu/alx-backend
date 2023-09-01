import redis from 'redis';
import express from 'express';
import util from 'util';

const client = redis.createClient();
const app = express();
const port = 1245;

const listProducts = [
  {
    id: 1, name: 'Suitcase 250', price: 50, stock: 4,
  },
  {
    id: 2, name: 'Suitcase 450', price: 100, stock: 10,
  },
  {
    id: 3, name: 'Suitcase 650', price: 350, stock: 2,
  },
  {
    id: 4, name: 'Suitcase 1050', price: 550, stock: 5,
  },
];

// Function to get a product by ID
const getItemById = (id) => listProducts.find((product) => product.id === id);

// Promisify the get and set methods
const getAsync = util.promisify(client.get).bind(client);
const setAsync = util.promisify(client.set).bind(client);

// Function to reserve stock for an item by itemId
const reserveStockById = async (itemId, stock) => {
  const key = `item:${itemId}`;
  await redis.set(key, stock);
};

// Async function to get the currently reserved stock by itemId
const getCurrentReservedStockById = async (itemId) => {
  const key = `item:${itemId}`;
  try {
    const reservedStock = await getAsync(key);
    return reservedStock || 0; // Return 0 if the key doesn't exist
  } catch (error) {
    throw error;
  }
};

// Middleware to handle checking stock availability and reserving a product
const reserveProductMiddleware = async (req, res, next) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);
  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const currentReservedStock = await getCurrentReservedStockById(itemId);

  if (currentReservedStock >= product.stock) {
    return res.status(400).json({ status: 'Not enough stock available', itemId });
  }

  // Reserve one item
  try {
    await setAsync(`item:${itemId}`, currentReservedStock + 1);
    res.json({ status: 'Reservation confirmed', itemId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'Internal Server Error' });
  }
};

// Route to list all available products
app.get('/list_products', (req, res) => {
  res.json(listProducts.map((product) => ({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
  })));
});

// Route to get product details
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const currentReservedStock = await getCurrentReservedStockById(itemId);

  res.json({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
    currentQuantity: product.stock - currentReservedStock,
  });
});

// Route to reserve a product
app.get('/reserve_product/:itemId', reserveProductMiddleware);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
