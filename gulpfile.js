const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const jeditor = require('gulp-json-editor');
const crx = require('gulp-crx-pack');
const zip = require('gulp-zip');
const del = require('del');
const runSequence = require('run-sequence');

const package = JSON.parse(fs.readFileSync('./package.json'));
const srcFolder = './src';
const buildFolder = './dist/tmp';
const babelConfig = {
    presets: ['env'],
    plugins: ['transform-object-rest-spread'],
}

// Clean old files
gulp.task('build:clean', () => {
    return del(`${buildFolder}/**/*`);
});

// Copy files to build folder
gulp.task('build:copy', () => {
    return gulp.src([
            `${srcFolder}/**/*`,
            `!${srcFolder}/**/*.js`,
            `!${srcFolder}/**/*.css`,
            `!${srcFolder}/view/background.html`,
            `!${srcFolder}/manifest.json`
        ])
        .pipe(gulp.dest(buildFolder));
});

gulp.task('build:copy-edge', () => {
    return gulp.src([`${srcFolder}/view/background.html`])
        .pipe(gulp.dest(`${buildFolder}/view`));
});

// Transform the manifest
gulp.task('build:manifest', () => {
    return gulp.src(`${srcFolder}/manifest.json`)
        .pipe(jeditor({
            'version': package.version,
        }))
        .pipe(gulp.dest(buildFolder));
});

gulp.task('build:manifest-ff', () => {
    return gulp.src(`${srcFolder}/manifest.json`)
        .pipe(jeditor({
            'version': package.version,
            'applications': {
                'gecko': {
                    'id': '{6abb757c-d119-4dca-9d11-1f701f08e008}',
                },
            },
        }))
        .pipe(gulp.dest(buildFolder));
});

gulp.task('build:manifest-edge', () => {
    return gulp.src(`${srcFolder}/manifest.json`)
        .pipe(jeditor({
            'version': package.version,
            'minimum_edge_version': '33.14281.1000.0',
            '-ms-preload': {
                'backgroundScript': 'js/backgroundScriptsAPIBridge.js',
                'contentScript': 'js/contentScriptsAPIBridge.js',
            },
            'background': {
                'scripts': [],
                'page': 'view/background.html',
                'persistent': true
            },
        }))
        .pipe(gulp.dest(buildFolder));
});

// Transform the JS files
gulp.task('build:js', () => {
    return gulp.src([`${srcFolder}/js/background.js`, `${srcFolder}/js/popup.js`])
        .pipe(babel(babelConfig))
        .pipe(uglify())
        .pipe(gulp.dest(`${buildFolder}/js`));
});

gulp.task('build:js-ff', () => {
    return gulp.src([`${srcFolder}/js/background.js`, `${srcFolder}/js/popup.js`])
        .pipe(babel(babelConfig))
        .pipe(gulp.dest(`${buildFolder}/js`));
});

gulp.task('build:js-edge', () => {
    return gulp.src([`${srcFolder}/js/backgroundScriptsAPIBridge.js`, `${srcFolder}/js/contentScriptsAPIBridge.js`])
        .pipe(babel(babelConfig))
        .pipe(uglify())
        .pipe(gulp.dest(`${buildFolder}/js`));
});

// Transform the CSS file
gulp.task('build:css', () => {
    return gulp.src(`${srcFolder}/styles/popup.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`${buildFolder}/styles`));
});

// Zip it for FF
gulp.task('pack:firefox', () => {
    return gulp.src(`${buildFolder}/**/*`)
        .pipe(zip(`coineater-${package.version}.xpi`))
        .pipe(gulp.dest('./dist/firefox'));
});

// Zip it for Chrome
gulp.task('pack:chrome', () => {
    return gulp.src(`${buildFolder}/**/*`)
        .pipe(zip(`coineater-${package.version}.zip`))
        .pipe(gulp.dest('./dist/chrome'));
});

// Make CRX
gulp.task('pack:chromium', () => {
    return gulp.src(`${buildFolder}`)
        .pipe(crx({
            privateKey: fs.readFileSync('./certs/key.pem', 'utf8'),
            filename: `coineater-${package.version}.crx`,
            codebase: 'https://github.com/fhstp/CoinEater',
            updateXmlFilename: 'update.xml'
        }))
        .pipe(gulp.dest('./dist/chromium'));
});

// Target platforms
gulp.task('chrome', (callback) => {
    return runSequence(
        'build:clean',
        'build:copy',
        [
            'build:manifest',
            'build:js',
            'build:css',
        ],
        [
            'pack:chrome',
        ],
        callback,
    );
});

gulp.task('firefox', (callback) => {
    return runSequence(
        'build:clean',
        'build:copy',
        [
            'build:manifest-ff',
            'build:js-ff',
            'build:css',
        ],
        [
            'pack:firefox',
        ],
        callback,
    );
});

gulp.task('chromium', (callback) => {
    return runSequence(
        'build:clean',
        'build:copy',
        [
            'build:manifest',
            'build:js',
            'build:css',
        ],
        [
            'pack:chromium',
        ],
        callback,
    );
});

gulp.task('edge', (callback) => {
    return runSequence(
        'build:clean',
        'build:copy',
        'build:copy-edge',
        [
            'build:manifest-edge',
            'build:js',
            'build:js-edge',
            'build:css',
        ],
        callback,
    );
});

gulp.task('default', () => {
    return runSequence(
        'chrome',
        'firefox',
        'chromium',
        'edge'
    );
});
