var gulp     = require('gulp');
var eslint   = require('gulp-eslint');
var mocha    = require('gulp-mocha-phantomjs');
var header   = require('gulp-header');
var webpack  = require('webpack-stream');
var scsslint = require('gulp-scss-lint');
var sass     = require('gulp-sass');
var pkg      = require('./package.json');

var banner = '/*! <%= pkg.name %> - v<%= pkg.version %> | <%= new Date().getFullYear() %> */\n';

gulp.task('test-script-format', function () {
	return gulp.src(['./src/js/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('compile-test-script', function () {
	return gulp.src(['./test/index.js'])
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('./test/compiled/'));
});

// Disabled for now
gulp.task('test-mocha', ['script-compile-test'], function () {
	return gulp.src(['test/test.html'])
		.pipe(mocha({ reporter: 'spec' }));
});

gulp.task('test-script', ['test-script-format']);

gulp.task('build-script', ['test-script'], function () {
	return gulp.src(['./src/index.js'])
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(header(banner, {
			pkg: pkg,
		}))
		.pipe(gulp.dest('./lib/'));
});

gulp.task('build-style', function () {
	return gulp.src('./src/sass/**/*.scss')
		.pipe(scsslint())
		.pipe(scsslint.failReporter())
		.pipe(sass({
			outputStyle: 'expanded',
		}).on('error', sass.logError))
		.pipe(gulp.dest('./lib'));
});

gulp.task('build-examples', ['build-script', 'build-style'], function () {
	return gulp.src(['./examples/index.js'])
		.pipe(webpack(require('./webpack.test.config.js')))
		.pipe(gulp.dest('./examples/compiled/'));
});

gulp.task('watch', function () {
	gulp.watch(['./src/js/**/*.js'], ['build-script']);
	gulp.watch(['./src/sass/**/*.scss'], ['build-style']);
});

gulp.task('default', ['build-script', 'build-style']);
