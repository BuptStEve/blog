const gulp = require('gulp');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const minifycss = require('gulp-clean-css');
const htmlclean = require('gulp-htmlclean');

const filePath = {
  dest: './public',
  imgsDest: './public/imgs',

  html: './public/**/*.html',
  css: './public/**/*.css',
  js: './public/**/*.js',
  imgs: './public/imgs/**/*.*',
};

// 压缩 public 目录内 html
gulp.task('minify-html', () => {
  return gulp.src(filePath.html)
    .pipe(htmlclean())
    .pipe(htmlmin({
      removeComments: true, //清除 HTML 注释
      collapseWhitespace: true, //压缩 HTML
      collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true, //删除 <script> 的 type="text/javascript"
      removeStyleLinkTypeAttributes: true, //删除 <style> 和 <link> 的 type="text/css"
      minifyJS: true, //压缩页面 JS
      minifyCSS: true //压缩页面 CSS
    }))
    .pipe(gulp.dest(filePath.dest))
});

// 压缩 public 目录内 css
gulp.task('minify-css', () => {
  return gulp.src(filePath.css)
    .pipe(minifycss({
      advanced: true, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
      compatibility: '*', //保留 ie9 及以下兼容写法
      keepBreaks: true, //类型：Boolean 默认：false [是否保留换行]
      keepSpecialComments: '*' //保留所有特殊前缀
    }))
    .pipe(gulp.dest(filePath.dest));
});

// 压缩 public/js 目录内 js
gulp.task('minify-js', () => {
  return gulp.src(filePath.js)
    .pipe(uglify())
    .pipe(gulp.dest(filePath.dest));
});

// 压缩 public/uploads 目录内图片
gulp.task('minify-images', () => {
  const jpgmin = imagemin.jpegtran({
    accurate: true, //高精度模式
    quality: "high", //图像质量:low, medium, high and veryhigh;
    method: "smallfry", //网格优化:mpe, ssim, ms-ssim and smallfry;
    min: 70, //最低质量
    loops: 0, //循环尝试次数, 默认为6;
    progressive: false, //基线优化
    subsample: "default", //子采样:default, disable;
  });

  const pngmin = imagemin.optipng({
    optimizationLevel: 4
  });

  return gulp.src(filePath.imgs)
    .pipe(imagemin({
      use: [jpgmin, pngmin]
    }))
    .pipe(gulp.dest(filePath.imgsDest));
});

// 执行 gulp 命令时执行的任务
gulp.task('default', [
  'minify-html',
  'minify-css',
  'minify-js',
  'minify-images',
]);
