# APIScheme

AngularJS module for translation of pseudo-url (like `api://collection/items/3`) to real url (`https://example.com/collection/items/3`). Useful for writing API calls, template URLs etc.

# Using

Add `altimho.apischeme` module as dependency and register URL scheme in config section.

```
angular.module('example', [ 'altimho.apischeme' ])
  .config(function (APISchemeInterceptorProvider) {
    APISchemeInterceptorProvider.register('api', 'https://api.example.com');
    APISchemeInterceptorProvider.register('template', 'https://example.com/tpl');
  });
```

Now you can use URLs like `api://items/1` (converted to `https://api.example.com/items/1`) and `template://view-item.tpl.html` (converted to `https://example.com/tpl/view-item.tpl.html`).

# Building

Install dependencies and run `make` script.

```
npm install
make
```
