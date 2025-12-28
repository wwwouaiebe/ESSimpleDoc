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
A class with properties found in the comments and needed to build the html files for
classes/methods/properties/variables
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class CommentsDoc {

	/**
	The description of the commented class/method/property/variable
	@type {?String}
	*/

	desc = null;

	/**
	The sample of the commented class/method/property/variable
	@type {?String}
	*/

	sample = null;

	/**
	The type of the commented variable
	@type {?String}
	*/

	type = null;

	/**
	The params of the commented method
	@type {?Array.<TypeDescription>}
	*/

	params = null;

	/**
	The returns type of the commented method
	@type {TypeDescription}
	*/

	returns = null;

	/**
	A flag indicating that the class/method/property/variable have to be ignored
	@type {Boolean}
	*/

	ignore = null;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

}

export default CommentsDoc;

/* --- End of file --------------------------------------------------------------------------------------------------------- */