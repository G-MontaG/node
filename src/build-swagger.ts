import fs = require('fs');
import path = require('path');
import swaggerJSDoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: {
        info: {
            title: 'Node Swagger API',
            version: '1.0.0',
            description: 'Node swagger',
            contacts: {
                name: 'Node',
                url: 'https://github.com/G-MontaG/node',
                email: 'arthur.osipenko@gmail.com'
            },
            license: {
                name: 'MIT',
                url: 'https://github.com/G-MontaG/node/blob/master/LICENSE'
            }
        },
        host: 'localhost:3000',
        basePath: '/',
    },
    apis: ['./controllers/**/*.ts'],
});
fs.writeFile('../swagger/public/swagger.json', JSON.stringify(swaggerSpec), (err) => {
    if (err) {
        throw err;
    }
});
