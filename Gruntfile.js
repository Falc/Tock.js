module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    app: {
      name:     'Tock.js',
      version:  '<%= pkg.version %>',
      license:  '<%= pkg.license %>',
      homepage: '<%= pkg.homepage %>',
      paths: {
        src:  'src',
        dist: 'dist'
      },
      files: {
        gruntfile: ['Gruntfile.js'],
        js:        ['tock.js']
      }
    },
    jshint: {
      options: {
        camelcase:  true,
        curly:      true,
        eqeqeq:     true,
        jquery:     true,
        newcap:     true,
        undef:      true,
        unused:     true,
        validthis:  true
      },
      gruntfile: {
        options: {
          predef: [
            'module'
          ]
        },
        src: '<%= app.files.gruntfile %>'
      },
      js: {
        options: {
          browser: true,
          devel:   true,
          predef:  [
            'define',
            'module',
            'require'
          ]
        },
        src: '<%= app.paths.src %>/<%= app.files.js %>'
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
        options: {
          'requireCamelCaseOrUpperCaseIdentifiers': 'ignoreProperties'
        },
        src: '<%= app.files.gruntfile %>'
      },
      js: {
        src: '<%= app.paths.src %>/<%= app.files.js %>'
      }
    },
    umd: {
      js: {
        src:            '<%= app.paths.src %>/<%= app.files.js %>',
        dest:           '<%= app.paths.dist %>/<%= app.files.js %>',
        amdModuleId:    '<%= pkg.name %>',  // AMD
        objectToExport: '<%= app.name %>',  // CommonJS
        globalAlias:    '<%= app.name %>',  // Global
        deps:           {}
      }
    },
    uglify: {
      options: {
        banner: '// <%= app.name %> (version <%= app.version %>) <%= app.homepage %>\n// License: <%= app.license %>\n',
        compress: {
          comparisons: false
        }
      },
      js: {
        files: [{
          src:    '<%= umd.js.dest %>',
          ext:    '.min.js',
          expand: true
        }]
      }
    },
    watch: {
      gruntfile: {
        files: '<%= app.files.gruntfile %>',
        tasks: ['check:gruntfile', 'build']
      },
      js: {
        options: {
          cwd: '<%= app.paths.src %>'
        },
        files: '<%= app.files.js %>',
        tasks: ['build:js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-umd');

  grunt.registerTask('check:gruntfile', ['jshint:gruntfile', 'jscs:gruntfile']);
  grunt.registerTask('check:js', ['jshint:js', 'jscs:js']);
  grunt.registerTask('check', ['check:gruntfile', 'check:js']);

  grunt.registerTask('build:js', ['check:js', 'umd:js', 'uglify:js']);
  grunt.registerTask('build', ['build:js']);

  grunt.registerTask('default', ['check:gruntfile', 'build']);
};
