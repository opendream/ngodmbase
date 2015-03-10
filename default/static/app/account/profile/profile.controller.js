'use strict';

angular
    .module('odmbase')
    .controller('ProfileCtrl', ['ProfileForm', ProfileCtrl]);


function ProfileCtrl (ProfileForm) {

    ProfileForm.extraFields = [
        //'address', 'description', 'phone',
        //'bank_number', 'bank_name', 'bank_user_name', 'bank_branch'
    ];
}