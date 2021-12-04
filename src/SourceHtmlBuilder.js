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
		- Issue ♯1 : Improve colorization of sources files...
Doc reviewed 20211111
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import FileWriter from './FileWriter.js';
import NavHtmlBuilder from './NavHtmlBuilder.js';
import theLinkBuilder from './LinkBuilder.js';
import theConfig from './Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Build the sources HTML pages
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

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
	The path between the html file and theConfig.destDir ( something like '../../../', depending of the folders tree )
	@type {String}
	*/

	#rootPath;

	/**
	The content of the source file
	@type {String}
	*/

	#fileContent;

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
	@param {String} fileName The file name, including the path since theConfig.destDir
	@param {Array.<TagData>} tagsData An array with the tags to insert in the souce file
	*/

	build ( fileContent, fileName, tagsData ) {

		this.#sourcesCounter ++;

		// Computing rootPath, htmlFilePath and dirs
		// dirs is an array with all the folders between theConfig.destDir and the htmlFile
		// rootPath is the path between the htmlFile and theConfig.destDir
		// htmlFilePath is the path between theConfig.destDir and the htmlFile
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

		if ( tagsData ) {

			// tagsDdata is sorted by line number and column number.
			// TagsData with column === null are the last
			tagsData.sort (
				( first, second ) => {
					if ( first.line === second.line ) {
						if ( null === second.column ) {
							return -1;
						}
						else if ( null === first.column ) {
							return 1;
						}
						return second.column - first.column;
					}

					return first.line - second.line;

				}
			);

			// File content is splitted into lines
			let lines = fileContent.split ( /\r\n|\r|\n/ );

			// and then tags are inserted
			let previousTag = { line : -1, column : -1, tag : '' };
			tagsData.forEach (
				tag => {
					if ( previousTag.line !== tag.line || previousTag.column !== tag.column ) {
						let line = lines [ tag.line - 1 ];
						if ( null === tag.column ) {
							line += tag.tag;
						}
						else {
							line = line.substring ( 0, tag.column ) + tag.tag + line.substring ( tag.column );
						}
						lines [ tag.line - 1 ] = line;
					}

					previousTag = tag;
				}
			);

			// Line are reassembled into a unique string to avoid a lot of replaceAll
			this.#fileContent = '';
			lines.forEach (
				line => this.#fileContent += line + '\n'
			);
		}
		else {
			this.#fileContent = fileContent;
		}

		this.#fileContent = this.#fileContent

			// Removing tabs
			.replaceAll ( '\t', '    ' )

			// Removing html entities
			.replaceAll ( /\u003c/g, '&lt;' )
			.replaceAll ( /\u003e/g, '&gt;' )
			.replaceAll ( /\u0022/g, '&quot;' )
			.replaceAll ( /\u0027/g, '&apos;' )

			// replacing < > and quot in tags for literals and comments
			.replaceAll ( /§lt§/g, '<' )
			.replaceAll ( /§gt§/g, '>' )
			.replaceAll ( /§quot§/g, '"' );

		// Adding color span and links
		if ( ! theConfig.noSourcesColor ) {
			this.#colorizeJSKeywords ( );
			this.#setClassesLinks ( );
			this.#setVariablesLinks ( );
		}

		// creating the file content in a html table
		let lineCounter = 0;
		html += '<table class="srcCode">';

		// splitting file into lines
		this.#fileContent.split ( /\r\n|\r|\n/ ).forEach (
			line => {

				// and adding a row in the html table
				lineCounter ++;
				const strLineCounter = String ( lineCounter ).padStart ( 5, '_' );
				html +=
					`<tr><td><a id="L${strLineCounter}">${lineCounter}</a></td>` +
					`<td><pre>${line}</pre></td></tr>`;
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

/* --- End of file --------------------------------------------------------------------------------------------------------- */