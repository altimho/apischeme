(function APIScheme() {

  'use strict';

  const SCHEME_EXPR = /^(\w+):\/\//,
        SERVICE_NAME = 'APIScheme';

  class Provider {
    constructor($sceDelegateProvider) {
      angular.extend(this, {
        $sceDelegateProvider,
        schemes: {}
      });
    }

    register(scheme, processor) {
      var whitelist = this.$sceDelegateProvider.resourceUrlWhitelist();

      if (angular.isFunction(processor)) {
        this.schemes[scheme] = processor;
      }
      else {
        this.schemes[scheme] = (url) => url.replace(`${scheme}:/`, processor);
      }

      this.$sceDelegateProvider.resourceUrlWhitelist(
        whitelist.concat([ `${scheme}://**` ])
      );
    }

    process(scheme, url) {
      return (this.schemes[scheme] || angular.identity)(url);
    }

    $get() {
      return {
        request: this.request.bind(this)
      };
    }

    request(config) {
      var [ , scheme ] = SCHEME_EXPR.exec(config.url) || [];

      if (angular.isDefined(this.schemes[scheme])) {
        config.url = this.process(scheme, config.url);
      }

      return config;
    }
  }

  function config($httpProvider) {
    $httpProvider.interceptors.push(SERVICE_NAME);
  }

  angular.module('altimho.apischeme', [])
    .provider(SERVICE_NAME, [ '$sceDelegateProvider', Provider ])
    .config([ '$httpProvider', config ]);

})();
