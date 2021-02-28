/*
 * @Date: 2021-02-28
 * @Desc: 
 */
const gulp  = require("gulp");
const sourcemaps  = require("gulp-sourcemaps");
const babel  = require("gulp-babel");
const concat  = require("gulp-concat");
const watch  = require("gulp-watch");

/**
 * 用 Gulp 自带的文件聚集工具 gulp.src 查找所有的 React jsx 文件
 * 1. 开始监视源文件,为调试构建源码映射
 * 2. 使用 ES2015 和 React(JSX) 配置 gulp-babel
 * 3. 单独写入源码映射文件
 * 4. 将所有文件放到 dist/ 目录下
 */
gulp.task('default', () => {
  return gulp
    .src('app/*.jsx')
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/react'],
      })
    )
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  watch('app/**.jsx', () => gulp.start('default'))
})

console.log('ok')