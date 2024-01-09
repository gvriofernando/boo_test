class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = {
    InvalidMBTIError: new CustomError("Invalid MBTI type", 400),
    InvalidEnneagramError: new CustomError("Invalid Enneagram type", 400),
    InvalidZodiacError: new CustomError("Invalid Zodiac type", 400),
    InternalServerError: new CustomError("Internal Server Error", 500),
};