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
      return !!this.schemes[scheme] && this.schemes[scheme](url) || url;
    }

    exists(scheme) {
      return !!this.schemes[scheme];
    }

    $get() {
      return {
        request: this.request.bind(this)
      };
    }

    request(config) {
      var scheme = SCHEME_EXPR.exec(config.url);

      if (
        !!scheme &&
        !!scheme[1] &&
        this.exists(scheme[1]) &&
        config.url.indexOf(`${scheme[1]}://`) === 0
      ) {
        config.url = this.process(scheme[1], config.url);
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
