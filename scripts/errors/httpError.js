export default class HttpError extends Error {
    constructor(message, code) {
        super(message)
        this.name = 'HttpError'
        this.message = message;
        this.code = code
    }
}