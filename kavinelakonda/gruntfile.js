module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    coffee: {
      build: {
        files: [
          {
            'javascripts/main.js': ['javascripts/*.coffee']
          }]
      }
    },
    connect: {
      server: {
       options: {
         base: '',
         keepalive: false
       }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: ['javascripts/*.coffee', '*.html'],
        tasks: ['coffee'],
        options: {
          spawn: false
        }
      }
    },
    usebanner: {
      build: {
        src: ["javascripts/main.js"],
        options: {
          banner: ''
        }
      }
    }

  });
  grunt.registerTask('dev', ['connect', 'watch'])
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['coffee', 'usebanner', 'connect', 'watch'])
};                            
