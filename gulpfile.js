require('babel-core/register');

var gulp = require('gulp'),
	babel=require('gulp-babel'),
	watch = require('gulp-watch'),
	karma = require('karma').Server,
	gls = require('gulp-live-server'),
	gZip = require('gulp-gzip'),
	gLess = require('gulp-less'),
	gHtmlmin = require('gulp-htmlmin'),
	gRename = require('gulp-rename'),
	gCssmin = require('gulp-cssmin'),
	gDocumentation = require('gulp-ngdocs');


var path = require('path');

gulp.task('liveServer', function(){
	var server = gls.new('scripts/server.js');
	server.start();
});

/*to conver es6 to es5*/
gulp.task('babel', function(){
	return gulp.src(['scripts/src/*.js'])
				.pipe(babel())
				.pipe(gulp.dest('scripts/dest'));
});

/*for Karma task runner*/
gulp.task('karma', function(done){
	new karma({
	    configFile: __dirname + '/karma.conf.js'
	  }, done).start();
});

/*conversion of less to css*/
gulp.task('less', function(){
	return gulp.src('styles/base.less')
	    .pipe(gLess({
	      paths: [ 'styles/*.less']
	    }))
	    .pipe(gCssmin())
	    .pipe(gRename({suffix: '.min'}))
	    .pipe(gulp.dest('styles'));
});

/*to minify html page*/
gulp.task('html', function(){
	return gulp.src('view/*.html')
    .pipe(gHtmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('view/min'))
});

/*to watch the changes in the source codes and convert to es5 immediately*/
gulp.task('watch', function(){
	return gulp.watch('scripts/src/*.js', ['babel']);
});

/*to convert files into gzip format. if server has gzip format enabled, this will reduce the file size issue*/
gulp.task('compress', function() {
    gulp.src('scripts/dest/*.js')
    .pipe(gZip())
    .pipe(gulp.dest('scripts/dest'));
});


/*to generate the documentation*/
gulp.task('documentation', function(){
	var options = {
	    scripts: ['scripts/src/*.js'],
	    html5Mode: true,
	    startPage: '/api',
	    title: "Weather Predictopn "
	};
	return gulp.src('scripts/src/app.js')
    .pipe(gDocumentation.process(options))
    .pipe(gulp.dest('docs'));
});


gulp.task('default', ['babel','watch','karma','liveServer', 'less','compress', 'html']);
