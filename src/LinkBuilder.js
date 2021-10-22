import theConfig from './Config.js';

class LinkBuilder {

	#sourcesLinks = null;

	constructor ( ) {
		Object.freeze ( this );
		this.#sourcesLinks = new Map ( )
	}
	
	getClassLink ( ) {
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