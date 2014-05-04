var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    connect = require('gulp-connect'),
    compass = require('gulp-compass'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    yuidoc = require('gulp-yuidoc'),
    karma = require('karma'),

    path = {
        src: './src/**/*.js',
        scss: './scss/husky.scss'
    };

gulp.task('lint', function() {
    gulp.src(path.src)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('compass', function() {
    gulp.src(path.scss)
        .pipe(compass({
            css: './css',
            sass: './scss'
        }))
        .pipe(minifyCSS())
        .pipe(rename('husky.min.css'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('doc', function() {
    gulp.src(path.src)
        .pipe(yuidoc())
        .pipe(gulp.dest('./doc'));
});

//a helper function to report karma's exit status
function karmaExit(exitCode) {
    gutil.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
}

gulp.task('test', function() {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, karmaExit);
});

gulp.task('tdd', function() {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js'
    }, karmaExit);
});

gulp.task('connect', function() {
    connect.server();
});

gulp.task('default', ['connect']);

gulp.task('build', ['lint']);
