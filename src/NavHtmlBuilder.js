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
Doc reviewed 20211021
*/

import theLinkBuilder from './LinkBuilder.js';

/**
Build the nav and footer HTMLElements for all the HTML pages
*/

class NavHtmlBuilder {

	/**
	The path between the html file and theConfig.docDir ( something like '../../../', depending of the folders tree )
	@type {String}
	*/

	#rootPath;

	/**
	The navigation html string
	@type {String}
	*/

	#navHtml;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Add the li html elements to the nav html string for files, variables and classes
	@param {Array.<Array.<String>>} links The links to add
	*/

	#buildList ( links ) {
		let firstLetter = '';
		links.forEach (
			link => {
				if ( firstLetter !== link [ 0 ] [ 0 ].toUpperCase ( ) ) {
					firstLetter = link [ 0 ] [ 0 ].toUpperCase ( );
					this.#navHtml += `<li class="navLetter">${firstLetter}</li>`;
				}
				this.#navHtml += `<li><a href="${this.#rootPath + link [ 1 ]}">${link [ 0 ]}</a> </li>`;
			}
		);
	}

	/**
	Build the nav html element for an html page
	@param {String} rootPath The path between the file where the nav will be inserted and theConfig.docDir
	( something like '../../../', depending of the folders tree )
	@return {String} The nav html
	*/

	build ( rootPath ) {

		this.#rootPath = rootPath;

		this.#navHtml = '<nav>';

		this.#navHtml += `<div id="homeNav"><a href="${this.#rootPath + 'index.html'}">🏠</a></div>`;

		this.#navHtml += '<div id="sourcesNav">Sources</div><ul id="sourcesNavList">';
		this.#buildList ( theLinkBuilder.sourcesLinks );
		this.#navHtml += '</ul>';

		this.#navHtml += '<div id="variablesNav">Globals</div><ul id="variablesNavList">';
		this.#buildList ( theLinkBuilder.variablesLinks );
		this.#navHtml += '</ul>';

		this.#navHtml += '<div id="classesNav">Classes</div><ul id="classesNavList">';
		this.#buildList ( theLinkBuilder.classesLinks );
		this.#navHtml += '</ul>';

		this.#navHtml += '<div id="showPrivateNav" title="Show or hide private properties and methods">#</div>';

		this.#navHtml += '</nav>';

		return this.#navHtml;
	}

	/**
	The footer to be inserted in the html pages
	@type {String} The fooder html
	*/

	get footer ( ) {
		return '<footer>Documentation generated with ' +
			'<a href="https://github.com/wwwouaiebe/ESSimpleDoc" target="_blank" rel="noopener noreferrer">' +
			'ESSimpleDoc</a></footer>';
	}
}

export default NavHtmlBuilder;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/