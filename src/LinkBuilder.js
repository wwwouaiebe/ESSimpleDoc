class LinkBuilder {

	#sourcesLinks = null;
	#classesLinksCache = null;
	#classesLinks = null;
	#variablesLinksCache = null;
	#variablesLinks = null;

	constructor ( ) {
		Object.freeze ( this );
		this.#sourcesLinks = new Map ( );
		this.#classesLinks = new Map ( );
		this.#variablesLinks = new Map ( );
	}

	getClassLink ( className, rootPath ) {
		const classLink = this.#classesLinks.get ( className );
		return classLink ? `<a href="${rootPath + classLink}">${className}</a>` : className;
	}

	setClassLink ( classDoc ) {
		this.#classesLinks.set ( 
			classDoc.name, 
			classDoc.file.substr ( 0, classDoc.file.lastIndexOf ( '/' ) + 1 ) + classDoc.name + '.html'
		);
	}

	get classesLinks ( ) {
		if ( ! this.#classesLinksCache ) {
			this.#classesLinksCache =  Array.from( this.#classesLinks ).sort ( 
				( first, second) => first [ 0 ] .localeCompare ( second [ 0] ) 
			);
		}
		return this.#classesLinksCache;
	}

	getSourceLink ( doc ) {
		let sourceLink = this.#sourcesLinks.get ( doc.file );
		if ( sourceLink ) {
			return doc.rootPath + sourceLink + '#L' + String ( doc.line ).padStart ( 5, '_' );
		}
		return null;
	}

	setSourceLink ( fileName, path ) {
		this.#sourcesLinks.set ( fileName, path );
	}
	
	setVariableLink ( variableDoc ) {
		if ( variableDoc.commentsDoc?.global ) {
			this.#variablesLinks.set (
				variableDoc.name,
				`variables.html#${variableDoc.name}`
			)
		}
	}
	
	get variablesLinks ( ) {
		if ( ! this.#variablesLinksCache ) {
			this.#variablesLinksCache =  Array.from( this.#variablesLinks ).sort ( 
				( first, second) => first [ 0 ] .localeCompare ( second [ 0 ] ) 
			);
		}
		return this.#variablesLinksCache;
	}
	
}

const theLinkBuilder = new LinkBuilder ( );

export default theLinkBuilder;