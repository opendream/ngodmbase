'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var templateCache = require('gulp-angular-templatecache');

var sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename');

gulp.task('styles', function() {
  /*return gulp.src('static/app/app.scss')
    .pipe(sass({sourcemap: true, sourcemapPath: '.'}))
    .on('error', function (err) { console.log(err.message); })
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('static/app'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('static/app'));
  */
  return sass('static/app/app.scss', { style: 'expanded', loadPath: ['.'], compass: false, sourcemap: true })
        //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('static/app/'));
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('odmbase/templates/base.html')
    .pipe(wiredep({
      ignorePath: '../../static/',
      fileTypes: {
        html: {
          replace: {
            js: '<script src="/static/{{filePath}}"></script>',
            css: '<link rel="stylesheet" href="/static/{{filePath}}" />'
          }
        }
      }
      }))
    .pipe(gulp.dest('odmbase/templates'));
});


gulp.task('watch', function() {
  gulp.watch('static/app/**/*.scss', ['styles']);
  gulp.watch('static/components/**/*.scss', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('jshint', function () {
  return gulp.src(['static/app/**/*.js', '!static/app/odmbase/default{,/**}'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('template', [], function () {

    var templateRootDir = __dirname,
        templateOptions = {
        root: '/',
        base: function (file) {
            return file.path.replace(templateRootDir, '').replace(/\\/g, '/');
        },
        module: 'odmbase'
    };

    return gulp.src(['static/app/**/*.html', 'static/components/**/*.html', '!static/app/odmbase/default{,/**}'])
        .pipe(templateCache(templateOptions))
        .pipe(gulp.dest('dist/static'));
});

gulp.task('html', ['template'], function () {
  var assets = $.useref.assets({searchPath: '.'});

  return gulp.src(['odmbase/templates/base.html'])
    .pipe($.preprocess())
    .pipe(assets)
    .pipe($.if('*.js', $.ngAnnotate()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});



gulp.task('build', ['html'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['wiredep', 'styles', 'watch'], function() {

});

