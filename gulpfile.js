require('babel-core/register');
var gulp = require('gulp'),
	babel=require('gulp-babel'),
	watch = require('gulp-watch'),
	karma = require('karma').Server,
	gls = require('gulp-live-server');

gulp.task('liveServer', function(){
	var server = gls.new('scripts/server.js');
	server.start();
});

gulp.task('babel', function(){
	return gulp.src(['scripts/src/*.js'])
				.pipe(babel())
				.pipe(gulp.dest('scripts/dest'));
});


gulp.task('karma', function(done){
	new karma({
	    configFile: __dirname + '/karma.conf.js'
	  }, done).start();
});




gulp.task('watch', function(){
	return gulp.watch('scripts/src/*.js', ['babel']);
});

gulp.task('default', ['babel','watch','karma','liveServer']);
