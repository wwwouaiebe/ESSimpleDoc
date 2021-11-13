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
import theConfig from './Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Write a file, creating before all the needed directories.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class FileWriter {

	/**
	A property to share the last created directory
	@type {String}
	*/

	#currentDir;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Creates all the directories in the dirs parameter, starting from theConfig.destDir
	@param {Array.<String>} dirs The directories to create
	*/

	#createDirs ( dirs ) {

		this.#currentDir = theConfig.destDir;

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

	/**
	Write a file
	@param {Array.<String>} dirs A list of directories to create. The file will be writed in the last created directory
	@param {String} fileName The name of the file
	@param {String} fileContent The content of the file
	*/

	write ( dirs, fileName, fileContent ) {
		this.#createDirs ( dirs );
		fs.writeFileSync ( this.#currentDir + fileName, fileContent );
	}
}

export default FileWriter;

/* --- End of file --------------------------------------------------------------------------------------------------------- */