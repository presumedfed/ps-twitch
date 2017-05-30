const gulp = require('gulp');
const sass = require('gulp-sass');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');

const target = (process.env.NODE_ENV === 'production') ? 'dist': 'build';

gulp.task('build', ['fonts', 'webpack', 'html', 'sass'], function(){
})

gulp.task('deploy', ['fonts', 'webpack', 'html', 'sass'], function(){
})

gulp.task('fonts', function() {
  return gulp.src('node_modules/font-awesome/fonts/**/*')
  .pipe(gulp.dest(target + '/fonts'))
})

gulp.task('html', function() {
  return gulp.src('src/views/**/*.html')
  .pipe(gulp.dest(target))
})

gulp.task('sass', function() {
  return gulp.src('src/assets/scss/**/*.scss') 
    .pipe(sass({
		includePaths: [
			'node_modules/font-awesome/scss'
		]}))
    .pipe(gulp.dest(target))
})

gulp.task('webpack', function() {
  return gulp.src('src/assets/js/**/*.js') 
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(target))
})

gulp.task('watch', ['fonts', 'webpack', 'html', 'sass'], function(){
  gulp.watch('src/assets/scss/**/*.scss', ['sass']); 
  gulp.watch('src/assets/js/**/*.js', ['webpack']); 
  gulp.watch('src/views/**/*.html', ['html']); 
})
