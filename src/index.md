# How works ESSimpleDoc

The entry point of the app is the [index.js file](indexjs.html). At this stage, we only call the loadApp ( ) method of the [AppLoader](AppLoader.html) class.

The Apploader.loadApp ( ) method:
- validate the parameters given by the user
- create a list of .js files found in the dest directory or subdirectories
- copy the css file to the dest directory
- and finally call the buildFiles ( ) method of the [DocBuilder](DocBuilder.html) class with the list of .js files

The DocBuilder.buildFiles ( ) method:
- parse the .js files with the @babel/parser
- extract from the ast node created by the @babel/parse the 'ClassDeclaration' and 'VariableDeclaration' nodes.
- from the ast nodes, build containers with the data needed for creating the html files, using the classes [ClassDocBuilder](ClassDocBuilder.html), [VariableDocBuilder](VariableDocBuilder.html) and [CommentsDocBuilder](CommentsDocBuilder.html).

Containers with data are instances of the classes [VariableDoc](VariableDoc.html), [MethodOrPropertyDoc](MethodOrPropertyDoc.html), [ClassDoc](ClassDoc.html), [TypeDescription](TypeDescription.html), and [CommentsDoc](CommentsDoc.html):
- VariableDoc is used to store the documentation extracted from 'VariableDeclaration' ast nodes
- ClassDoc is used to store the documentation extracted from 'ClassDeclaration' ast nodes. Each ClassDoc instance contains a collection of MethodOrPropertyDoc
- MethodOrPropertyDoc is used to store the documentation extracted from 'ClassPrivateProperty', 'ClassProperty', 'ClassPrivateMethod', and 'ClassMethod' ast node that are childs of the 'ClassDeclaration' node.
- CommentsDoc is used to store the documentation extracted from the leading comments of each ast node. Each VariableDoc, ClassDoc
and MethodOrPropertyDoc contains one CommentsDoc.
- TypeDescription is a container used to store types found in the @type, @return and @param tags of the the leading comments.

When all the doc containers are created, the documentation is controlled (when the --validate parameter is present ), using the [DocsValidator](DocsValidator.html) class.

And finally, the html files are created from the doc containers:
- for the classes by the [ClassHtmlBuilder](ClassHtmlBuilder.html)
- for the variables by the [VariablesHtmlBuilder](VariablesHtmlBuilder.html)
- for the sources by the [SourceHtmlBuilder](SourceHtmlBuilder.html)
- and for the home page by the [IndexHtmlBuilder](IndexHtmlBuilder.html)

The [NavHtmlBuilder](NavHtmlBuilder.html) class is responsible of the creation of the &lt;nav&gt; html tag present in all the html pages

The global object [theLinkBuilder](variables.html#theLinkBuilder) is a container for all the html links created.

The global object [theConfig](variables.html#theConfig) is a container for the program's configuration.

The [FileWriter](FileWriter.html) class is a simple helper class to write files.