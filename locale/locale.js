angular.module('odmbase').config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('en', {
        GLOBAL: {
            EMAIL: 'Email',
            PASSWORD: 'Password',
            DISPLAY_NAME: 'Display name',
            OR: 'or',
            SAVE: 'Save',
            FOR: 'For',
            INSTEAD: 'instead',
            MAYBE_TRY: 'May be try',
            SUBMIT: 'Submit',
            EDIT: 'Edit',
            DELETE: 'Delete',
            CANCEL: 'Cancel',
            SWAL_SAVED_TITLE: 'Data has been saved'
        },
        ERROR: {
            REQUIRED: 'Required field',
            IS_REQUIRED: 'is required.',
            IMAGE_SIZE: 'Automatically resize large images',
        },
        FORM: {
            SELECT: 'Select ',
            QUOTE: {
                QUOTE_PLACEHOLDER: 'Write quote',
                SOURCE_PLACEHOLDER: 'Quote\'s source'
            },
            IMAGE: {
                LABEL: 'Image',
                MAIN: 'Main image',
                ADD: 'Add image'
            },
            MEDIA: {
                ADD_IMAGE: 'Add Image',
                ADD_VDO: 'Add VDO',
                ADD_QUOTE: 'Add Quote'
            }
        }

    });
    $translateProvider.translations('th', {
        GLOBAL: {
            EMAIL: 'อีเมล',
            PASSWORD: 'รหัสผ่าน',
            DISPLAY_NAME: 'ชื่อที่ใช้แสดง',
            OR: 'หรือ',
            SAVE: 'บันทึก',
            FOR: 'สำหรับ',
            INSTEAD: 'แทน',
            MAYBE_TRY: 'อาจลอง',
            SUBMIT: 'ตกลง',
            EDIT: 'แก้ไข',
            DELETE: 'ลบ',
            CANCEL: 'ยกเลิก',
            SWAL_SAVED_TITLE: 'บันทึกข้อมูลแล้ว'
        },
        ERROR: {
            REQUIRED: 'จำเป็นต้องกรอก',
            IS_REQUIRED: 'จำเป็นต้องกรอก',
            IMAGE_SIZE: 'ระบบจะย่อรูปที่มีขาดใหญ่เกินให้อัตโนมัติ',
        },
        FORM: {
            SELECT: 'เลือก',
            QUOTE: {
                QUOTE_PLACEHOLDER: 'เขียนคำคม',
                SOURCE_PLACEHOLDER: 'ชื่อเจ้าของคำคม'
            },
            IMAGE: {
                LABEL: 'รูปภาพ',
                MAIN: 'รูปหลัก',
                ADD: 'เพิ่มภาพ',
            },
            MEDIA: {
                ADD_IMAGE: 'เพิ่มรูปภาพ',
                ADD_VDO: 'เพิ่มวีดีโอ',
                ADD_QUOTE: 'เพิ่มคำคม'
            }
        }

    });


    $translateProvider.translations('en', {
        ACCOUNT: {
            ERROR: {
                EMAIL_REQUIRED: 'Please enter email.',
                EMAIL_FORMAT: 'Email address invalid.',
                EMAIL_DOSE_NOT_REGISTERED: 'Your email address is not registered.',
                EMAIL_PASSWORD_REQUIRED: 'Please enter email and password',
                EMAIL_PASSWORD_INVALID: 'Invalid email or password . Please try again.',
                EMAIL_EXIST: 'This email is already in use.',
                PASSWORD_SHORT: 'Please enter password longer than 6 letter.',
                DISPLAY_NAME_REQUIRED: 'Please enter display name.',
                CURRENT_PASSWORD_REQUIRED: 'Please enter current password.',
                CONFIRM_PASSWORD_INVALID: 'Invalid confirm password.',
                CONFIRM_PASSWORD_VALID: 'Valid confirm password.',
            },
            FOLLOW: {
                FOLLOW: 'Follow',
                UNFOLLOW: 'Unfollow'
            },
            FORGOT_PASSWORD: {
                TITLE: 'Please enter your registered email.',
                SUCCESS: 'A message has been sent to your email address containing a link to reset your password.',
                SUBMIT_BUTTON: 'Reset password',
            },
            SIGN: {
                CONNECT_WITH_SOCIAL: 'Connect with social network',
                CONNECT_WITH: 'Connect with',
                LOGIN_QUESTION: 'Already have account?',
                FORGOT_PASSWORD_QUESTION: 'Forgot password?',
                LOGIN_LINK: 'Log in',
                SIGNUP_LINK: 'Sign up'
            },
            LOGIN: {
                OR_LOGIN_EMAIL: 'Or log in with email',
                SUBMIT_BUTTON: 'Log in'
            },
            REGISTER: 'Register',
            SIGNUP: {
                OR_SIGNUP_EMAIL: 'Or sign up with email',
                SUBMIT_BUTTON: 'Sign up'
            },
            PROFILE: {
                TITLE: 'Edit Profile',
                SELECT_FOR_UPLOAD: 'Select file for upload',
                OR_DRAG_FOR_CHANGE: 'or <br />drag and drop image here<br />for change image',
                FIRST_NAME: 'First name',
                LAST_NAME: 'Last name',
                OR_CLICK_FOR_DELETE: 'or click for delete image',
                SWAL_SAVED_CONFIRM_BUTTON_TEXT: 'Click for go to your profile page'
            },
            SETTINGS: {
                TITLE: 'Change password',
                OLD_PASSWORD: 'Current password',
                NEW_PASSWORD: 'New password',
                CONFIRM_NEW_PASSWORD: 'Confirm new password',
            },
            SOCIAL_CONFIRM: {
                TITLE: 'Please fill more your information and verify.',
                SELECT_FOR_UPLOAD: 'Select file <br/>for upload',
                CONFIRM_PASSWORD: 'Confirm password'
            },
            MODAL_TITLE: {
                FORGOT_PASSWORD: 'Forgot password',
                LOGIN: 'Log in',
                SIGNUP: 'Sign up',
                SOCIAL_CONFIRM: 'Create new account'
            }
        }
    });
    $translateProvider.translations('th', {
        ACCOUNT: {
            ERROR: {
                EMAIL_REQUIRED: 'กรุณากรอกอีเมล',
                EMAIL_FORMAT: 'รูปแบบอีเมลไม่ถูกต้อง',
                EMAIL_DOSE_NOT_REGISTERED: 'อีเมลที่คุณกรอก ยังไม่มีอยู๋ในระบบ',
                EMAIL_PASSWORD_REQUIRED: 'กรุณากรอกอีเมลและรหัสผ่าน',
                EMAIL_PASSWORD_INVALID: 'คุณกรอกอีเมลหรือรหัสไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
                EMAIL_EXIST: 'อีเมลนี้มีผู้ใช้งานแล้ว',
                PASSWORD_SHORT: 'กรุณาระบุรหัสผ่านอย่างน้อย 6 ตัวอักษร',
                DISPLAY_NAME_REQUIRED: 'ชื่อที่ใช้แสดง จำเป็นต้องกรอก',
                CURRENT_PASSWORD_REQUIRED: 'รหัสผ่านปัจจุบัน จำเป็นต้องกรอก',
                CONFIRM_PASSWORD_INVALID: 'การยืนยันรหัสผ่านไม่ถูกต้อง',
                CONFIRM_PASSWORD_VALID: 'การยืนยันรหัสผ่านถูกต้อง',
            },
            FOLLOW: {
                FOLLOW: 'ติดตาม',
                UNFOLLOW: 'ยกเลิกการติดตาม'
            },
            FORGOT_PASSWORD: {
                TITLE: 'ใส่อีเมลที่ใช้สมัครสมาชิกของคุณ เพื่อขอรหัสผ่านใหม่',
                SUCCESS: 'ลิงก์ตั้งค่ารหัสผ่านใหม่ ได้ถูกส่งไปยังอีเมลของคุณแล้ว',
                SUBMIT_BUTTON: 'ขอรหัสผ่านใหม่',
            },
            SIGN: {
                CONNECT_WITH_SOCIAL: 'เชื่อมต่อผ่าน social network',
                CONNECT_WITH: 'เชื่อมต่อกับ',
                LOGIN_QUESTION: 'มีบัญชีผู้ใช้แล้ว?',
                FORGOT_PASSWORD_QUESTION: 'ลืมรหัสผ่าน?',
                LOGIN_LINK: 'เข้าสู่ระบบ',
                SIGNUP_LINK: 'สร้างบัญชีผู้ใช้ใหม่'
            },
            LOGIN: {
                OR_LOGIN_EMAIL: 'หรือเข้าสู่ระบบผ่านอีเมล',
                SUBMIT_BUTTON: 'เข้าสู่ระบบ'
            },
            REGISTER: 'สมัครสมาชิก',
            SIGNUP: {
                OR_SIGNUP_EMAIL: 'หรือสมัครผ่านอีเมล',
                SUBMIT_BUTTON: 'สมัคร'
            },
            PROFILE: {
                TITLE: 'แก้ไขข้อมูลส่วนตัว',
                SELECT_FOR_UPLOAD: 'กดเลือกไฟล์เพื่ออัพโหลด',
                OR_DRAG_FOR_CHANGE: 'หรือ <br />ลากไฟล์รูปมาวางที่นี่ <br />เพื่อเปลี่ยนรูป',
                FIRST_NAME: 'ชื่อ',
                LAST_NAME: 'นามสกุล',
                OR_CLICK_FOR_DELETE: 'หรือ กดเพื่อลบรูป',
                SWAL_SAVED_CONFIRM_BUTTON_TEXT: 'คลิกเพื่อไปดูหน้าโปรไฟล์ของคุณ',
            },
            SETTINGS: {
                TITLE: 'เปลี่ยนรหัสผ่าน',
                OLD_PASSWORD: 'รหัสผ่านปัจจุบัน',
                NEW_PASSWORD: 'รหัสผ่านใหม่',
                CONFIRM_NEW_PASSWORD: 'ยืนยันรหัสผ่านใหม่',
            },
            SOCIAL_CONFIRM: {
                TITLE: 'กรุณากรอกข้อมูลเพิ่ม และยืนยันข้อมูลของคุณ',
                SELECT_FOR_UPLOAD: 'กดเลือกไฟล์ <br/>เพื่ออัพโหลด',
                CONFIRM_PASSWORD: 'ยืนยันรหัสผ่าน'
            },
            MODAL_TITLE: {
                FORGOT_PASSWORD: 'ขอรหัสผ่านใหม่',
                LOGIN: 'เข้าสู่ระบบ',
                SIGNUP: 'สมัครสมาชิก',
                SOCIAL_CONFIRM: 'สร้างบัญชีผู้ใช้ใหม่'
            }
        }
    });


    // --------------- ACTION ---------------
    $translateProvider.translations('en', {
        LIKE: {
            LIKE_PEOPLE: 'People Who Like This',
            SEE_MORE: 'See More'
        },
        COMMENT: {
            COMMENT: 'Comment',
            SEND: 'Send',
            PLEASE: 'Please',
            BEFORE_COMMENT: 'before comment',
            SEE_MORE_COMMENT_PREVIOUS: 'See more { remain, plural, 1{1 comment} other{# comments}}'
        }

    });

    $translateProvider.translations('th', {
        LIKE: {
            LIKE_PEOPLE: 'คนชอบ',
            SEE_MORE: 'ดูต่อ'
        },
        COMMENT: {
            COMMENT: 'ความคิดเห็น',
            SEND: 'ส่ง',
            PLEASE: 'กรุณา',
            BEFORE_COMMENT: 'ก่อนเพื่อแสดงความคิดเห็น',
            SEE_MORE_COMMENT_PREVIOUS: 'ดูอีก { remain } ความคิดเห็นก่อนหน้า'

        }

    });

    $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
    $translateProvider.preferredLanguage('th');

    $translateProvider.useLocalStorage();
}]);
