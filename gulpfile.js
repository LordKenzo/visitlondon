const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
// docs: https://browsersync.io/docs/gulp
const browserSync = require('browser-sync');
const server = browserSync.create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
/* JS Bundle
npm i -D @babel/core @babel/preset-env babel-loader gulp-plumber gulp-uglify webpack webpack-stream

*/
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const webpack = require('webpack');
const webpackconfig = require('./webpack.config.js');
const webpackstream = require('webpack-stream');
/* JS Bundle */
const merge = require('merge-stream');

const appPath = {
  dist: {
    assets: 'app/dist/assets',
    root: 'app/',
    css: 'app/dist/css',
    js: 'app/dist/js',
  },
  source: {
    assets: 'src/assets/**/*',
    sassSource: 'src/scss/**/*.scss',
    htmlSource: 'src/**/*.html',
    jsSource: 'src/js/**/*.js',
  },
};
sass.compiler = require('node-sass');

/* Styles */
function compileSass() {
  const bootstrapCSS = src('./node_modules/bootstrap/dist/css/bootstrap.css');

  const sassFiles = src(appPath.source.sassSource)
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      }),
    )
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError));
  return merge(sassFiles, bootstrapCSS)
    //compact-compress-expanded
    .pipe(concat('app.css'))
    .pipe(dest(appPath.dist.css))
    .pipe(browserSync.stream());
}

/* Concat JavaScript files */
function scripts() {
  return src(appPath.source.jsSource)
    .pipe(concat('main.bundle.js'))
    .pipe(dest(appPath.dist.js));
}

function bundleJS() {
  return (
    src([appPath.source.jsSource])
      .pipe(plumber())
      .pipe(webpackstream(webpackconfig, webpack, function(err, stats) {}))
      .pipe(uglify())
      // folder only, filename is specified in webpack config
      .pipe(dest(appPath.dist.js))
      .pipe(server.stream())
  );
}

/* Remove Scripts file from dist */
function cleanDist() {
  return src(appPath.dist.root, { allowEmpty: true, read: false, force: true }).pipe(clean());
}

/* Server */
async function serve(/*done*/) {
  console.log('Start Server');
  await server.init({
    server: {
      baseDir: appPath.dist.root,
    },
  });
  // done();
}

/* Copy Source files */
function copyHTML() {
  return src(appPath.source.htmlSource).pipe(dest(appPath.dist.root));
}

/* Remove HTML file from dist */
function cleanHTML() {
  return src(appPath.dist.root + '/**/*.html', { read: false, force: true }).pipe(clean());
}

function copyAssets() {
  return src(appPath.source.assets)
    .pipe(dest(appPath.dist.assets));
}

/* Watch for change */
function watchWork(done) {
  watch(appPath.source.sassSource).on('all', compileSass);
  watch(appPath.source.htmlSource).on('all', series(cleanHTML, copyHTML));
  watch(appPath.source.jsSource).on('change', bundleJS);
  watch(appPath.dist.root).on('change', server.reload);
  done();
}

/* Tasks */
const html = series(copyHTML);
const style = series(compileSass);
const js = series(bundleJS);
const build = series(cleanDist, parallel(style, html, js, copyAssets), serve, watchWork);
// exports.watchWork = watchWork; // make it private
exports.default = build;
exports.concat = series(cleanDist, watchWork, parallel(style, html, scripts, copyAssets), serve);
