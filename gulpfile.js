const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const header = require('gulp-header');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const scsslint = require('gulp-scss-lint');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const pkg = require('./package.json');
const browserSync = require('browser-sync').create();
const webpackConfig = require('./webpack.config');
const testWebpackConfig = require('./webpack.test.config');

const banner = '/*! <%= pkg.name %> - v<%= pkg.version %> | <%= new Date().getFullYear() %> */\n';

gulp.task('test-script-format', () => (
	gulp.src(['./src/js/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError())
));

gulp.task('test-mocha', ['test-script-format'], () => (
	gulp.src(['./test/**/*.js'])
		.pipe(mocha({
			compilers: [
				'js:babel-core/register',
			],
			require: [
				'./test/setup.js',
			],
		}))
));

gulp.task('test', ['test-script-format', 'test-mocha']);

gulp.task('build-script', ['test'], () => (
	gulp.src(['./src/index.js'])
		.pipe(webpackStream(webpackConfig, webpack))
		.pipe(header(banner, { pkg }))
		.pipe(gulp.dest('./lib/'))
));

gulp.task('build-style', () => (
	gulp.src('./src/sass/**/*.scss')
		.pipe(scsslint())
		.pipe(scsslint.failReporter())
		.pipe(sass({
			outputStyle: 'expanded',
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
		}))
		.pipe(gulp.dest('./lib'))
));

gulp.task('build', ['build-script', 'build-style']);

gulp.task('build-examples-style', () => (
	gulp.src('./examples/src/**/*.scss')
		.pipe(scsslint())
		.pipe(scsslint.failReporter())
		.pipe(sass({
			outputStyle: 'expanded',
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
		}))
		.pipe(gulp.dest('./examples/dist'))
		.pipe(browserSync.stream())
));

gulp.task('build-examples-script', () => (
	gulp.src(['./examples/src/index.js'])
		.pipe(webpackStream(testWebpackConfig, webpack))
		.pipe(gulp.dest('./examples/dist/'))
		.pipe(browserSync.stream())
));

gulp.task('build-examples-html', () => (
	gulp.src('./examples/src/index.html')
		.pipe(gulp.dest('./examples/dist/'))
		.pipe(browserSync.stream())
));

gulp.task('examples', ['build-examples-style', 'build-examples-script', 'build-examples-html'], () => {
	browserSync.init({ server: './examples/dist' });

	gulp.watch(['./src/js/**/*.js', './examples/src/**/*.js'], ['build-examples-script']);
	gulp.watch(['./src/sass/**/*.scss', './examples/src/**/*.scss'], ['build-examples-style']);
	gulp.watch(['./examples/src/**/*.html'], ['build-examples-html']).on('change', browserSync.reload);
});

gulp.task('default', ['build']);
