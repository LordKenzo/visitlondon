# My Personal Worflow with SASS, NPM, Gulp and Webpack

Web workflow with NPM, SASS, Gulp and Webpack
Run with:

# Instructions

1.  Clone this repo or download it from github;
2.  Make sure you have these dependencies installed globally:
  - [node.js] (http://nodejs.org)
  - [git] (http://git-scm.com)
  - [gulp] (http://gulpjs.com)
  - [webpack] (https://webpack.js.org)
3.  Run `npm i` to install all the project dependencies;
4.  Run `npm start` for developing or `npm run build` for production;
5.  Use gulp command for specifics tasks.

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

## Auto-prefixer e clean

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

## Concatenate different JavaScript files

Install: `npm i -D gulp-concat`.

Creo la task `scripts`.

Attenzione, questa task concatena file JavaScript, per creare un bundle più serio, ho installato **Webpack**:

```
npm i -D @babel/core @babel/preset-env babel-loader gulp-plumber gulp-uglify webpack webpack-stream
```

Gulp-uglify lo uso al posto di gulp-minify per comprimere i file JavaScript.
Gulp-plumber mi permette di gestire eventuali errori, es un task che farò più avanti:

```js
.pipe(
  plumber(err => {
    console.log(err);
    done();
  }),
)
```

## Bundle con Webpack

Per creare un bundle con webpack e babel e fare la minificazione con uglify. In questo modo posso scrivere anche codice ES6 e creare codice JavaScript con dipendenze con require o import.

Ho creato in più il file .babelrc ed il file di webpack.config.js ;)

## Bundle Managers: Browserify - Webpack

Un bludner è un sistema che mi permette di combinare gli assets statici, con lo scopo di ridurre le richieste HTTP e migliorare le performance grazie ad una ottimizzazione delle risorse richieste, come la compressione.
Browserify è un bundle nato per eseguire codice NodeJS nel browser, inoltre combina moduli separti in un unico file. A differenza di Webpack, Browserify non ha caratteristiche da task runner, quindi non è possibile effettuare concatenamenti, eseguire test o effettuare analisi di linting sul codice, ecc..., per questo viene usato sempre in combinazione con Gulp o Grunt. Con Webpack possiamo fare a meno sia di Gulp che di Grunt.
La scelta ad oggi è orientata ad utilizzare Webpack in solitaria come bundler e task runner, anche perchè framework importanti come Angular utilizzano questa scelta.

## Bootstrap e Jquery

Installo: `npm i bootstrap popper.js jquery`.

Con Bootstrap 4 ho avuto qualche problema di conversione per visualizzare correttamente la gallery:

sostiuisci:

```js
$('#gallery').html(showTemplate);
```

con:

```js
$('#gallery').replaceWith(showTemplate);
```

## Image Minification

Installa: `npm install -D gulp-newer gulp-imagemin`.

Gulp-newer processa solo i file nuovi. In questo caso se l'immagine non è stata già processata viene copiata e successivamente la processo con Gulp-imagemin.

## HTML Parziali

Installo: `npm install gulp-preprocess --save-dev`.

Posso togliere il task di copyHTML e fare un unico task html per il preprocessamento dei file parzili, oppure farlo nel task copyHTML.

## Minificazione dei CSS

Uso CSSNano che passo come plugin a Gulp-postcss:

```
npm i -D cssnano gulp-postcss
```

Ad es. sono passato da 189k a 152k.

## Minificazione dell'HTML

Per la minificazione dell'HTML vado ad installare `npm i -D gulp-minhmtl` e nella task vado a prendere come sorgente i file uniti e messi nella dist folder in quanto la task di minificazione viene avviata dopo la task di unificazione dei file parziali. Nella cartella "sorgente" che indico, specifico i file HTML:

```js
 return src(appPath.dist.root + '/**/*.html')
```

## Refactoring

Abbiamo una serie di task:

- Compressione: CSS, HTML, IMAGES e JS
- Bundle (concatenamento di file parziali): CSS, HTML (il bundle vero di JS lo faccio gestire a Webpack), anche se ho una task per il concatenamento di JS in Gulp
- Copia da sorgente a destinazione di ASSETS, CSS, HTML e JS
- Compilazione: SASS a CSS
- Watching
- Serve

La task di build fa:
series(cleanDist, copyAssets, parallel(style, html, js, images), serve, watchWork);
style => generateStyle

Vado ad installare gulp-if: `npm i -D gulp-if`
Vado a definire nel package.json una modalità di avvio che mi setta il NODE_ENV:

```json
"start":"NODE_ENV=development gulp",
"build":"NODE_ENV=production gulp",
```

Aggiungo questo controllo nel gulpfile:

```js
const context = process.env.NODE_ENV === 'production' ? true : false;
```

e vado ad utilizzare gulpif in questa maniera:

```js
.pipe(gulpif(context, rename({ suffix:'.min' }))) // Rinomino in min i file minificati
.pipe(gulpif(context, postcss([cssnano()]))) // Eseguo la compressione CSS
.pipe(gulpif(context, uglify())) // Compressione del JS
```

Nella build per la produzione non avrò bisogno di un live-server con resync come brower-sync, userò un web server chiamato gulp-connect. Altrimenti imposto il `watch: false` di browser-sync magari in questo modo: `watch: !context`.

## Typescript

Installo:
```
npm install --save-dev typescript ts-loader tslint
```

e creo il file di configurazione tsconfig.json con `tsc --init`.

Installo inoltre le declaration types per node e jQuery:

```
npm i @types/node @types/jquery @types/mustache @types/bootstrap -D
```

e imposto il file di configurazione così:

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "es6",
    "allowJs": true,
    "checkJs": true,
    "jsx": "react",
    "sourceMap": true,
    "outDir": "./dist",
    "removeComments": true,
    "strict": true,
    "noImplicitAny": true,
    "moduleResolution": "node",
    "types": ["node"],
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}
```

TSLINT Configuration:
```json
{
  "extends": "tslint:recommended",
  "rulesDirectory": [],
  "rules": {
    "max-line-length": {
        "options": [120]
    },
    "quotemark": [true, "single", "jsx-double"],
    "only-arrow-functions": false,
    "no-empty": false,
    "new-parens": true,
    "no-arg": true,
    "no-bitwise": true,
    "no-conditional-assignment": true,
    "no-consecutive-blank-lines": false,
    "no-console": {
      "severity": "warning",
      "options": ["debug", "info", "log", "time", "timeEnd", "trace"]
    }
  },
  "jsRules": {
    "max-line-length": {
        "options": [120]
    }
  },
  "linterOptions": {
    "exclude": ["**/node_modules/**"]
  }
}
```

### Babelrc

```json
{
  "presets": [
    "@babel/typescript"
  ],
  "plugins": [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ]
}
```

### Testing

#### karma

karma is a test runner for JavaScript. karma support jasmine and mocha.

#### Jasmine

Jasmine is a BDD testing framework. Jasmine’s type is unit testing.

Installo:
```
npm i -D @types/jasmine karma jasmine karma-webpack karma-chrome-launcher karma-jasmine karma-sourcemap-loader karma-coverage karma-jasmine-html-reporter karma-typescript
```

Se ho karma installato globalmente posso anche fare:

```
karma init my.conf.js
```

karma-typescript mi permette di scrivere Unit Test in TypeScript.

### Link utili

https://www.joezimjs.com/javascript/complete-guide-upgrading-gulp-4/
https://github.com/jeromecoupe/jeromecoupe.github.io/blob/master/gulpfile.js
https://github.com/gulpjs/vinyl-fs/issues/292
https://www.toptal.com/front-end/webpack-browserify-gulp-which-is-better
https://www.bootply.com/h6mvwRaiCl
https://medium.com/devux/minifying-your-css-js-html-files-using-gulp-2113d7fcbd16
https://webpack.js.org/guides/typescript/
https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
https://stackoverflow.com/questions/31173738/typescript-getting-error-ts2304-cannot-find-name-require
https://palantir.github.io/tslint/usage/configuration/
https://iamturns.com/typescript-babel/