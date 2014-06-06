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
    var path        = require('path');



    grunt.registerMultiTask( 'xml2pot', 'Convert your XML files with key/value pairs to a POT file', function(  )
    {
        // Merge task-specific and/or target-specific options with these defaults.
        var options             = this.options(
            {
                punctuation: '.',
                separator: ', '
            } )
        ,   separatePotFiles    = this.data.options && this.data.options.separatePotfiles ? this.data.options.separatePotfiles : false
        ;

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
                ,   context = "__global"
                ;

                grunt.log.writeln( chalk.cyan( "Processing file ") + path.resolve( filepath) );
                //sourceList[ "<%source%>-" + idx ] = filepath;

                // now get the content of each source file
                //
                xml         = grunt.file.read( filepath) ;

                // convert the source from XML to JSON
                //
                src         = parser.toJson( xml,
                {
                    object:             true
                ,   arrayNotation:      false
                ,   sanitize:           false
                } );


                root        = src.i18n ? "i18n" : ( src.I18N ? "I18N" : null );

                if ( !root )
                {
                    return true; // this file doesn't have any labels defined, so skip iteration
                }

                // if this XML file has a context defined, create a new context object in the sourceList, otherwise default to __global
                //
                context     = src[root].context ? src[root].context : context;
                if ( !sourceList[ context ] )
                {
                    sourceList[ context ] = {};

                }
                // add a current source file entry to the context object so that we can report in pot file wheree the following element came from
                //
                sourceList[ context ][ "<%source%>-" + idx ] = filepath;

                // little hack because our xml parser doesnt return an array object of labels when there is only one element in the xml file
                //
                if ( grunt.util.kindOf( src[ root ].label ) === "object" )
                {
                    temp                = src[ root ].label;
                    src[ root ].label   = [];
                    src[ root ].label.push( temp );
                }

                if ( root && src[ root ].label && src[ root ].label.length )
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

                        if ( !sourceList[ context ][ el.key ] )
                        {
                            sourceList[ context ][ el.key ] = el.$t;
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
                _createPotFile( f.dest, sourceList, separatePotFiles );
            }
            else
            {
                 grunt.log.writeln( chalk.red( "No text elements found." ) + " Pot file not written." );
            }

        } ); // end this.files loop
    } );


    function _createPotFile( filepath, elements, seperate )
    {
        var content     = ""
        ,   head
        ,   key
        ,   context
        ,   cntxtEl
        ,   fileLocation
        ,   file
        ;


        // get the head for the POT file
        //
        head            = grunt.file.read( "node_modules/grunt-xml2pot/templates/head.txt") ;
        head            = head.replace( "%potCreationDate%", getDate() );



        // iterate the contexts objects. In case user wants seperate files per context, we will create a new file in each iteration
        //
        for ( context in elements )
        {
            if ( elements.hasOwnProperty( context ) )
            {
                cntxtEl = elements[ context ];

                for( key in cntxtEl )
                {
                    if ( cntxtEl.hasOwnProperty( key ) )
                    {

                        if ( key.search( /<%source%>/) === 0 )
                        {
                            content += "\n\n";
                            content += "#: text from " + path.resolve( cntxtEl[ key ] );
                        }
                        else
                        {
                            content += "\n\n";
                            if ( context !== "__global" )
                            {
                                content += "msgctxt \"" + context + "\"" + "\n\r";
                            }
                            content += "msgid \"" + cntxtEl[ key ] + "\"" + "\n\r";
                            content += "msgstr \"\"";

                        }
                    }
                }
            }
            // we are creating seperate files per context, so at the end of this current context iteration we write the file
            //
            if ( seperate )
            {
                // define filelocation for our seperate files
                //
                fileLocation = filepath.replace( /\/[^/]*$/, "" );

                // Write the destination file.
                //
                file = fileLocation + "/" + context + ".pot";
                grunt.file.write( file, head + content );
                grunt.log.writeln( "\n" + chalk.green( file + " written." ) );
                // clear context for next iteration
                //
                content = "";
            }
        }


        if ( !seperate )
        {
            // Write the destination file.
            //
            grunt.file.write( filepath, head + content );
            grunt.log.writeln( "\n" + chalk.green( filepath + " written." ) );
        }

    }

    function getDate()
    {
        var now = new Date()
        ,   result
        ,   offset
        ,   paddedOfset
        ;
        result          = grunt.template.date( now, "yyyy-mm-dd hh:MM" );
        offset          = now.getTimezoneOffset() / 0.6;

        paddedOfset     = -offset < 1000 ? "0" + offset : offset;
        offset          = offset < 0 ? "+" + -( paddedOfset ) : "-" + ( paddedOfset );
        result          += offset;

        return result;
    }
};
