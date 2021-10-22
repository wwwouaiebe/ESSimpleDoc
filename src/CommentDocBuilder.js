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