const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
// docs: https://browsersync.io/docs/gulp
const browserSync = require('browser-sync');
const server = browserSync.create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

const appPath = {
  dist: {
    root: 'app/',
    css: 'app/dist/css',
    js: 'app/dist/js',
  },
  source: {
    sassSource: 'src/scss/**/*.scss',
    htmlSource: 'src/**/*.html',
    jsSource: 'src/js/*.js',
  },
};

sass.compiler = require('node-sass');

/* Styles */
function compileSass() {
  // Returning a stream
  console.log('compile Sass');
  return src(appPath.source.sassSource)
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      }),
    )
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError)) //compact-compress-expanded
    .pipe(dest(appPath.dist.css))
    .pipe(browserSync.stream());
}

/* JavaScript files */
function scripts() {
  return src(appPath.source.jsSource).pipe(dest(appPath.dist.js));
}

/* Remove Scripts file from dist */
function cleanScripts() {
  return src(appPath.dist.root + '/**/*.js', { read: false, force: true }).pipe(clean());
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

/* Watch for change */
function watchWork(done) {
  watch(appPath.source.sassSource, compileSass);
  watch(appPath.source.htmlSource).on('all', series(cleanHTML, copyHTML));
  watch(appPath.source.jsSource).on('all', series(cleanScripts, scripts));
  watch(appPath.dist.root).on('change', server.reload);
  done();
}

/* Tasks */
const html = series(cleanHTML, copyHTML);
const style = series(compileSass);
const js = series(cleanScripts);
const build = series(html, style, js, serve, watchWork);
// exports.watchWork = watchWork; // make it private
exports.default = build;
