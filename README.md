# SimpleESDoc

Coming soon...

### Using Grunt

The Gruntfile.js is a commonJS module file, but the package.json specifies that modules are ES modules, so grunt crash when starting. 
To fix this, I have renamed the Gruntfile.js to Gruntfile.cjs and then you have two possibilities to launch grunt:
- you specify the file in the grunt options when lauching grunt : grunt --gruntfile=Gruntfile.cjs
- or you modify the node_modules\grunt\lib\grunt\task.js file, adding the cjs extension to the list of extensions at lines 348 and 437. This
modification is the best solution and will be applied in a future release of grunt. See [https://github.com/gruntjs/grunt/pull/1736](https://github.com/gruntjs/grunt/pull/1736)
