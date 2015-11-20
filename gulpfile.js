var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');
var sass = require('gulp-sass');
var mainBowerFiles = require('main-bower-files');
var sourceMaps = require('gulp-sourcemaps');

var paths = {
	target: './build',
	html: './src/**/*.html',
	js: './src/**/*.js',
	scss: './src/**/*.scss',
	bowerJs: mainBowerFiles('./**/*.js'),
	bowerSass: mainBowerFiles(['./**/*.scss', './**/*.css'])
};

var allJs = paths.bowerJs.concat(paths.js);
var allSass = paths.bowerSass.concat(paths.scss);


gulp.task('clean', function () {
	return del.sync([paths.target + '/**'], {force: true});
});

gulp.task('html', function () {
	var s = gulp.src(paths.html);
	s = s.pipe(gulp.dest(paths.target));
	return s;
});

gulp.task('scss', function () {
	var s = gulp.src(allSass);
	s = s.pipe(sass());
	s = s.pipe(minify());
	s = s.pipe(concat('style.css'));
	s = s.pipe(gulp.dest(paths.target));
	return s;
});

gulp.task('js', function () {
	var s = gulp.src(allJs);
	s = s.pipe(sourceMaps.init());
	s = s.pipe(uglify());
	s = s.pipe(concat('app.js'));
	s = s.pipe(sourceMaps.write('maps/'));
	s = s.pipe(gulp.dest(paths.target));
	return s;
});

gulp.task('watch', function() {
	gulp.watch(paths.html, ['html']).on('change', browserSync.reload);
	gulp.watch(paths.scss, ['scss']).on('change', browserSync.reload);
	gulp.watch(paths.js, ['js']).on('change', browserSync.reload);
});

gulp.task('default', ['clean', 'html', 'scss', 'js', 'watch'], function () {
	browserSync.init([], {
		server: {
			baseDir: paths.target
		}
	});
});