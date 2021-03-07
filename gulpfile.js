/** eslint config / hints **/
/* global  */
"use strict";

/*
 * Necessary plugins
 */
const gulp = require('gulp');
// const { task, parallel, src, dest } = gulp;
const sass = require('gulp-sass');
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const electron = require('gulp-electron');
const winInstaller = require('electron-windows-installer');
const info = require('./app/package.json');
const { exception } = require('console');
const rimraf = require('rimraf')

/*
 * Paths configuration
 */
const paths = {
    "frontend-js":      '    app/js/front-end/',
    "backend-js":           'app/back-end/',
    "sass":                 'app/src/scss/editor/',
    "css":                  'app/dist/css/',
    "base":                 'app/',
    "dist":                 'app/dist/',
    "dist-vendor":          'app/dist/vendor/',
    "src-helpers-vendor":   'app/src/helpers/vendor/'
};

/*
 * remove app/dist/vendor
 */
gulp.task('remove-vendor-dist-dir', function removeVendorDistDir (cb) {
    rimraf(paths['dist-vendor'].replace(/\/+$/,''), cb);
});

/*
 * create app/dist/vendor
 */
gulp.task('prepare-vendor-dist-dir', function prepareVendorDistDir () { 
    return fs.promises.mkdir(paths['dist-vendor'].replace(/\/+$/,''), { recursive: true });
});


/*
 * copy-vendor-tinymce
 */
gulp.task('copy-vendor-tinymce', function copyVendorTinymce() {
    return gulp.src([paths['src-helpers-vendor'] + 'tinymce/**/*'])
        .pipe(gulp.dest(paths['dist-vendor'] + 'tinymce'))
});

/*
 * copy-vendor-tinymce
 */
gulp.task('copy-vendor-jquery', function copyVendorJquery () {
    return gulp.src([paths['src-helpers-vendor'] + 'jquery/**/*'])
        .pipe(gulp.dest(paths['dist-vendor'] + 'jquery'))
});

/*
 * copy-vendor-files
 */
gulp.task('copy-vendor-files', ['copy-vendor-tinymce', 'copy-vendor-jquery']);



/*
 * Parse SASS into CSS
 */
 gulp.task('prepare-editor-css', function() {
    gulp.src(paths.sass + 'editor.scss')
        .pipe(sass())
        .pipe(gulp.dest(paths['css']));

    gulp.src(paths.sass + 'editor-options.scss')
        .pipe(sass())
        .pipe(gulp.dest(paths['css']));
});

/*
 * Build
 */
gulp.task('build', function() {
    let buildData = JSON.parse(fs.readFileSync('app/back-end/builddata.json'));
    buildData.build += 1;
    buildData = JSON.stringify(buildData);
    fs.writeFileSync('app/back-end/builddata.json', buildData);

    exec('"./node_modules/.bin/electron" app/', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
});
