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
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks


    var parser      = require('xml2json');
    var chalk       = require('chalk');


    grunt.registerMultiTask( 'xml2pot', 'Convert your XML files with key/value pairs to a POT file', function()
    {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options(
        {
            punctuation: '.',
            separator: ', '
        } );

        var sourceList = {};

        // Iterate over all specified file groups.
        this.files.forEach( function( f )
        {
            // loop through all the source files
            f.src.map( function( filepath )
            {
                var xml
                ,   src
                ,   elements
                ;

                grunt.log.writeln( chalk.cyan( "Processing file ") + filepath );

                // now get the content of each source file
                //
                xml     = grunt.file.read( filepath) ;
                src  = parser.toJson( xml,
                {
                    object:             true
                ,   arrayNotation:      false
                ,   sanitize:           false
                } );

                if ( src.i18n && src.i18n.label && src.i18n.label.length )
                {
                    elements = src.i18n.label;

                    elements.forEach( function( el, ix )
                    {
                        // if value or textlabel ($t) are missing, skip this element
                        //
                        if ( !el.value || !el.$t )
                        {
                            //warn user of duplicate
                            //
                            grunt.log.writeln( chalk.red( "Incomplete entry found" ) + " with {key}/{label} value {" +el.value + "}/{" + el.$t  + "}" );
                            return true;
                        }
                        // if element doesnt exist already, add it to the list
                        //
                        if ( !sourceList[ el.value ] )
                        {
                            sourceList[ el.value ] = el.$t
                        }
                        else
                        {
                            //warn user of duplicate
                            //
                            grunt.log.writeln( chalk.red( "Duplicate" ) + " entry found for '" + chalk.cyan(el.value) + "' in file " + chalk.green( filepath ) + ". This entry will be ignored" );
                        }
                    } );
                }


                //console.log(data);

             }); // end file loop

    // crete our pot file!
    console.log(sourceList);



// var parser = new xml2js.Parser();
// fs.readFile(__dirname + '/foo.xml', function(err, data) {
//     parser.parseString(data, function (err, result) {
//         console.dir(result);
//         console.log('Done');
//     });
// });

            //grunt.log.writeflags( f);
            // var src = f.src.map( function( filepath )
            // {
            //  grunt.log.writeflags( filepath );

            //  } );
            //grunt.log.writeflags( f );
        } );
    } );

};
