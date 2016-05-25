const assert = require('assert');
const Location = require('../../../src/components/location');

describe('Location', () => {
  describe('#constructor()', () => {
    it('Creates a new Location', () => {
      assert.deepEqual(new Location({
        name: 'the garden',
        id: 0
      }), {
        name: 'the garden',
        id: 0
      });
    });
  });
});
