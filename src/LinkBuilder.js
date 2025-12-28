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
	- v1.1.0:
		- Issue ♯3 : String.substr ( ) is deprecated... Replace...
	- v1.2.1:
		- Issue ♯5 : Sources files are not sorted correctly in nav part of the html pages
Doc reviewed 20211111
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import { marked } from 'marked';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Store all the links  created from the source document and get the links completed with the path for others classes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LinkBuilder {

	/**
	A cache for the sources links
	@type {Array.<Array.<String>>}
	*/

	#sourcesLinksCache;

	/**
	The links to the sources  files
	@type {Map.<String>}
	*/

	#sourcesLinks;

	/**
	A cache for the classes links
	@type {Array.<Array.<String>>}
	*/

	#classesLinksCache;

	/**
	The links to the classes  files
	@type {Map.<String>}
	*/

	#classesLinks;

	/**
	A cache for the variables links
	@type {Array.<Array.<String>>}
	*/

	#variablesLinksCache;

	/**
	The links to the variables file and the variables in the file
	@type {Map.<String>}
	*/

	#variablesLinks;

	/**
	The links to the mdn documentation
	@type {Object}
	*/

	#mdnLinks = Object.freeze (
		{

			// Global objects
			Array : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
			ArrayBuffer : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer',
			Boolean : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean',
			Error : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',
			File : 'https://developer.mozilla.org/en-US/docs/Web/API/File',
			Function : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function',
			Map : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
			Number : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
			Object : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
			Promise : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
			RegExp : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp',
			String : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
			Uint8Array : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array',

			// Statements
			Class : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class',

			// API
			CryptoKey : 'https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey',
			Event : 'https://developer.mozilla.org/en-US/docs/Web/API/Event',
			GeolocationPosition : 'https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition',
			GeolocationPositionError : 'https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError',
			IDBFactory : 'https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory',
			HTMLCollection : 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection',
			HTMLElement : 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement',
			Node : 'https://developer.mozilla.org/en-US/docs/Web/API/Node',
			NodeList : 'https://developer.mozilla.org/en-US/docs/Web/API/NodeList',
			SVGElement : 'https://developer.mozilla.org/en-US/docs/Web/API/SVGElement',
			Touch : 'https://developer.mozilla.org/en-US/docs/Web/API/Touch',
			TouchList : 'https://developer.mozilla.org/en-US/docs/Web/API/TouchList',
			XMLDocument : 'https://developer.mozilla.org/en-US/docs/Web/API/XMLDocument',

			// Others
			LeafletObject : 'https://leafletjs.com/reference.html',
			OsmElement : 'https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL',
			JsonObject : 'https://www.json.org/json-en.html'
		}
	);

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#sourcesLinks = new Map ( );
		this.#classesLinks = new Map ( );
		this.#variablesLinks = new Map ( );
	}

	/**
	Get the html link to a class file
	@param {String} className The name of the class for witch the link must be created
	@param {String} rootPath The path between the file where the link will be inserted and theConfig.destDir
	( something like '../../../', depending of the folders tree )
	@return {String} An html string with the link or the className when the link is not found
	*/

	getClassLink ( className, rootPath ) {
		const classLink = this.#classesLinks.get ( className );
		return classLink ? `<a href="${rootPath + classLink}">${className}</a>` : className;
	}

	/**
	Store a link to a class file
	@param {ClassDoc} classDoc the doc with the class documentation
	*/

	setClassLink ( classDoc ) {
		this.#classesLinks.set (
			classDoc.name,
			classDoc.file.substring ( 0, classDoc.file.lastIndexOf ( '/' ) + 1 ) + classDoc.name + '.html'
		);
	}

	/**
	Get all the classes links. Each subAray contains the class name and the class link.
	@type {Array.<Array.<String>>}
	*/

	get classesLinks ( ) {
		if ( ! this.#classesLinksCache ) {

			// Create the cache if not exists
			this.#classesLinksCache = this.#classesLinksCache ?? Array.from ( this.#classesLinks ).sort (
				( first, second ) => first [ 0 ] .localeCompare ( second [ 0 ] )
			);
		}

		return this.#classesLinksCache;
	}

	/**
	Get a link to a source file
	@param {VariableDoc|MethodOrPropertyDoc|VariableDoc} doc The doc for witch the link to the source file must be created.
	@return {?String} The link to the source file
	*/

	getSourceLink ( doc ) {
		let sourceLink = this.#sourcesLinks.get ( doc.file );
		if ( sourceLink ) {
			// eslint-disable-next-line no-magic-numbers
			return doc.rootPath + sourceLink + '#L' + String ( doc.line ).padStart ( 5, '_' );
		}
		return null;
	}

	/**
	Store a link to a source file
	@param {String} fileName The file name
	@param {String} path The path since theConfig.destDir, included file name
	*/

	setSourceLink ( fileName, path ) {
		this.#sourcesLinks.set ( fileName, path );
	}

	/**
	Get all the sources links. Each subAray contains the source file name and the path
	between theConfig.destDir  and the source file, included file name
	@type {Array.<Array.<String>>}
	*/

	get sourcesLinks ( ) {
		if ( ! this.#sourcesLinksCache ) {
			this.#sourcesLinksCache = Array.from ( this.#sourcesLinks ).sort (
				( first, second ) => {
					const firstPath = first [ 0 ].substring ( 0, first [ 0 ].lastIndexOf ( '/' ) );
					const firstFile = first [ 0 ].substring ( first [ 0 ].lastIndexOf ( '/' ) + 1 );
					const secondPath = second [ 0 ].substring ( 0, second [ 0 ].lastIndexOf ( '/' ) );
					const secondFile = second [ 0 ].substring ( second [ 0 ].lastIndexOf ( '/' ) + 1 );
					const pathCompare = firstPath.localeCompare ( secondPath );
					if ( 0 === pathCompare ) {
						return firstFile.localeCompare ( secondFile );
					}
					return pathCompare;
				}
			);
		}
		return this.#sourcesLinksCache;
	}

	/**
	Store a link to a variable in the variables.html file
	@param {VariableDoc} variableDoc the doc with the variable documentation
	*/

	setVariableLink ( variableDoc ) {
		this.#variablesLinks.set (
			variableDoc.name,
			`variables.html#${variableDoc.name}`
		);
	}

	/**
	Get all the variables links. Each subAray contains the variable name and the variable link.
	@type {Array.<Array.<String>>}
	*/

	get variablesLinks ( ) {
		if ( ! this.#variablesLinksCache ) {
			this.#variablesLinksCache = Array.from ( this.#variablesLinks ).sort (
				( first, second ) => first [ 0 ] .localeCompare ( second [ 0 ] )
			);
		}
		return this.#variablesLinksCache;
	}

	/**
	Get the link to a type
	@param {String} type The type for witch the link must be created. Must be a single word
	@param {String} rootPath The path between the file where the link will be inserted and theConfig.destDir
	( something like '../../../', depending of the folders tree )
	@return {String} The link to the type. We search first in the classes links, then in the mdn links. If nothing
	found, the type without html link is returned.
	*/

	#getTypeLink ( type, rootPath ) {
		if ( 'constructor' === type ) {
			return type;
		}
		const classLink = this.#classesLinks.get ( type );
		if ( classLink ) {
			return `<a href="${rootPath + classLink}">${type}</a>`;
		}
		const mdnLink = this.#mdnLinks [ type ];
		if ( mdnLink ) {
			return `<a href="${mdnLink}">${type}</a>`;
		}
		const variableLink = this.#variablesLinks.get ( type );
		if ( variableLink ) {
			return `<a href="${variableLink}">${type}</a>`;
		}
		return type;
	}

	/**
	Verify that a given type is a known type ( = present in the @classesLinks map
	or the mdnLinks object
	@param {String} type The type to verify
	@return {Boolean} True when the type is known
	*/

	isKnownType ( type ) {
		return Boolean ( this.#classesLinks.get ( type ) || this.#mdnLinks [ type ] );
	}

	/**
	Get the links to a type
	@param {String} type The types for witch the link must be created. Can be multiple word
	@param {String} rootPath The path between the file where the link will be inserted and theConfig.destDir
	( something like '../../../', depending of the folders tree )
	@return {String} The html links to the types. We search first in the classes links, then in the mdn links. If nothing
	found, the types without html link is returned.
	*/

	getTypeLinks ( type, rootPath ) {
		if ( ! type ) {
			return 'null';
		}
		let returnType = '';
		type.split ( ' ' ).forEach (
			tmpType => returnType += this.#getTypeLink ( tmpType, rootPath ) + ' '
		);

		return returnType.trimEnd ( );
	}

	/**
	Add links to a description
	@param {String} desc The description to complete with links
	@param {String} rootPath The path between the file where the link will be inserted and theConfig.destDir
	( something like '../../../', depending of the folders tree )
	@return {String} The description completed with html links
	*/

	getDescLink ( desc, rootPath ) {
		let returnDesc = '';
		desc.split ( ' ' ).forEach (
			word => returnDesc += this.#getTypeLink ( word, rootPath ) + ' '
		);
		return marked.parse ( returnDesc.trimEnd ( ) );
	}
}

/**
The one and only one instance of LinkBuilder class
@type {LinkBuilder}
*/

const theLinkBuilder = new LinkBuilder ( );

export default theLinkBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */