import kue from 'kue';

const queue = kue.createQueue();

// Define the job data format
const jobData = {
  phoneNumber: '1234567890',
  message: 'Hello, this is a test message',
};

// Create a job and add it to the queue
const notificationJob = queue.create('push_notification_code', jobData);
notificationJob.save((err) => {
  if (!err) {
    console.log(`Notification job created: ${notificationJob.id}`);
  } else {
    console.error('Error creating notification job:', err);
  }
});

notificationJob.on('complete', () => {
  console.log('Notification job completed');
});

notificationJob.on('failed', () => {
  console.log('Notification job failed');
});
