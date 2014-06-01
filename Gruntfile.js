/*
 * grunt-xml2pot
 * https://github.com/mattiLeBlanc/xml2pot
 *
 * Copyright (c) 2014 Mattijs Spierings
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt)
{

    // Project configuration.
    grunt.initConfig(
    {

        // Configuration to be run (and then tested).
        xml2pot:
        {
            dist:
            {
               src:
                [
                    'test/*/i18n.xml'
                ,   '118n.xml'
                ]
            ,   dest: 'plugin.pot'
            }
        }

    } );

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // By default, lint and run all tests.
  grunt.registerTask('default', [ 'xml2pot'] );

};
