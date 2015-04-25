'use strict';

var gulp = require('gulp');
var del = require('del');


var path = require('path');


// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    jshint = require('gulp-jshint'),
    cache = require('gulp-cached'),
    babel = require('gulp-babel'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify'),
    stripDebug = require('gulp-strip-debug'),
    
    sourceFile = './app/scripts/app.js',
    
    destFolder = './dist/scripts',
    destFileName = 'app.js';

var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Styles
gulp.task('styles', function () {
    return gulp.src(['app/styles/main.scss', 'app/styles/**/*.css'])
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            loadPath: ['app/bower_components']}))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});

function compile(watch) {
    var bundler = watchify(
        browserify(
            sourceFile,
            {
                debug: true
            }
        ).transform(babelify));
 
    function rebundle() {
        bundler.bundle()
          .on('error', function(err) { console.error(err); this.emit('end'); })
          .pipe(source(destFileName))
          .pipe(buffer())
          //.pipe(uglify())
          //.pipe(stripDebug())
          //.pipe(sourcemaps.init({ loadMaps: true }))
          //.pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(destFolder));
    }
 
    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }
 
    rebundle();
}

gulp.task('compile', function() {
    return compile();
});

gulp.task('update', function() {
    return compile(true);
});

// Scripts
gulp.task('scripts', function () {
    var bundler = watchify(browserify({
        entries: [sourceFile],
        insertGlobals: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }).transform(babelify));

    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
            // log errors if they happen
            .on('error', $.util.log.bind($.util, 'Browserify Error'))
            .pipe(source(destFileName))
            .pipe(gulp.dest(destFolder));
    }

    return rebundle();
});

gulp.task('jshint', function() {
  var stream = gulp.src('./app/scripts/**/*.js')
    .pipe(cache('jshint'))
    .pipe(babel())
    .on('error', function(err) {
      console.error('JSX ERROR in ' + err.fileName);
      console.error(err.message);
      this.end();
    })
    .pipe(jshint())
    .pipe(jshint.reporter('default', {verbose: true}))
    .pipe(jshint.reporter('fail'));
  
  return stream;
});

// HTML
gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

// Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

// Clean
gulp.task('clean', function (cb) {
    cb(del.sync(['dist/styles', 'dist/scripts', 'dist/images']));
});

// Bundle
gulp.task('bundle', ['styles', 'compile', 'bower'], function(){
    return gulp.src('./app/*.html')
               .pipe($.useref.assets())
               .pipe($.useref.restore())
               .pipe($.useref())
               .pipe(gulp.dest('dist'));
});

gulp.task('buildBundle', ['styles', 'compile', 'bower'], function(){
    return gulp.src('./app/*.html')
               .pipe($.useref.assets())
               .pipe($.useref.restore())
               .pipe($.useref())
               .pipe(gulp.dest('dist'));
});

// Bower helper
gulp.task('bower', function() {
    gulp.src('app/bower_components/**/*.*', {base: 'app/bower_components'})
        .pipe(gulp.dest('dist/bower_components/'));

});

gulp.task('json', function() {
    gulp.src('app/scripts/json/**/*.json', {base: 'app/scripts'})
        .pipe(gulp.dest('dist/scripts/'));
});

// Robots.txt and favicon.ico
gulp.task('extras', function () {
    return gulp.src(['app/*.txt', 'app/*.ico', 'app/*.png'])
        .pipe(gulp.dest('dist/'))
        .pipe($.size());
});

// Watch
gulp.task('watch', ['html', 'bundle', 'json'], function () {
    browserSync({
        notify: true,
        logPrefix: 'BS',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['dist', 'app']
    });

    gulp.watch('app/scripts/**/*.js', ['jshint', 'scripts', reload]);

    // Watch .json files
    gulp.watch('app/scripts/**/*.json', ['json']);

    // Watch .html files
    gulp.watch('app/*.html', ['html']);

    gulp.watch(['app/styles/**/*.scss', 'app/styles/**/*.css'], ['styles', reload]);

    // Watch image files
    gulp.watch('app/images/**/*', reload);
});

// Build
gulp.task('build', ['html', 'buildBundle', 'images', 'extras'], function() {
    
});

// Default task
gulp.task('default', ['watch']);
