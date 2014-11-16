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
          'devel': true,
          'eqeqeq': true,
          'exported': ['Tock'],
          'newcap': true,
          'quotmark': 'single',
          'undef': true,
          'unused': true
        }
      }
    },
    jscs: {
      main: {
        src: '<%= jshint.main.src %>',
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
          'validateQuoteMarks': "'"
        }
      }
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
        tasks: ['jshint:main', 'jscs:main', 'uglify:main']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('default', ['jshint', 'jscs', 'uglify']);
};
