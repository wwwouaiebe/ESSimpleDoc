import fs from 'fs';
import theConfig from './Config.js';

class FileWriter {

	#currentDir = '';

	constructor ( ) {
		Object.freeze ( this );
	}

	#createDirs ( dirs ) {
		this.#currentDir = theConfig.docDir;

		dirs.forEach (
			dir => {
				this.#currentDir += dir + '/';
				try {
					if ( ! fs.existsSync ( this.#currentDir ) ) {
						fs.mkdirSync ( this.#currentDir );
					}
				}
				catch ( err ) {
					console.error ( err );
				}
			}
		);

	}

	write ( dirs, fileName, fileContent ) {
		this.#createDirs ( dirs );
		fs.writeFileSync ( this.#currentDir + fileName, fileContent );
	}
}

export default FileWriter;