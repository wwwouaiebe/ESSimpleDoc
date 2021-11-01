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

import FileWriter from './FileWriter.js';
import NavHtmlBuilder from './NavHtmlBuilder.js';

/**
Build the sources HTML pages
*/

class SourceHtmlBuilder {

	#commentCounter = 0;

	#countWords ( text, word ) {
		let counter = 0;
		let position = text.indexOf ( word );

		while (-1 !== position) {
			counter ++;
			position = text.indexOf ( word, position + 1 );
		}			
		
		return counter;
	}

	#parseLine ( line ) {
		let parsedLine = line;
		if ( 0 !== this.#commentCounter ) {
			parsedLine = '<span class="codeComments">' + parsedLine;
		}
		this.#commentCounter = this.#commentCounter +
			this.#countWords ( parsedLine, '/*' ) -
			this.#countWords ( parsedLine, '*/' );
		parsedLine = parsedLine.replaceAll ( '/*' , '<span class="codeComments">/*' ).replaceAll ( '*/' , '*/</span>' );
		if ( -1 !== parsedLine.indexOf ( '//') ) {
			parsedLine = parsedLine.replace ( '//', '<span class="codeComments">//' ) + '</span>';
		}
		if ( 0 !== this.#commentCounter ) {
			parsedLine = parsedLine + '</span>';
		}
		return parsedLine;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Build the a source html file.
	@param {String} fileContent The file content
	@param {String} fileName The file name, including the path since theConfig.docDir
	*/

	build ( fileContent, fileName ) {

		// Computing rootPath, htmlFilePath and dirs
		// dirs is an array with all the folders between theConfig.docDir and the htmlFile
		// rootPath is the path between the htmlFile and theConfig.docDir
		// htmlFilePath is the path between theConfig.docDir and the htmlFile
		const dirs = fileName.split ( '/' );
		const htmlFileName = dirs.pop ( ).split ( '.' ) [ 0 ] + 'js.html';
		let rootPath = '';
		dirs.forEach ( ( ) => rootPath += '../' );

		const navHtmlBuilder = new NavHtmlBuilder ( );

		// head
		let html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			`<link type="text/css" rel="stylesheet" href="${rootPath}SimpleESDoc.css"></head><body>`;

		// nav
		html += navHtmlBuilder.build ( rootPath );

		html += `<h1>File : ${fileName}</h1>`;

		html += '<table class="srcCode">';

		// body
		let lineCounter = 0;

		// splitting file into lines
		fileContent.split ( /\r\n|\r|\n/ ).forEach (
			line => {
				lineCounter ++;
				const strLineCounter = String ( lineCounter ).padStart ( 5, '_' );

				const htmlLine = line
					.replaceAll ( '\t', '    ' )
					
					// replacing < and >
					.replaceAll ( /\u003c/g, '&lt;' )
					.replaceAll ( /\u003e/g, '&gt;' )
					.replaceAll ( /\u0022/g, '&quot;' )
					.replaceAll ( /\u0027/g, '&apos;' )
					
				html +=
					`<tr><td><a id="L${strLineCounter}">${lineCounter}</a></td><td><pre>${this.#parseLine ( htmlLine )}</pre></td></tr>`;
			}
		);

		html += '</table>';

		// footer
		html += navHtmlBuilder.footer;
		html +=
			'<script>document.getElementById ( new URL ( window.location' +
			' ).hash.substr( 1 ) )?.parentNode.classList.add ( \'hash\' )</script>';
		html += '</body></html>';

		// write file
		new FileWriter ( ).write ( dirs, htmlFileName, html );

	}
}

export default SourceHtmlBuilder;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/