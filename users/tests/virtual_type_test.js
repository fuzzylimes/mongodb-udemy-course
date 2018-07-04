const assert = require('assert');
const User = require('../src/user');

describe('Virtual types', () => {
    it('postCount returns number of posts', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: [
                {title: 'Post One'},
                {title: 'Post Two'}
            ]
        });
        joe.save()
            .then(() => User.findOne({name: 'Joe'}))
            .then((user) => {
                assert(user.postCount == 2);
                done();
            });
    });
});