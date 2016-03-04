module.exports = function (grunt) {

	/**
	 * Load required Grunt tasks. These are installed based on the versions listed
	 * in `package.json` when you do `npm install` in this directory.
	 */
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks("grunt-image-embed");
	grunt.loadNpmTasks('grunt-artifactory-artifact');
	grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-notify');

	// Protractor Testing
	grunt.loadNpmTasks('grunt-protractor-runner');

	// Pact
	grunt.loadNpmTasks('grunt-pact');
	grunt.loadNpmTasks('grunt-execute');
	grunt.loadNpmTasks('grunt-continue');

	/**
	 * Rename watch task to two separate tasks for build and release
	 */
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.renameTask('watch', 'delta');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.renameTask('watch', 'deltarelease');

	/**
	 * Middleware for grunt-contrib-connect
	 */
	var modRewrite = require('connect-modrewrite');

	/**
	 * Load in our build configuration file.
	 */
	var userConfig = require('./build.config.js');
	var json = grunt.file.readJSON("package.json");
	json.name = json.name.replace('@pageup/', '');

	var taskConfig = {
			pkg: json,

			clean: {
				options: { force: true },
				build: ['<%= build_dir %>'],
				release: ['<%= release_dir %>'],
				package: ['<%= package_dir %>'],
				pact: ['<%= mkdir.tmp.options.create %>']
			},

			mkdir: {
				tmp: {
					options: {
						create: ['.tmp/chrome', '.tmp/pacts']
					}
				}
			},

			copy: {
				build_app_assets: {
					files: '<%= app_files.assets %>'
				},
				build_vendor_assets: {
					files: '<%= vendor_files.assets %>'
				},
				build_app_js: {
					files: [
						{
							src: ['<%= app_files.js %>'],
							dest: '<%= build_dir %>/',
							cwd: '.',
							expand: true
						}
					]
				},
				build_vendor_js: {
					files: [
						{
							src: ['<%= vendor_files.js %>'],
							dest: '<%= build_dir %>/',
							cwd: '.',
							expand: true
						}
					]
				},
				release_assets: {
					files: [
						{
							src: ['**/*'],
							dest: '<%= release_dir %>/assets',
							cwd: '<%= build_dir %>/assets',
							expand: true
						}
					]
				},
				libs: {
					files: [
						{
							src: ['**/*'],
							dest: '<%= release_dir %>/libs/',
							cwd: '<%= release_dir %>/assets/',
							expand: true,
							rename: function (dest, src) {
								return dest + src.replace('-' + taskConfig.pkg.version, '');
							}
						},
						{
							src: ['**/*'],
							dest: '<%= release_dir %>/libs/<%= pkg.version %>/',
							cwd: '<%= release_dir %>/assets/',
							expand: true,
							rename: function (dest, src) {
								return dest + src.replace('-' + taskConfig.pkg.version, '');
							}
						}
					]
				},
				package: {
					files: [
						{
							src: ['**/*'],
							dest: '<%= package_dir %>/',
							cwd: '<%= release_dir %>/libs/<%= pkg.version %>/',
							expand: true
						},
						{
							src: ['package.json', 'README.md'],
							dest: '<%= package_dir %>',
							cwd: '.',
							expand: true
						}
					]
				}
			},

			concat: {
				css:{
					files: [
						{
							src: [
								'<%= vendor_files.css %>',
								'<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
							],
							dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
						}
					]
				},
				'css-release':{
					files: [
						{
							src: [
								'<%= vendor_files.css %>',
								'<%= release_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
							],
							dest: '<%= release_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
						}
					]
				},
				release: {
					src: [
						'<%= vendor_files.js %>',
						'module.prefix',
						'<%= build_dir %>/src/**/*.js',
						'<%= build_dir %>/templates-*.js',
						'module.suffix'
					],
					dest: '<%= release_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
				}
			},

			ngAnnotate: {
				options: {
					singleQuotes: true
				},
				build: {
					files: [
						{
							src: ['<%= app_files.js %>'],
							cwd: '<%= build_dir %>/',
							dest: '<%= build_dir %>/',
							expand: true
						},
						{
							src: ['<%= vendor_files.js %>'],
							cwd: '<%= build_dir %>/',
							dest: '<%= build_dir %>/',
							expand: true
						}
					]
				}
			},

			uglify: {
				release: {
					options: {
						mangle: false,
						sourceMap: true
					},
					files: [
						{
							src: ['<%= concat.release.dest %>'],
							expand: true,
							ext: '.min.js',
							extDot: 'last'
						}
					]
				}
			},

			htmlmin: {
				release: {
					options: {
						removeComments: true,
						collapseWhitespace: true,
						minifyJS: true,
						caseSensitive: true
					},
					files: [
						{
							src: ['**/*.html'],
							cwd: '<%= release_dir %>/',
							dest: '<%= release_dir %>/<%= pkg.name %>',
							expand: true
						}
					]
				}
			},

			less: {
				build: {
					files: [
						{
							src: [
								'<%= app_files.less %>'
							],
							dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
						}
					]
				},
				release: {
					options: {
						compress: true,
						cleancss: true,
						cleancssOptions: {
							keepSpecialComments: 0
						}
					},
					files: [
						{
							src: [
								'<%= app_files.less %>'
							],
							dest: '<%= release_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
						}
					]
				}
			},

			jscs: {
				options: {
					verbose: true
				},

				src: [
					'<%= app_files.js %>'
				],
				test: [
					'<%= app_files.jsunit %>'
				],
				gruntfile: [
					'Gruntfile.js'
				]
			},

			/**
			 * HTML2JS is a Grunt plugin that takes all of your template files and
			 * places them into JavaScript files as strings that are added to
			 * AngularJS's template cache. This means that the templates too become
			 * part of the initial payload as one JavaScript file. Neat!
			 */
			html2js: {
				/**
				 * These are the templates from `src/app`.
				 */
				app: {
					options: {
						base: 'src/app'
					},
					src: ['<%= app_files.atpl %>'],
					dest: '<%= build_dir %>/templates-app.js'
				},

				/**
				 * These are the templates from `src/directives`.
				 */
				directives: {
					options: {
						base: 'src/directives'
					},
					src: ['<%= app_files.dtpl %>'],
					dest: '<%= build_dir %>/templates-directives.js'
				}
			},

			karma: {
				options: {
					configFile: '<%= build_dir %>/karma-unit.js'
				},
				unit: {
					singleRun: true
				},
				continuous: {
					singleRun: false,
					background: true
				}
			},


			protractor: {
				options: {
					configFile: "protractor.config.js",
					args: {
						verbose: true,
						specs: '<%= app_files.jse2e %>',
						baseUrl: '<%= connect.options.protocol %>://localhost:<%= connect.test.options.port %>/'
					}
				},
				all: {}
			},

			pact: {
				all: {
					options: {
						port: 9700,
						cors: true,
						dir: '.tmp/pacts'
					}
				}
			},

			execute: {
				options: {
					module: true
				},
				'pact-setup': {
					src: ['mock/setup.js']
				},
				'pact-teardown': {
					src: ['mock/teardown.js']
				}
			},

			index: {
				options: {
					templateSrc: 'src/index.html',
					templateDest: '<%= build_dir %>/'
				},
				build: {
					files: [
						{
							src: [
								'<%= vendor_files.js %>'
							],
							cwd: '<%= build_dir %>/',
							expand: true
						},
						{
							src: [
								'**/*.js',
								'**/*.css',
								'!vendor/**/*',
								'!node_modules/**/*',
								'!karma-unit.js'
							],
							cwd: '<%= build_dir %>/',
							expand: true
						}
					]
				},

				release: {
					options: {
						templateDest: '<%= release_dir %>/',
						release: true
					},
					files: [
						{
							src: [
								'**/*.min.js.gz',
								'**/*.css.gz'
							],
							cwd: '<%= release_dir %>/',
							expand: true
						}
					]
				}
			},

			compress: {
				release: {
					options: {
						mode: 'gzip'
					},
					files: [
						{
							expand: true,
							src: ['<%= release_dir %>/**/*.min.js'],
							ext: '.js.gz',
							extDot: 'last'
						},
						{
							expand: true,
							src: ['<%= release_dir %>/**/*.css'],
							ext: '.css.gz',
							extDot: 'last'
						},
						{
							expand: true,
							src: ['<%= release_dir %>/**/*.html'],
							ext: '.html.gz',
							extDot: 'last'
						}
					]
				}
			},

			imageEmbed: {
				all: {
					src: '<%= release_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
					dest: '<%= release_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
				}
			},

			karmaconfig: {
				unit: {
					dir: '<%= build_dir %>',
					src: [
						'<%= vendor_files.js %>',
						'<%= build_dir %>/templates-*.js',
						'<%= app_files.js %>',
						'<%= test_files.js %>',
						'<%= app_files.jsunit %>'
					]
				}
			},

			notify_hooks: {
				options: {
					enabled: true,
					title: '<%= pkg.name %>',
					success: false,
					duration: 3
				}
			},

			delta: {
				options: {
					livereload: true
				},

				gruntfile: {
					files: 'Gruntfile.js',
					tasks: ['jscs:gruntfile'],
					options: {
						livereload: false
					}
				},

				jssrc: {
					files: [
						'<%= app_files.js %>'
					],
					tasks: ['jscs:src', 'copy:build_app_js', 'ngAnnotate', 'karma:unit:run']
				},

				jsvendor: {
					files: [
						'<%= vendor_files.js %>'
					],
					tasks: ['copy:build_vendor_js', 'ngAnnotate']
				},

				assets: {
					files: [
						'src/assets/**/*'
					],
					tasks: ['copy:build_app_assets', 'copy:build_vendor_assets']
				},

				html: {
					files: ['<%= app_files.html %>'],
					tasks: ['index:build']
				},

				tpls: {
					files: [
						'src/app/**/*.tpl.html',
						'src/directives/**/*.tpl.html'
					],
					tasks: ['html2js']
				},

				less: {
					files: ['src/**/*.less', 'vendor/**/*.less'],
					tasks: ['less:build', 'concat:css']
				},

				jsunit: {
					files: [
						'<%= app_files.jsunit %>'
					],
					tasks: ['jscs:test', 'karma:unit:run'],
					options: {
						livereload: false
					}
				},

				pacts: {
					files: [
						'mock/pacts/**/*.js'
					],
					tasks: ['execute:pact-setup']
				}
			},

			deltarelease: {
				gruntfile: {
					files: 'Gruntfile.js',
					tasks: ['jscs:gruntfile'],
					options: {
						livereload: false
					}
				},

				jssrc: {
					files: [
						'<%= app_files.js %>'
					],
					tasks: ['jscs:src', 'copy:build_app_js', 'ngAnnotate', 'concat:release', 'uglify', 'karma:unit:run']
				},

				jsvendor: {
					files: [
						'<%= vendor_files.js %>'
					],
					tasks: ['copy:build_vendor_js', 'ngAnnotate', 'concat:release', 'uglify']
				},

				assets: {
					files: [
						'src/assets/**/*'
					],
					tasks: ['copy:build_app_assets', 'copy:build_vendor_assets', 'copy:release_assets']
				},

				html: {
					files: ['<%= app_files.html %>'],
					tasks: ['index:release']
				},

				tpls: {
					files: [
						'src/app/**/*.tpl.html',
						'src/directives/**/*.tpl.html'
					],
					tasks: ['html2js', 'concat', 'uglify', 'compress']
				},

				less: {
					files: ['src/**/*.less'],
					tasks: ['less:release', 'concat:css', 'imageEmbed', 'compress']
				},

				jsunit: {
					files: [
						'<%= app_files.jsunit %>'
					],
					tasks: ['jscs:test', 'karma:unit:run'],
					options: {
						livereload: false
					}
				},

				pacts: {
					files: [
						'mock/pacts/**/*.js'
					],
					tasks: ['execute:pact-setup']
				}
			},

			connect: {
				options: {
					port: 8080,
					protocol: 'http', // TODO: need to be able to test https over phantom
					middleware: function (connect, options) {
						var middlewares = [];
						//middlewares.push(modRewrite(['!\\.?(js|css|html|eot|svg|ttf|woff|otf|css|png|jpg|gif|ico|pdf) / [L]'])); // Anything after name
						middlewares.push(function (req, res, next) {
							var url = req.url.split('?')[0];
							if (/\.(gz|gzip)$/.test(url)) {
								var type = 'text/html';
								if (/\.js\.(gz|gzip)$/.test(url)) {
									type = 'application/javascript';
								} else if (/\.css\.(gz|gzip)$/.test(url)) {
									type = 'text/css';
								}

								res.setHeader('Content-Type', type);
								res.setHeader('Content-Encoding', 'gzip');
							}

							// don't just call next() return it
							return next();
						});
						options.base.forEach(function (base) {
							middlewares.push(connect.static(base));
						});
						return middlewares;
					}
				},
				build: {
					options: {
						base: '<%= build_dir %>'
					}
				},
				release: {
					options: {
						base: '<%= release_dir %>',
						protocol: 'https'
					}
				},
				test: {
					options: {
						port: 8181,
						base: '<%= release_dir %>'
					}
				}
			},

			// TODO: Check for version number of files
			file_check: {
				vendors: {
					src: [
						'<%= vendor_files.js %>',
						'<%= vendor_files.css %>'
					],
					nonull: true // DO NOT REMOVE, this is needed to find all incorrect paths
				}
			},

			cloudfront: {
				index: {
					options: {
						output: '<%= release_dir %>/<%= pkg.name %>.cloudfront-invalidation',
					},
					files: [
						{
							cwd: '<%= release_dir %>/',
							src: ['**/*'],
							expand: true
						}
					]
				}
			}
		};

// Dynamically adding html2js targets
	for (var key in userConfig.vendor_files.tpl) {
		var value = userConfig.vendor_files.tpl[key];
		value.dest = userConfig.build_dir + '/templates-' + key + '.js';
		taskConfig.html2js[key] = value;
		if (Array.isArray(value.src)) {
			taskConfig.delta.tpls.files = taskConfig.delta.tpls.files.concat(value.src);
			taskConfig.deltarelease.tpls.files = taskConfig.deltarelease.tpls.files.concat(value.src);
		} else {
			taskConfig.delta.tpls.files.push(value.src);
			taskConfig.deltarelease.tpls.files.push(value.src);
		}
	}

	grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  grunt.registerTask('watch', ['build', 'notify_hooks', 'connect:build', 'karma:continuous', 'pact:start', 'execute:pact-setup', 'delta']);
	grunt.registerTask('watch:local', ['build', 'notify_hooks', 'connect:build', 'karma:continuous', 'delta']);
	grunt.registerTask('watch:release', ['release', 'copy:libs', 'notify_hooks', 'connect:release', 'karma:continuous', 'pact:start', 'execute:pact-setup', 'deltarelease']);

	/**
	 * The default task is to build and release.
	 */
	grunt.registerTask('default', ['build']);

	/**
	 * Testing tasks
	 */
	grunt.registerTask('test', ['test:unit'/*, 'test:e2e'*/]);
	grunt.registerTask('test:unit', ['karmaconfig', 'karma:unit']);
	grunt.registerTask('test:e2e', ['connect:test', 'pact:start', 'protractor', 'pact:stop']);

	/**
	 * Pact tasks
	 */
	grunt.registerTask('pact:start', ['continue:on', 'pact:all', 'onexit']);
	grunt.registerTask('pact:stop', ['pact:all:stop', 'continue:off', 'continue:fail-on-warning']);

	/**
	 * The build task gets your app ready to run for development and testing.
	 */
	var buildTasks = ['file_check:vendors', 'clean', 'mkdir:tmp', 'html2js', 'jscs', 'less:build', 'concat:css',
		'copy:build_app_assets', 'copy:build_vendor_assets',
		'copy:build_app_js', 'copy:build_vendor_js', 'ngAnnotate', 'index:build'];
	grunt.registerTask('build', buildTasks.concat([
		'test:unit'
	]));

	/**
	 * The release task gets your app ready for deployment
	 */
	grunt.registerTask('release', buildTasks.concat([
		'copy:release_assets', 'less:release', 'concat:css-release', 'imageEmbed', 'concat:release', 'uglify', 'compress:release', 'index:release', 'htmlmin:release', 'test'
	]));

	grunt.registerTask('package', [
		'copy:libs', 'cloudfront', 'copy:package'
	]);

	function filterForJS(files) {
		return files.filter(function (file) {
			return file.match(/\.js(\.gz)?$/);
		});
	}

	function filterForCSS(files) {
		return files.filter(function (file) {
			return file.match(/\.css(\.gz)?$/);
		});
	}

	grunt.registerTask('onexit', function (step) {
		var config = grunt.config('onexit');
		if (!config) {
			config = {
				watched: false,
				exit: function () {
					grunt.log.writeln('').writeln('Shutting down server...');
					grunt.task.run([/*'execute:pact-teardown',*/ 'pact:all:stop', 'onexit:exit']);
					grunt.task.current.async()();
				}
			};
			grunt.config.set('grunt ', config);
		}

		if (step === 'exit') {
			process.exit();
		} else if (!config.watched) {
			process.once('SIGINT', config.exit);
			process.once('SIGHUP', config.exit);
			process.once('SIGTERM', config.exit);
			config.watched = true;
		}
	});

	grunt.registerMultiTask('index', 'Process index.html template', function () {
		var options = this.options({
			templateSrc: ['src/index.html'],
			release: false
		});

		if (options.templateDest.slice(-1) !== '/') {
			options.templateDest += '/';
		}

		if (!Array.isArray(options.templateSrc)) {
			options.templateSrc = [options.templateSrc];
		}

		var files = this.files.map(function (file) {
			return file.dest;
		});
		var jsFiles = filterForJS(files);
		var cssFiles = filterForCSS(files);

		if (cssFiles.length !== 0) {
			grunt.log.writeln('Including CSS:');
			cssFiles.forEach(function (f) {
				grunt.log.writeln(String(f).cyan);
			});
		}

		if (jsFiles.length !== 0) {
			grunt.log.writeln('Including JS:');
			jsFiles.forEach(function (f) {
				grunt.log.writeln(String(f).cyan);
			});
		}

		options.templateSrc.forEach(function (tpl) {
			grunt.file.copy(tpl, options.templateDest + tpl.split('/').pop(), {
				process: function (contents, path) {
					return grunt.template.process(contents, {
						data: {
							release: options.release,
							scripts: jsFiles,
							styles: cssFiles,
							version: grunt.config('pkg.version'),
							name: grunt.config('pkg.name'),
							timestamp: new Date().getTime()
						}
					});
				}
			});
		});
	});

	grunt.registerMultiTask('cloudfront', 'Generate cloudfront file for invalidation on deploy', function () {
		var options = this.options({
			output: '.cloudfront-invalidation'
		});
		var files = this.files.filter(function (file) {
			return grunt.file.isFile(file.src[0]);
		}).map(function (file) {
			return file.dest;
		});
		grunt.file.write(options.output, JSON.stringify(files));
	});

	grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
		var jsFiles = filterForJS(this.filesSrc);

		grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
			process: function (contents, path) {
				return grunt.template.process(contents, {
					data: {
						scripts: jsFiles
					}
				});
			}
		});
	});

	/**
	 * A quick file check to make sure all dependent files exists, if not throw error.
	 * This is mostly used to mention to the user that a new dependency might of been added, but not installed
	 * through `bower install`.
	 */
	grunt.registerMultiTask('file_check', 'Custom file check to catch dependency problems', function () {
// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({});

		grunt.verbose.writeflags(options, 'Options');

		var missingFiles = [];

		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			missingFiles = f.src.filter(function (filepath) {
				return !grunt.file.exists(filepath) && !/[!*?{}]/.test(filepath);
			});
		});

		if (missingFiles.length !== 0) {
			var message = 'The following files are missing: ' + missingFiles.join(',') + '\nDid you forget to do `bower install`?';
			grunt.fail.warn(message, 3);
			return false;
		}

		grunt.log.writeln('All files accounted for.');
		return true;
	});
};
