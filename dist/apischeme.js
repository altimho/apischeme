(function APIScheme() {
    'use strict';
    var SCHEME_EXPR = /^(\w+):\/\//, SERVICE_NAME = 'APIScheme';
    var Provider = (function () {
        function Provider($sceDelegateProvider) {
            angular.extend(this, {
                $sceDelegateProvider: $sceDelegateProvider,
                schemes: {}
            });
        }
        Provider.prototype.register = function (scheme, processor) {
            var whitelist = this.$sceDelegateProvider.resourceUrlWhitelist();
            if (angular.isFunction(processor)) {
                this.schemes[scheme] = processor;
            }
            else {
                this.schemes[scheme] = function (url) { return url.replace(scheme + ":/", processor); };
            }
            this.$sceDelegateProvider.resourceUrlWhitelist(whitelist.concat([(scheme + "://**")]));
        };
        Provider.prototype.process = function (scheme, url) {
            return (this.schemes[scheme] || angular.identity)(url);
        };
        Provider.prototype.$get = function () {
            return {
                request: this.request.bind(this)
            };
        };
        Provider.prototype.request = function (config) {
            var _a = SCHEME_EXPR.exec(config.url) || [], scheme = _a[1];
            if (angular.isDefined(this.schemes[scheme])) {
                config.url = this.process(scheme, config.url);
            }
            return config;
        };
        return Provider;
    }());
    function config($httpProvider) {
        $httpProvider.interceptors.push(SERVICE_NAME);
    }
    angular.module('altimho.apischeme', [])
        .provider(SERVICE_NAME, ['$sceDelegateProvider', Provider])
        .config(['$httpProvider', config]);
})();
