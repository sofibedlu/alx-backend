import kue from 'kue';

const queue = kue.createQueue();

// Function to send a notification
const sendNotification = (phoneNumber, message) => {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

// Queue process for push_notification_code
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  // Call the sendNotification function with job data
  sendNotification(phoneNumber, message);

  // Mark the job as completed
  done();
});
