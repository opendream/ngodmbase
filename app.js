'use strict';

angular.module('odmbase', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.router',
  'ui.bootstrap',
  'ngTouch',
  'angular-loading-bar',
  'ngAnimate',
  'textAngular',
  'monospaced.elastic',
  'restangular',
  'ui.gravatar',
  'ui.slider',
  'LocalStorageModule',
  'ngCart',
  'ngCart.directives',
  'angularFileUpload',
  'angular-ellipses',
  'facebook',
  'googleplus',
  'angularMoment',
  'ui.bootstrap.datetimepicker',
  'ngTagsInput',
  'ngDropdowns',
  'infinite-scroll',
  'angular-carousel',
  '720kb.socialshare',
  'youtube-embed',
  'validation.match',
  'angular-blocks',
  'wu.masonry',
  'ngTextTruncate',
  'sticky',
  'pasvaz.bindonce',
  'timer',
  'nl2br',
  'pascalprecht.translate',
  'angular-tour',
  'chart.js'
])


  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$resourceProvider', 'RestangularProvider', '$provide', 'localStorageServiceProvider', 'FacebookProvider', 'GooglePlusProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $resourceProvider, RestangularProvider, $provide, localStorageServiceProvider, FacebookProvider, GooglePlusProvider) {

    var apiVersion = '/api/v1';
    $urlRouterProvider.otherwise(function ($injector, $location) {
        //$rootScope = $injector.get('$rootScope');
        //$rootScope.pageNotFound = true;
        $.post('/api/v1/page_not_found/', {path: $location.path()});
        return '/404';
    });
    $urlRouterProvider.rule(function($injector, $location) {

      var path = $location.path();
      var hasTrailingSlash = path[path.length-1] === '/';

      if(hasTrailingSlash) {

        //if last charcter is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        return newPath;
      }

    });



    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    $resourceProvider.defaults.stripTrailingSlashes = false;

    localStorageServiceProvider.setNotify(true, true);

    RestangularProvider.configuration.requestSuffix = '/';
    RestangularProvider.configuration.suffix = '/';
    RestangularProvider.setBaseUrl(apiVersion);

    FacebookProvider.init(FACEBOOK_APP_ID);
    FacebookProvider.setInitCustomOption('scope', FACEBOOK_EXTENDED_PERMISSIONS);

     GooglePlusProvider.init({
        clientId: GOOGLE_OAUTH2_CLIENT_ID,
        apiKey: GOOGLE_OAUTH2_API_KEY,
        scopes: 'https://www.googleapis.com/auth/userinfo.email'
     });

    $provide.decorator('taOptions', ['$delegate', function(taOptions){
        // $delegate is the taOptions we are decorating
        // here we override the default toolbars and classes specified in taOptions.
        taOptions.toolbar = [
            ['bold', 'italics', 'ul', 'ol', 'quote'],
            // ['justifyLeft','justifyCenter','justifyRight'],
            ['insertLink']
        ];
        taOptions.classes = {
            focussed: 'focussed',
            toolbar: 'btn-toolbar',
            toolbarGroup: 'btn-group',
            toolbarButton: 'btn btn-default',
            toolbarButtonActive: 'active',
            disabled: 'disabled',
            textEditor: 'form-control',
            htmlEditor: 'form-control'
        };
        return taOptions; // whatever you return will be the taOptions
    }]);
  }])
  .factory('authInterceptor', ['$rootScope', '$q', '$cookieStore', '$location', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization key to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('key')) {
          config.headers.Authorization = 'ApiKey ' + $cookieStore.get('key');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          //$location.path('/login');
          // remove any stale keys
          // $cookieStore.remove('key');
          return $q.reject(response);
        }
        else if(response.status === 404) {
          $.post('/api/v1/page_not_found/', {path: $location.path()});
          //window.location = '/404';
          $rootScope.pageNotFound = true;
          $rootScope.hideNavbar = true;
          return $q.reject(response);
        }
        else if (response.status === 500) {
          //window.location = '/500';
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }])

  .run(['$rootScope', '$location', '$route', '$q', '$http', '$window', 'Auth', 'Modal', function ($rootScope, $location, $route, $q, $http, $window, Auth, Modal) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      $rootScope.hideNavbar = false;
      $rootScope.pageNotFound = false;
      $rootScope.accessDenied = false;
      $rootScope.currentPath = $location.path();

      Auth.isLoggedInAsync(function(loggedIn, user) {
        if (next.authenticate && !loggedIn) {
          //$location.path('/login');
          $rootScope.accessDenied = true;
          Modal.open('/static/app/odmbase/account/modal/login_modal.html', null, {'hideCloseButton': true});
        }

        if (next.superuser && !user.is_superuser) {
          $rootScope.accessDenied = true;
        }

        if (!loggedIn) {
          $rootScope.pageClass = 'page--unauthen' + $location.path().replace('/', '--');
        }
        else {
          $rootScope.pageClass = 'page' + $location.path().replace('/', '--');
        }
      });
    });

    $rootScope.$on('$stateChangeSuccess', function (event, current, previous) {

     window.onbeforeunload = null;

      if (current && current.title) {
        $rootScope.pageTitle = current.title + ' | ' + SITE_NAME;
      }
      else {
        $http({
          url: $location.path(),
          method: "GET",
          params: {get_title: true}
        }).success(function (title) {
          $rootScope.pageTitle = title;
        })
        .error(function (title) {
          $rootScope.pageTitle = SITE_NAME;
        });
      }

      if ($window.ga) {
          $window.ga('send', 'pageview', { page: $location.url() });
      }
    });

  }]);
