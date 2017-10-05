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
				js: {
					src: 'src/js/*.js',
					dest: 'js/concat.js'
				},
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
						cwd:	'js',
						src:	'concat.js',
						dest:	'minified/js',
							ext:	'.min.js',
						extDot:	'last'
					}]
				}
			},			
			htmlbuild: {
				src: "src/html/Index.html",
				dest: 'dist/',
	    		options: {
	    			sections:{
	    				templates:['src/html/aviaForm.html','src/html/railForm.html']
	    			}
	    		}	     				
	    	}, 
			copy: {
				main: {
	    			files: [      
	      			{expand: true, cwd:'src/css/',src: '**', dest: 'origin/css/'},
	      			{expand: true, cwd:'src/js/',src: '**', dest: 'origin/js/'},
	      			{expand: true, cwd:'src/html/',src:'**', dest: 'html/'},
	      			{expand: true, cwd:'src/img/',src:'**', dest: 'img/'}
	      			],
	      		},
	      	}
		});	

		// Load tasks
		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-css');
		grunt.loadNpmTasks('grunt-contrib-uglify');	
		grunt.loadNpmTasks('grunt-githooks');
		grunt.loadNpmTasks('grunt-contrib-copy');
		grunt.loadNpmTasks('grunt-html-build');		
		
		
		grunt.registerTask('default', ['concat','uglify','cssmin','htmlbuild','copy']);
		

	};