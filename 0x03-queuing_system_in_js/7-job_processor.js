import kue from 'kue';

const queue = kue.createQueue();

const blacklistNumbers = ['4153518780', '4153518781'];

const sendNotification = (phoneNumber, message, job, done) => {
  // track job progress
  job.progress(0, 100);

  if (blacklistNumbers.includes(phoneNumber)) {
    // Phone number is blacklisted, fail the job
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  } else {
    // Phone number is not blacklisted, update progress and send notification
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done();
  }
};

// Process jobs from the push_notification_code_2 queue
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
