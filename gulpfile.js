/*------------------------------------*\
 #REQUIRED DEPENDENCIES
 \*------------------------------------*/

var
	gulp = require( "gulp" ),
	gutil = require( "gulp-util" ),
	wrapJS = require( "gulp-wrap-js" ),
	babel = require( "gulp-babel" ),
	concat = require( "gulp-concat" ),
	clean = require( "gulp-clean" ),
	sourcemaps = require( "gulp-sourcemaps" ),
	sass = require( "gulp-sass" ),
	newer = require( "gulp-newer" ),
	browserSync = require( "browser-sync" ).create(),

	minifycss = require( "gulp-minify-css" ),
	inlineCss = require( "gulp-inline-css" ),
	php2html = require( "gulp-php2html" ),

	rename = require( "gulp-rename" ),
	replace = require( "gulp-replace" ),
	autoprefixer = require( "gulp-autoprefixer" ),
	browsersToPrefix = [ "> 5%", "ie >= 7" ],
	reload = browserSync.reload,
	fs = require( "fs" ),
	env = require( "gulp-env" ),
	combiner = require( "stream-combiner2" ),
	jscs = require( "gulp-jscs" ),
	runSequence = require( "run-sequence" ),

	scsslint = require( "gulp-scss-lint" ),

	/*------------------------------------*\
	 #FILE LOCATIONS
	 \*------------------------------------*/

	input = {
		"scssResources": "**/*.scss",
		"scssComponents": "./*.scss",
		"scssMobileComponents": "src/components-mobile/**/*.scss",
		"scssSharedComponents": "src/components-shared/**/*.scss",
		"jsComponents": "./*.js",
		"jsMobileComponents": "src/components-mobile/**/*.js",
		"jsSharedComponents": "src/components-shared/**/*.js",
		"jsPlugins": "src/resources/js/plugins/*.js",
		"jsVendor": "src/resources/js/vendor/*.js",
		"images": "src/resources/images/**",
		"icons": "src/resources/icons/**",
	},

	output = {
		"stylesheets": "dist/css",
		"javascript": "dist/js",
		"images": "dist/images/",
		"icons": "dist/icons/",
		"jsPlugins": "dist/js/plugins",
		"jsVendor": "dist/js/vendor",
		"fonts":  "./dist/fonts/",
		"iconFonts":  "./dist/fonts/icons"
	};

if ( fs.existsSync( ".env.json" ) ) {
	env( ".env.json" );
}

/*------------------------------------*\
 #GULP TASK THAT RUNS AT THE OUTSET
 \*------------------------------------*/

gulp.task( "default", [  "serve"
] );


/*------------------------------------*\
 #BUILD THE JAVASCRIPT
 \*------------------------------------*/

gulp.task( "build-js", function() {
	return gulp.src( [ input.jsComponents ] )
		// .pipe( jscs( {
		// 	configPath: "./.jscsrc"
		// } ) )
		// .pipe( jscs.reporter() )
		.pipe( babel( {
			presets: [ "es2015" ],
			compact: false
		} ) )
		// .pipe( wrapJS( "(function ($, window, document, undefined)\{%= body % }(jQuery, window, document));" ) )
		.pipe( gulp.dest( output.javascript ) );
} );

/*------------------------------------*\
 #CSS COMPILIATION
 \*------------------------------------*/

gulp.task( "build-css", function() {
	gulp.src( [ "./app.scss" ] )

	//.pipe(sourcemaps.init())
		.pipe( sass( {
			outputStyle: "uncompressed"
		} ) )
		.pipe( autoprefixer( browsersToPrefix ) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( output.stylesheets ) )
		.pipe( reload( {
			stream: true
		} ) );
} );

/*------------------------------------*\
 #GULP SERVE - WATCHES FILES AND SETS UP BROWSERSYNC
 \*------------------------------------*/

gulp.task( "js-watch", [ "build-js" ], browserSync.reload );
gulp.task( "serve", [ "build-css", "build-js"], function() {
	browserSync.init( {
		proxy: process.env.PROXY_URL || "localhost/jet2hols-local"
	} );
	
	gulp.watch([input.jsComponents], ['js-watch']);
	gulp.watch('*.html').on( 'change', browserSync.reload );
	gulp.watch( [ input.scssResources,  input.scssComponents, ], [ "build-css" ] );
} );

// @todo : test everything works - zip:* works its just the deploy stuff
