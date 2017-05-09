import moment = require('moment');
import crypto = require('crypto');
import { emailTokenExp, emailTokenLength } from './constants';

// Generate token by crypto library and set expired field
export function generateToken(type: 'forgot' | 'reset' | 'verify'): { value: string, exp: number } {
    const response: { value: string, exp: number } = {value: '', exp: 0};
    if (type === 'forgot') {
        response.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
        response.exp = moment().add(emailTokenExp, 'hours').unix();
    } else if (type === 'reset') {
        response.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
        response.exp = moment().add(emailTokenExp, 'hours').unix();
    } else if (type === 'verify') {
        response.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
        response.exp = moment().add(emailTokenExp, 'hours').unix();
    }
    return response;
}
