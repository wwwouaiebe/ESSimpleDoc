import theConfig from './Config.js';

class LinkBuilder {

	#sourcesLinks = null;
	
	#classesLinks = null;

	constructor ( ) {
		Object.freeze ( this );
		this.#sourcesLinks = new Map ( );
		this.#classesLinks = new Map ( );
	}
	
	getClassLink ( className, rootPath ) {
		const classLink = this.#classesLinks.get ( className );
		return classLink ? `<a href="${rootPath + classLink}">${className}</a>` : className;
	}
	
	setClassLink ( classDoc ) {
		this.#classesLinks.set ( classDoc.name, classDoc.file.replace ('.js', '.html' ) );
	}

	getSourceLink ( doc ) {
		let sourceLink = this.#sourcesLinks.get ( doc.file );
		if ( sourceLink ) {
			return doc.rootPath + sourceLink + '#L' + String ( doc.line ).padStart ( 5, '_' );
		}
		return null;
	}
	
	setSourceLink ( fileName, path) {
		this.#sourcesLinks.set ( fileName, path );
	}
}

const theLinkBuilder = new LinkBuilder ( );

export default theLinkBuilder;