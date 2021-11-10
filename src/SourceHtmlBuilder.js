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
import theLinkBuilder from './LinkBuilder.js';
import theConfig from './Config.js';

/**
Build the sources HTML pages
*/

class SourceHtmlBuilder {

	/**
	A sources files counter
	@type {Number}
	*/

	#sourcesCounter;

	/**
	A list with JS keyword that will be colored in blue in the sources files
	@type {Array.<String>}
	*/

	static get #jsKeywords ( ) {
		return [
			'async',
			'await',
			'break',
			'class',
			'const',
			'constructor',
			'export',
			'for',
			'get',
			'import',
			'let',
			'new',
			'return',
			'set',
			'static',
			'switch',
			'this',
			'throw',
			'try',
			'catch',
			'while'
		];
	}

	/**
	The path between the html file and theConfig.docDir ( something like '../../../', depending of the folders tree )
	@type {String}
	*/

	#rootPath;

	/**
	The content of the source file
	@type {String}
	*/

	#fileContent;

	/**
	A counter for the comments in the source file
	@type {Number}
	*/

	#commentCounter;

	/**
	A helper method for the parseLine method. Count the occurences of word in text
	@param {String} text The text in witch the word must be searched
	@param {String} word The word to search
	@return {Number} The number of occurences found.
	*/

	#countWords ( text, word ) {
		let counter = 0;
		let position = text.indexOf ( word );

		while ( -1 !== position ) {
			counter ++;
			position = text.indexOf ( word, position + 1 );
		}

		return counter;
	}

	/**
	Colorize the js keywords in the source file content
	*/

	#colorizeJSKeywords ( ) {
		SourceHtmlBuilder.#jsKeywords.forEach (
			keyword => {
				const regexp = new RegExp ( '(?<=[\n| |,|;|.])' + keyword + '(?=[ |,|;|.])', 'g' );
				this.#fileContent = this.#fileContent.replaceAll ( regexp, '<span class="jsKeyword">' + keyword + '</span>' );
			}
		);
	}

	/**
	add the classes links in the source file content
	*/

	#setClassesLinks ( ) {
		theLinkBuilder.classesLinks.forEach (
			classLink => {
				const regexp = new RegExp ( '(?<=[\n| |,|;|.|{])' + classLink [ 0 ] + '(?=[ |,|;|.|}|\r|\n])', 'g' );
				this.#fileContent = this.#fileContent.replaceAll (
					regexp,
					`<a class="classLink" href="${this.#rootPath + classLink [ 1 ]}">` + classLink [ 0 ] + '</a>'
				);
			}
		);
	}

	/**
	add the variables links in the source file content
	*/

	#setVariablesLinks ( ) {
		theLinkBuilder.variablesLinks.forEach (
			variableLink => {
				const regexp = new RegExp ( '(?<=[\n| |,|;|.])' + variableLink [ 0 ] + '(?=[ |,|;|.|\r|\n])', 'g' );
				this.#fileContent = this.#fileContent.replaceAll (
					regexp,
					`<a class="variableLink" href="${this.#rootPath + variableLink [ 1 ]}">` + variableLink [ 0 ] + '</a>'
				);
			}
		);
	}

	/**
	Parse a line of the source file content, adding span to the comments
	@param {String} line The line to parseLine
	@return {String} The line parsed and completed with span html tags
	*/

	#parseLine ( line ) {
		let parsedLine = line;
		if ( 0 !== this.#commentCounter ) {
			parsedLine = '<span class="codeComments">' + parsedLine;
		}
		this.#commentCounter = this.#commentCounter +
			this.#countWords ( parsedLine, '/*' ) -
			this.#countWords ( parsedLine, '*/' );
		parsedLine = parsedLine.replaceAll ( '/*', '<span class="codeComments">/*' ).replaceAll ( '*/', '*/</span>' );
		if ( -1 !== parsedLine.indexOf ( '//' ) ) {
			parsedLine = parsedLine.replace ( '//', '<span class="codeComments">//' ) + '</span>';
		}
		if ( 0 !== this.#commentCounter ) {
			parsedLine += '</span>';
		}
		return parsedLine;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#sourcesCounter = 0;
	}

	/**
	A sources files counter
	@type {Number}
	*/

	get sourcesCounter ( ) { return this.#sourcesCounter; }

	/**
	Build the  source html file.
	@param {String} fileContent The file content
	@param {String} fileName The file name, including the path since theConfig.docDir
	*/

	build ( fileContent, fileName ) {

		this.#sourcesCounter ++;

		// Computing rootPath, htmlFilePath and dirs
		// dirs is an array with all the folders between theConfig.docDir and the htmlFile
		// rootPath is the path between the htmlFile and theConfig.docDir
		// htmlFilePath is the path between theConfig.docDir and the htmlFile
		const dirs = fileName.split ( '/' );
		const htmlFileName = dirs.pop ( ).split ( '.' ) [ 0 ] + 'js.html';
		this.#rootPath = '';
		dirs.forEach ( ( ) => this.#rootPath += '../' );

		const navHtmlBuilder = new NavHtmlBuilder ( );

		// head
		let html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			`<link type="text/css" rel="stylesheet" href="${this.#rootPath}ESSimpleDoc.css"></head><body>`;

		// nav
		html += navHtmlBuilder.build ( this.#rootPath );

		// title
		html += `<h1>File : ${fileName}</h1>`;

		// Removing html entities and tabs
		this.#fileContent = fileContent
			.replaceAll ( '\t', '    ' )
			.replaceAll ( /\u003c/g, '&lt;' )
			.replaceAll ( /\u003e/g, '&gt;' )
			.replaceAll ( /\u0022/g, '&quot;' )
			.replaceAll ( /\u0027/g, '&apos;' );

		// Adding color span and links
		if ( ! theConfig.noSourcesColor ) {
			this.#colorizeJSKeywords ( );
			this.#setClassesLinks ( );
			this.#setVariablesLinks ( );
		}

		// creating the file content
		let lineCounter = 0;
		this.#commentCounter = 0;
		html += '<table class="srcCode">';

		// splitting file into lines
		this.#fileContent.split ( /\r\n|\r|\n/ ).forEach (
			line => {

				// and adding a row in the html table
				lineCounter ++;
				const strLineCounter = String ( lineCounter ).padStart ( 5, '_' );
				html +=
					`<tr><td><a id="L${strLineCounter}">${lineCounter}</a></td>` +
					`<td><pre>${this.#parseLine ( line )}</pre></td></tr>`;
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