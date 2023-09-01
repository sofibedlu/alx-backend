import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (error) => {
  console.error('Redis client error:', error);
});

const createHash = () => {
  client.hset('HolbertonSchools', 'Portland', 50, redis.print);
  client.hset('HolbertonSchools', 'Seattle', 80, redis.print);
  client.hset('HolbertonSchools', 'New York', 20, redis.print);
  client.hset('HolbertonSchools', 'Bogota', 20, redis.print);
  client.hset('HolbertonSchools', 'Cali', 40, redis.print);
  client.hset('HolbertonSchools', 'Paris', 2, redis.print);
};
const displayHash = () => {
  client.hgetall('HolbertonSchools', (error, result) => {
    if (error) {
      console.error('Error', error);
    } else {
      console.log(result);
    }

    client.quit();
  });
};

createHash();
displayHash();
