import gulp from "gulp";
import concat from "gulp-concat";
import autoPrefixer from "gulp-autoprefixer";
import CleanCSS from "clean-css";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import GulpUglify from "gulp-uglify";
import {deleteSync} from "del";
import browserSync from "browser-sync";
import imagemin from "gulp-imagemin";
import qcmq from "gulp-group-css-media-queries";
import sourcemap from "gulp-sourcemaps";
import babel from "gulp-babel";

const sass = gulpSass(dartSass);

async function styles() {
    return gulp.src("./src/scss/styles.scss")
       .pipe(sass().on("error", sass.logError))
       .pipe(gcmq())
       .pipe(sourcemap.init())
       .pipe(concat("styles.css"))
       .pipe(autoPrefixer({
        overridebrowserslist: ["last 2 version"],
        cascade: false
       }))
       .pipe(CleanCSS({
          lavel: 2
       }))
       .pipe(sourcemap.write("."))
       .pipe(gulp.dest("./build/css"))
       .pipe(browserSync.stream());
}

async function script() {
    return gulp.src("./src/js/**/*.js")
      .pipe(sourcemap.init())
      .pipe(concat("index.js"))
      .pipe(babel({
        presets: ["@babel/env"]
      }))
      .pipe(uglify({
        toplevel: true
      }))
      .pipe(sourcemap.write("."))
      .pipe(gulp.dest("./build/js"))
      .pipe(browserSync.stream());
}

async function img() {
    return gulp.src("./src/img/**/*")
     .pipe(imagemin())
     .pipe(gulp.dest(".build/img"));
}

async function clean() {
    return deleteSync(["./build/*"]);
}

async function fonts() {
    return gulp.src("./src/fonts/*")
      .pipe(gulp.dest("./build/fonts"))
}

async function htmls() {
    return gulp.src("./src/*.html")
      .pipe(gulp.dest("./build/"))
      .pipe(browserSync.stream());
}

async function watch () {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
      tunnel: false
    });

    gulp.watch("./src/scss/styles.scss", styles);
    gulp.watch("./src/js/**/*.js", script);
    gulp.watch("./src/*.html, htmls");
    gulp.watch("./*.html").on("change", browserSync.reload);
}

