const assert = require('assert');
const User = require('../src/user');

describe('Updating records', () => {
    let joe;

    beforeEach((done) => {
        joe = new User({name: "Joe", likes: 0});
        joe.save()
            .then(() => done())
    });

    function assertName(operation, done){
        operation
            .then(() => User.find({}))
            .then((users) => {
                assert(users.length === 1);
                assert(users[0].name === 'Alex');
                done();
            });
    }

    it('instance type using set and save', (done) => {
        joe.set('name', 'Alex');
        assertName(joe.save(), done);
            
    });

    it('instance type using update', (done) => {
        assertName(joe.update({name: 'Alex'}), done);
    });

    it('class type using update', (done) => {
        assertName(User.update({name: 'Joe'}, {name: 'Alex'}), done);
    });

    it('class type can update one record', (done) => {
        assertName(
            User.findOneAndUpdate({name: 'Joe'}, {name: 'Alex'}),
            done
        );
    });

    it('class type can find a record by id and update', (done) => {
        assertName(
            User.findByIdAndUpdate({_id: joe._id}, {name: 'Alex'}),
            done
        );
    });

    it('a user can have their post count incremented by 1', (done) => {
        User.update({name: 'Joe'}, {$inc: {likes: 1}})
            .then(() => User.findOne({name: 'Joe'}))
            .then((user) => {
                assert(user.likes === 1);
                done();
            });
    });

});