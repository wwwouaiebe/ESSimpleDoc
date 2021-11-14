# ESSimpleDoc

Recently private fields were coming in Firefox. They were already in Chrome browsers and Node,
so it's was time to migrate my code, replacing all closures in the code by real classes with
private and public fields. But when I have generated the documentation, I was disappointed
because the ```#``` was not recognized and a lot of things missing in the docs...

So I have quickly build ESSimpleDoc to have a correct documentation.

## What is ESSimpleDoc and what is not...

ES is there for EcmaScript. So it's not TypeScript, jsx or what you will...

Simple because my code structure is simple: only EcmaScript modules (not CommonJS modules!) and only
classes declarations and variables declarations in the code

## How to document the code

Because my old code was documented with JSDoc tags, I have keeped this, but only on a limited set of tags.

Each class, class property, class method or global variable that you document must have a leading comment block
starting with ```/**``` and finishing with ```*/```

All the text between the ```/**``` and the first @ char is considered as the description of the class, 
method, property or variable.

### @desc and @classdesc tags

These tags can also be used to give the description of the class, method, property or variable. All the text
between the tag and the next @ char will be considered as a description.

### @type tag

This tag is used to document the type of a property or a variable. The tag must be followed by a
type description between {&nbsp;}. All the text following the {&nbsp;} will be ignored.

### @return and @returns tags

These tags are used to document the return value of a method. The tag must be followed by a
type description between {&nbsp;}. All the text following the {&nbsp;} is considered as a description
of the return.

### @param tag

This tag is used to document a parameter of a method. The tag must be followed by a
type description between {&nbsp;} and the parameter name, exactly as it is in the code. All the text following the 
parameter name is considered as a description of the parameter.

### @ignore tag
When this tag is present, the class, method property or variable will not be added to the documentation.

### @sample tag
This tag is used to document a sample. All the text following the tag will be considered as a sample and
added after the description in the documentation.

### How to document the type

The types of the properties, variables, parameters and returns have to be documented between {&nbsp;}. Only
JS script types, JS built-in objects and classes declared in your code are considered as valid types.

Arrays, Map and others containers can be follwed by a . folowed by the type of the contained objects 
betwwen &lt; &gt;> so the complete type of an array of strings is {Array.&lt;String&gt;>}.

You can also add a ? before to type when the property, variable, type or param can be nullable.

### How to document descriptions

You can use Markdown and html tags to document the classes, methods, properties, variables, returns and param descriptions.

See [Github](https://docs.github.com/en/github/writing-on-github) or [Marked](https://marked.js.org/) for
more about Markdown.

### How to document getter and setter

Getters and setters are considered as properties and so you have:
- to document the getter
- to document the setter **only** when the getter is not present
- you have to add a @type tag
- you don't have to add a @param tag for the setters
- you don't have to add a @return tag to the getters

### Unnecessary tags

ESSimpleDoc uses [@babel/parser](https://babeljs.io/docs/en/babel-parser)  to parse the code and then some tags are unnecessary.

Names are always extracted by the parser. But for params, you have always to add the param name in the
@param tags, so ESSimpleDoc can do the link between the code and the documentation.

Private or public fields are detected by the parser, so the @private and @public tags are ignored.

Static methods and properties are detected by the parser so the @static tag is ignored.

Async methods are detected by the parser so the @async tag is ignored.

The super class is detected by the parser so the @extends tag is ignored.

ESSimpleDoc add a link to the class or variable documentation when the class or variable
name is found in the description, so the @link tag is also ignored. And you can always use markdown 
to add a link in the documentation.

### How to document the home page

When ESSimpleDoc find a file named index.md in the src directory, this file is added to the home page.

## Validation of the documentation

When ESSimpleDoc runs with the --validate parameter, some verifications are done on the documentation
and errors and warnings displayed.

### 'Duplicate class name' warning

Sorry... it's a limitation of ESSimpleDoc. You cannot have duplicate class names, or it's impossible
to create a link to the class documentation...

### 'Missing description' error

No description found for a class, method, property or variable. Add a description

### 'Unknown type' warning

A type is unknown. Verify that the type is correct. If you are using external libraries, you can add types
to the #mdnLinks property of the LinkBuilder class. Yes, I aggree, that will be better in a config file...

### 'Constructor with @return tag' error

JS constructors cannot have a return. Remove the return in the code and the documentation

### 'Missing @type tag for getter' error

Getters are documented as properties. Add a @type tag.

### 'Getter with @return tag' warning

Getters are documented as properties. Remove the @return tag

### 'Mismatch between the @param tags and parameters in the code' error

Same names are not used for the params in the code and the documentation or you have not 
the same number of params in the code and the documentation.

### 'Missing @type for property' error

A @type tag is needed for a property. Add the tag.

### 'Property with @param tag' warning

A property cannot have a @param tag. Remove the tag.

### 'Property with @return tag' warning

A property cannot have a @return tag. Remove the tag.

### 'Missing description for @return tag' error

A description is missing for a @return tag. Add a description

### 'Missing type for @return tag' error

A type is missing for a @return tag. Add a type

### 'Setter with @return tag' warning

Setters are documented as properties. Remove the @return tag

### 'Setter with @type tag' warning

Setter cannot have a @type tag. Remove the @type tag

### 'Getter and Setter have documentation' error

Getters and setters are documented as properties and only one documentation have to be done. Remove
the documentation for the setter.

### 'Setter don\'t have getter and don\'t have description' error

A setter don't have the corresponding getter **and** don't have documentation.
Add a documentation for the setter.

## Parameters

### --src parameter

The parameter must be followed by an = and the path where the source files are.

The path can be an absolute path or a relative path to the current working directory

### --dest parameter

The parameter must be followed by an = and the path where the documentation files will be placed. 

The path can be an absolute path or a relative path to the current working directory.

If your source directory have subdirectories, the same directories structure will be created in
the dest directory.

**Warning**. The dest directory will be completely erased when ESSimpleDoc start to avoid to have orphan
files in the directory. Never place important files in that directory.

### --validate parameter

When present, the documentation is validated

### --launch parameter

When present the home page of the documentation is directly opened in the browser.

### --noSourcesColor

By default, ESSimpleDoc show some JS keywords colored in the html version of source files added to the documentation. 
Also, links to the classes and variables are added in the html version of sources files added to the documentation.

When the --noSourcesColor parameter is present, JS keywords are not colored and links not added.

### Samples of call to ESSimpleDoc from Node

```
node ./PathToEsSimpleDoc/index.js --src=./PathToTheSourceFiles --dest=./PathToTheHtmlFiles --validate --launch
```

If you have installed ESSimpleDoc globally you can also do this:

```
esd --src=./PathToTheSourceFiles --dest=./PathToTheHtmlFiles --validate --launch
```

### Using Grunt

See the Grunt-ESSimpleDoc on [Github](https://github.com/wwwouaiebe/Grunt-ESSimpleDoc) or [NPM](https://www.npmjs.com/package/grunt-essimpledoc).

## View or hide the private methods and properties.

By default, private methods and properties are hidden in the HTML classes files.
You need to click on the **✔️#** to show and on the **❌#** to hide

## Samples

Of course ESSimpleDoc is self documented. You can see the documentation on the
[github page](https://wwwouaiebe.github.io/ESSimpleDoc/) of ESSimpleDoc

## Known limitations

### duplicate classes names

No really... it's impossible to create the links  to the classes...

### default parameters

When a parameter of a method have a default value, you will always receive 
a 'Mismatch between the @param tags and parameters in the code' error.

### Source files extension

Source files extension must be .js and not mjs

### Download and install

The best solution is to use npm directly from Node:

```
npm install essimpledoc --save-dev
```

But you can also download from [Github](https://github.com/wwwouaiebe/ESSimpleDoc#readme).

### And also...

ESSimpleDoc was build for my needs... So only the documentation for classes and variables declarations
in ES modules is build.

## Bugs and modifications

You know surely JS as me. So if you find a bug or need a modification:
1. You fork the repository
2. You do the correction / modification
3. If your modifications are usefull for others users, create a pull request

## Thanks to...

- [eslint](https://eslint.org/) for the verification of the code
- [@babel/parser](https://babeljs.io/docs/en/babel-parser) for parsing the files
- [Marked](https://marked.js.org/) for parsing the markdown in the descriptions
