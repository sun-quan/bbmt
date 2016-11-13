/**
 * Created by kemvin on 2015/8/10.
 * npm install -g  lodash@3.0.0 gulp gulp-autoprefixer gulp-rename gulp-sass gulp-minify-css gulp-uglify gulp-concat gulp-rev gulp-rev-collector gulp-clean
 * npm link gulp gulp-autoprefixer	gulp-rename gulp-sass gulp-minify-css gulp-uglify gulp-concat gulp-rev gulp-rev-collector gulp-clean
 */
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),//自动添加css前缀
    rename = require('gulp-rename'),//文件重命名
    sass = require('gulp-sass'),//sass的编译
    minifycss = require('gulp-minify-css'),//压缩css
    uglify = require('gulp-uglify'),//压缩js代码
    concat = require('gulp-concat'),//合并js文件
    rev = require('gulp-rev'),//更改版本名
    revCollector = require('gulp-rev-collector'),//rev的插件，用于更改html模版中lib的引用
    clean = require('gulp-clean');//清除文件

var js_pach = ["js/app.js","template/**/*.js","js/jweixin-1.0.0.js"];
var css_pach = ["css/*.css"];
var scss_pach = ["css/*.scss"];

gulp.task('scss', function() {
    return gulp.src(scss_pach)
        .pipe(sass())
        .pipe(gulp.dest('css'));
});

gulp.task('css',["scss"], function() {
    return gulp.src(css_pach)
        .pipe(concat('main.css'))
        .pipe(rename({ suffix: '-min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('css'))
        .pipe(rev())
        .pipe(gulp.dest('css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('css'))
});

gulp.task('js', function() {
    return gulp.src(js_pach)
        .pipe(concat('debug.js'))
        .pipe(gulp.dest('js'))
        .pipe(concat('main.js'))
        .pipe(rename({ suffix: '-min' }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('js'))
});

gulp.task("clean", function() {
    return gulp.src(["js/debug.js","js/main-min-*.js","css/*.css"], {read: false})
        .pipe(clean());
});

gulp.task('rev',['js','css'], function () {
    return gulp.src(['*/*.json', 'index.html'])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(''))
});

gulp.task('default', ["clean"], function() {
    gulp.start('rev');
});

gulp.task('connect', function () {
    connect.server({
        root: '',
        livereload: true,
        port:8000
    });
});

gulp.task('watch', function() {
    // Watch .scss files
    //gulp.watch(scss_pach, ['default']);
    //// Watch .js files
    //gulp.watch(js_pach, ['default']);
});
