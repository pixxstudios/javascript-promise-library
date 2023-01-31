class MyPromise {
    constructor(callback) {
        try {
        callback(this.onSuccess, this.onFail)
        } catch(err) {
            this.onFail(err)
        }
    }

    onSuccess() {
        
    }

    onFail() {
        
    }
}

module.exports = MyPromise;