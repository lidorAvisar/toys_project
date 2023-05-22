const jwt = require("jsonwebtoken");
const {config} = require("../config/secret");


exports.authToken = (req, res, next) => {
    const token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ msg: 'you need send token111' });
    }
    try {
        const decodeToken = jwt.verify(token,config.TOKEN_SECRET);
        req.tokenData = decodeToken;
        next();

    }
    catch (err) {
        console.log(err);
        res.status(401).json({ msg: "token invalid or expired" });
    }
}