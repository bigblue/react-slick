'use strict';
module.exports = function(grunt) {
    grunt.initConfig({
        babel: {
            options: {
                modules: 'common'
            },
            production: {
                files: [{
                    expand: true,
                    cwd: './lib',
                    src: ['**/*.js', '**/*.jsx'],
                    dest: './dist/es5/'
                }]
            }
        },
        
    });
    // libs
    grunt.loadNpmTasks('grunt-babel');
};
