'use strict';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('css', function () {
    return gulp
        .src('./public/css/*.css')
        .pipe(autoprefixer('last 2 versions'))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./public/'))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(cssmin())
        .pipe(gulp.dest('./public/'));
});

gulp.task('vendor.min.js', function () {
    return gulp
        .src(['./public/bower_components/d3/d3.min.js'])
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('./public/'));
});

gulp.task('vendor.js', ['vendor.min.js'], function () {
    return gulp
        .src(['./public/bower_components/d3/d3.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./public/'));
});

gulp.task('app.js', function () {
    return gulp
        .src('./public/js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./public/'))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(uglify())
        .pipe(gulp.dest('./public/'));
});

gulp.task('js', ['vendor.js', 'app.js']);

gulp.task('watch', function () {
    gulp.watch('./public/bower_components/**/*', ['vendor.js']);
    gulp.watch('./public/css/*.js', ['css']);
    gulp.watch('./public/js/*.js', ['app.js']);
});

gulp.task('default', ['css', 'js'], function () {
  // place code for your default task here
});
