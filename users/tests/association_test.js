const mongoose = require('mongoose');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');
const assert = require('assert');

describe('Associations', () => {
    let joe, blogPost, comment;

    beforeEach((done) => {
        joe = new User({name: 'Joe'});
        blogPost = new BlogPost({
            title: 'JS is great',
            content: 'Sure it is'
        });
        comment = new Comment({
            content: 'This is a comment'
        });
        joe.blogPosts.push(blogPost);
        blogPost.comments.push(comment);
        comment.user = joe;

        Promise.all([joe.save(), blogPost.save(), comment.save()])
            .then(() => done())
            .catch((err) => console.log(err));
    });

    it('saves a relation between a user and a blog post (my way)', (done) => {
        User.findOne({name: 'Joe'})
            .then((user) => BlogPost.findOne({_id: user.blogPosts[0]}))
            .then((post) => {
                assert(post.title == 'JS is great');
                done();
            });
    });

    it('saves a relation between a user and a blog post', (done) => {
        User.findOne({ name: 'Joe' })
            .populate('blogPosts')
            .then((user) => {
                assert(user.blogPosts[0].title == 'JS is great');
                done();
            });
    });
});