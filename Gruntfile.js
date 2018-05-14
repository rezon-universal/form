	module.exports = function(grunt) {
		grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			meta: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */'
			},

			githooks: {
				options: {
					hashbang: '#!/bin/sh',
					template: 'install/template/shell.hb',
					startMarker: '# GRUNT-GITHOOKS START',
					endMarker: '# GRUNT-GITHOOKS END'
				},
				all: {
					'pre-commit': 'pre-commit'
				}
			},

			eslint: {
				options: {
					quiet: true
				},
				target: ['src/*.js']
			},

			mocha: {
				all: {
					src: ['test/*.html'],
				},
				options: {
					run: true
				}
			},
			concat: {			
				// js: {
				// 	src: 'src/js/*.js',
				// 	dest: 'js/concat.js'
				// },
				css: {
					src: 'src/css/*.css',
					dest: 'css/concat.css'
				}
			},
			cssmin: {
				css:{
					src: 'css/concat.css',
					dest: 'minified/css/concat.min.css'
				}
			},
			// Minifies JS files
			uglify: {
				options: {
					preserveComments: /^!|@preserve|@license|@cc_on/i,
					sourceMap: true,
					footer: '\n'
				},
				dist: {
					files: [{
						expand:	true,
						cwd:	'src/js',
						src:	['typeahead.bundle.js','vue_datepicker/Datepicker.js','rezon-form.js'],
						dest:	'minified/js',
						ext:	'.min.js',
						extDot:	'last'
					}]
				}
			},			
			copy: {
				main: {
	    			files: [      
	      			{expand: true, cwd:'src/css/',src: '**', dest: 'origin/css/'},
	      			{expand: true, cwd:'src/js/',src: '**', dest: 'origin/js/'},
	      			{expand: true, cwd:'src/html/',src:'**', dest: 'html/'},
	      			{expand: true, cwd:'src/img/',src:'**', dest: 'img/'}
	      			]
	      		}
	      	},
	      	htmlbuild: {
				src: "html/Index.html",				
	    		options: {
	    			replace:true,
	    			beautify:true,
	    			scripts: {
	    				bundle: [
	    				'origin/js/*.min.js',
	    				'minified/js/vue_datepicker/*.min.js',
	    				'minified/js/*.min.js',	    				
	    				],	    			
	    			},
	    			styles: {
	    				bundle: 'minified/css/*.css'
	    			},
	    			sections:{
                        templates: ['html/aviaForm.html','html/railForm.html','html/busForm.html']
	    			}
	    		}	     				
	    	}
		});	

		// Load tasks
		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-css');
		grunt.loadNpmTasks('grunt-contrib-uglify');	
		grunt.loadNpmTasks('grunt-githooks');
		grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-html-build');		

		grunt.registerTask('default', ['concat','uglify','cssmin','copy','htmlbuild']);
		

	};