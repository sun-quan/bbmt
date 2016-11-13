
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),//sass的编译
    autoprefixer = require('gulp-autoprefixer'),//自动添加css前缀
    rename = require('gulp-rename'),//文件重命名
    minifycss = require('gulp-minify-css'),//压缩css
    notify = require('gulp-notify'),//显示报错
    uglify = require('gulp-uglify'),//压缩js代码
    concat = require('gulp-concat'),//合并js文件
    rev = require('gulp-rev'),//更改版本名
    revCollector = require('gulp-rev-collector'),//rev的插件，用于更改html模版中lib的引用
    del = require('del');//清除文件
    var ngHtml2Js = require("gulp-ng-html2js");

var js_pach=['static/index.js','static/js/config.js','static/js/run.js','static/templatejs/*.js','static/js/*/*.js'];
gulp.task('js', function() {
    return gulp.src(js_pach)
     .on('error', function(err) {
        notify.log('Less Error!', err.message);
        this.end();
      })
        .pipe(concat('debug.js'))
        .pipe(gulp.dest('static'))
        .pipe(concat('main.js'))
        .pipe(rename({ suffix: '.min' }))
         .pipe(uglify())
         .pipe(rev())
         .pipe(gulp.dest('static'))
         .pipe(rev.manifest())
         .pipe(gulp.dest('static'))
});


gulp.task('clean', function(cb) {
    del(['static/templatejs/*.js','static/js/debug.js'], cb)
});
// gulp.task('css', function() {
//    return gulp.src([ 'template/*.css', 'template/**/*.css']).pipe(concat('yp.css')).pipe(rename({
//        suffix: '.min'
//    })).pipe(minifycss()).pipe(rev()).pipe(gulp.dest('css')).pipe(rev.manifest()).pipe(gulp.dest('css'))
// });
gulp.task('watch', function() {
  gulp.watch(js_pach, ['html2js','js'])
});
gulp.task('html2js',function() {
 gulp.src(["template/**/*.html","template/*.html","template/**/*/*.html"])
    .pipe(ngHtml2Js({
        moduleName: "template",
        prefix: "template/"
    }))
    .pipe(gulp.dest("static/templatejs/"));
});
gulp.task('rev',['html2js','js'], function () {
    return gulp.src(['*/*.json', 'index.html'])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(''))
});

gulp.task('default', function() {
    gulp.start('rev','watch');
});

// gulp.task('watch', function() {
//     gulp.watch(['js/index.js', 'template/*.js', 'template/**/*.js','js/directive.js', 'js/server.js'], ['clean','js','html2js']);
// });
