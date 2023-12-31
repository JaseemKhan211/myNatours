const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //This is only work Create or Save!!!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    }
});

userSchema.pre('save', function() {
    //Only run this function if password actually modified
    if(!this.isModified('password')) return next();
    
    //Hash the password with cost of 12
    this.password = bcrypt.hash(this.password, 12);
    
    //Delete password confirm field
    this.confirmPassword = undefined;
    
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;