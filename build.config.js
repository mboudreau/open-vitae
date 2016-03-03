/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
	/**
	 * The `build_dir` folder is where our projects are compiled during
	 * development and the `compile_dir` folder is where our app resides once it's
	 * completely built.
	 */
	build_dir: 'build',
	release_dir: 'release',
	package_dir: 'dist',


	/**
	 * This is a collection of file patterns that refer to our app code (the
	 * stuff in `src/`). These file paths are used in the configuration of
	 * build tasks. `js` is all project javascript, less tests. `ctpl` contains
	 * our reusable components' (`src/common`) template HTML files, while
	 * `atpl` contains the same, but for our app's code. `html` is just our
	 * main HTML file, `less` is our main stylesheet, and `unit` contains our
	 * app's unit tests.
	 */
	app_files: {
		js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/**/*.e2e.js', '!src/assets/**/*.js' ],
		jsunit: [ 'src/**/*.spec.js', 'mock/**/*.spec.js' ],
		jse2e: [ 'src/**/*.e2e.js' ],

		atpl: [ 'src/app/**/*.tpl.html' ],
		dtpl: [ 'src/directives/**/*.tpl.html' ],

		html: [ 'src/index.html' ],
		less: ['src/less/global.less'],

		assets: [
			{
				src: [ '**' ],
				dest: '<%= build_dir %>/assets/',
				cwd: 'src/assets',
				expand: true
			}
		]
	},

	/**
	 * This is a collection of files used during testing only.
	 */
	test_files: {
		js: [
			'vendor/angular-mocks/angular-mocks.js',
			'mock/fixtures/**/*.js',
			'!mock/fixtures/**/*.spec.js'
		]
	},

	/**
	 * This is the same as `app_files`, except it contains patterns that
	 * reference vendor code (`vendor/`) that we need to place into the build
	 * process somewhere. While the `app_files` property ensures all
	 * standardized files are collected for compilation, it is the user's job
	 * to ensure non-standardized (i.e. vendor-related) files are handled
	 * appropriately in `vendor_files.js`.
	 *
	 * The `vendor_files.js` property holds files to be automatically
	 * concatenated and minified with our project source files.
	 *
	 * The `vendor_files.css` property holds any CSS files to be automatically
	 * included in our app.
	 *
	 * The `vendor_files.assets` property holds any assets to be copied along
	 * with our app's assets. This structure is flattened, so it is not
	 * recommended that you use wildcards.
	 */
	vendor_files: {
		js: [
			'vendor/angular/angular.js',
			'vendor/angular-sanitize/angular-sanitize.js',
			'vendor/angular-cookies/angular-cookies.js',
			'vendor/angular-animate/angular-animate.js',
			'vendor/angular-ui-router/release/angular-ui-router.js',
			'vendor/angular-restate/src/angular-restate.js',
			'vendor/angucomplete-alt/angucomplete-alt.js',
			'vendor/angular-bootstrap/src/tabs/tabs.js',
			'vendor/angular-bootstrap/src/buttons/buttons.js',
			'vendor/angular-bootstrap/src/modal/modal.js',
			'vendor/angular-bootstrap/src/position/position.js',
			'vendor/angular-bootstrap/src/stackedMap/stackedMap.js',
			'vendor/angular-bootstrap/src/dropdown/dropdown.js',
			'vendor/angular-bootstrap/src/tooltip/tooltip.js',
			'vendor/angular-bootstrap/src/popover/popover.js',
			'vendor/angular-ui-scrollpoint/dist/scrollpoint.js',
			'vendor/elasticsearch/elasticsearch.angular.js',
			'node_modules/angular-feature-toggle/dist/angular-feature-toggle.js',
			'node_modules/angularytics/dist/angularytics.js',
			'vendor/angular-mosaic/angular-mosaic.js',
			'vendor/ngInfiniteScroll/build/ng-infinite-scroll.js',
			'node_modules/numeraljs/numeral.js',
			'node_modules/angular-numeraljs/dist/angular-numeraljs.js'
		],
		css: [
			'vendor/angucomplete-alt/angucomplete-alt.css',
			'vendor/angular-mosaic/angular-mosaic.css'
		],
		assets: [
			{
				src: [ '**' ],
				dest: '<%= build_dir %>/assets/fonts',
				cwd: 'node_modules/font-awesome/fonts',
				expand: true
			}
		],
		tpl: {
			bootstrap: {
				options: {
					base: 'vendor/angular-bootstrap/',
					rename:function (moduleName) {
						return 'uib/' + moduleName;
					}
				},
				src: [
					'vendor/angular-bootstrap/template/tabs/*.html',
					'vendor/angular-bootstrap/template/popover/*.html',
					'vendor/angular-bootstrap/template/tooltip/*.html',
					'vendor/angular-bootstrap/template/modal/*.html'
				]
			}
		}
	}
};
