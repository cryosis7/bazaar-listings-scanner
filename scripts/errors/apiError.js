export default class ApiError extends Error {
    constructor(message, code) {
        super(message)
        this.name = 'ApiError'
        this.message = message;
        this.code = code
    }
}