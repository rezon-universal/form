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
				dest: 'dest/js/concat.js'
			},
			css: {
				src: 'src/css/*.css',
				dest: 'dest/css/concat.css'
			}
		},
		cssmin: {
			css:{
				src: 'dest/css/concat.css',
				dest: 'dest/css/concat.min.css'
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
					cwd:	'dest/js',
					src:	'concat.js',
					dest:	'dest/js',
					ext:	'.min.js',
					extDot:	'last'
				}]
			}
		},

		copy: {
			main: {
    			files: [      
      			{expand: true, src: ['src/**'], dest: 'dest'},
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
	
	grunt.registerTask('default', ['concat','uglify','cssmin','copy']);
	

};