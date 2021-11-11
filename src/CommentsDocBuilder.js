/*
Copyright - 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
/*
Changes:
	- v1.0.0:
		- created
Doc reviewed 20211111
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import { TypeDescription, CommentsDoc } from './Docs.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Build a CommentsDoc object from the leading comments of a class, method, property or variable
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class CommentsDocBuilder {

	/**
	The currently builded comments
	@type {CommentsDoc}
	*/

	#commentsDoc;

	/**
	A RegExp to find the &#64;desc, &#64;classdesc, &#64;sample,&#64;type, &#64;param,
	&#64;return, &#64;returns, &#64;ignore tags
	@type {RegExp}
	*/

	#tagRegExp;

	/**
	A RegExp to find space or new line at the beginning of the string
	@type {RegExp}
	*/

	#beginSpaceNewlineRegExp;

	/**
	A RegExp to find space or new line in the string
	@type {RegExp}
	*/

	#spaceNewlineRegExp;

	/**
	A RegExp to find space or new line at the end of the string
	@type {RegExp}
	*/

	#endSpaceNewlineRegExp;

	/**
	A RegExp to find multiple spaces
	@type {RegExp}
	*/

	#multipleSpacesRegExp;

	/**
	A RegExp to find multiple spaces + newline +multiple spaces
	@type {RegExp}
	*/

	#spaceNewlineSpaceRegExp;

	/**
	A RegExp to find a new line at the beginning of the string
	@type {RegExp}
	*/

	#beginNewLineRegExp;

	/**
	A RegExp to find a type in the string ( a string starting with { and ending with }
	@type {RegExp}
	*/

	#typeRegExp;

	/**
	A RegExp to find a name the string ( the first word with only chars and numbers
	@type {RegExp}
	*/

	#nameRegExp;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#tagRegExp = RegExp ( '@[a-z]*' );
		this.#beginSpaceNewlineRegExp = RegExp ( '^[ |\\n]' );
		this.#spaceNewlineRegExp = RegExp ( '[ |\\n]' );
		this.#endSpaceNewlineRegExp = RegExp ( '[ |\\n]$' );
		this.#multipleSpacesRegExp = RegExp ( '[ ]+', 'g' );
		this.#spaceNewlineSpaceRegExp = RegExp ( '[ ]*[\\n][ ]*', 'g' );
		this.#beginNewLineRegExp = RegExp ( '^\\n' );
		this.#typeRegExp = RegExp ( '{.*}' );
		this.#nameRegExp = RegExp ( '^[a-zA-Z0-9]*' );
	}

	/**
	Set to uppercase the first letter of a text
	@param {String} text The text to capitalize
	@return {String} The capitalized text
	*/

	#capitalizeFirstLetter ( text ) {

		switch ( text.toLowerCase ( ) ) {
		case '' :
			return text;
		case 'null' :
			return 'null';
		default :
			return text [ 0 ].toUpperCase ( ) + text.substring ( 1 );
		}
	}

	/**
	Parse a type tag ( the value into {} for a type, param, return or returns tags.
	Remove the { } < > ! and space chars from the type, replace the . char with ' of ',
	replace the ? char with 'null or ', replace the | char with ' or ' and finally capitalize the first letter
	of the types, so '{Number}' is parsed to 'Number', '{?String}' is parsed to 'null or String',
	'Array.<Number>' is parsed to 'Array of Number', {String|Number} is parsed to 'String or Number'
	@param {String} type The type tag to parse
	@return {String} The parsed type
	*/

	#parseType ( type ) {
		const tmpType =
			type
				.replaceAll ( '{', '' )
				.replaceAll ( '}', '' )
				.replaceAll ( ' ', '' )
				.replaceAll ( '.', ' of ' )
				.replaceAll ( '<', '' )
				.replaceAll ( '>', '' )
				.replaceAll ( '!', '' )
				.replaceAll ( '.', ' of ' )
				.replaceAll ( '?', 'null or ' )
				.replaceAll ( '|', ' or ' );
		if ( '' === tmpType ) {
			return null;
		}

		let returnValue = '';
		tmpType.trim ( ).split ( ' ' )
			.forEach (
				word => {
					returnValue +=
					( -1 === [ 'of', 'null', 'or' ].indexOf ( word ) )
						?
						this.#capitalizeFirstLetter ( word )
						:
						word;
					returnValue += ' ';
				}
			);

		return returnValue.trimEnd ( );
	}

	/**
	This method build a TypeDescription object from the contains of a comment tags
	@param {String} commentTag The comment tag
	@param {boolean} haveName A flag indicating that commentTag contains also a name to add in the TypeDescription
	*/

	#getTypeDescription ( commentTag, haveName ) {

		const typeDescription = new TypeDescription ( );

		// removing tag and spaces or newline. Spaces and newline must be in a separate replace!
		let tmpCommentTag =
			commentTag.replace ( this.#tagRegExp, '' )
				.replace ( this.#beginSpaceNewlineRegExp, '' );

		// Searching type
		const type = commentTag.match ( this.#typeRegExp );
		if ( type ) {
			typeDescription.type = this.#parseType ( type [ 0 ] );

			// removing type and spaces or newline
			tmpCommentTag =
				commentTag.substring ( commentTag.indexOf ( '}' ) + 1 ).replace ( this.#beginSpaceNewlineRegExp, '' );
		}

		// Searching name
		if ( haveName ) {
			if ( tmpCommentTag.match ( this.#nameRegExp ) ) {
				typeDescription.name = tmpCommentTag.match ( this.#nameRegExp ) [ 0 ];
				typeDescription.name = typeDescription.name.replace ( this.#spaceNewlineRegExp, '' );
				if ( '' === typeDescription.name ) {
					typeDescription.name = null;
				}

				// removing name and spaces or newline
				tmpCommentTag = tmpCommentTag.replace ( this.#nameRegExp, '' ).replace ( this.#beginSpaceNewlineRegExp, '' );
			}
		}

		// Searching desscription
		// removing space and newline at the end
		tmpCommentTag = tmpCommentTag.replace ( this.#endSpaceNewlineRegExp, '' );
		if ( '' !== tmpCommentTag ) {
			typeDescription.desc = this.#capitalizeFirstLetter ( tmpCommentTag );
		}

		return Object.freeze ( typeDescription );
	}

	/**
	Parse a comment tag. A comment tag is a text starting at the beginning of a comment, just after the &#47;&#42;&#42;
	or starting with a 	&#64; char and finishing just before the next &#64; char in the comment or just before the &#42;&#47;
	@param {String} commentTag the comment tag to parse
	*/

	#parseCommentTag ( commentTag ) {

		// no @ char at the beginning. It's a desc...
		if ( ! commentTag.startsWith ( '@' ) ) {
			this.#commentsDoc.desc = this.#capitalizeFirstLetter ( commentTag );
			return;
		}

		// searching the @ tag
		const tag = commentTag.match ( this.#tagRegExp ) [ 0 ];

		switch ( tag ) {
		case '@desc' :
		case '@classdesc' :
			this.#commentsDoc.desc = this.#capitalizeFirstLetter (
				commentTag.replace ( this.#tagRegExp, '' ).replace ( this.#endSpaceNewlineRegExp, '' )
			);
			break;
		case '@sample' :
			this.#commentsDoc.sample =
				commentTag.replace ( this.#tagRegExp, '' ).replace ( this.#endSpaceNewlineRegExp, '' );
			break;
		case '@type' :
			{
				const type = commentTag.match ( this.#typeRegExp );
				if ( type ) {
					this.#commentsDoc.type = this.#parseType ( type [ 0 ] );
				}
			}
			break;
		case '@param' :
			this.#commentsDoc.params = ( this.#commentsDoc.params ?? [] );
			this.#commentsDoc.params.push ( this.#getTypeDescription ( commentTag, true ) );
			break;
		case '@return' :
		case '@returns' :
			this.#commentsDoc.returns = this.#getTypeDescription ( commentTag, false );
			break;
		case '@ignore' :
			this.#commentsDoc.ignore = true;
			break;
		default :
			break;
		}
	}

	/**
	Parse a leading comment and extracts the &#64;desc, &#64;classdesc, &#64;sample,&#64;type, &#64;param,
	&#64;return, &#64;returns, &#64;ignore tags
	@param {String} leadingComment The comment to parse
	*/

	#parseLeadingComment ( leadingComment ) {

		// replacing Windows and Mac EOL with Unix EOL, tab with spaces and @ with a strange text surely not used
		// then spliting the comments at the strange text, so the comment is splitted, preserving the @
		leadingComment
			.replaceAll ( '\r\n', '\n' ) // eol windows
			.replaceAll ( '\r', '\n' ) // eol mac
			.replaceAll ( '\t', ' ' ) // tab
			.replaceAll ( this.#multipleSpacesRegExp, ' ' ) // multiple spaces
			.replaceAll ( this.#spaceNewlineSpaceRegExp, '\n' ) // spaces + eol + spaces
			.replaceAll ( '@', '§§§@' ) // strange text
			.replace ( this.#beginNewLineRegExp, '' ) // eol at the beginning
			.split ( '§§§' )
			.forEach (

				// and parsing each result
				commentTag => { this.#parseCommentTag ( commentTag ); }
			);
	}

	/**
	Build a CommentsDoc object from the leading comments found in the code before the class/method/properties/variable
	@param {Array.<String>} leadingComments The leadingComments to use
	@return {CommentsDoc} An object with the comments
	*/

	build ( leadingComments ) {

		if ( ! leadingComments ) {
			return null;
		}

		// Filtering on comments starting with *
		const docLeadingComments = leadingComments.filter ( leadingComment => '*' === leadingComment.value [ 0 ] );

		if ( 0 === docLeadingComments.length ) {
			return null;
		}

		this.#commentsDoc = new CommentsDoc ( );
		docLeadingComments.forEach ( docLeadingComment => this.#parseLeadingComment ( docLeadingComment.value.substr ( 1 ) ) );
		return Object.freeze ( this.#commentsDoc );
	}
}

export default CommentsDocBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */