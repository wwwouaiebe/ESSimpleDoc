/*
Copyright - 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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
Doc reviewed 20211111
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import fs from 'fs';
import process from 'process';
import childProcess from 'child_process';

import DocBuilder from './DocBuilder.js';
import theConfig from './Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Start the app: read the arguments, set the config, create the source file list and remove the old documentation if any.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AppLoader {

	/**
	The source files names, included the path since theConfig.srcDir
	@type {Array.<String>}
	*/

	#sourceFileNames;

	/**
	A const to use when exit the app due to a bad parameter
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #EXIT_BAD_PARAMETER ( ) { return 9; }

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#sourceFileNames = [];
	}

	/**
	Read **recursively** the contains of a directory and store all the js files found in the #sourceFileNames property
	@param {String} dir The directory to read. It's a relative path, starting at theConfig.srcDir ( the path
	given in the --src parameter )
	*/

	#readDir ( dir ) {

		// Searching all files and directories present in the directory
		const fileNames = fs.readdirSync ( theConfig.srcDir + dir );

		// Loop on the results
		fileNames.forEach (
			fileName => {

				// Searching the stat of the file/directory
				const lstat = fs.lstatSync ( theConfig.srcDir + dir + fileName );

				if ( lstat.isDirectory ( ) ) {

					// It's a directory. Reading this recursively
					this.#readDir ( dir + fileName + '/' );
				}
				else if ( lstat.isFile ( ) ) {

					// it's a file. Adding to the files list with the relative path, if the extension is 'js'
					if ( 'js' === fileName.split ( '.' ).reverse ( )[ 0 ] ) {
						this.#sourceFileNames.push ( dir + fileName );
					}
				}
			}
		);
	}

	/**
	Clean the previously created files, to avoid deprecated files in the documentation.
	*/

	#cleanOldFiles ( ) {
		try {

			// Removing the complete documentation directory
			fs.rmSync (
				theConfig.destDir,
				{ recursive : true, force : true },
				err => {
					if ( err ) {
						throw err;
					}
				}
			);

			// and then recreating
			fs.mkdirSync ( theConfig.destDir );
		}
		catch {

			// Sometime the cleaning fails due to opened files
			console.error ( `\x1b[31mNot possible to clean the ${theConfig.destDir} folder\x1b[0m` );
		}
	}

	/**
	Show the help on the screen
	*/

	#showHelp ( ) {
		console.error ( '\n\t\x1b[36m--help\x1b[0m : this help\n' );
		console.error ( '\t\x1b[36m--src\x1b[0m : the path to the directory where the sources are located\n' );
		console.error (
			'\t\x1b[36m--dest\x1b[0m : the path to the directory where' +
			' the documentation have to be generated\n'
		);
		console.error ( '\t\x1b[36m--validate\x1b[0m : when present, the documentation is validated\n' );
		console.error (
			'\t\x1b[36m--launch\x1b[0m : when present, the documentation will' +
			' be opened in the browser at the end of the process\n'
		);
		console.error (
			'\t\x1b[36m--noSourcesColor\x1b[0m : when present, the sources files will' +
			' not have colors for JS keywords and links for types\n'
		);
		process.exit ( 0 );
	}

	/**
	Validate a path:
	- Verify that the path exists on the computer
	- verify that the path is a directory
	- complete the path with a \
	@param {String} path The path to validate
	*/

	#validatePath ( path ) {
		let returnPath = path;
		if ( '' === returnPath ) {
			console.error ( 'Invalid or missing \x1b[31m--src or dest\x1b[0m parameter' );
			process.exit ( AppLoader.#EXIT_BAD_PARAMETER );
		}
		let pathSeparator = null;
		try {
			returnPath = fs.realpathSync ( path );
			pathSeparator = -1 !== returnPath.indexOf ( '\\' ) ? '\\' : '/';
			const lstat = fs.lstatSync ( returnPath );
			if ( lstat.isFile ( ) ) {
				returnPath = returnPath.substr ( 0, returnPath.lastIndexOf ( pathSeparator ) );
			}
		}
		catch {
			console.error ( 'Invalid path for the --src or --dest parameter \x1b[31m%s\x1b[0m', returnPath );
			process.exit ( AppLoader.#EXIT_BAD_PARAMETER );
		}
		returnPath += pathSeparator;
		return returnPath;
	}

	/**
	Complete theConfig object from the app parameters
	@param {?Object} options The options for the app
	*/

	#createConfig ( options ) {

		if ( options ) {
			theConfig.srcDir = options.src;
			theConfig.destDir = options.dest;
			theConfig.appDir = process.cwd ( ) + '/node_modules/essimpledoc/src';
			if ( options.launch ) {
				theConfig.launch = true;
			}
			if ( options.noSourcesColor ) {
				theConfig.noSourcesColor = true;
			}
			if ( options.validate ) {
				theConfig.validate = true;
			}
		}
		else {
			process.argv.forEach (
				arg => {
					const argContent = arg.split ( '=' );
					switch ( argContent [ 0 ] ) {
					case '--src' :
						theConfig.srcDir = argContent [ 1 ] || theConfig.srcDir;
						break;
					case '--dest' :
						theConfig.destDir = argContent [ 1 ] || theConfig.destDir;
						break;
					case '--validate' :
						theConfig.validate = true;
						break;
					case '--launch' :
						theConfig.launch = true;
						break;
					case '--noSourcesColor' :
						theConfig.noSourcesColor = true;
						break;
					case '--help' :
						this.#showHelp ( );
						break;
					default :
						break;
					}
				}
			);
			theConfig.appDir = process.argv [ 1 ];
		}
		theConfig.srcDir = this.#validatePath ( theConfig.srcDir );
		theConfig.destDir = this.#validatePath ( theConfig.destDir );
		theConfig.appDir = this.#validatePath ( theConfig.appDir );

		// the config is now frozen
		Object.freeze ( theConfig );
	}

	/**
	Load the app, searching all the needed infos to run the app correctly
	@param {?Object} options The options for the app
	*/

	loadApp ( options ) {

		// start time
		const startTime = process.hrtime.bigint ( );

		// config
		this.#createConfig ( options );

		// console.clear ( );
		console.error ( 'Starting ESSimpleDoc...' );

		// source files list
		this.#readDir ( '' );

		// Cleaning old files
		this.#cleanOldFiles ( );

		// copy the css file in the documentation directory
		fs.copyFileSync ( theConfig.appDir + 'ESSimpleDoc.css', theConfig.destDir + 'ESSimpleDoc.css' );

		// starting the build
		new DocBuilder ( ).buildFiles ( this.#sourceFileNames );

		// end of the process
		const deltaTime = process.hrtime.bigint ( ) - startTime;

		/* eslint-disable-next-line no-magic-numbers */
		const execTime = String ( deltaTime / 1000000000n ) + '.' + String ( deltaTime % 1000000000n ).substr ( 0, 3 );
		console.error ( `\nDocumentation generated in ${execTime} seconds in the folder \x1b[36m${theConfig.destDir}\x1b[0m` );
		if ( theConfig.launch ) {
			console.error ( '\n\t... launching in the browser...\n' );
			childProcess.exec ( theConfig.destDir + 'index.html' );
		}
	}
}

export default AppLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */