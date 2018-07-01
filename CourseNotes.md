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