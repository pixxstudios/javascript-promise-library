const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

class MyPromise {
    #thenCallbacks = []
    #catchCallbacks = []
    #state = STATE.PENDING
    #value

    constructor(callback) {
        try {
        callback(this.#onSuccess, this.#onFail)
        } catch(err) {
            console.log('catch')
            this.#onFail(err)
        }
    }

    #runCallbacks() {
        if (this.#state === STATE.FULFILLED) {
            this.#thenCallbacks.forEach(callback => {
                callback(this.#value)
            })

            this.#thenCallbacks = []
        }

        if (this.#state === STATE.REJECTED) {
            this.#catchCallbacks.forEach(callback => {
                callback(this.#value)
            })

            this.#catchCallbacks = []
        }
    }

    #onSuccess(value) {
        console.log('onSuccess ', this.#state)
        if (this.#state != STATE.PENDING) return;

        this.#state = STATE.FULFILLED;
        this.#value = value

        this.#runCallbacks()
    }

    #onFail(value) {
        console.log('onFail ', this.#state)
        if (this.#state != STATE.PENDING) return;

        this.#state = STATE.REJECTED
        this.#value = value

        this.#runCallbacks()
    }

    then(callback) {
        this.#thenCallbacks.push(callback)

        this.#runCallbacks()
    }
}

module.exports = MyPromise;


const p = new MyPromise((resolve, reject) => {
    resolve(500)
});
p.then((res) => {
    console.log(res)
})

p.then(res => {
    console.log('> ', res)
})