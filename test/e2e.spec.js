'use strict';

describe('APIScheme Interceptor', function () {
  var $httpBackend,
      $http;

  beforeEach(module('altimho.apischeme'));
  beforeEach(module(function (APISchemeProvider) {
    APISchemeProvider.register('api', 'https://api.example.com');
    APISchemeProvider.register('tokenize', function (url) {
      return url.replace('tokenize://', '') + '?token';
    });
  }));

  beforeEach(inject(function (_$http_, _$httpBackend_) {
    $http = _$http_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function () {
    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should implement string processor', function () {
    $httpBackend
      .expectGET('https://api.example.com/collection')
      .respond();

    $http.get('api://collection');
  });

  it('should implement function processor', function () {
    $httpBackend
      .expectGET('https://example.com?token')
      .respond();

    $http.get('tokenize://https://example.com');
  });

  it('should leave url unchanged when there is no scheme', function () {
    $httpBackend
      .expectGET('https://example.com')
      .respond();

    $httpBackend
      .expectGET('test://example.com')
      .respond();

    $httpBackend
      .expectGET('example.com')
      .respond();

    $http.get('https://example.com');
    $http.get('test://example.com');
    $http.get('example.com');
  });

});
