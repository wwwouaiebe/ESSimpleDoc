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

import VariableDoc from './VariableDoc.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A class with properties needed to build the html files for methods/properties
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MethodOrPropertyDoc extends VariableDoc {

	/**
	A flag indicating that the method or property is static - found in ast
	@type {?boolean}
	*/

	static = null;

	/**
	A flag indicating that the method is async
	@type {?boolean}
	*/

	async = null;

	/**
	A flag indicating that the method or property is private - found in ast
	@type {?boolean}
	*/

	private = null;

	/**
	The kind of method ( = 'get', 'set' or 'constructor' ) - found in ast
	@type {?String}
	*/

	kind = null;

	/**
	The type ( = 'method' or 'property' ) - found in ast
	@type {?String}
	*/

	isA = null;

	/**
	The params names found in ast
	@type {?Array.<String>}
	*/

	params = null;
}

export default MethodOrPropertyDoc;

/* --- End of file --------------------------------------------------------------------------------------------------------- */