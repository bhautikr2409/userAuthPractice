const { getUserToken } = require('../service/token');

const authenticateUser = (req, res, next) => {
    try {
        const token = req.cookies.accesstoken // WORKING

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decoded = getUserToken(token); // WORKING

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token"
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized - Invalid token"
        });
    }
};

module.exports = authenticateUser;