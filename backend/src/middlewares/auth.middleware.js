const jwt = require('jsonwebtoken');

exports.verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado.' });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = function (role) {
    return (req, res, next) => {
        const userRole = req.headers['x-role'];
        if (userRole !== role) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};
