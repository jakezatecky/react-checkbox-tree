const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha-phantomjs');
const header = require('gulp-header');
const webpack = require('webpack-stream');
const scsslint = require('gulp-scss-lint');
const sass = require('gulp-sass');
const pkg = require('./package.json');

const webpackConfig = require('./webpack.config');
const testWebpackConfig = require('./webpack.test.config');

const banner = '/*! <%= pkg.name %> - v<%= pkg.version %> | <%= new Date().getFullYear() %> */\n';

gulp.task('test-script-format', () =>
	gulp.src(['./src/js/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError())
);

gulp.task('compile-test-script', () =>
	gulp.src(['./test/index.js'])
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest('./test/compiled/'))
);

// Disabled for now
gulp.task('test-mocha', ['script-compile-test'], () =>
	gulp.src(['test/test.html'])
		.pipe(mocha({ reporter: 'spec' }))
);

gulp.task('test-script', ['test-script-format']);

gulp.task('build-script', ['test-script'], () =>
	gulp.src(['./src/index.js'])
		.pipe(webpack(webpackConfig))
		.pipe(header(banner, { pkg }))
		.pipe(gulp.dest('./lib/'))
);

gulp.task('build-style', () =>
	gulp.src('./src/sass/**/*.scss')
		.pipe(scsslint())
		.pipe(scsslint.failReporter())
		.pipe(sass({
			outputStyle: 'expanded',
		}).on('error', sass.logError))
		.pipe(gulp.dest('./lib'))
);

gulp.task('build-examples-style', () =>
	gulp.src('./examples/src/**/*.scss')
		.pipe(scsslint())
		.pipe(scsslint.failReporter())
		.pipe(sass({
			outputStyle: 'expanded',
		}).on('error', sass.logError))
		.pipe(gulp.dest('./examples/dist'))
);

gulp.task('build-examples-script', () =>
	gulp.src(['./examples/src/index.js'])
		.pipe(webpack(testWebpackConfig))
		.pipe(gulp.dest('./examples/dist/'))
);

gulp.task('build-examples', ['build-examples-style', 'build-examples-script'], () =>
	gulp.src('./examples/src/index.html')
		.pipe(gulp.dest('./examples/dist/'))
);

gulp.task('watch', () => {
	gulp.watch(['./src/js/**/*.js'], ['build-script']);
	gulp.watch(['./src/sass/**/*.scss'], ['build-style']);
});

gulp.task('default', ['build-script', 'build-style']);
