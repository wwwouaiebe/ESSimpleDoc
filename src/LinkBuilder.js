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
Store all the links  created from the source document and get the links completed with the path for others classes
*/

class LinkBuilder {

	#sourcesLinksCache = null;
	#sourcesLinks = null;
	#classesLinksCache = null;
	#classesLinks = null;
	#variablesLinksCache = null;
	#variablesLinks = null;

	#mdnLinks = {
		Array : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
		Map : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
		Boolean : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean',
		Number : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
		String : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
		Promise : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
		Function : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function'
	};

	constructor ( ) {
		Object.freeze ( this );
		this.#sourcesLinks = new Map ( );
		this.#classesLinks = new Map ( );
		this.#variablesLinks = new Map ( );
	}

	getClassLink ( className, rootPath ) {
		const classLink = this.#classesLinks.get ( className );
		return classLink ? `<a href="${rootPath + classLink}">${className}</a>` : className;
	}

	setClassLink ( classDoc ) {
		this.#classesLinks.set (
			classDoc.name,
			classDoc.file.substr ( 0, classDoc.file.lastIndexOf ( '/' ) + 1 ) + classDoc.name + '.html'
		);
	}

	get classesLinks ( ) {
		if ( ! this.#classesLinksCache ) {
			this.#classesLinksCache = Array.from ( this.#classesLinks ).sort (
				( first, second ) => first [ 0 ] .localeCompare ( second [ 0 ] )
			);
		}
		return this.#classesLinksCache;
	}

	getSourceLink ( doc ) {
		let sourceLink = this.#sourcesLinks.get ( doc.file );
		if ( sourceLink ) {
			return doc.rootPath + sourceLink + '#L' + String ( doc.line ).padStart ( 5, '_' );
		}
		return null;
	}

	setSourceLink ( fileName, path ) {
		this.#sourcesLinks.set ( fileName, path );
	}

	get sourcesLinks ( ) {
		if ( ! this.#sourcesLinksCache ) {
			this.#sourcesLinksCache = Array.from ( this.#sourcesLinks ).sort (
				( first, second ) => first [ 0 ] .localeCompare ( second [ 0 ] )
			);
		}
		return this.#sourcesLinksCache;
	}

	setVariableLink ( variableDoc ) {
		this.#variablesLinks.set (
			variableDoc.name,
			`variables.html#${variableDoc.name}`
		);
	}

	#getTypeLink ( type, rootPath ) {
		const classLink = this.#classesLinks.get ( type );
		if ( classLink ) {
			return `<a href="${rootPath + classLink}">${type}</a>`;
		}
		const mdnLink = this.#mdnLinks [ type ];
		if ( mdnLink ) {
			return `<a href="${mdnLink}">${type}</a>`;
		}
		return type;
	}

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

	get variablesLinks ( ) {
		if ( ! this.#variablesLinksCache ) {
			this.#variablesLinksCache = Array.from ( this.#variablesLinks ).sort (
				( first, second ) => first [ 0 ] .localeCompare ( second [ 0 ] )
			);
		}
		return this.#variablesLinksCache;
	}

	getDescLink ( desc, rootPath ) {
		let returnDesc = '';
		desc.split ( ' ' ).forEach (
			word => returnDesc += this.#getTypeLink ( word, rootPath ) + ' '
		);
		return returnDesc.trimEnd ( );
	}
}

/**
@global
*/

const theLinkBuilder = new LinkBuilder ( );

export default theLinkBuilder;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/