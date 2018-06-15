/**
 * Created by Umanda Jayobandara on 15/01/2017.
 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Require dependencies (defined in www/packages.json)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Setup paths and file lists
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var paths = {

    in: {
        sass: [
            './sass/login-page-styles.scss',
        ],
        sass_ie: [
            './sass-ie/login-page-styles.scss',

        ],

        css: [

            // Libraries, Frameworks, Plugins
            'resources/vendor/bootstrap/dist/js/bootstrap.min.css',
        ],
        js_vendor: [
            'resources/vendor/jquery/dist/jquery.min.js',
            'resources/vendor/bootstrap/dist/js/bootstrap.min.js',
        ],
        js: [

            // Libraries, Frameworks, Plugins


        ]


    },
    out: {
        css: '../assets/css',
        css_ie: '../assets/css-ie',
        css_building: '../assets/css',
        css_building_ie: '../assets/css-ie',
        js: '../assets/js',
        js_building: '../assets/js',
    }
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Aggregated tasks
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


// Default task
gulp.task('default', ['css', 'js']);


// Build to Development Servers
gulp.task('dev', function (callback) {
    runSequence(
        'sass',
        'sass-ie',
        'concat_css',
        'concat_css_ie',
        'concat_vendor_js',
        'concat_js',
        callback
    );
});


// Build to Production Servers
gulp.task('prod', function (callback) {
    runSequence(
        'sass',
        'sass-ie',
        'concat_css',
        'minify_css',
        'concat_css_ie',
        'minify_css_ie',
        'concat_js',
        'minify_js',
        'minify_vendor_js',
        callback
    );
});

// Build Only CSS
gulp.task('css', function (callback) {
    runSequence(
        'sass',
        'concat_css',
        'minify_css',
        callback
    );
});

// Build Only Js
gulp.task('js_vendor', function (callback) {
    runSequence(
        'concat_vendor_js',
        'minify_vendor_js',
        'copy-angular-view',
        callback
    );
});

gulp.task('js', function (callback) {
    runSequence(
        'concat_js',
        'minify_js',
        'copy-angular-view',
        callback
    );
});



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * SASS compilation task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('sass', function () {
    return gulp.src(paths.in.sass)
        .pipe(sass({outputStyle: 'compact', errLogToConsole: true}))
        .pipe(gulp.dest(paths.out.css_building));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * SASS IE compilation task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('sass-ie', function () {
    return gulp.src(paths.in.sass_ie)
        .pipe(sass({outputStyle: 'compact', errLogToConsole: true}))
        .pipe(gulp.dest(paths.out.css_building_ie));
});



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * CSS concatenation task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('concat_css', function () {
    return gulp.src(paths.in.css)
        .pipe(concat('application.css'))
        .pipe(gulp.dest(paths.out.css));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * CSS concatenation task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('concat_css_ie', function () {
    return gulp.src(paths.in.css)
        .pipe(concat('application.css'))
        .pipe(gulp.dest(paths.out.css_ie));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * CSS minification task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('minify_css', function () {

    var _minifyCSS = minifyCSS({});
    _minifyCSS.on('error', function (e) {
        gutil.log(e);
        _minifyCSS.end();
    });

    return gulp.src(paths.out.css + '/application.css')
        .pipe(_minifyCSS)
        .pipe(rename(function (path) {
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest(paths.out.css));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * CSS minification task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('minify_css_ie', function () {

    var _minifyCSS = minifyCSS({});
    _minifyCSS.on('error', function (e) {
        gutil.log(e);
        _minifyCSS.end();
    });

    return gulp.src(paths.out.css_ie + '/application.css')
        .pipe(_minifyCSS)
        .pipe(rename(function (path) {
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest(paths.out.css_ie));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JS concatenation task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('concat_vendor_js', function () {
    return gulp.src(paths.in.js_vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.out.js));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Vendor JS concatenation task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('concat_js', function () {
    return gulp.src(paths.in.js)
        .pipe(concat('application.js'))
        .pipe(gulp.dest(paths.out.js));
});


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JS minification task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('minify_vendor_js', function () {

    var _uglify = uglify({mangle: false});
    _uglify.on('error', function (e) {
        gutil.log(e);
        _uglify.end();
    });

    return gulp.src([paths.out.js + '/vendor.js'])
        .pipe(_uglify)
        .pipe(rename(function (path) {
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest(paths.out.js));
});


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JS minification task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('minify_js', function () {

    var _uglify = uglify({mangle: false});
    _uglify.on('error', function (e) {
        gutil.log(e);
        _uglify.end();
    });

    return gulp.src([paths.out.js + '/application.js'])
        .pipe(_uglify)
        .pipe(rename(function (path) {
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest(paths.out.js));
});
