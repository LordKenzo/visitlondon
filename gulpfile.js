const { src, dest, series } = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

function compileSass() {
  return src('src/scss/app.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(dest('app/css'));
}

exports.compileSass = compileSass;
exports.default = series(compileSass);
