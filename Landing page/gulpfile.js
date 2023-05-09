import gulp from 'gulp';
import prefixer from 'gulp-autoprefixer'; //add prefix to css
import clean from 'gulp-clean'; //
import cleancss from 'gulp-clean-css';
import concat from 'gulp-concat'; //Склеиваем файлы в один
import fileInclude from 'gulp-file-include'; // Подключение html секций
import gulpif from 'gulp-if'; // if для создания условий при которых выполнится пакет
import imagemin from 'gulp-imagemin'; //Оптимизация картинок
import minifyjs from 'gulp-js-minify';
import notify from 'gulp-notify'; // Подключение уведомления об ошибках в файле
import plumber from 'gulp-plumber'; // Подключение уведомления об ошибках в файле
import prettyhtml from 'gulp-pretty-html'; // Пакет позволяет сделать html красивым
import rename from 'gulp-rename';
import gulpsass from 'gulp-sass'; //Обработка sass/scss файлов, и перекомпиляция в css
import dartSass from 'sass' //Обработка sass/scss файлов
import spritesvg from 'gulp-svg-sprite';
import uglify from 'gulp-uglify'; //JavaScript компрессор
import browserSync from 'browser-sync'; //auto-reload page (streaming)

const sass = gulpsass(dartSass);
// browserSync.create();

//Create path 

const path = {
	src: {
		html: './*.html',
		scss: './src/scss/**/*.scss',
		js: './src/js/**/*.js',
		img: './src/img/**/*.+(png|jpg|jpeg)',
		svg: './src/img/**/*.svg'
	},

	dist: {
		self: "./dist/",
		css: './dist/css/',
		js: './dist/js/',
		image: './dist/image/',
		svg: './dist/image/',
	},

	setEnv() {
		this.isProd = process.argv.includes("--prod")
		this.isDev = !this.isProd
	},
}

path.setEnv()

// Create tasks

const createHTML = () =>
	gulp
	.src(path.src.html)
	.pipe(fileInclude())
	.pipe(prettyhtml({
		indent_size: 4,
		indent_char: ' ',
		unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
	}))
	.pipe(gulp.dest(path.dist.self))
	.pipe(browserSync.stream())


const createScss = () =>
	gulp
	.src(path.src.scss)
	.pipe(plumber({
		errorHandler: notify.onError(err => ({
			title: 'createScss',
			message: err.message
		}))
	}))
	.pipe(sass().on('error', sass.logError))
	.pipe(gulpif(path.isProd, prefixer({
		cascade: false
	})))
	.pipe(gulpif(path.isProd, cleancss({
		compatibility: 'ie8'
	})))
	.pipe(rename('style.min.css'))
	.pipe(plumber.stop())
	.pipe(gulp.dest(path.dist.css))
	.pipe(browserSync.stream())



const createJs = () =>
	gulp
	.src(path.src.js)
	.pipe(plumber({
		errorHandler: notify.onError(err => ({
			title: 'createJs',
			message: err.message
		}))
	}))
	.pipe(concat("index.js"))
	.pipe(gulpif(path.isProd, uglify()))
	.pipe(minifyjs())
	.pipe(rename('scripts.min.js'))
	.pipe(plumber.stop())
	.pipe(gulp.dest(path.dist.js))
	.pipe(browserSync.stream())



const createImg = () =>
	gulp
	.src(path.src.img)
	.pipe(plumber({
		errorHandler: notify.onError(err => ({
			title: 'createImg',
			message: err.message
		}))
	}))
	.pipe(imagemin())
	.pipe(plumber.stop())
	.pipe(gulp.dest(path.dist.image))
	.pipe(browserSync.stream())


const createSvg = () =>
	gulp
	.src(path.src.svg)
	.pipe(plumber({
		errorHandler: notify.onError(err => ({
			title: 'createSvg',
			message: err.message
		}))
	}))
	.pipe(spritesvg({
		mode: {
			css: {
				render: {
					css: true
				}
			}
		}
	}))
	.on('error', function (error) {
		console.log(error)
	})
	.pipe(plumber.stop())
	.pipe(gulp.dest(path.dist.svg))
	.pipe(browserSync.stream())


//Functions clean and watcher

const createClean = () =>
	gulp
	.src(path.dist.self, {
		allowEmpty: true
	}).pipe(clean());



const watcher = () => {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	})


	gulp.watch('./index.html').on('change', browserSync.reload)
	gulp.watch(path.src.scss, createScss).on('change', browserSync.reload)
	gulp.watch(path.src.js, createJs).on('change', browserSync.reload)
	gulp.watch(path.src.img, createImg).on('change', browserSync.reload)
	gulp.watch(path.src.svg, createSvg).on('change', browserSync.reload)
	gulp.watch(path.src.html, createHTML).on('change', browserSync.reload)
}

//Gulp tasks
gulp.task('dev', gulp.series(createHTML, createScss, createJs, createImg, createSvg, watcher))
gulp.task('build', gulp.series(createHTML, createClean, createScss, createJs,
	gulp.parallel(createImg, createSvg)))