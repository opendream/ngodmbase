'use strict';

angular.module('odmbase')
  .factory('Auth', ['$location', '$rootScope', '$http', 'User', '$cookieStore', '$q', 'Facebook', '$interval', function Auth($location, $rootScope, $http, User, $cookieStore, $q, Facebook, $interval) {
    var Auth = {};
    var currentUser = null;
    if($cookieStore.get('key')) {
      currentUser = User;
      User.one().me().then(function(model) {
        currentUser = model;
      });

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
    };

    Auth.socialSign = function (provider, callback) {
      var callback = callback || angular.noop;

      //$scope.cancel(); // Close modal first for faster feeling

      var providerFunction = {
        /**
        * Facebook
        */
        facebook: function() {
          Facebook.login(function(response) {
            var accessToken = response.authResponse.accessToken;
            // Post to facebook api
            var user = User.one();
                          console.log(user);

            user.access_token = accessToken;
            user.provider = provider;


            user.social_sign().then(function(model) {

              Auth.setApiKey(model);
              Auth.setCurrentUser(model)

              callback(null, model);
            }, function(err) {
              callback(err, null);
            });
          },
          {
            scope: FACEBOOK_EXTENDED_PERMISSIONS
          })
        }
      }
      providerFunction[provider]();

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
    Auth.changePassword = function(oldPassword, newPassword, callback) {
      var cb = callback || angular.noop;

      return User.changePassword({ id: currentUser.id }, param, function(user) {
        return cb(user);
      }, function(err) {
        return cb(err);
      }).$promise;
    };


    /**
     * Check if a user is logged in
     *
     * @return {Boolean}
     */
    Auth.isLoggedIn = function() {
      return $cookieStore.get('key') && currentUser.hasOwnProperty('username');
    };

    /**
     * Waits for currentUser to resolve before checking if user is logged in
     */
    Auth.isLoggedInAsync = function(cb) {

      if(currentUser && currentUser.hasOwnProperty('one') && !currentUser.hasOwnProperty('username')) {
        User.one().me().then(function(model) {
          currentUser = model;
          cb(true);
        }).catch(function() {
          cb(false);
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

            var stop = $interval(function() {
                if (currentUser && currentUser.id) {
                    cb(currentUser, true);
                    $interval.cancel(stop);
                    stop = undefined;
                }
            }, 100);

        }
        else {
            User.one(username).get().then(function (user) {
                cb(user, Auth.getCurrentUser().id == user.id);
            });
        }
    }

    return Auth;

  }]);
