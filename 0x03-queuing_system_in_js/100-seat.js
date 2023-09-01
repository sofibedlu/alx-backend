const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const kue = require('kue');

// Create a Redis client
const client = redis.createClient();
// Promisify Redis client methods for async/await usage
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const app = express();
const port = 1245;
const queue = kue.createQueue();

// Initialize the number of available seats and reservation flag
let availableSeats = 50;
let reservationEnabled = true;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Function to reserve seats in Redis
async function reserveSeat(number) {
  try {
    await setAsync('available_seats', number); // Set the 'available_seats' key in Redis
    availableSeats = number;
  } catch (error) {
    throw new Error('Failed to reserve seats');
  }
}

// Function to get the current number of available seats from Redis
async function getCurrentAvailableSeats() {
  try {
    const seats = await getAsync('available_seats'); // Get the 'available_seats' key from Redis
    return parseInt(seats, 10);
  } catch (error) {
    throw new Error('Failed to get available seats');
  }
}

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  // Return the number of available seats as JSON
  res.json({ numberOfAvailableSeats: availableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    // If reservation is disabled, return a message
    return res.json({ status: 'Reservation is blocked' });
  }

  // Create and enqueue a reservation job in Kue
  const job = queue.create('reserve_seat', {}).save((err) => {
    if (err) {
      console.error(`Seat reservation job ${job.id} failed: ${err.message}`);
      // If job creation fails, return a failure message
      return res.json({ status: 'Reservation failed' });
    }

    console.log(`Seat reservation job ${job.id} created`);
    // If job creation is successful, return an in-process message
    res.json({ status: 'Reservation in process' });
  });
});

// Route to process the reservation queue
app.get('/process', async (req, res) => {
  // Return a message indicating the queue is being processed
  res.json({ status: 'Queue processing' });

  // Process the queue for seat reservations
  queue.process('reserve_seat', async (job, done) => {
    try {
      const currentSeats = await getCurrentAvailableSeats();
      if (currentSeats <= 0) {
        // If no seats are available, disable further reservations and fail the job
        reservationEnabled = false;
        done(new Error('Not enough seats available'));
      } else {
        // If seats are available, reserve one and update availability
        await reserveSeat(currentSeats - 1);
        if (currentSeats - 1 === 0) {
          reservationEnabled = false;
        }
        console.log(`Seat reservation job ${job.id} completed`);
        done();
      }
    } catch (error) {
      console.error(`Seat reservation job ${job.id} failed: ${error.message}`);
      done(error);
    }
  });
});

// Function to initialize available seats in Redis
async function initializeAvailableSeats(number) {
  try {
    await setAsync('available_seats', number);
  } catch (error) {
    throw new Error('Failed to initialize available seats in Redis');
  }
}

// Initialize available seats in Redis when the server starts
initializeAvailableSeats(availableSeats) // Set the initial value

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
