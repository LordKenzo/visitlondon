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
    html: 'src/**/*.html',
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
  return src(appPath.source.html).pipe(dest(appPath.dist.root));
}

/* Remove HTML file from dist */
function cleanHTML() {
  return src(appPath.dist.root + '/**/*.html', { read: false, force: true }).pipe(clean());
}

/* Watch for change */
function watchWork(done) {
  watch(appPath.source.sassSource, compileSass);
  watch(appPath.source.html).on('all', series(cleanHTML, copyHTML));
  watch(appPath.dist.root).on('change', server.reload);
  done();
}

/* Tasks */
const html = series(cleanHTML, copyHTML);
const style = series(compileSass);
const build = series(html, style, serve, watchWork);
// exports.watchWork = watchWork; // make it private
exports.default = build;
