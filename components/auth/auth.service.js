'use strict';

angular.module('odmbase')
  .factory('Auth', ['$location', '$rootScope', '$http', 'User', 'Modal', '$cookieStore', '$q', 'Facebook', 'GooglePlus', '$interval', '$window', '$state', 'ngCart', function Auth($location, $rootScope, $http, User, Modal, $cookieStore, $q, Facebook, GooglePlus, $interval, $window, $state, ngCart) {
    var Auth = {};
    var currentUser = null;
    if($cookieStore.get('key')) {
      currentUser = User;
      User.one().me().then(function(model) {
        currentUser = model;
      }, function (err) {
          if (err.status == 403) {
            Auth.logout();
            $window.location('/');
          }
      } );

    }
    Auth.reloadUserData = function(callback) {
       if($cookieStore.get('key')) {
          currentUser = User;
          User.one().me().then(function(model) {
            currentUser = model;
            Auth.setCurrentUser(currentUser);
            callback && callback(currentUser);
          }, function (err) {
              if (err.status == 403) {
                Auth.logout();
                callback && callback(err);
                $window.location('/');
              }
          } );

       }
    }

    Auth.setApiKey = function(data) {
      if (data && data.key && data.username) {
        $cookieStore.put('key', data.username + ':' + data.key);
      }
    };

    Auth.setCurrentUser = function(user, callback) {
      var cb = callback || angular.noop;
      currentUser = user;
    };

    /**
     * Gets all available info on authenticated user
     *
     * @return {Object} user
     */
    Auth.getCurrentUser = function() {
      return currentUser;
    };

    /**
     * Authenticate user and save key
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    Auth.login = function(user, callback) {
      var cb = callback || angular.noop;
      var deferred = $q.defer();

      $http.post('/api/v1/user/login/', {
        email: user.email,
        password: user.password
      }).
      success(function(data) {

        Auth.setApiKey(data);

        User.one().me().then(function (model) {
          Auth.setCurrentUser(model)
          deferred.resolve(data);
        }, function (err) {
          deferred.reject(err);
        });

        return cb();
      }).
      error(function(err) {
        this.logout();
        deferred.reject(err);
        return cb(err);
      }.bind(this));

      return deferred.promise;
    };

    /**
     * Delete access key and user info
     *
     * @param  {Function}
     */
    Auth.logout = function() {
      $cookieStore.remove('key');
      currentUser = {};
      ngCart.empty();
    };

    Auth._socialSign = function (provider, callback) {
      var callback = callback || angular.noop;

      //$scope.cancel(); // Close modal first for faster feeling

      var connectServer = function (access_token) {
        var user = User.one();

        user.access_token = access_token;
        user.provider = provider;
        console.log(user);
        Auth.loading = true;
        user.social_sign().then(function(model) {

          Auth.setApiKey(model);
          Auth.setCurrentUser(model);


          $rootScope.accessDenied = false;
          $rootScope.pageNotFound = false;


          if (Auth.$scope && Auth.$scope.cancel) {
              Auth.$scope.cancel();
          }

          callback(null, model);
        }, function(err) {
          callback(err, null);
        });
      };
      //this.connectServer = connectServer;

      var providerFunction = {
        /**
        * Facebook
        */
        'facebook': function() {
          Facebook.login(function(response) {
            // Post to facebook api
            connectServer(response.authResponse.accessToken)
          },
          {
            scope: FACEBOOK_EXTENDED_PERMISSIONS
          })
        },

        /**
        * Google Plus
        */
        'google-oauth2': function() {
          GooglePlus.login().then(function(response) {

            connectServer(response.access_token)
          })
        },

        /**
        * Twitter
        */
        'twitter': function () {

          $window.open('/account/login/twitter/', '', "width=530,height=500")
          $window.socialSignCallback = function(access_token) {
            connectServer(access_token)
          };

        },
        /**
        * Instagram
        */
        'instagram': function () {

          $window.open('/account/login/instagram/', '', "width=530,height=500")
          $window.socialSignCallback = function(access_token) {
            connectServer(access_token)
          };

        }

      };


      providerFunction[provider]();

    };

    Auth.socialSign = function(provider, redirectUrl, confirmRequired, confirmWithModal, notReloadPageAfterSign) {

        console.log(confirmRequired);


        // do callback ex redirect to page
        redirectUrl = (Auth.$scope && Auth.$scope.param && Auth.$scope.param.redirectUrl) || redirectUrl || 'profile';
        var cb = function (err, model) {
            Auth.loading = false;
            if (model.is_new && confirmRequired !== false) {
                if (confirmWithModal) {
                    Modal.open('/static/app/odmbase/account/modal/social_confirm_modal.html', null, {next: redirectUrl, successCallback: Auth.successCallback});
                }
                else {

                    if (redirectUrl) {
                        $location.path('/profile/social-confirm').search({next: redirectUrl});
                    }
                    else {
                        $location.path('/profile/social-confirm');
                    }
                }
            }
            else if (notReloadPageAfterSign) {
                Auth.successCallback(model)
            }
            else {
                //$window.location.reload();
                $state.go($state.$current, null, { reload: true });
                Auth.successCallback(model)
            }
        };

        Auth._socialSign(provider, cb);
    };

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    Auth.createUser = function(user, callback) {
      var cb = callback || angular.noop;
      User.post(user).then(function(model) {

        //dpicate code to login
        $http.post('/api/v1/user/login/', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {

          if (data && data.key && data.username) {
            $cookieStore.put('key', data.username + ':' + data.key);
          }

          User.one().me().then(function(user) {
            currentUser = user;
            return cb(null, user);
          }, function (err) {
            return cb(err);
          });

        }).
        error(function(data, status, headers, config) {
          return cb(data);
        });
      },
      function(err) {
        return cb(err);
      });
    };

     /**
     * Change profile
     *
     * @param  {Object}   profile     - user info
     * @param  {Function} callback    - optional
     * @return {Promise}
     */
    Auth.changeProfile = function(profile, callback) {
      var cb = callback || angular.noop;
      var param = $.param(profile);

      return User.changeProfile({ id: currentUser.id }, param, function(user) {
        return cb(user);
      }, function(err) {
        return cb(err);
      }).$promise;
    };
    /**
     * Change password
     *
     * @param  {String}   oldPassword
     * @param  {String}   newPassword
     * @param  {Function} callback    - optional
     * @return {Promise}
     */
    /*
    Auth.changePassword = function(oldPassword, newPassword, callback) {
      var cb = callback || angular.noop;

      return User.changePassword({ id: currentUser.id }, param, function(user) {
        return cb(user);
      }, function(err) {
        return cb(err);
      }).$promise;
    };
    */


    /**
     * Check if a user is logged in
     *
     * @return {Boolean}
     */
    Auth.isLoggedIn = function() {
      return $cookieStore.get('key');
    };

    /**
     * Waits for currentUser to resolve before checking if user is logged in
     */
    Auth.isLoggedInAsync = function(cb) {

      if(currentUser && currentUser.hasOwnProperty('one') && !currentUser.hasOwnProperty('username')) {
        User.one().me().then(function(model) {
          currentUser = model;
          cb(true, model);
        }).catch(function(err) {
          cb(false);
          if (err.status == 403) {
            Auth.logout();
            $location.path('/');
            //$window.location.reload();
            $state.go($state.$current, null, { reload: true });
          }
        });
      }
      else
        if($cookieStore.get('key') && currentUser.hasOwnProperty('username')) {
        cb(true);
      }
      else {
        cb(false);
      }
    };

    /**
     * Check if a user is an admin
     *
     * @return {Boolean}
     */
    Auth.isAdmin = function() {
      return currentUser.is_superuser;
    };

    /**
     * Check if a user is an staff
     *
     * @return {Boolean}
     */
    Auth.isStaff = function() {
      return currentUser.is_staff;
    };

    /**
     * Get auth key
     */
    Auth.getToken = function() {
      return $cookieStore.get('key');
    };

    Auth.getDetail = function (username, cb) {

        if (!username && $cookieStore.get('key')) {
            /*
            var stop = $interval(function() {
                if (currentUser && currentUser.id) {
                    cb(currentUser, true);
                    $interval.cancel(stop);
                    stop = undefined;
                }
            }, 100);
            */
            User.one().me().then(function(model) {
                currentUser = model;
                cb(currentUser, true);
            }, function (err) {
                if (err.status == 403) {
                    Auth.logout();
                    $location.path('/');
                    //$window.location.reload();
                    $state.go($state.$current, null, { reload: true });
                }
            });
        }
        else {
            User.one(username).get().then(function (user) {
                var isMe = Auth.getCurrentUser() && (Auth.getCurrentUser().id == user.id);
                cb(user, isMe);
            });
        }
    }

    return Auth;

  }]);

