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
		gitadd: {
			task: {
				options: {
					force: true,
					all: true,
					cwd: 'MytProjectRepo/'
                }
            }
        },

        gitcommit: {
        	task: {
        		options: {
        			message: 'Repository updated on ' + grunt.template.today(),
        			allowEmpty: true,
        			cwd: 'MyGitProjectRepo/'
        		}
        	}
        },

        gitpush: {
        	task: {
        		options: {
        			remote: 'origin',
        			branch: 'master',
        			cwd: 'MyGitProjectRepo/'
        		}
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
					cwd:	'src',
					src:	['*.js','!*.min.js'],
					dest:	'dist',
					ext:	'.min.js',
					extDot:	'last'
				}]
			}
		}
	});

	// Load tasks
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-githooks');

	// Default task.
	grunt.registerTask('lint', [ 'eslint' ]);
	grunt.registerTask('git', ['gitadd','gitcommit','gitpush']);
	grunt.registerTask('pre-commit', [ 'test' ]);	
	grunt.registerTask('default', [ 'lint', 'mocha', 'uglify','git' ]);
	

};