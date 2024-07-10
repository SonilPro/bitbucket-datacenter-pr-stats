const PuppeteerEnvironment = require('jest-environment-puppeteer');

const { doLogin, doLogout } = require('./helpers/login-helper.js');
const { getUserLogin, getUserPassword } = require('./helpers/env-helper.js');

class BitbucketJestPuppeteerEnvironment extends PuppeteerEnvironment {
    async setup() {
        await super.setup();

        await doLogin(this.global.page, {
            login: getUserLogin(),
            password: getUserPassword(),
        });
    }

    async teardown() {
        await doLogout(this.global.page);

        await super.teardown();
    }
}

module.exports = BitbucketJestPuppeteerEnvironment;
