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
        queueMicrotask(() => {
            if (this.#state != STATE.PENDING) return;

            if (value && (typeof value.then === 'function')) {
                value.then(this.#onSuccessBind, this.#onFailBind)
                return
            }

            this.#state = STATE.FULFILLED;
            this.#value = value

            this.#runCallbacks()
        })
    }

    #onFail(value) {
        queueMicrotask(() => {
            if (this.#state != STATE.PENDING) return;
            
            if (value && (typeof value.then === 'function')) {
                value.then(this.#onSuccessBind, this.#onFailBind)
                return
            }

            this.#state = STATE.REJECTED
            this.#value = value

            this.#runCallbacks()
        })
    }

    then(thenCb, catchCb) {
        return new MyPromise((resolve, reject) => {
            this.#thenCallbacks.push(result => {
                if(thenCb === null) {
                    resolve(result)
                    return
                }

                try {
                    resolve(thenCb(result))
                }catch(error){
                    reject(error)
                }
            })


            this.#catchCallbacks.push(result => {
                if(catchCb === null) {
                    reject(result)
                    return
                }

                try {
                    resolve(catchCb(result))
                }catch(error){
                    reject(error)
                }
            })


            if (thenCb !== undefined) this.#thenCallbacks.push(thenCb)
            if (catchCb !== undefined) this.#catchCallbacks.push(catchCb)
    
            this.#runCallbacks()
        })
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