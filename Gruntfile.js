module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    jshint: {
      grunt: {
        src: ['Gruntfile.js']
      },
      main: {
        src: ['tock.js'],
        options: {
          'browser': true,
          'camelcase': true,
          'curly': true,
          'eqeqeq': true,
          'indent': 2,
          'newcap': true,
          'quotmark': 'single',
          'unused': true
        }
      },
    },
    uglify: {
      options: {
        banner: '// Tock.js (version <%= pkg.version %>) <%= pkg.homepage %>\n// License: <%= pkg.license %>\n'
      },
      main: {
        src: '<%= jshint.main.src %>',
        dest: 'tock.min.js'
      }
    },
    watch: {
      main: {
        files: '<%= jshint.main.src %>',
        tasks: ['jshint:main', 'uglify:main']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'uglify']);
};
