var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    connect = require('gulp-connect'),
    compass = require('gulp-compass'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    yuidoc = require("gulp-yuidoc"),

    paths = {
        src: './src/*.js',
        scss: './scss/husky.scss'
    };

gulp.task('lint', function() {
    gulp.src(paths.src)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('compass', function() {
    gulp.src(paths.scss)
        .pipe(compass({
            css: './css',
            sass: './scss'
        }))
        .pipe(minifyCSS())
        .pipe(rename('husky.min.css'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('doc', function() {
    gulp.src(paths.src)
        .pipe(yuidoc())
        .pipe(gulp.dest('./doc'));
});

gulp.task('connect', function() {
    connect.server();
});

gulp.task('default', ['connect']);

gulp.task('build', ['lint']);

