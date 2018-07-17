import gulp from 'gulp'
import sass from 'gulp-sass'
import plumber from 'gulp-plumber'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import browserSync from 'browser-sync'
import sourcemaps from 'gulp-sourcemaps'
import browserify from 'browserify'
import babelify from 'babelify'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'

const server = browserSync.create();

let postcssPlugins = [
  autoprefixer({
    browsers: '> 1%, last 3 versions, Firefox ESR, Opera 12.1'
  }),
  cssnano({
    core: true
  })
];

let sassOptions = {
  outputStyle: 'expanded'
};

gulp.task('styles', () =>
  gulp.src('./src/sass/style.scss')
  .pipe(plumber({
    errorHandler: function (err) {
      console.log(err);
      this.emit('end');
    }
  }))
  .pipe(sass(sassOptions))
  .pipe(postcss(postcssPlugins))
  .pipe(plumber.stop())
  .pipe(gulp.dest('./dist/assets/css'))
  .pipe(server.stream())
);

gulp.task('scripts', () =>
  browserify('./src/js/scripts.js', {
    debug: true,
    standalone: 'script'
  })
  .transform(babelify)
  .bundle()
  .pipe(source('script.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({
    loadMaps: true
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/assets/js'))
);

gulp.task('default', () => {
  server.init({
    server: {
      baseDir: './dist'
    },

    serveStatic: ['./js']
  });

  gulp.watch('./src/sass/**/*.scss', ['styles']);
  gulp.watch('./src/js/**/*.js', ['scripts']);
  gulp.watch('./dist/**/*.html').on('change', server.reload);
  gulp.watch('./dist/assets/js/**/*.js').on('change', server.reload);
});