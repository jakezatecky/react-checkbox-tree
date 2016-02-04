var gulp     = require('gulp');
var eslint   = require('gulp-eslint');
var mocha    = require('gulp-mocha-phantomjs');
var header   = require('gulp-header');
var webpack  = require('webpack-stream');
var scsslint = require('gulp-scss-lint');
var sass     = require('gulp-sass');
var pkg      = require('./package.json');

var banner = '/*! <%= pkg.name %> - v<%= pkg.version %> | <%= new Date().getFullYear() %> */\n';

gulp.task('script-test-format', function () {
	return gulp.src(['./src/js/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('script-compile-test', function () {
	return gulp.src(['./test/index.js'])
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('./test/compiled/'));
});

// Disabled for now
gulp.task('script-test-mocha', ['script-compile-test'], function () {
	return gulp.src(['test/test.html'])
		.pipe(mocha({ reporter: 'spec' }));
});

gulp.task('script-test', ['script-test-format', 'script-compile-test']);

gulp.task('script-build', ['script-test'], function () {
	return gulp.src(['./src/index.js'])
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(header(banner, {
			pkg: pkg,
		}))
		.pipe(gulp.dest('./lib/'));
});

gulp.task('style-build', function () {
	return gulp.src('./src/sass/**/*.scss')
		.pipe(scsslint())
		.pipe(scsslint.failReporter())
		.pipe(sass({
			outputStyle: 'expanded',
		}).on('error', sass.logError))
		.pipe(gulp.dest('./lib'));
});

gulp.task('watch', function () {
	gulp.watch(['./src/js/**/*.js'], ['script-build']);
	gulp.watch(['./src/sass/**/*.scss'], ['style-build']);
});

gulp.task('default', ['script-build', 'style-build']);
