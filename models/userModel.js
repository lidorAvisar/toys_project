const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role:{
        type:String,default:"user"
    }
}, { timestamps: true });

exports.UserModel = mongoose.model("users", userSchema);


exports.createToken = (_userId) => {
    const token = jwt.sign({ _id: _userId }, config.TOKEN_SECRET, { expiresIn: "60min" });
    return token;
}


exports.validateUser = (_reqBody) => {
    const joiSchema = Joi.object({
        name: Joi.string().min(2).max(200).required(),
        email: Joi.string().min(2).max(200).email().required(),
        password: Joi.string().min(2).max(200).required(),
    });
    return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
    const joiSchema = Joi.object({
        email: Joi.string().min(2).max(200).email().required(),
        password: Joi.string().min(2).max(200).required(),
    });
    return joiSchema.validate(_reqBody);
}

