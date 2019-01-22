const { src, dest, series, parallel, watch } = require('gulp');
/* Transpiler SASS */
const sass = require('gulp-sass');
/* Server */ // docs: https://browsersync.io/docs/gulp
const browserSync = require('browser-sync');
const server = browserSync.create();
/* CSS Autoprefixer */
const autoprefixer = require('gulp-autoprefixer');
/* Clean Folders */
const clean = require('gulp-clean');
/* Concat per JS */
const concat = require('gulp-concat');
/* JS Bundle */
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const webpack = require('webpack');
const webpackconfig = require('./webpack.config.js');
const webpackstream = require('webpack-stream');
/* Utility for merge files */
const merge2 = require('merge2');
/* Image Minification */
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
/* HTML Parziali */
const preprocess = require('gulp-preprocess');
/* CSS Minification */
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
/* HTML Minification */
const htmlmin = require('gulp-htmlmin');
/* Uility for use an if inside Gulp Pipe */
const gulpif = require('gulp-if');
/* A web server for testing in production */
const gulpConnect = require('gulp-connect');

const context = process.env.NODE_ENV === 'production' ? true : false;

const appPath = {
  dist: {
    assets: 'app/dist/assets',
    root: 'app/',
    css: 'app/dist/css',
    js: 'app/dist/js',
    img: 'app/dist/assets/images',
  },
  source: {
    assets: 'src/assets/**/*.json',
    sassSource: 'src/scss/**/*.scss',
    htmlSource: 'src/*.html',
    jsSource: 'src/js/**/*.js',
    imgSource: 'src/assets/images/**',
  },
};
sass.compiler = require('node-sass');

/* Remove files from dist */
function cleanDist(done) {
  return src(appPath.dist.root, { allowEmpty: true, read: false, force: true })
    .pipe(plumber( err => {
      console.log(`Clean Dist Folder error: ${err}`);
      done()
    }))
    .pipe(clean());
}

/* Copy Assets Folder to Dist Assets Folder */
function copyAssets(done) {
  return src(appPath.source.assets)
    .pipe(plumber( err => {
      console.log(`Asset copy error: ${err}`);
      done()
    }))
    .pipe(dest(appPath.dist.assets));
}

/* Styles */
function generateStyle() {
  const bootstrapCSS = src('./node_modules/bootstrap/dist/css/bootstrap.css');

  const sassFiles = src(appPath.source.sassSource)
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      }),
    )
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError)); //alternative: compact-compress-expanded
  return merge2(bootstrapCSS, sassFiles)
    .pipe(concat('app.css'))
    .pipe(gulpif(context, rename({ suffix:'.min' })))
    .pipe(gulpif(context, postcss([cssnano()])))
    .pipe(dest(appPath.dist.css))
    .pipe(browserSync.stream())
}

/* Generate unique JS file with weboack and minify*/
function bundleJS() {
  return (
    src([appPath.source.jsSource])
      .pipe(plumber())
      .pipe(webpackstream(webpackconfig, webpack, function(err, stats) {}))
      .pipe(gulpif(context, uglify()))
      // folder only, filename is specified in webpack config
      .pipe(dest(appPath.dist.js))
      .pipe(server.stream())
  );
}

/* Test Server */
async function serve() {
  console.log('Start Server');
  await server.init({
    server: {
      baseDir: appPath.dist.root,
    },
    watch: !context
  });
}

/* Generate HTML */

function bundleHTML(done) {
  return src(appPath.source.htmlSource)
    .pipe(
      plumber(err => {
        console.log(err);
        done();
      }),
    )
    .pipe(preprocess({ context: { NODE_ENV: process.env.NODE_ENV, DEBUG: true } })) // To set environment variables in-line
    .pipe(dest(appPath.dist.root));
}

function minifyHTML() {
  return src(appPath.dist.root + '/**/*.html')
    .pipe(
      plumber(err => {
        console.log(err);
        done();
      }),
    )
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(dest(appPath.dist.root));
}

/* Remove HTML file from dist */
function cleanHTML() {
  return src(appPath.dist.root + '/**/*.html', { read: false, force: true }).pipe(clean());
}

/* Minify Images */
function generateImages() {
  return src(appPath.source.imgSource)
    .pipe(newer(appPath.dist.img))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true,
            },
          ],
        }),
      ]),
    )
    .pipe(dest(appPath.dist.img));
}

/* Watch for change */
function watchWork(done) {
  watch(appPath.source.sassSource).on('all', generateStyle);
  watch(appPath.source.htmlSource).on('all', series(cleanHTML, bundleHTML));
  watch(appPath.source.jsSource).on('change', bundleJS);
  watch(appPath.dist.root).on('all', server.reload);
  done();
}

/* Tasks */
const generateHTML = series(bundleHTML, minifyHTML);

const build = series(cleanDist, copyAssets, parallel(generateStyle, generateHTML, bundleJS, generateImages), serve);
const dev = series(cleanDist, copyAssets, parallel(generateStyle, bundleHTML, bundleJS, generateImages), serve, watchWork);

exports.build = build;
exports.default = dev;
exports.clean = cleanDist;