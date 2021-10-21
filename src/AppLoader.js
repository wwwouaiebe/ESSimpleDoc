import fs from 'fs';
import DocBuilder from './DocBuilder.js';
import theConfig from './Config.js';

class AppLoader {

	#filesList = [];

	constructor ( ) {
		Object.freeze ( this );
	}

	#readDir ( dir ) {
		const fileNames = fs.readdirSync ( theConfig.srcDir + dir );

		fileNames.forEach (
			fileName => {
				const lstat = fs.lstatSync ( theConfig.srcDir + dir + fileName );
				if ( lstat.isDirectory ( ) ) {
					this.#readDir ( dir + fileName + '/' );
				}
				else if ( lstat.isFile ( ) ) {
					if ( 'js' === fileName.split ( '.' ).reverse ( )[ 0 ] ) {
						this.#filesList.push ( dir + fileName );
					}
				}
			}
		);
	}

	#createFileList ( ) {
		this.#filesList = [];
		this.#readDir ( '' );
	}

	#cleanOldFiles ( ) {
		fs.rmSync (
			theConfig.docDir,
			{ recursive : true, force : true },
			err => {
				if ( err ) {
					throw err;
				}
			}
		);

		fs.mkdirSync ( theConfig.docDir );
	}

	loadApp ( ) {
		this.#createFileList ( );

		// this.#cleanOldFiles ( );
		new DocBuilder ( ).buildFiles ( this.#filesList );
		console.error ( 'Done' );
	}
}

export default AppLoader;