module.exports = {
    apps: [
        {
            name: 'shtudy-company',
            script: 'npx',
            interpreter: 'none',
            args: 'serve -s company -l 5078',
            env_production: {
                NODE_ENV: 'production'
            }
        }
        ,  {
            name: 'shtudy-admin',
            script: 'npx',
            interpreter: 'none',
            args: 'serve -s admin -l 5080',
            env_production: {
                NODE_ENV: 'production'
            }
        }
        ,  {
            name: 'shtudy-student',
            script: 'npx',
            interpreter: 'none',
            args: 'serve -s student -l 5079',
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};
