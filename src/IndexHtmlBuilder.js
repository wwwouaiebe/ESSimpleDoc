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

import fs from 'fs';
import theConfig from './Config.js';
import NavHtmlBuilder from './NavHtmlBuilder.js';
import { marked } from 'marked';

/**
Build the index.html home page
*/

class IndexHtmlBuilder {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Build the index.html page
	*/

	build ( ) {

		const navHtmlBuilder = new NavHtmlBuilder ( );

		// head
		let html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			'<link type="text/css" rel="stylesheet" href="ESSimpleDoc.css"></head><body>';

		// nav
		html += navHtmlBuilder.build ( '' );

		// reading the content of the indexUserContent.html file
		if ( fs.existsSync ( theConfig.srcDir + 'index.md' ) ) {

			// and adding to the html
			html += marked.parse ( fs.readFileSync ( theConfig.srcDir + 'index.md', 'utf8' ) );
		}
		else {

			// or adding a default content
			html += '<div><p>Move the mouse on one of the blue, green or red rectangles on top of the page to display' +
			' the menus and select an item in the menu.<p></div>';
		}

		// footer
		html += navHtmlBuilder.footer;
		html += '</body></html>';

		// writing file
		fs.writeFileSync ( theConfig.docDir + 'index.html', html );
	}
}

export default IndexHtmlBuilder;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/