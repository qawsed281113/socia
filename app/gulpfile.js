const typescript = require("gulp-typescript");
const mode = require("gulp-mode")();
const pcss = require("gulp-postcss");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const minify = require("gulp-minify");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const { src, dest, series, watch } = require("gulp");
const del = require("del");
const path = require("path");
const tailwindcss = require("tailwindcss");
const tailwindConfig = require("./tailwind.config");
const tsConfig = require("./tsconfig.json");
const babel = require("gulp-babel");

const css = () => {
  return src(path.join(__dirname, "assets/styles/main.css"))
    .pipe(pcss([tailwindcss(tailwindConfig), autoprefixer(), cssnano()]))
    .pipe(sourcemaps.init())
    .pipe(concat("styles.min.css"))
    .pipe(sourcemaps.write("."))
    .pipe(dest(path.join(__dirname, "wwwroot/css")));
};

const ts = () => {
  return src(path.join(__dirname, "assets/scripts/main.ts"))
    .pipe(typescript(tsConfig))
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(
      minify({
        noSource: true,
        ext: {
          min: ".min.js",
        },
      })
    )
    .pipe(concat("bundle.min.js"))
    .pipe(sourcemaps.write("."))
    .pipe(dest(path.join(__dirname, "wwwroot/js")));
};

const cssDev = () => {
  return src(path.join(__dirname, "assets/styles/main.css"))
    .pipe(pcss([tailwindcss(tailwindConfig.compilerOptions), autoprefixer()]))
    .pipe(concat("styles.css"))
    .pipe(dest(path.join(__dirname, "wwwroot/css")));
};

const tsDev = () => {
  return src(path.join(__dirname, "assets/scripts/main.ts"))
    .pipe(typescript(tsConfig.compilerOptions))
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("bundle.js"))
    .pipe(dest(path.join(__dirname, "wwwroot/js")));
};

const liveReload = () => {
  watch("./assets/styles/main.css", cssDev);
  watch("./tailwind.config.js", cssDev);
  watch("./Pages/**/*.cshtml", cssDev);
  watch("./assets/scripts/**/*.ts", tsDev);
};

const clear = () =>
  del([
    path.join(__dirname, "wwwroot/js"),
    path.join(__dirname, "wwwroot/css"),
  ]);

if (mode.development()) {
  exports.default = series(clear, cssDev, tsDev);
  exports.css = cssDev;
  exports.ts = tsDev;
  exports.watch = liveReload;
} else {
  exports.default = series(clear, css, ts);
  exports.css = css;
  exports.ts = ts;
}
