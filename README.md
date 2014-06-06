# grunt-xml2pot

> Convert your XML files with key/label pairs to separate or multiple POT file(s). This will enable you to load MO files which you can run parallel with a function that fetches the key/value pairs and mold it into an array for your wp_localize_script in WordPress.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-xml2pot --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-xml2pot');
```

## The "xml2pot" task

### Overview
In your project's Gruntfile, add a section named `xml2pot` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    xml2pot:
    {
        dist:
        {
           src:
            [
                'node_modules/grunt-xml2pot/test/*/i18n.xml'
            ,   '118n.xml'
            ]
        ,   dest: 'plugin.pot'
        ,   options:
            {
                separatePotfiles: false
            }
        }
    },
});
```

### Options
#### separatePotFiles (true/false)
This option will allow you to channel all the xml output into one, or multiple (context named) pot files

#### Multiple file groups
You can duplicate the dist block for another collection of files, with a unique name.



### Usage Examples

#### Default Options
The example setup works together with the structure in the TEST folder. There are several i18n files located in the main folder and subdirectories.
They will be merged in one pot file and written to the location set in the 'dest' parameter (separatePotFiles is set to FALSE).

The i18n.xml file in the folder '/test' plays a general role in this example. It does not have a context so all entries will be placed in the global context. The xml files in the sub directories (person and survey) do have a context defined and will have the 'msgctxt' context entry added for each translation item.

If you don't use the option separatePotFiles, all entries will be placed in one POT file including he contexts (if defined).
If you DO use separatePotFiles, then each context will get it's own POT file. For this example this would result in a __global.pot, a user.pot and customer.pot file (notice the context name is NOT based on the directory name but on the i18n context value )

Any duplication within a context of a label KEY is not allowed, so a second occurence of an item will be ignored (but reported).
This is because the keys will be used as unique key/value pair for your wp_localize_script function.

An i18n XML file needs to have to following structure:
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<i18n context="user">
    <label key="iconClose">Close</label>
    <label key="male">Male</label>
    <label key="female">Female</label>
</i18n>
```
The i18n root element can have a context attribute which will be used to set the translation context (msgctxt) for use with the _x() functions. If you do not use the context attribute, then all entries will be collected into a global context.

The 'key' attribute will be converted to a Javascript key, so refrain from using to wild characters, I would stick to '-,_,a-z,A-Z,0-9'. Other characters shouldn't be a problem because during the conversion I access the colletion with the key using 'words[ key ]'.

Xml2Pot allows the use of the root tag as 'i18n' or 'I18N'. Don't do <i18N></I18n> etc..Javascript is case sensitive and the xml parser I use doesn't support to lower case the XML tags will parsing.


```js
grunt.initConfig({
    xml2pot:
    {
        dist:
        {
           src:
            [
                'node_modules/grunt-xml2pot/test/*/i18n.xml'
            ,   '118n.xml'
            ]
        ,   dest: 'plugin.pot'
        ,   options:
            {
                separatePotfiles: false
            }
        }
    },
});
```

#### Custom Options
The templates folder holds the head of the pot file that is used. It is a card blanch because I expect you to use POEDIT to fill in the gaps and save your PO files based on this POT file.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
Version 0.1.0 Initial

Version 0.1.1 ~ 0.1.6 ....refining concept

Version 0.1.7 Added separate Potfiles and context

Version 0.1.8 Changed readme

Version 0.1.9 Changed readme

Version 0.2.0 fixed error on empty Xml file with only root i18n element but no labels

