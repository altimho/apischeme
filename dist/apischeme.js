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
            this.schemes[scheme] = function (url) { return url.replace(scheme + ":/", processor); };
            this.$sceDelegateProvider.resourceUrlWhitelist(whitelist.concat([(scheme + "://**")]));
        };
        Provider.prototype.process = function (scheme, url) {
            return !!this.schemes[scheme] && this.schemes[scheme](url) || url;
        };
        Provider.prototype.exists = function (scheme) {
            return !!this.schemes[scheme];
        };
        Provider.prototype.$get = function () {
            return {
                request: this.request.bind(this)
            };
        };
        Provider.prototype.request = function (config) {
            var scheme = SCHEME_EXPR.exec(config.url);
            if (!!scheme &&
                !!scheme[1] &&
                this.exists(scheme[1]) &&
                config.url.indexOf(scheme[1] + "://") === 0) {
                config.url = this.process(scheme[1], config.url);
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
