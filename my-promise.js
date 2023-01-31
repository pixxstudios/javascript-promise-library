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

    #onSuccessBind = this.#onSuccess.bind(this)
    #onFailBind = this.#onFail.bind(this)

    constructor(callback) {
        try {
        callback(this.#onSuccessBind, this.#onFailBind)
        } catch(err) {
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
        if (this.#state != STATE.PENDING) return;

        this.#state = STATE.FULFILLED;
        this.#value = value

        this.#runCallbacks()
    }

    #onFail(value) {
        if (this.#state != STATE.PENDING) return;

        this.#state = STATE.REJECTED
        this.#value = value

        this.#runCallbacks()
    }

    then(thenCb, catchCb) {
        if (thenCb !== undefined) this.#thenCallbacks.push(thenCb)
        if (catchCb !== undefined) this.#catchCallbacks.push(catchCb)

        this.#runCallbacks()
    }

    catch(cb) {
        this.then(undefined, cb)
    }

    finally(cb) {}
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