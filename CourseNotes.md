## Promises
* Used to help define asyncronus functionality
* You can create a new Promise by using the following syntax:
```js
new Promise((resolve, reject) => {
    setTimeout(() => {
        if (counter>5) {
            resolve(counter);
        } else {
            reject(counter);
        }
    }, 2000)
})
```
* Note in the above that a Promise has two different inputs, resolve and reject.
* When your Promise has completed running whatever it needs to do, and the call was successful, you'd call the `resolve()` method, passing in any varaibles you need to return.
* If the promise has failed, such as erroring out, you can call the `reject()` method to return back the failure.
* To handle the actual function in the code, you use the dot notation to chain on to the initial function call:
```js
startGame()
    .then((count) => alert(`You win!\nYou clicked ${count} times!`))
    .catch((count) => alert(`You lost!\nYou only clicked ${count}/5 times!`));
```
* Most libraries already have promises written, we'll be written the consumers to handle them (at least in this course).
* As long as whatever you're using returns a promise, you can continue to chain them with `.then()` calls:
```js
it('model instance remove', (done) => {
    joe.remove()
        .then(() => User.findOne({name: 'Joe'}))
        .then((user) => {
            assert(user === null);
            done();
        });
});
```
* You can pass off promisses to a function and then deal with them there (for common, reusable code):
```js
function assertName(operation, done){
    operation
        .then(() => User.find({}))
        .then((users) => {
            assert(users.length === 1);
            assert(users[0].name === 'Alex');
            done();
        });
}
```

## Basic MongoDB Concepts
* Mongo allows for multiple databases within a single mongo instance
* Each database is made up of n number of collections
* Collections repersent a specific kind of data (you wouldn't typically mix with another collection)
* We're using Mongoose for Node in this course
* We're using Mocha for testing against the Node app

## User Models
* We create user models (using Mongoose in this case) to define how collections will be structured
* This is where we're setting what the schema will be for that collection when accessing data within the collection.
* Going to be using `mongoose.Schema` to define the model.
* Schema is created like follows:
```js
const UserSchema = new Schema({
    name: String
})
```
* Note how the properties of the schema is assigned to a Javascript type of `String`.
* In order to actually create the model (and in turn the collection), the following is required:
```js
const User = mongoose.model('user', UserSchema);
```
* If the defined collection does not exist in the connected database, it will create it on runtime.
* `User` above can now be refered to as the `User Class`.
    * `User` does NOT represent a single user, it represents the ENTIRE SET of data
* Best practive is to only export the Class name when creating models in projects (making usable in the rest of the application)
* Model classes give access to `find` and `findOne` methods.
    * criteria is an object with search criteria

## Inserting Records
* Start by creating a new instance of your model, complete with the parameters for that model:
```js
const joe = new User({ name: "Joe" });
```
* Once the instance has been created, you can use the `.save()` method to save it to mongo.
* Save method will return a promise, which can then be used to move on to assertions in Mocha.
    * After the new instance is created, Mongoose attaches an `isNew` proptery to the instance, defaulting to true
    * Once this has been saved to the database, this is flipped to false
* As soon as the instance has been created, an `_id` has been assigned

## Query Records
* Have two ways to retrieve records: `find` and `findone`
    * `find` returns array of all matches
    * `findOne` will return back first instance found
* Can't just use the `_id` for comparison as is, must convert it to a string first.
* Both `find` and `findOne` are used the same way. Always need to provide them an object to query off of.

## Deleting Records
* Mongoose calls a delete a `remove`
* The Model Class supports:
    * `remove()` - remove a bunch of records with some given criteria
    * `findOneAndRemove()` - takes a criteria, only deletes first matching record
    * `findByIdAndRemove()` - looks up an idea
    * All three of these are basically the same thing, just different ways of deleting
* An instance of a model only supports the `remove()` method. Only removes the specific instance.

## Updating Records
* Like delete, there are two different sets of updates
* Model Class specific:
    * `update()`
    * `findOneAndUpdate()`
    * `findByIdAndUpdate()`
* Model Instance specific:
    * `update()`
    * `set and save`
* using `set()` will only update the record in memory NOT in the database. It must be used with `save()` to update the record.
* `save()` is best suited when multiple updates are being done (like having multiple functions that do updates and saving at the end)
* When using `update()` for class, you provide both the query and the replacement:
```js
User.update({name: 'Joe'}, {name: 'Alex'})
```
* All three of the class specific updates work exactly the same (query, replacement)

## Mocha Tests
* Using mocha for testing automatically gives you access to `describe` function (test case) and `it` method (test step).
* Have to make assertions to do the evaluation
    * `assert` package must be imported, not imediately accessible
* Execute tests by running `mocha <test_folder_name>`.
* As an alternative, you can set up an npm start rule to kick it off (same as above).
* using `xit` instead of `it` will cause the test to be skipped
* using `it.only` will run only that specific test case

### test_helper
* `test_helper` file is created to handle things we want to be done related to the test
    * In this example we're using it to establish connection over to mongo
* Inside of `test_helper` you can use a `beforeEach()` function to define what needs to be done before each part of the test (such as wiping the db)
* Need to use the `done` callback to pause tests to wait for long running tasks to finish
    * `done` is provided by Mocha
    * `beforeEach` and `it` accept the done callback
* Use the `before` function to have the tests wait until the connection has been completed before starting

## Mongo Update Operators
* Can be used with any of the update commands to send an instruction to mongo on how to update a record
* Much more performant than retrieving the data and updating it locally, lets mongo do the work
* The operators are just used inline like a normal mongo query/operation:
```js
User.update({name: 'Joe'}, {$inc: {postCount: 1}})
```
* Example above will do an increment on the `postCount` attribute for any record with a name of `Joe` by 1
* [Here's a list of all the update operators](https://docs.mongodb.com/manual/reference/operator/update/)

## Mongoose specific capabilities
### Schema Validation
* Model files can be updated to perform validation
* Prevents invalid model data from being put into the database
* Properties are kept in an object inside of the model file
* To evaluate, you need to use `validate()` (async) or `validateSync()`:
```js
const validationResult = user.validateSync();
```
* The `validationResult` above has different properties, including the message that was set back in the model.
    * Can be accessed by `validationResult.errors.name.message`.
* Can set `validate` object inside of model definition to define a specific validation:
```js
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        validate: {
            validator: (name) => name.length > 2,
            message: 'Name must be longer than 2 characters.'
        }
    },
    postCount: Number
});
```

### Subdocuments
* You can create relation by making subdocuments within a document (for whatever reason)
* Create a new schema for whatever you want, and then embed it into the main model
    * subobjects are not models
* Please use the `findOneAndUpdate()` when adding or removing documents instead of constantly saving every two second.
    * They can be used in conjunction with the `$pull` and `$push` update operators to remove or add records

### Virtual Types
* Used in model, but don't get stored over in mongo
* Whenever the virtual property is refered to, it will call a function back in the model
* This is done by tagging with a getter
```js
UserSchema.virtual('postCount').get(function() {
    return this.posts.length;
});
```
* Notice above how we're using the `this` to access what's calling this function

## Referencing between collections
* Setting up references between documents between collections (think relational DB)
* Assign an object with type `Schema.Types.ObjectId` and a ref equal to a model name:
```js
const BlogPostSchema = new Schema({
    title: String,
    content: String,
    comments: [{
        type: Schema.Types.ObjectId, 
        ref: 'comment'
    }]
});
```
* This ref value MUST match what's being defined in model, as shown below:
```js
const Comment = mongoose.model('comment', CommentSchema);
```
* Mongoose does magic behind the sceens when associating the data. In the following steps, Mongoose is actually handling the id referencing:
```js
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
```
* When doing a query, you can add on a `populate` modifier to fill in the data for a specific field:
```js
it.only('saves a relation between a user and a blog post', (done) => {
    User.findOne({ name: 'Joe' })
        .populate('blogPosts')
        .then((user) => {
            console.log(user);
            done();
        });
});
```
* There is no way to recursively crawl like this. You only get one.
    * Mongoose will not allow it
* ... But evidently there is a way to do it? Not sure why it was said that it wasn't possible:
```js
it.only('saves a full relation tree', (done) => {
    User.findOne({name:'Joe'})
        .populate({
            path: 'blogPosts',
            populate: {
                path: 'comments',
                model: 'comment',
                populate: {
                    path: 'user',
                    model: 'user'
                }
            }
        })
        .then((user) => {
            assert(user.name === 'Joe');
            assert(user.blogPosts[0].title === 'JS is great');
            assert(user.blogPosts[0].comments[0].content === 'This is a comment');
            assert(user.blogPosts[0].comments[0].user.name === 'Joe');
            done();
        });
});
```