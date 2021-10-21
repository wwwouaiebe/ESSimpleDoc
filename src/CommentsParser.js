class CommentsParser {

	#docTags = null;
	constructor ( ) {
	}

	#parseDocTag ( docTag ) {
		const words = docTag.split ( ' ' );
		const paramDoc = { type : '', name : words [ 2 ], desc : '' };
		switch ( words [ 0 ] ) {
		case '@desc' :
			this.#docTags.desc = docTag.replace ( '@desc ', '' );
			break;
		case '@classdesc' :
			this.#docTags.desc = docTag.replace ( '@classdesc ', '' );
			break;
		case '@type' :
			if ( '{' === words [ 1 ] [ 0 ] && words [ 1 ].endsWith ( '}' ) ) {
				this.#docTags.type = words [ 1 ].replace ( '{', '' ).replace ( '}', '' );
			}
			break;
		case '@param' :
			if ( '{' === words [ 1 ] [ 0 ] && words [ 1 ].endsWith ( '}' ) ) {
				paramDoc.type = words [ 1 ].replace ( '{', '' ).replace ( '}', '' );
			}
			for ( let counter = 3; counter < words.length; counter ++ ) {
				paramDoc.desc += words [ counter ] + ' ';
			}
			this.#docTags.params.push ( paramDoc );
			break;
		case '@return' :
		case '@returns' :
			if ( '{' === words [ 1 ] [ 0 ] && words [ 1 ].endsWith ( '}' ) ) {
				this.#docTags.returns.type = words [ 1 ].replace ( '{', '' ).replace ( '}', '' );
			}
			for ( let counter = 2; counter < words.length; counter ++ ) {
				this.#docTags.returns.desc += words [ counter ] + ' ';
			}
			break;
		case '@global' :
			this.#docTags.global = true;
			break;
		default :
			if ( '@' !== words [ 0 ] [ 0 ] ) {
				this.#docTags.desc = docTag;
			}
			break;

		}
	}

	#parseComment ( comment ) {
		let tmpComment = comment;
		tmpComment = tmpComment.replaceAll ( '\r', ' ' ).replaceAll ( '\t', ' ' )
			.replaceAll ( '\n', ' ' )
			.replaceAll ( '@', '§§§@' );
		while ( tmpComment.includes ( '  ' ) ) {
			tmpComment = tmpComment.replaceAll ( '  ', ' ' );
		}
		const docTags = tmpComment.split ( '§§§' );
		docTags.forEach (
			docTag => { this.#parseDocTag ( docTag ); }
		);

	}

	parse ( comments ) {

		this.#docTags = {
			desc : null,
			type : null,
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
		return this.#docTags;
	}
}

export default CommentsParser;