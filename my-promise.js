const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

class MyPromise {
    //when multiple then statements are chained together
    #thenCallbacks = []

    //when multiple catch statements are chained together
    #catchCallbacks = []

    // initial state for any promise
    #state = STATE.PENDING

    #value

    // this.#onSuccess and this.#onFail doesn't work directly
    // so using bind and assigning to new private variables
    #onSuccessBind = this.#onSuccess.bind(this)
    #onFailBind = this.#onFail.bind(this)

    constructor(callback) {
        try {
            // the default callback which is passed when initializing a new Promise
            callback(this.#onSuccessBind, this.#onFailBind)
        } catch(err) {
            // in case there is some error
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

    finally(cb) {
        return this.then(result => {
            cb()
            return result
        }, result => {
            cb()
            throw result
        })
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