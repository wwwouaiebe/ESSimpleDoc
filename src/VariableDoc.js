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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class with properties needed to build the html files for classes/methods/properties/variables
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class VariableDoc {

	/**
	The name found in ast
	@type {?String}
	*/

	name = null;

	/**
	The path between the html file and theConfig.destDir ( something like '../../../', depending of the folders tree )
	@type {?String}
	*/

	rootPath = null;

	/**
	The file name in witch the class/method/property/variable is declared, including path since theConfig.destDir
	@type {?String}
	*/

	file = null;

	/**
	The line at witch the class/method/property/variable is declared - found in ast
	@type {?String}
	*/

	line = null;

	/**
	The doc found in the comments of the class/method/property/variable
	@type {?CommentsDoc}
	*/

	commentsDoc = null;

	/**
	The constructor. Seal the object, so it's not possible to add new properties to the object
	*/

	constructor ( ) { }

}

export default VariableDoc;

/* --- End of file --------------------------------------------------------------------------------------------------------- */