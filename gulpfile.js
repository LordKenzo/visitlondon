const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
// docs: https://browsersync.io/docs/gulp
const browserSync = require('browser-sync');
const server = browserSync.create();

const appPath = {
  dist: {
    root: 'app/',
    css: 'app/dist/css',
    js: 'app/dist/js',
  },
  source: {
    sassSource: 'src/scss/**/*.scss',
  },
};

sass.compiler = require('node-sass');

/* Styles */
function compileSass() {
  console.log('compile Sass');
  return src(appPath.source.sassSource)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(dest(appPath.dist.css))
    .pipe(browserSync.stream());
}

/* Server */
function serve(done) {
  console.log('Start Server but before need Sass');
  server.init({
    server: {
      baseDir: appPath.dist.root,
    },
  });
  done();
}

/* Watch for change */
function watchWork() {
  watch(appPath.source.sassSource, compileSass);
  watch(appPath.dist.root).on('change', server.reload);
}

/* Tasks */
const dev = series(compileSass, serve, watchWork);
exports.watchWork = watchWork;
exports.default = dev;
