module.exports = function (role) {
    return (req, res, next) => {
        const userRole = req.headers['x-role'];
        if (userRole !== role) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};
