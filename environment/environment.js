module.exports = {
    env: (() => {
        let env;
        switch(process.env.TYPE) {
            case 'staging':
                env = require('./environment.staging').env;
                break;
            default:
                env = require('./environment.local').env;
                break;
        }
        console.log(`Loading environment ${env.ENV_NAME}`)
        return env
    })
};
