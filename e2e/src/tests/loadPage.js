module.exports = {
    'Load Page' : function (browser) {
        browser.url(browser.launchUrl);

        browser.page.main().expect.element("@body").to.be.visible;
        browser.page.add().expect.element('@input').to.be.visible;

        browser.end();
    }
};