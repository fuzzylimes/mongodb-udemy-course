const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');

describe('Middleware', () => {
    let joe, blogPost;

    beforeEach((done) => {
        joe = new User({ name: 'Joe' });
        blogPost = new BlogPost({
            title: 'JS is great',
            content: 'Sure it is'
        });
        joe.blogPosts.push(blogPost);

        Promise.all([joe.save(), blogPost.save()])
            .then(() => done())
            .catch((err) => console.log(err));
    });

    it('users delete cleans up orphaned blog posts', (done) => {
        joe.remove()
            .then(() => BlogPost.count())
            .then((result) => {
                assert(result === 0);
                done();
            });
    });

});