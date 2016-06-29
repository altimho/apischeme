'use strict';

describe('APIScheme Provider', function () {
  var TEST_SCHEME_NAME = 'test',
      TEST_SOURCE_URL = TEST_SCHEME_NAME + '://test',
      TEST_DOMAIN = 'http://example.com',
      TEST_DST_URL = TEST_DOMAIN + '/test',
      $sceDelegateProvider,
      APISchemeProvider;

  beforeEach(module('altimho.apischeme'));
  beforeEach(module(function (_$sceDelegateProvider_, _APISchemeProvider_) {
    $sceDelegateProvider = _$sceDelegateProvider_;
    APISchemeProvider = _APISchemeProvider_;
  }));
  beforeEach(inject());


  it('should be defined', function () {
    expect(APISchemeProvider).toBeDefined();
    expect(APISchemeProvider.$get).toBeDefined();
  });

  describe('register() call', function () {

    it('should allow registering string processors', function () {
      APISchemeProvider.register(TEST_SCHEME_NAME, TEST_DOMAIN);

      expect(APISchemeProvider.schemes[TEST_SCHEME_NAME]).toBeDefined();
    });

    it('should allow registering function processors', function () {
      APISchemeProvider.register(TEST_SCHEME_NAME, angular.noop);

      expect(APISchemeProvider.schemes[TEST_SCHEME_NAME]).toBe(angular.noop);
    });

    it('should register whitelist URL', function () {
      var TEST_REGEXP = new RegExp('^' + TEST_SCHEME_NAME + '\\:\/\/.*$');

      APISchemeProvider.register(TEST_SCHEME_NAME, null);

      expect(APISchemeProvider.schemes[TEST_SCHEME_NAME]).toBeDefined();
      expect($sceDelegateProvider.resourceUrlWhitelist())
        .toContain(TEST_REGEXP);
    });

  });

  describe('scheme processing', function () {

    it('should use string processor', function () {
      APISchemeProvider.register(TEST_SCHEME_NAME, TEST_DOMAIN);

      expect(APISchemeProvider.process(TEST_SCHEME_NAME, TEST_SOURCE_URL))
        .toBe(TEST_DST_URL);
    });

    it('should use function processor', function () {
      APISchemeProvider.register(TEST_SCHEME_NAME, function () {
        return TEST_SCHEME_NAME;
      });

      expect(APISchemeProvider.process(TEST_SCHEME_NAME, TEST_SOURCE_URL))
        .toBe(TEST_SCHEME_NAME);
    });

  });

});
