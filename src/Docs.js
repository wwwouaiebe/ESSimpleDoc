/**
Base class with properties needed to build the html files for classes/methods/properties/variables
*/

class VariableDoc {

	/**
	The name found in ast
	@type {?String}
	*/

	name = null;

	/**
	The path between the html file and theConfig.docDir ( something like '../../../', depending of the folders tree )
	@type {?String}
	*/

	rootPath = null;

	/**
	The file name in witch the class/method/property/variable is declared, including path since theConfig.docDir
	@type {?String}
	*/

	file = null;

	/**
	The line at witch the class/method/property/variable is declared - found in ast
	@type {?String}
	*/

	line = null;

	/**
	The doc found in the comments of the class/method/property/variable
	@type {?CommentsDoc}
	*/

	commentsDoc = null;

	/**
	The constructor. Seal the object, so it's not possible to add new properties to the object
	*/

	constructor ( ) { }

}

/**
A class with properties needed to build the html files for methods/properties
*/

class MethodOrPropertyDoc extends VariableDoc {

	/**
	A flag indicating that the method or property is static - found in ast
	@type {?boolean}
	*/

	static = null;

	/**
	A flag indicating that the method is async
	@type {?boolean}
	*/

	async = null;

	/**
	A flag indicating that the method or property is private - found in ast
	@type {?boolean}
	*/

	private = null;

	/**
	The kind of method ( = 'get', 'set' or 'constructor' ) - found in ast
	@type {?String}
	*/

	kind = null;

	/**
	The type ( = 'method' or 'property' ) - found in ast
	@type {?String}
	*/

	isA = null;

	/**
	The params names found in ast
	@type {?Array.<String>}
	*/

	params = null;
}

/**
A class with properties needed to build the html files for classes
*/

class ClassDoc extends VariableDoc {

	/**
	The super class name
	@type {?String}
	*/

	superClass = null;

	/**
	The methods and properties of the class
	@type {?Array.<methodOrPropertyDoc>}
	*/

	methodsAndProperties = null;

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}
}

/**
A class with properties to document params and returns
*/

class TypeDescription {

	/**
	The name of the param
	@type {String}
	*/

	name = '';

	/**
	The type of the param or return
	@type {?String}
	*/

	type = '';

	/**
	The description of the param or return
	@type {?String}
	*/

	desc = '';

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

}

/**
A class with properties found in the comments and needed to build the html files for
classes/methods/properties/variables
*/

class CommentsDoc {

	/**
	The description of the commented class/method/property/variable
	@type {?String}
	*/

	desc = null;

	/**
	The type of the commented variable
	@type {?String}
	*/

	type = null;

	/**
	The params of the commented method
	@type {?Array.<>}
	*/

	params = null;

	/**
	The returns type of the commented method
	@type {TypeDescription}
	*/

	returns = null;

	/**
	A flag indicating that the class/method/property/variable have to be ignored
	@type {Boolean}
	*/

	ignore = null;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

}

export { VariableDoc, MethodOrPropertyDoc, ClassDoc, TypeDescription, CommentsDoc };