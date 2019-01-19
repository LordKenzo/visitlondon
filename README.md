# workflow

Web workflow with NPM, SASS, Gulp and More

## Installation Step

```
npm i -D gulp gulp-sass node-sass browser-sync
```

After your first gulp task, run with:

```
gulp
```

## Old and new way to write a task

The old way:

```javascript
gulp.task('sass', function() {
  return gulp
    .src('src/scss/app.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest('app/css'));
});

gulp.task('default', gulp.series('sass'));
```

The new one:

```javascript
function compileSass() {
  return src('src/scss/app.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(dest('app/css'));
}

exports.compileSass = compileSass;
exports.default = series(compileSass);
```
