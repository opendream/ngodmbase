'use strict';

angular.module('odmbase')
  .factory('Device', [ function Device() {
    var Device = {};
    // check device isMobile or touch for preload 
    var isMobile = {
        Android: function() {
            return /Android/g.test(navigator.userAgent);
        },
        BlackBerry: function() {
            return /BlackBerry/g.test(navigator.userAgent);
        },
        iOS: function() {
            return /iPhone|iPad|iPod/g.test(navigator.userAgent);
        },
        WindowsMoblie: function() {
            return /IEMobile/g.test(navigator.userAgent);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.WindowsMoblie());
        }
    };

    Device.isMobile = isMobile.any();
    Device.isTouchDevice = 'ontouchstart' in document.documentElement;

    Device.isMobileOrTouchDevice = Device.isMobile || Device.isTouchDevice;
    
    return Device;

  }]);

