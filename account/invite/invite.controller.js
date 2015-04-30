'use strict';

angular
    .module('odmbase')
    .controller('InviteCtrl', ['$scope', 'User', 'Auth', 'Credit', InviteCtrl])
    .controller('InviteConfirmCtrl', ['$scope', '$stateParams', '$location', '$timeout', '$window', '$controller', 'Auth', 'Credit', 'Modal', 'User', InviteConfirmCtrl]);

function InviteCtrl ($scope, User, Auth, Credit) {
    Auth.getDetail(null, function (user) {

        $scope.user = user;
        var initModel = {email: '', display:'', isValid: null};

        $scope.user.quota_invite = 6; // TODO: receive from user model
        $scope.inviteList = [];

        $scope.inviteModel = {
            message: 'ฉันอยากจะแบ่งปันเรื่องดีๆให้กับคุณ จากเว็บไซต์ปันใจ'
        };

        var quotaInvite = $scope.user.quota_invite;
        $scope.numValid = 0;


        // initial rows
        for (var i=0; i < Math.min(quotaInvite-1, 3); i++) {
            $scope.inviteList.push(_.clone(initModel));
        }

        function validateEmail(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }

        function updateRemain () {
            $scope.remain =  quotaInvite - $scope.numValid;
        }
        updateRemain();

        $scope.addMoreInvite = function ($last, $index) {

            $scope.inviteList[$index].inFocus = true;
            console.log(quotaInvite, $scope.inviteList);
            if ($last && $scope.inviteList.length < quotaInvite) {
                $scope.inviteList.push(_.clone(initModel));
            }
        };

        $scope.deleteInvite = function ($index) {

            var models = $scope.inviteList.splice($index, 1);
            if (models[0].isValid) {
                $scope.numValid--;
            }

            if (($scope.inviteList.length == quotaInvite-1 && $scope.numValid == quotaInvite-1) ||
                ($scope.inviteList[$scope.inviteList.length-1].isValid && $scope.numValid < quotaInvite)) {
                $scope.addMoreInvite(true);
            }

            updateRemain();

        };

        $scope.checkValid = function (model, $index) {

            $scope.inviteList[$index].inFocus = false;

            if (validateEmail(model.email)) {
                if (!model.isValid) {
                    $scope.numValid++;
                }
                model.isValid = true;
            }
            else if (model.email) {
                model.isValid = false;
            }

            updateRemain();

        };

        $scope.sendInvite = function (form) {
            $scope.submitted = true;

            var numInviteList = $scope.inviteList.length;
            var numCompleteInviteList = 0;

            var updateInviteList = function ()  {

                var newInviteList = [];

                if (numCompleteInviteList == numInviteList) {
                    angular.forEach($scope.inviteList, function(invite, ignore) {
                        if (!invite.isInvited) {
                            newInviteList.push(invite);
                        }
                    });
                    $scope.inviteList = newInviteList;
                    swal({
                        title: 'ชวนเพื่อนเรียบร้อยแล้ว',
                        text: 'เพื่อนของคุณจะได้รับข้อความเชิญชวน พร้อมทั้งโคดเพื่อนำไปใช้เพิ่มสิทธิ์ให้กับการปันของ',
                        confirmButtonText: 'คลิกเพื่อชวนเพื่อนต่อ'
                    });

                }
            }


            angular.forEach($scope.inviteList, function(invite, ignore) {
                if (invite.isValid) {
                    var credit = Credit.one();
                    credit.email = invite.email;
                    credit.message = $scope.inviteModel.message;
                    invite.credit = credit;

                    invite.credit.save().then(function (model) {
                        invite.isInvited = true;
                        numCompleteInviteList++;
                        quotaInvite--;
                        $scope.numValid--;
                        updateInviteList();
                    });

                }
                else {
                    numCompleteInviteList++;
                    updateInviteList();

                }
            });
        };


    });


};


function InviteConfirmCtrl ($scope, $stateParams, $location, $timeout, $window, $controller, Auth, Credit, Modal, User) {

    var checkCode = function (params) {
        params = params || {};

        var credit = Credit.one($stateParams.code);

        credit.get(params).then(function (model) {

            if (model.is_used) {
                swal({
                    title: "โคดนี้เคยถูกใช้งานไปแล้ว",
                    confirmButtonText: 'คลิกเพื่อกลับไปยังหน้าแรก',
                    allowEscapeKey: false,
                    type: 'error'

                }, function (isConfirm) {
                    if (isConfirm) {
                        $timeout(function () {
                            $location.path('/');
                        }, 1);
                    }

                });
            }
            else if (!Auth.isLoggedIn()) {

                User.one().get({email: model.email}).then(function (resp) {
                    var templateUrl = '/static/app/odmbase/account/modal/signup_modal.html';
                    if (resp.objects.length) {
                        templateUrl = '/static/app/odmbase/account/modal/login_modal.html';
                    }

                    Modal.open(templateUrl, null, {
                        email: model.email,
                        redirectUrl: $location.path(),
                        successCallback: function () {
                            checkCode({force_used: true});
                        }
                    });
                });


            }
            else {
                swal({
                    title: "คุณได้รับสิทธิ์ในการโพสต์ของเพิ่ม " + model.unit + " ชิ้น",
                    confirmButtonText: 'คลิกเพื่อทำการโพสต์ของ',
                    allowEscapeKey: false,
                    type: 'success'
                }, function (isConfirm) {
                    if (isConfirm) {
                        $timeout(function () {
                            $location.path('/product/add');
                        }, 1);
                    }

                });
            }

        }, function (resp) {
            if (resp.status == 404) {

                swal({
                    title: 'โคดไม่ถูกต้อง',
                    confirmButtonText: 'คลิกเพื่อกลับไปยังหน้าแรก'
                }, function (isConfirm) {
                    if (isConfirm) {
                        $timeout(function () {
                            $location.path('/');
                        }, 1);
                    }

                });
            }

        });

    } ;

    if (Auth.isLoggedIn()) {
        Auth.getDetail(null, function (user) {
            // TODO: check is code.dst not equal logged in user
            checkCode({force_used: true});
        });
    }
    else {
        checkCode();
    }
}
