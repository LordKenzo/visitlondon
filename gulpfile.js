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
  // Returning a stream
  console.log('compile Sass');
  return src(appPath.source.sassSource)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(dest(appPath.dist.css))
    .pipe(browserSync.stream());
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

/* Watch for change */
function watchWork(done) {
  watch(appPath.source.sassSource, compileSass);
  watch(appPath.dist.root).on('change', server.reload);
  done();
}

/* Tasks */
const build = series(compileSass, serve, watchWork);
// exports.watchWork = watchWork; // make it private
exports.default = build;
