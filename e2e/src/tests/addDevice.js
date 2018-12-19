module.exports = {
    'Add a new Device' : function (browser) {
        browser.mongo(function(db) {
            console.log('Dropping all Devices');
            const col = db.collection('Devices');
            return col.remove({});
        });

        browser.url(browser.launchUrl);

        const addDeviceForm = browser.page.add();
        addDeviceForm.setValue('@input', 'Run first test');
        addDeviceForm.click('@submit');

        addDevcieForm.expect.element('@input').value.to.equal('');

        const devicesList = browser.page.devices();
        devicesList.expect.element('.item:nth-child(1) label').text.to.equal('Run first test');
        devicesList.assert.cssClassNotPresent('.item:nth-child(1) .checkbox', 'checked');

        browser.end();
    }
};