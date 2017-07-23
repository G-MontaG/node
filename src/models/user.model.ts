import crypto = require('crypto');
import mongoose = require('mongoose');
import moment = require('moment');
import passwordGenerator = require('password-generator');
import {
    emailConfirmTokenExp,
    emailConfirmTokenLength,
    forgotPasswordTokenExp,
    forgotPasswordTokenLength,
    passwordMinLength,
    resetPasswordTokenExp,
    resetPasswordTokenLength
} from '../helpers/constants';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, lowercase: true, unique: true, index: true},
    emailConfirmed: {type: Boolean, required: true, default: false},
    hash: {type: String},
    salt: {type: String},
    emailVerifyToken: {
        value: {type: String},
        exp: {type: Number}
    },
    resetPasswordToken: {
        value: {type: String},
        exp: {type: Number}
    },
    forgotPasswordToken: {
        value: {type: String},
        exp: {type: Number}
    },
    profile: {
        firstName: {type: String, default: ''},
        lastName: {type: String, default: ''},
        gender: {type: String, default: ''},
        language: {type: String, default: ''},
        picture: {
            url: {type: String, default: ''},
            source: {type: String, default: ''}
        }
    }
});

export interface IUserDocument extends mongoose.Document {
    id: string;
    email: string;
    emailConfirmed: boolean;
    hash: string;
    salt: string;
    emailVerifyToken: {
        value: string,
        exp: number
    };
    resetPasswordToken: {
        value: string,
        exp: number
    };
    forgotPasswordToken: {
        value: string,
        exp: number
    };
    profile: {
        firstName: string,
        lastName: string,
        gender: string,
        language: string,
        picture: {
            url: string,
            source: string
        }
    };

    cryptPassword(password: string): Promise<void>;
    checkPassword(password: string): Promise<boolean>;
    createPassword(): string;
    createEmailVerifyToken();
    setEmailConfirmed(): void;
    createResetPasswordToken();
    setResetPasswordTokenUsed(): void;
    createForgotPasswordToken();
    setForgotPasswordTokenUsed(): void;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
    findByEmail(email: string, cb: () => void);
}

// Generate hash based on <code>crypto.pbkdf2('sha512')</code> algorithm
function getHash(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!password || !salt) {
            reject(null);
        }
        const saltStr = salt;
        const length = 512;
        crypto.pbkdf2(password, saltStr, 100000, length, 'sha512', (err, hashStr) => {
            if (err) {
                reject(err);
            }
            resolve(hashStr.toString('hex'));
        });
    });
}

// Compare passwords based on their hashes
function compareHash(password: string, hash: string, salt: string): Promise<boolean> {
    if (!password || !hash || !salt) {
        return null;
    }
    return getHash(password, salt).then((generatedHash) => {
        return hash === generatedHash;
    });
}

userSchema.statics.findByEmail = (email: string, cb: () => void) => {
    return User.findOne({email}, cb);
};

userSchema.methods.cryptPassword = function(password: string): Promise<void> {
    this.salt = crypto.randomBytes(128).toString('hex');
    return getHash(password, this.salt).then((hash) => {
        this.hash = hash;
    });
};

userSchema.methods.checkPassword = function(password: string): Promise<boolean> {
    return compareHash(password, this.hash, this.salt).then((result) => {
        return result;
    });
};

userSchema.methods.createPassword = (): string => {
    return passwordGenerator(
        passwordMinLength,
        false,
        /[\w\d\W\!\@\#\$\%\^\&\*\(\)\=\_\+\,\.\/\<\>\?\;\'\:\"\|\{\}]/);
};

userSchema.methods.createEmailVerifyToken = function() {
    this.emailVerifyToken = {
        value: crypto.randomBytes(64).toString('base64').slice(0, emailConfirmTokenLength),
        exp: moment().add(emailConfirmTokenExp, 'hours').unix()
    };
};

userSchema.methods.setEmailConfirmed = function(): void {
    this.emailConfirmed = true;
    this.emailVerifyToken = undefined;
};

userSchema.methods.createResetPasswordToken = function() {
    this.resetPasswordToken = {
        value: crypto.randomBytes(64).toString('base64').slice(0, resetPasswordTokenLength),
        exp: moment().add(resetPasswordTokenExp, 'hours').unix()
    };
};

userSchema.methods.setResetPasswordTokenUsed = function(): void {
    this.resetPasswordToken = undefined;
};

userSchema.methods.createForgotPasswordToken = function() {
    this.forgotPasswordToken = {
        value: crypto.randomBytes(64).toString('base64').slice(0, forgotPasswordTokenLength),
        exp: moment().add(forgotPasswordTokenExp, 'hours').unix()
    };
};

userSchema.methods.setForgotPasswordTokenUsed = function(): void {
    this.forgotPasswordToken = undefined;
};

export const User = mongoose.model('User', userSchema) as IUserModel;
