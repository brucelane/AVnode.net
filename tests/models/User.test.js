const assert = require('assert');
const slug = require('../../app/utilities/slug');
const User = require('../../app/models/User');

describe('User', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('should have a valid virtual property publicUrl', (done) => {
    const user = new User({
      name: 'John Doe',
      username: 'John Doe',
      slug: slug.parse('John Doe'),
      email: 'john@doe.com'
    });
    assert.equal(
      '/performers/john-doe',
      user.publicUrl
    );
    done();
  });
});
