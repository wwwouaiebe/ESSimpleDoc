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

import theLinkBuilder from './LinkBuilder.js';

/**
Build the nav and footer HTMLElements for all the HTML pages
*/

class NavHtmlBuilder {

	constructor ( ) {
		Object.freeze ( this );
	}

	build ( rootPath ) {

		let navHtml = '<nav><div id="sourcesNav">Sources</div><ul id="sourcesNavList">';
		theLinkBuilder.sourcesLinks.forEach (
			sourceLink => {
				navHtml += `<li><a href="${rootPath + sourceLink [ 1 ]}">${sourceLink [ 0 ]}</a> </li>`;
			}
		);
		navHtml += '</ul>';

		navHtml += '<div id="variablesNav">Globals</div><ul id="variablesNavList">';
		theLinkBuilder.variablesLinks.forEach (
			variableLink => {
				navHtml += `<li><a href="${rootPath + variableLink [ 1 ]}">${variableLink [ 0 ]}</a> </li>`;
			}
		);
		navHtml += '</ul>';

		navHtml += '<div id="classesNav">Classes</div><ul id="classesNavList">';
		theLinkBuilder.classesLinks.forEach (
			classLink => {
				navHtml += `<li><a href="${rootPath + classLink [ 1 ]}">${classLink [ 0 ]}</a> </li>`;
			}
		);
		navHtml += '</ul></nav>';
		return navHtml;
	}

	get footer ( ) {
		return '<footer>Documentation generated with ' +
			'<a href="https://github.com/wwwouaiebe/SimpleESDoc" target="_blank" rel="noopener noreferrer">' +
			'SimpleESDoc</a></footer>';
	}
}

export default NavHtmlBuilder;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/