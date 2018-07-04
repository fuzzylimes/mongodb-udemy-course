const assert = require('assert');
const User = require('../src/user');

describe('Validating records', () => {
    it('requires a user name', () => {
        const user = new User({name: undefined, postCount: 5});
        const validationResult = user.validateSync();
        assert(validationResult.errors.name.message === 'Name is required.');
    });

    it('requires a user name longer than 2', () => {
        const user = new User({name: 'Al'});
        const validationResult = user.validateSync();
        assert(validationResult.errors.name.message === 'Name must be longer than 2 characters.');
    });
});