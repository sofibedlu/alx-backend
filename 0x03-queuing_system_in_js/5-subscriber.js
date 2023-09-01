import redis from 'redis';

const client = redis.createClient();

// Event handler for a successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');

  // Subscribe to the "holberton school channel"
  client.subscribe('holberton school channel');
});

// Event handler for errors
client.on('error', (error) => {
  console.log('Redis client not connected to the server:', error);
});

// Event handler for incoming messages on the subscribed channel
client.on('message', (channel, message) => {
  console.log(message);

  if (message === 'KILL_SERVER') {
    client.unsubscribe();
    client.quit();
  }
});
