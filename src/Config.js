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

/**
A simple container to store the app configuration
*/

class Config {

	/**
	The directory where the source files are. Coming from the --in parameter
	@type {String}
	*/

	srcDir

	/**
	The directory where the documentation files will be installed. Coming from the --out parameter
	@type {String}
	*/

	docDir

	/**
	The directory where the app is installed. Coming from the app parameter
	@type {String}
	*/

	appDir

	/**
	A flag indicating the validation must be done. Coming from the --validate parameter
	@type {boolean}
	*/

	validate

	/**
	A flag indicating that the documentation must be opened in the browser immediately after
	the generation. Coming from the --launch parameter
	@type {boolean}
	*/

	launch

	/**
	A flag indicating that the source files must have colors for the js keywords and links for 
	global variables and types. Coming from the --noSourcesColor parameter
	@type {boolean}
	*/

	noSourcesColor

	/**
	The constructor
	*/

	constructor ( ) {
	}

}

/**
The one and only one instance of Config class. Notice that the object will be froozen directly after reading the parameters
*/

const theConfig = new Config;

export default theConfig;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/