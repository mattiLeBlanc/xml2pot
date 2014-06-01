# grunt-xml2pot

> Convert your XML files with key/label pairs to a POT file. This will enable you to create your MO file which you can run parallel with a proces that fetches the key/value pairs and mold it into an array for your wp_localize_script action.

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
        }
    },
});
```

### Options
There are currenty no options.
You can duplicate the dist block for another collection of files, with another name of course. That is about it for now.



### Usage Examples

#### Default Options
The example setup works together with the structure in the TEST folder. There are several i18n files located in the main folder and subdirectories.
There are being merged in one pot file set in the 'dest' parameter.

The separate i18n.xml file in the main folder has a general role. It holds textlabels used in all subdirectory apps. The xml files in the sub directory apps are specifically for those app.

Any duplication is not allowed, so a second occurence of a text value will be ignored (but reported)

An i18n XML file needs to have to following structure:
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<i18n>
    <label key="iconClose">Close</label>
    <label key="male">Male</label>
    <label key="female">Female</label>
</i18n>
```
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
