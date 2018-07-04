const assert = require('assert');
const User = require('../src/user');

describe('Subdocuments', () => {
    it('can create a subdocument', (done) => {
        const joe = new User({ 
            name: 'Joe', 
            posts: [{
                title: 'Post One'
            },
            {
                title: 'Post Two'
            }]
        });
        joe.save()
            .then(() => User.findOne({name: 'Joe'}))
            .then((user) => {
                assert(user.posts.length === 2);
                assert(user.posts[1].title === 'Post Two');
                done();
            });
    });

    it('can add subdocuments to an existing record', (done) => {
        const joe = new User({
            name: 'Joe'
        });
        joe.save()
            .then(() => User.findOne({name: 'Joe'}))
            .then((user) => {
                user.posts.push({title: 'Post One'});
                return user.save();
            })
            .then(() => User.findOne({name: 'Joe'}))
            .then((user) => {
                console.log(user);
                assert(user.posts.length === 1);
                assert(user.posts[0].title === 'Post One');
                done();
            });
    });

    it('can add subdocuments using update operators', async() => {
        const joe = new User({
            name: 'Joe'
        });
        await joe.save();
        await User.findOneAndUpdate({name: 'Joe'}, {$push: {posts: {title: 'Post One'}}})
        user = await User.findOne({name: 'Joe'});
        assert(user.posts.length === 1);
        assert(user.posts[0].title === 'Post One');
    });

    it('can add multiple subdocuments using update operators', (done) => {
        const joe = new User({
            name: 'Joe'
        });
        joe.save()
            .then(() => User.findOneAndUpdate(
                {name: 'Joe'}, 
                {$push: {posts: [
                    {title: 'Post One'},
                    {title: 'Post Two'},
                    {title: 'Post Three'}
                ]}})
            )
            .then(() => User.findOne({name: 'Joe'}))
            .then((user) => {
                console.log(user);
                assert(user.posts.length === 3);
                assert(user.posts[2].title === 'Post Three');
                done();
            });
    });

    it('can remove an existing subdocument', (done) => {
        const joe = new User( {
            name: 'Joe',
            posts: [ {title: 'Post One'}]
        });
        joe.save()
            .then(() => User.findOne({name: 'Joe'}))
            .then((user) => {
                user.posts[0].remove();
                return user.save()
            })
            .then(() => User.findOne({name: 'Joe'}))
            .then((user) => {
                assert(user.posts.length === 0);
                done();
            });
    });

    it('can remove existing subdocument with update operators', async() => {
        const joe = new User({
            name: 'Joe',
            posts: [
                { title: 'Post One' },
                { title: 'Post Two' },
                { title: 'Post Three'}
            ]
        });
        await joe.save();
        await User.findOneAndUpdate(
            {name: 'Joe'}, 
            {$pull: {posts: {title: 'Post Two'}}}
        );
        let user = await User.findOne({name: 'Joe'});
        assert(user.posts.length === 2);
        assert(user.posts[0].title === 'Post One');
        assert(user.posts[1].title === 'Post Three');

    })
});