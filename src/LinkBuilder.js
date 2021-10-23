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
		if ( variableDoc.commentsDoc?.global ) {
			this.#variablesLinks.set (
				variableDoc.name,
				`variables.html#${variableDoc.name}`
			);
		}
	}

	get variablesLinks ( ) {
		if ( ! this.#variablesLinksCache ) {
			this.#variablesLinksCache = Array.from ( this.#variablesLinks ).sort (
				( first, second ) => first [ 0 ] .localeCompare ( second [ 0 ] )
			);
		}
		return this.#variablesLinksCache;
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