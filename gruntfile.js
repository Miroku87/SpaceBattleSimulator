var
	SERVER_PORT     = 9000,
	LIVERELOAD_PORT = 35729;
  
module.exports = function (grunt)
{
	require("matchdep").filterDev("grunt-*").forEach( grunt.loadNpmTasks );
	
	grunt.initConfig(
	{
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			dev: {
				options: {
					hostname: 'localhost',
					port: SERVER_PORT,
					open: true,
					livereload: LIVERELOAD_PORT,
					//keepalive: true,
					base: {
						path: './dist',
						options: {
							index: 'index.html',
							maxAge: 300000
						}
					}
				}
			}
		},
		copy: {
			dev: {
				files : [
					{ src : [ '**' ], cwd: './app', expand : true, dest : './dist/', nonull: true },
					{ src : [ '**', '!loaders' ], cwd: './lib', dest : './dist/js/', expand : true, nonull: true },
					{ src : [ 'ColladaLoader.js' ], cwd: './lib/loaders', dest : './dist/js/threejs', expand : true, nonull: true },
					{ src : [ '**' ], cwd: './assets', dest : './dist/assets/', expand : true, nonull: true },
					{ src : [ '*.min.*' ], cwd: './node_modules/bootstrap/dist/js', dest : './dist/js/bootstrap/', expand : true, nonull: true },
					{ src : [ '*.min.*' ], cwd: './node_modules/bootstrap/dist/css', dest : './dist/styles/', expand : true, nonull: true },
					{ src : [ '*.min.*' ], cwd: './node_modules/tether/dist/js', dest : './dist/js/bootstrap/', expand : true, nonull: true }
				]				
			}
		},
		clean : {
			dev : {
				src : [ './dist' ]
			}
		},
		watch: {
			dev: {
				files : [ './app/**/**' ],
				tasks: [],
				options: {
					livereload: {
						host: 'localhost'
					},
					nospawn: false
				}
			}
		}
	});
	
	grunt.event.on('watch', function(action, filepath, target) 
	{
		var dest = require( 'path' ).join( './dist', filepath.replace( /app[\/\\]+/, "" ) );
		
		if( action === "changed" && target === "dev" )
		{
			grunt.file.copy( filepath, dest );
			grunt.log.writeln( ">> "+filepath+" has been copied to "+dest );
		}
	});
	
	grunt.registerTask( 'default', [ 'clean:dev', 'copy:dev', 'connect:dev', 'watch:dev' ] );
};