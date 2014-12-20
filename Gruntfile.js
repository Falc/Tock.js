module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    app: {
      name: 'Tock.js',
      version: '<%= pkg.version %>',
      license: '<%= pkg.license %>',
      homepage: '<%= pkg.homepage %>',
      files: {
        gruntfile: ['Gruntfile.js'],
        js: ['tock.js']
      },
      targets: {
        gruntfile: [{
          src: '<%= app.files.gruntfile %>'
        }],
        main: [{
          expand: true,
          src: '<%= app.files.js %>',
          ext: '.min.js',
          extDot: 'last'
        }]
      }
    },
    jshint: {
      options: {
        'camelcase': true,
        'curly': true,
        'eqeqeq': true,
        'newcap': true,
        'undef': true,
        'unused': true
      },
      gruntfile: {
        files: '<%= app.targets.gruntfile %>',
        options: {
          'predef': [
            'module'
          ]
        }
      },
      main: {
        files: '<%= app.targets.main %>',
        options: {
          'browser': true,
          'devel': true,
          'predef': [
            'define',
            'module',
            'require'
          ]
        }
      }
    },
    jscs: {
      options: {
        'disallowSpacesInNamedFunctionExpression': {
          'beforeOpeningRoundBrace': true
        },
        'disallowSpacesInFunctionExpression': {
          'beforeOpeningRoundBrace': true
        },
        'disallowSpacesInAnonymousFunctionExpression': {
          'beforeOpeningRoundBrace': true
        },
        'disallowSpacesInFunctionDeclaration': {
          'beforeOpeningRoundBrace': true
        },
        'disallowSpaceBeforeBinaryOperators': [
          ','
        ],
        'requireSpaceBeforeBinaryOperators': true,
        'requireSpaceAfterBinaryOperators': true,
        'requireCamelCaseOrUpperCaseIdentifiers': true,
        'requireCapitalizedConstructors': true,
        'disallowMixedSpacesAndTabs': true,
        'disallowTrailingWhitespace': true,
        'disallowTrailingComma': true,
        'disallowSpaceAfterPrefixUnaryOperators': true,
        'disallowSpaceBeforePostfixUnaryOperators': true,
        'disallowSpacesInsideArrayBrackets': true,
        'disallowSpacesInsideParentheses': true,
        'requireSpaceAfterKeywords': [
          'if',
          'else',
          'for',
          'while',
          'do',
          'switch',
          'case',
          'return',
          'try',
          'catch',
          'typeof'
        ],
        'validateIndentation': 2,
        'validateLineBreaks': 'LF',
        'validateQuoteMarks': true
      },
      gruntfile: {
        files: '<%= app.targets.gruntfile %>'
      },
      main: {
        files: '<%= app.targets.main %>'
      }
    },
    uglify: {
      options: {
        banner: '// <%= app.name %> (version <%= app.version %>) <%= app.homepage %>\n// License: <%= app.license %>\n',
        compress: {
          comparisons: false
        }
      },
      main: {
        files: '<%= app.targets.main %>'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= app.files.gruntfile %>',
        tasks: ['check:gruntfile', 'build']
      },
      main: {
        files: '<%= app.files.js %>',
        tasks: ['build:main']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('check:gruntfile', ['jshint:gruntfile', 'jscs:gruntfile']);
  grunt.registerTask('check:main', ['jshint:main', 'jscs:main']);
  grunt.registerTask('check', ['check:gruntfile', 'check:main']);

  grunt.registerTask('build:main', ['check:main', 'uglify:main']);
  grunt.registerTask('build', ['build:main']);

  grunt.registerTask('default', ['check:gruntfile', 'build']);
};
