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

  //  grunt.file.defaultEncoding = 'utf8';
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



        // Iterate over all specified file groups.
        this.files.forEach( function( f )
        {

            var sourceList = {};

            // loop through all the source files
            f.src.map( function( filepath , idx)
            {
                var xml
                ,   src
                ,   root
                ,   elements
                ,   temp
                ;

                grunt.log.writeln( chalk.cyan( "Processing file ") + filepath );
                sourceList[ "<%source%>-" + idx ] = filepath;
                // now get the content of each source file
                //
                xml         = grunt.file.read( filepath) ;

                src         = parser.toJson( xml,
                {
                    object:             true
                ,   arrayNotation:      false
                ,   sanitize:           false
                } );

                root = src.i18n ? "i18n" : ( src.I18N ? "I18N" : null );

                // little hack because our xml parser doesnt return an array object of labels when there is only one element in the xml file
                //
                if ( grunt.util.kindOf( src[ root ].label ) === "object" )
                {
                    temp                = src[ root ].label;
                    src[ root ].label   = [];
                    src[ root ].label.push( temp );
                }

                if ( root && src[ root ].label && src[  root ].label.length )
                {
                    elements = src[ root ].label;

                    elements.forEach( function( el )
                    {
                        // if value or textlabel ($t) are missing, skip this element
                        //
                        if ( !el.key || !el.$t )
                        {
                            //warn user of duplicate
                            //
                            grunt.log.writeln( chalk.red( "Incomplete entry found" ) + " with {key}/{label} value {" +el.key + "}/{" + el.$t  + "}" );
                            return true;
                        }
                        // if element doesnt exist already, add it to the list
                        //
                        if ( !sourceList[ el.key ] )
                        {
                            sourceList[ el.key ] = el.$t;
                        }
                        else
                        {
                            //warn user of duplicate
                            //
                            grunt.log.writeln( chalk.red( "Duplicate" ) + " entry found for '" + chalk.cyan(el.key) + "' in file " + chalk.green( filepath ) + ". This entry will be ignored" );
                        }
                    } );
                }
                else
                {
                    grunt.log.writeln( chalk.red( "No i18n or I18N root element found in file " ) + filepath );
                }


             }); // end file loop


            // create our pot file
            if ( sourceList )
            {
                _createPotFile( f.dest, sourceList );
            }
            else
            {
                 grunt.log.writeln( chalk.red( "No text elements found." ) + " Pot file not written." );
            }

        } ); // end this.files loop
    } );


    function _createPotFile( filepath, elements )
    {
        var content     = ""
        ,   head
        ,   key
        ;

        // get the head for the POT file
        //
        head            = grunt.file.read( "node_modules/grunt-xml2pot/templates/head.txt") ;
        content         += head ;


        // now create the text entries
        for( key in elements )
        {
            if ( elements.hasOwnProperty( key ) )
            {
                // add comment line to POT file
                //
                if ( key.search( /<%source%>/) === 0 )
                {
                    content += "\n\n";
                    content += "#: text from " + elements[ key ];
                }
                else
                {
                    content += "\n\n";
                    content += "msgid \"" + key + "\"" + "\n\r";
                    content += "msgstr \"\"";

                }
            }
        }
        // Write the destination file.
        //
        grunt.file.write( filepath, content );
        grunt.log.writeln( "\n" + chalk.green( filepath + " written." ) );
    }

};
