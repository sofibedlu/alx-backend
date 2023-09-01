import kue from 'kue';
const { expect } = require('chai');
import createPushNotificationsJobs from './8-job';

const queue = kue.createQueue();

describe('createPushNotificationsJobs', () => {
  before(() => {
    // Enter test mode (prevent job processing)
    queue.testMode.enter();
  });

  after(() => {
    // Clear the queue and exit test mode
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('should create jobs for each jobData object', () => new Promise((done) => {
    const jobs = [
      { phoneNumber: '1234567890', message: 'Message 1' },
      { phoneNumber: '9876543210', message: 'Message 2' },
    ];

    createPushNotificationsJobs(jobs, queue);

    // Check if the jobs were created correctly
    expect(queue.testMode.jobs.length).to.equal(jobs.length);

    done();
  }));

  it('should throw an error if jobs is not an array', () => {
    // Test the error case when jobs is not an array
    const invalidJobs = 'This is not an array';

    expect(() => createPushNotificationsJobs(invalidJobs, queue)).to.throw('Jobs is not an array');
  });
});
