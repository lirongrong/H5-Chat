var gulp = require('gulp'); 
var sass = require('gulp-sass'); 

gulp.task('sass', function () {
    return gulp.src('./wwwroot/sass/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./wwwroot/css'));
});
   
gulp.task('sass:watch', function () {
    gulp.watch('./wwwroot/sass/*.scss', ['sass']);
});