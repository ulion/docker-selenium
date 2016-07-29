require('colors');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// adding custom promise chain method
wd.addPromiseChainMethod(
  'elementByCssSelectorWhenReady',
  function(selector, timeout) {
    return this
      .waitForElementByCssSelector(selector, timeout)
      .elementByCssSelector(selector);
  }
);

module.exports = function(browserName, privateMode) {
  var logPrefix = ('[' + browserName + '] ').grey;
  var browser = wd.promiseChainRemote({
    hostname: process.env.HUB_PORT_4444_TCP_ADDR,
    port: process.env.HUB_PORT_4444_TCP_PORT
  });

  // optional extra logging
  browser.on('status', function(info) {
    console.log(logPrefix + info.cyan);
  });
  browser.on('command', function(eventType, command, response) {
    console.log(logPrefix + ' > ' + eventType.cyan, command, (response || '').grey);
  });
  browser.on('http', function(meth, path, data) {
    console.log(logPrefix + ' > ' + meth.magenta, path, (data || '').grey);
  });

  var browserOptsMap = {
    'firefox': {
      shortName: 'Firefox',
    },
    'chrome': {
      shortName: 'Chrome',
      privateModeArg: 'incognito'
    },
    'operablink': {
      shortName: 'Opera',
      privateModeArg: 'newprivatetab'
    }
  };
  var browserOpts = browserOptsMap[browserName];
  var options = {
    browserName: browserName
  };
  if (privateMode) {
    if (browserOpts && browserOpts.privateModeArg) {
      options.chromeOptions = {
        args: [browserOpts.privateModeArg]
      };
    }
  }
  browser
    .init(options)
  .get("http://www.wikipedia.org")
  .title()
    .should.eventually.include('Wikipedia')
  .get("https://www.whatismybrowser.com/")
  .title()
    .should.eventually.include('browser')
  .elementByCssSelectorWhenReady('.string-major', 5000)
  .text()
    .should.eventually.include(browserOpts.shortName)
  .eval("navigator.userAgent")
  .elementByCssSelectorWhenReady('#ip-address .detected-column', 5000)
  .text()
  .fin(function() { return browser.quit(); })
  .catch(function(err) {
    console.error(err, err.stack);
    process.exit(1);
  })
  .done();
};
