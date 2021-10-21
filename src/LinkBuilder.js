
import theConfig from './Config.js';

class LinkBuilder {
	
	constructor ( ) {
	}

	getSourceLink ( classDoc ) {
		console.log ( classDoc.rootPath );
		let fileLink = theConfig.links.get ( classDoc.file );
		console.log ( fileLink );
		if ( fileLink ) {
			return classDoc.rootPath + fileLink + '#L' + String ( classDoc.line ).padStart ( 5, '_' );
		}
		return null;
	}
}

export default LinkBuilder;