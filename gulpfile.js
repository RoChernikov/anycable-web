var gulp = require("gulp");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var options = {
  env: "development",
  sponsorUrl: "https://github.com/sponsors/anycable",
  formURL: "https://form.typeform.com/to/wAHm0sRP",
  proFormUrl: "https://form.typeform.com/to/BwBcZmdQ",
};

function config(dir) {
  return {
    server: {
      baseDir: ["./", dir],
    },
    host: "0.0.0.0",
    port: 3002,
  };
}

gulp.task("html", function () {
  var pug = require("gulp-pug");
  var useref = require("gulp-useref");
  var typograf = require("gulp-typograf");

  return gulp
    .src("src/**/*.pug")
    .pipe(pug({ pretty: true, locals: options, basedir: "src" }))
    .pipe(typograf({ locale: ["en-US"] }))
    .pipe(useref({ searchPath: "./" }))
    .pipe(gulp.dest("./build"))
    .pipe(reload({ stream: true }));
});

gulp.task("styles", function () {
  var postcss = require("gulp-postcss");
  var sourcemaps = require("gulp-sourcemaps");

  return gulp
    .src("src/styles/main.css")
    .pipe(sourcemaps.init())
    .pipe(
      postcss([
        require("postcss-cssnext"),
        require("precss"),
        require("postcss-easings"),
        require("postcss-custom-media"),
      ])
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./build"))
    .pipe(reload({ stream: true }));
});

gulp.task("copy:fonts", function () {
  return gulp
    .src("src/fonts/*")
    .pipe(gulp.dest("./build/fonts"))
    .pipe(reload({ stream: true }));
});

gulp.task("copy:images", function () {
  return gulp
    .src("src/images/**/*")
    .pipe(gulp.dest("./build/images"))
    .pipe(reload({ stream: true }));
});

gulp.task("copy:blog:media", function () {
  return gulp
    .src("src/**/*.{png,jpg,mp4}")
    .pipe(gulp.dest("./build/"))
    .pipe(reload({ stream: true }));
});

gulp.task("copy:root", function () {
  return gulp
    .src(["src/*.{xml,png,ico,json,svg}", "src/CNAME"])
    .pipe(gulp.dest("./build"))
    .pipe(reload({ stream: true }));
});

gulp.task(
  "copy",
  gulp.parallel("copy:images", "copy:root", "copy:fonts", "copy:blog:media")
);

gulp.task("serve", function () {
  browserSync(config("./build"));
});

gulp.task("watch", function () {
  gulp.watch("src/**/*.pug", gulp.series("html"));
  gulp.watch("src/**/*.md", gulp.series("html"));
  gulp.watch("src/**/*.js", gulp.series("html"));
  gulp.watch("src/**/*.css", gulp.series("styles"));
  gulp.watch("src/images/**/*", gulp.series("copy:images", "html"));
  gulp.watch("src/**/*.mp4", gulp.series("copy:blog:media", "html"));
});

gulp.task("clean", function () {
  var del = require("del");
  return del(["./build/**/*"]);
});

gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("styles", "html", "copy"))
);

gulp.task(
  "build:prod",
  gulp.series(function (cb) {
    options.env = "production";
    options.formURL = "https://form.typeform.com/to/wAHm0sRP";
    options.proFormUrl = "https://form.typeform.com/to/BwBcZmdQ";
    cb();
  }, "build")
);

gulp.task("default", gulp.series("build", gulp.parallel("serve", "watch")));
