var gulp            = require("gulp"),
    sass            = require("gulp-sass"),
    autoprefixer    = require("gulp-autoprefixer")
    hash            = require("gulp-hash"),
    concat          = require('gulp-concat'),
    del             = require("del"),
    uglifyjs        = require('gulp-uglifyjs'),
    notify          = require('gulp-notify'),
    nunjucksRender  = require('gulp-nunjucks-render'),
    browserSync     = require('browser-sync').create();

var config = {
    nodeDir: './node_modules/',
    srcDir: './src/',
    distDir: './dist/'
};

// Images
gulp.task("images", function () {
    return gulp.src("src/images/**/*")
        .pipe(gulp.dest(config.distDir + "/images"))
})

// Compile SCSS files to CSS
gulp.task("scss", function () {
    // del(["static/css/**/*"])
    gulp.src("src/scss/**/*.scss")
        .pipe(sass({outputStyle : "compressed"}))
        .pipe(autoprefixer({browsers : ["last 20 versions"]}))
        .pipe(concat('app.css'))
        .pipe(gulp.dest(config.distDir + "/css"))
        .pipe(browserSync.stream());
});

// JavaScript
gulp.task("js", function () {
    return gulp.src(
        [
            config.nodeDir + "/jquery/dist/jquery.min.js",
            config.nodeDir + "/tether/dist/js/tether.min.js",
            config.nodeDir + "/bootstrap/dist/js/bootstrap.min.js",
            // config.srcDir + "/js/plugins/jquery.medium.js",
            config.srcDir + "/js/**/*.js"
        ])
        .pipe(uglifyjs('app.js', {
            compress: true,
            outSourceMap: true
        }))
        .pipe(gulp.dest(config.distDir + '/js'))
});

// Nunjucks
gulp.task('nunjucks', function() {
    
    // Gets .html and .nunjucks files in pages
    return gulp.src(config.srcDir + '/pages/*.+(html|nunjucks)')
    
    // Renders template with nunjucks
    .pipe(nunjucksRender({
        path: [config.srcDir + '/templates']
    }))

    // output files in app folder
    .pipe(gulp.dest(config.distDir))
});

// Watch asset folder for changes
gulp.task("watch", ["scss", "images", "js", "nunjucks"], function () {
    browserSync.init({
        open: 'internal',
        host: 'localhost',
        proxy: 'http://localhost/dist/',
        port: 3000
    });
    gulp.watch(config.srcDir + "/scss/**/*", ["scss"]).on('change', browserSync.reload);
    gulp.watch(config.srcDir + "/images/**/*", ["images"]);
    gulp.watch(config.srcDir + "/js/**/*", ["js"]).on('change', browserSync.reload);
    gulp.watch(config.srcDir + "/**/*.nunjucks", ["nunjucks"]).on('change', browserSync.reload);
});

// Set watch as default task
gulp.task("default", ["scss", "images", "js", "nunjucks"]);