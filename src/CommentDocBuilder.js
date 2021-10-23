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

/**
Build a doc object from the comments of a class, a method, a property or a variable
*/

class CommentDocBuilder {

	#commentsDoc = null;
	constructor ( ) {
		Object.freeze ( this );
	}

	#parseCommentTag ( commentTag ) {

		// Splitting the tag into words
		const words = commentTag.split ( ' ' );
		switch ( words [ 0 ] ) {
		case '@desc' :
			this.#commentsDoc.desc = commentTag.replace ( '@desc ', '' );
			break;
		case '@classdesc' :
			this.#commentsDoc.desc = commentTag.replace ( '@classdesc ', '' );
			break;
		case '@type' :
			if ( '{' === words [ 1 ] [ 0 ] && words [ 1 ].endsWith ( '}' ) ) {
				this.#commentsDoc.type = words [ 1 ].replace ( '{', '' ).replace ( '}', '' );
			}
			break;
		case '@param' :
			{
				const paramDoc = { type : '', name : words [ 2 ], desc : '' };
				if ( '{' === words [ 1 ] [ 0 ] && words [ 1 ].endsWith ( '}' ) ) {
					paramDoc.type = words [ 1 ].replace ( '{', '' ).replace ( '}', '' );
				}
				for ( let counter = 3; counter < words.length; counter ++ ) {
					paramDoc.desc += words [ counter ] + ' ';
				}
				Object.freeze ( paramDoc );
				this.#commentsDoc.params.push ( paramDoc );
			}
			break;
		case '@return' :
		case '@returns' :
			if ( '{' === words [ 1 ] [ 0 ] && words [ 1 ].endsWith ( '}' ) ) {
				this.#commentsDoc.returns.type = words [ 1 ].replace ( '{', '' ).replace ( '}', '' );
			}
			for ( let counter = 2; counter < words.length; counter ++ ) {
				this.#commentsDoc.returns.desc += words [ counter ] + ' ';
			}
			Object.freeze ( this.#commentsDoc.returns );
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

	/*
	commentsDoc = {
		desc : {string} the description found in the comments = the free text or the @desc tag or @classdesc tag text
		type : {string} the type of the property = the @type tag text
		params : {Array.<param>} An array with the type and description of the params
		returns :{returns} An array with the type and description of the params
		global : {boolean} the property is a global property
	}

	param = {
		type : {string} the type of the param
		desc : {string} the description of the param
	}

	returns = {
		type : {string} the type of the param
		desc : {string} the description of the param
	}

	*/

	build ( comments ) {

		this.#commentsDoc = {
			params : [],
			returns : { type : '', desc : '' }
		};

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