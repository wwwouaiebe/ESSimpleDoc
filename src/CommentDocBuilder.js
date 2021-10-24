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
Build a doc object from the comments of a class, a method, a property or a variable
*/

class CommentDocBuilder {

	#commentsDoc = null;
	constructor ( ) {
		Object.freeze ( this );
	}

	#capitalizeFirstLetter ( str ) {
		if ( 'null' === str.toLowerCase ( ) ) {
			return 'null';
		}
		return str [ 0 ].toUpperCase ( ) + str.substr ( 1 );
	}

	#parseType ( type ) {
		let returnType =
			type
				.replaceAll ( '{', '' )
				.replaceAll ( '}', '' )
				.replaceAll ( ' ', '' )
				.replaceAll ( '<', '' )
				.replaceAll ( '>', '' )
				.replaceAll ( '!', '' )
				.replaceAll ( '.', ' of ' )
				.replaceAll ( '?', 'null or ' )
				.replaceAll ( '|', ' or ' );
		if ( '' === returnType ) {
			return null;
		}
		let returnTypeArray = returnType.split ( ' ' );

		switch ( returnTypeArray.length ) {
		case 1 :
			returnType = this.#capitalizeFirstLetter ( returnTypeArray [ 0 ] );
			break;
		case 3 :
			returnType = this.#capitalizeFirstLetter ( returnTypeArray [ 0 ] ) +
					' ' + returnTypeArray [ 1 ] + ' ' +
					this.#capitalizeFirstLetter ( returnTypeArray [ 2 ] );
			break;
		default :
			returnType = null;
			break;
		}

		return returnType;

	}
	#parseCommentTag ( commentTag ) {

		// Splitting the tag into words
		const words = commentTag.split ( ' ' );
		let typeDescription = null;
		switch ( words [ 0 ] ) {
		case '@desc' :
			this.#commentsDoc.desc = commentTag.replace ( '@desc ', '' );
			break;
		case '@classdesc' :
			this.#commentsDoc.desc = commentTag.replace ( '@classdesc ', '' );
			break;
		case '@type' :
			if ( '{' === words [ 1 ] [ 0 ] && words [ 1 ].endsWith ( '}' ) ) {
				this.#commentsDoc.type = this.#parseType ( words [ 1 ] );
			}
			break;
		case '@param' :
			typeDescription = new TypeDescription ( );
			if ( '{' === words [ 1 ] [ 0 ] && words [ 1 ].endsWith ( '}' ) ) {
				typeDescription.type = this.#parseType ( words [ 1 ] );
			}
			typeDescription.name = words [ 2 ];
			for ( let counter = 3; counter < words.length; counter ++ ) {
				typeDescription.desc = ( typeDescription.desc ?? '' ) + words [ counter ] + ' ';
			}
			Object.freeze ( typeDescription );
			this.#commentsDoc.params = ( this.#commentsDoc.params ?? [] );
			this.#commentsDoc.params.push ( typeDescription );
			break;
		case '@return' :
		case '@returns' :
			typeDescription = new TypeDescription ( );
			if ( '{' === words [ 1 ] [ 0 ] && words [ 1 ].endsWith ( '}' ) ) {
				typeDescription.type = words [ 1 ].replace ( '{', '' ).replace ( '}', '' );
			}
			for ( let counter = 2; counter < words.length; counter ++ ) {
				typeDescription.desc = ( typeDescription.desc ?? '' ) + words [ counter ] + ' ';
			}
			Object.freeze ( typeDescription );
			this.#commentsDoc.returns = typeDescription;
			break;
		case '@global' :
			this.#commentsDoc.global = true;
			break;
		default :
			if ( '@' !== words [ 0 ] [ 0 ] ) {
				this.#commentsDoc.desc = commentTag;
			}
			break;

		}
	}

	#parseComment ( comment ) {
		let tmpComment = comment;

		// replacing \n \r and \t with space and @ with a strange text surely not used
		tmpComment = tmpComment
			.replaceAll ( '\r', ' ' )
			.replaceAll ( '\t', ' ' )
			.replaceAll ( '\n', ' ' )
			.replaceAll ( '@', '§§§@' );

		// removing multiple spaces
		while ( tmpComment.includes ( '  ' ) ) {
			tmpComment = tmpComment.replaceAll ( '  ', ' ' );
		}

		// spliting the comments at the strange text, so the comment are splitted, preserving the @
		tmpComment.split ( '§§§' ).forEach (
			commentTag => { this.#parseCommentTag ( commentTag ); }
		);

	}

	build ( comments ) {

		this.#commentsDoc = new CommentsDoc ( );

		comments.forEach (
			comment => {
				if ( '*' === comment [ 0 ] ) {
					this.#parseComment ( comment.substr ( 1 ) );
				}
			}
		);
		return Object.freeze ( this.#commentsDoc );
	}
}

export default CommentDocBuilder;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/