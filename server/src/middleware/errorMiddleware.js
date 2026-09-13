const errorMiddleware = (err, req, res, next) => {
    console.error('API Error:', err);

    let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    let message = 'Internal Server Error';

    // Safely extract message regardless of whether err is an Error object, string, or custom object
    if (typeof err === 'string') {
        message = err;
    } else if (err instanceof Error) {
        message = err.message || 'Server Error';
    } else if (err && err.message) {
        message = err.message;
    }

    if (err?.name === 'ValidationError') {
        statusCode = 400;
        if (err.errors) {
            message = Object.values(err.errors)
                .map((val) => val.message)
                .join(', ');
        }
    } else if (err?.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}.`;
    } else if (err?.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || 'Field';
        message = `${field} already exists.`;
    }

    // Always guarantee a valid JSON object structure
    return res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && err?.stack && { stack: err.stack })
    });
};

module.exports = errorMiddleware;