/**
A simple container to store the line, column and html tag value to insert in the source file
for comments, string literals, template literals and regexp literals
*/

class TagData {

	/**
	The line number in the source file where the tag must be inserted
	@type {Number}
	*/

	#line;

	/**
	The column number in the source file where the tag must be inserted
	@type {?Number}
	*/

	#column;

	/**
	The tag to insert.
	@type {String}
	*/

	#tag;

	/**
	The constructor
	@param {Number} line The line number in the source file where the tag must be inserted
	@param {?Number} column The column number in the source file where the tag must be inserted
	@param {String} tag The tag to insert.
	*/

	constructor ( line, column, tag ) {
		Object.freeze ( this );
		this.#line = line;
		this.#column = column;
		this.#tag = tag;
	}

	/**
	The line number in the source file where the tag must be inserted
	@type {Number}
	*/

	get line ( ) { return this.#line; }

	/**
	The column number in the source file where the tag must be inserted
	If the tag must be inserted at the end of the line the value is null
	@type {?Number}
	*/

	get column ( ) { return this.#column; }

	/**
	The tag to insert.
	To avoid  a replacement of the < ,> and " chars when creating the source html file
	the < char is replaced with §lt§, the > char with §gt§ and the " char with §quot§ and then
	replaced with the correct value inthe source html file.
	@type {String}
	*/

	get tag ( ) { return this.#tag; }
}

export default TagData;