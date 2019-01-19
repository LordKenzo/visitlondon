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

## Gulp function - Gulp Composition - Done function

Ogni task di Gulp è una funzione JavaScript asincrona. Una funzione che accetta un callback `error-first` o ritorna: uno **stream**, una **promise**, un **event emitter**, un **child process** o un **observable**.

Le funzioni che non esporto si considerano funzioni `private` che possono essere comunque usate nella composizione delle `series()`. Una task privata è una task che non può essere eseguita direttamente dall'utente.

Nella precedente versione di Gulp (>=@3), la funzione `task()` aveva il compito di registrare le tasks disponibili. Sebbene l'API è ancora disponibile, è bene utilizzare il sistema di `exports` come meccanismo primario di registrazione tasks.

Gulp fornisce due metodi principali di composizione delle tasks: `series()` e `parallel()`, che permettono alle singole task di far parte di composizioni di operazioni più complesse. Entrambi i metodi accettano un numero n di funzioni task o composizioni. Le funzioni `series()` e `parallel()` possono essere annidate. La `series()` serve per avere un ordine di esecuzione, mentre `parallel()` ci permette il massimo della concorrenza:

```javascript
exports.build = series(
  clean,
  parallel(cssTranspile, series(jsTranspile, jsBundle)),
  parallel(cssMinify, jsMinify),
  publish,
);
```

Ogni task viene eseguita ogni volta in cui viene chiamata, per questo se la task `clean` viene referenziata da due o più differenti tasks, questa verrà eseguita due o più volte, portando a risultati inaspettati.

In Gulp @3, era solito avere nella firma della funzione task una funzione di callback come parametro, convenzionalmente chiamata `done`. L'esecuzione della funzione `done` alla fine della task è un hint a Gulp per dire che la task è completa.
Nella documentazione di Gulp @4, leggiamo che se la nostra task non ritorna nulla, dobbiamo utilizzare ancora un segnale di completamento di tipo `error-first`. La funzione di callback verrà passata alla task come unico argomento:

```javascript
function callbackTask(cb) {
  // `cb()` should be called by some async work
  cb();
}

exports.default = callbackTask;
```

Per indicare che è avvenuto un errore durante l'esecuzione della task, utilizziamo l'approccio `error-first`, in cui l'errore è l'unico argomento della mia callback:

```javascript
function callbackError(cb) {
  // `cb()` should be called by some async work
  cb(new Error('kaboom'));
}

exports.default = callbackError;
```

In Gulp@4 le task sincrone non sono più supportate per evitare errori subdoli difficili da scovare, come scordarsi di tornare uno streams da una task. Per questo la nostra task

# Auto-prefixer e clean

Installo:

```
npm i -D gulp-autoprefixer gulp-clean
```

e configuro, provando questa regola css:

```css
h1:hover {
  transition: color 1s ease;
}
```

e verifico che venga creato un css con la regola `-webkit-transition`.
E' importante mettere l'autoprefixer prima del preprocessore SASS nella task Gulp ed infine la creazione con `dest`.
