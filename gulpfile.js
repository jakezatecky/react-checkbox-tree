var gulp     = require('gulp');
var eslint   = require('gulp-eslint');
var mocha    = require('gulp-mocha-phantomjs');
var rename   = require('gulp-rename');
var uglify   = require('gulp-uglify');
var header   = require('gulp-header');
var webpack  = require('webpack-stream');
var scsslint = require('gulp-scss-lint');
var sass     = require('gulp-sass');
var pkg      = require('./package.json');

var banner = '/*! <%= pkg.name %> - v<%= pkg.version %> | <%= new Date().getFullYear() %> */\n';

gulp.task('test-format', function () {
	return gulp.src(['./src/js/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('compile-test', function () {
	return gulp.src(['./test/index.js'])
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('./test/compiled/'));
});

gulp.task('test-mocha', ['compile-test'], function () {
	return gulp.src(['test/test.html'])
		.pipe(mocha({reporter: 'spec'}));
});

gulp.task('test', ['test-format', 'compile-test']);

gulp.task('compile-build', function () {
	return gulp.src(['./src/index.js'])
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('./compiled/'));
});

gulp.task('build', ['test', 'compile-build'], function () {
	return gulp.src(['./compiled/d3-funnel.js'])
		.pipe(gulp.dest('./dist/'))
		.pipe(rename({
			extname: '.min.js',
		}))
		.pipe(uglify())
		.pipe(header(banner, {
			pkg: pkg,
		}))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('style-build', function () {
	return gulp.src('./src/sass/**/*.scss')
		.pipe(scsslint())
		.pipe(scsslint.failReporter())
		.pipe(sass({
			outputStyle: 'expanded',
		}).on('error', sass.logError))
		.pipe(gulp.dest('./compiled'));
});

gulp.task('watch', function () {
	gulp.watch(['./src/js/**/*.js'], ['build']);
	gulp.watch(['./src/sass/**/*.scss'], ['style-build']);
});

gulp.task('default', ['build', 'style-build']);
