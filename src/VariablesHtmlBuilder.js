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
import theLinkBuilder from './LinkBuilder.js';
import NavHtmlBuilder from './NavHtmlBuilder.js';

/**
Build the HTML page for all the variables
*/

class VariablesHtmlBuilder {

	#html = '';

	constructor ( ) {
		Object.freeze ( this );
	}

	#buildVariable ( variableDoc ) {
		
		if ( ! variableDoc.commentsDoc ) {
			return;
		}

		// type
		const typePostfix =
			variableDoc?.commentsDoc?.type
				?
				' : ' + theLinkBuilder.getClassLink ( variableDoc?.commentsDoc?.type, '' )
				:
				'';

		variableDoc.commentsDoc?.type ?? '';
		this.#html +=
			`<a id="${variableDoc.name}"></a><h3><span>${variableDoc?.kind ?? ''} </span>` +
			`${variableDoc.name}<span>${typePostfix}</span></h3>`;

		// description
		const desc =
			variableDoc?.commentsDoc?.desc
				?
				theLinkBuilder.getDescLink ( variableDoc.commentsDoc.desc, '' )
				:
				' ...No description provided. Coming soon?';
			
			
		this.#html += `<div>${desc}</div>`;

		// source

		const sourceLink = theLinkBuilder.getSourceLink ( variableDoc );
		this.#html += `<div>Source : <a href="${sourceLink}"> file ${variableDoc.file} at line ${variableDoc.line}</a></div>`;
	}

	build ( variablesDocs ) {

		const navHtmlBuilder = new NavHtmlBuilder ( );
		variablesDocs.sort ( ( first, second ) => first.name.localeCompare ( second.name ) );
		this.#html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			'<link type="text/css" rel="stylesheet" href="SimpleESDoc.css"></head><body>';

		this.#html += navHtmlBuilder.build ( '' );

		this.#html += '<h1>Global variables</h1>';
		variablesDocs.forEach ( variableDoc => this.#buildVariable ( variableDoc ) );

		this.#html += navHtmlBuilder.footer;

		this.#html += '</body></html>';

		fs.writeFileSync ( theConfig.docDir + 'variables.html', this.#html );
	}
}

export default VariablesHtmlBuilder;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/