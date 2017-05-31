/* eslint-env node */
const gulp = require("gulp");
const path = require("path");
const del = require("del");
const inject = require("gulp-inject");
const htmlreplace = require("gulp-html-replace");

const ROOT_PATH = path.resolve(__dirname);
const CURRENT_FOLDER = path.basename(ROOT_PATH);

const PATHS = {
    src: {
        root: "./src",
        css: "./src/css",
        fonts: "./src/fonts",
        images: "./src/images"
    },
    build: {
        root: "./build",
        css: "./build/css",
        fonts: "./build/fonts",
        js: "./build/js",
        images: "./build/images"
    },
    doco: path.resolve(CURRENT_FOLDER, "/docs/index.html")
};

// scripts
// Copy assets from src to build folder, cleaning that folder out first
gulp.task("cleanBuildFolder", () => del(PATHS.build.root + "/**/*"));

gulp.task("copyCSS", () => {
    gulp.src(PATHS.src.css + "/**/*").pipe(gulp.dest(PATHS.build.css));
});

gulp.task("copyImages", () => {
    gulp.src(PATHS.src.images + "/**/*").pipe(gulp.dest(PATHS.build.images));
});

gulp.task("copyFavicon", () => {
    gulp.src(path.resolve(PATHS.src.root, "favicon.ico")).pipe(gulp.dest(PATHS.build.root));
});

gulp.task("copyHTMLAndInjectBuildRefs", function() {
    // Copy all the HTML files over and inject the correct JS script tags into them.
    const htmlFilesArray = ["index"];
    let refsArray, refsToInject;
    for (let x = 0; x <= htmlFilesArray.length; x++) {
        refsArray = [
            PATHS.build.js + "/vendor.js",
            PATHS.build.js + "/" + htmlFilesArray[x] + ".js"
        ];
        refsToInject = gulp.src(refsArray, {
            read: false
        });

        gulp
            .src([PATHS.src.root + "/" + htmlFilesArray[x] + ".html"])
            .pipe(htmlreplace()) // Remove dev script tags
            .pipe(
                inject(refsToInject, {
                    // Inject prod script tags
                    relative: true
                })
            )
            .pipe(gulp.dest(PATHS.build.root));
    }
});

gulp.task("buildAssets", ["copyCSS", "copyImages", "copyFavicon"]);
