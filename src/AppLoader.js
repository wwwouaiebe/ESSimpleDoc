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

import fs from 'fs';
import process from 'process';
import child_process from 'child_process';

import DocBuilder from './DocBuilder.js';
import theConfig from './Config.js';

/**
Start the app: read the arguments, set the config, create the source file list and remove the old documentation if any.
*/

class AppLoader {

	#startTime = null;
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
		try {
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
		catch {
			console.error ( `\x1b[31mNot possible to clean the ${theConfig.docDir} folder\x1b[0m` )
		}
	}
	
	#createConfig ( ) {
		process.argv.forEach ( 
			arg => {
				const argContent = arg.split ( '=' )
				if ( argContent [ 1 ] ){
					switch ( argContent [ 0 ] ) {
						case '--in' :
							if (fs.existsSync ( argContent [ 1 ] ) ) {
								theConfig.srcDir = fs.realpathSync ( argContent [ 1 ] ) + '\\';
							}
							else {
								console.error ( 'Invalid path for the --in parameter\x1b[31m%s\x1b[0m', argContent [ 1 ] );
								process.exit ( 9 );
							}
							break;
						case '--out' :
							try {
								theConfig.docDir = fs.realpathSync ( argContent [ 1 ] ) + '\\';
							}
							catch {
								console.error ( 'Invalid path for the --out parameter\x1b[31m%s\x1b[0m ', argContent [ 1 ] );
								process.exit ( 9 );
							}
							break;
					}
				}
				if ( '--validate' === arg ) {
					theConfig.validate = true;
				}
				if ( '--launch' === arg ) {
					theConfig.launch = true;
				}
			}
		);
		
		theConfig.appDir = process.argv [ 1 ].substr ( 0, process.argv [ 1 ].lastIndexOf ( '\\' ) + 1 );
		if ( ! theConfig.srcDir ) {
			console.error ( `Invalid \x1b[31m--in\x1b[0m parameter` );
			process.exit ( 9 );
		}
		if ( ! theConfig.docDir ) {
			console.error ( `Invalid \x1b[31m--out\x1b[0m parameter` );
			process.exit ( 9 );
		}
	}
	
	loadApp ( ) {
		this.#startTime = process.hrtime.bigint ( );
		console.error ( '' );
		
		this.#createConfig ( )
		this.#createFileList ( );
		this.#cleanOldFiles ( );
		fs.copyFileSync ( theConfig.appDir + 'SimpleESDoc.css', theConfig.docDir + 'SimpleESDoc.css' );
		
		new DocBuilder ( ).buildFiles ( this.#filesList );
		
		const deltaTime = process.hrtime.bigint ( ) - this.#startTime;
		const execTime = String ( deltaTime / 1000000000n ) + '.' + String( deltaTime % 1000000000n ).substr (0, 3 );
		console.error ( `Documentation generated in ${execTime} seconds in the folder \x1b[36m${theConfig.docDir}\x1b[0m` );
		console.error ('' );
		if ( theConfig.launch ) {
			child_process.exec( theConfig.docDir + 'index.html' );
		}
	}
}

export default AppLoader;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/