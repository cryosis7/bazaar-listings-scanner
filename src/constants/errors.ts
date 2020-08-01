export class ApiError extends Error {
    constructor(public message: string, public code: number) {
        super(message)
        this.name = 'ApiError';
    }
}

export class HttpError extends Error {
    constructor(public message: string, public code: number) {
        super(message)
        this.name = 'HttpError';
    }
}

export class InputError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = 'InputError';
    }
}