/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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
Doc reviewed 20211021
*/

import { TypeDescription, CommentsDoc } from './Docs.js';

/**
Build a CommentsDoc object from the comments of a class, a method, a property or a variable
*/

class CommentsDocBuilder {

	/**
	The currently builded comments
	@type {CommentsDoc}
	*/

	#commentsDoc;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Set to uppercase the first letter of a word
	@param {String} word The word to capitalize
	@return {String} The capitalized word
	*/

	#capitalizeFirstLetter ( word ) {
		if ( ! word || '' === word ) {
			return word;
		}
		if ( 'null' === word.toLowerCase ( ) ) {
			return 'null';
		}
		return word [ 0 ].toUpperCase ( ) + word.substr ( 1 );
	}

	/**
	Parse a JSdoc type tag ( the value into {} for a @type, @param, @return or @returns JSDoc tags.
	Remove the { } < > ! and space chars from the type, replace the . char with ' of ',
	replace the ? char with 'null or ', replace the | char with ' or ' and finally capitalize the first letter
	of the types, so '{number}' is parsed to 'Number', '{?string}' is parsed to 'null or String',
	'Array.<number>' is parsed to 'Array of Number', {string|number} is parsed to 'String or Number'
	@param {string} type The type tag to parse
	@return {string} The parsed type
	*/

	#parseType ( type ) {
		const tmpType =
			type
				.replaceAll ( '{', '' )
				.replaceAll ( '}', '' )
				.replaceAll ( ' ', '' )
				.replaceAll ( '.<', ' of ' )
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
	This method clean a string
	@param {String} desc the string to clean
	@return {?String} The cleaned string or null when the cleaned string is empty
	*/

	#cleanDesc ( desc ) {
		const tmpDesc = this.#capitalizeFirstLetter ( desc );
		return '' === tmpDesc ? null : tmpDesc;
	}

	/**
	This method build a TypeDescription from the words found in a comment tags
	@param {Array.<String>} words The words used to build the TypeDescription
	@param {boolean} haveName A flag indicating that words contains also a name to add in the TypeDescription
	*/

	#getTypeDescription ( words, haveName ) {
		const typeDescription = new TypeDescription ( );
		if ( '{' === words [ 1 ] [ 0 ] && words [ 1 ].endsWith ( '}' ) ) {
			typeDescription.type = this.#parseType ( words [ 1 ] );
		}
		if ( haveName ) {
			typeDescription.name = words [ 2 ];
			typeDescription.name = '' === typeDescription.name.trim ( ) ? null : typeDescription.name;
		}
		for ( let counter = haveName ? 3 : 2; counter < words.length; counter ++ ) {
			typeDescription.desc = ( typeDescription.desc ?? '' ) + words [ counter ] + ' ';
		}
		typeDescription.desc = this.#cleanDesc ( typeDescription.desc );
		return Object.freeze ( typeDescription );
	}

	/**
	Parse a comment tag. A comment tag is a text starting at the beginning of a comment or starting with a @ char
	and finishing just before the next @ char in the comment
	@param {string} commentTag the comment tag to parse
	*/

	#parseCommentTag ( commentTag ) {
		
		if ( ! commentTag.startsWith ( '@' ) ) {
			this.#commentsDoc.desc = this.#cleanDesc ( commentTag );
			return;
		}
		else if ( commentTag.startsWith ( '@desc ' ) ) {
			this.#commentsDoc.desc = this.#cleanDesc ( commentTag.replace ( '@desc ', '' ) );
			return;
		}
		else if ( commentTag.startsWith ( '@classdesc ' ) ) {
			this.#commentsDoc.desc = this.#cleanDesc ( commentTag.replace ( '@classdesc ', '' ) );
			return;
		}
				
		// Splitting the tag into words
		const words = commentTag.replaceAll ( '\n', '' ).split ( ' ' );
		switch ( words [ 0 ] ) {
		case '@type' :
			if ( '{' === words [ 1 ] [ 0 ] && words [ 1 ].endsWith ( '}' ) ) {
				this.#commentsDoc.type = this.#parseType ( words [ 1 ] );
			}
			break;
		case '@param' :
			this.#commentsDoc.params = ( this.#commentsDoc.params ?? [] );
			this.#commentsDoc.params.push ( this.#getTypeDescription ( words, true ) );
			break;
		case '@return' :
		case '@returns' :
			this.#commentsDoc.returns = this.#getTypeDescription ( words, false );
			break;
		case '@ignore' :
			console.log ( 'ignore' );
			this.#commentsDoc.ignore = true;
			break;
		default :
			break;
		}
	}

	/**
	Parse a comment and extracts the desc, classdesc, type, param, return, returns JSDoc tags
	@param {string} comment The comment to parse
	*/

	#parseComment ( comment ) {

		// replacing Windows and Mac EOL with Unix EOL, tab with spaces and @ with a strange text surely not used
		let tmpComment = comment
			.replaceAll ( '\r\n', '\n' )
			.replaceAll ( '\r', '\n' )
			.replaceAll ( '\t', ' ' )
			.replaceAll ( '@', '§§§@' );

		// removing multiple spaces
		while ( tmpComment.includes ( '  ' ) ) {
			tmpComment = tmpComment.replaceAll ( '  ', ' ' );
		}
		
		// trim
		tmpComment = tmpComment.trim ( );

		// spliting the comments at the strange text, so the comment is splitted, preserving the @
		tmpComment.split ( '§§§' ).forEach (

			// and parsing each result
			commentTag => { this.#parseCommentTag ( commentTag ); }
		);

	}

	/**
	Build a CommentsDoc object from the comments found in the code before the class/method/properties/variable
	@param {Array.<string>} leadingComments The leadingComments to use
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
		docLeadingComments.forEach ( docLeadingComment => this.#parseComment ( docLeadingComment.value.substr ( 1 ) ) );
		return Object.freeze ( this.#commentsDoc );
	}
}

export default CommentsDocBuilder;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/