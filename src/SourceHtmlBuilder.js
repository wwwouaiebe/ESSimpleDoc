import FileWriter from './FileWriter.js';
import NavBuilder from './NavBuilder.js';

class SourceHtmlBuilder {

	constructor ( ) {
		Object.freeze ( this );
	}

	build ( fileContent, fileName ) {

		// Computing rootPath, htmlFilePath and dirs
		// dirs is an array with all the folders between theConfig.docDir and the htmlFile
		// rootPath is the path between the htmlFile and theConfig.docDir
		// htmlFilePath is the path between theConfig.docDir and the htmlFile
		const dirs = fileName.split ( '/' );
		const htmlFileName = dirs.pop ( ).split ( '.' ) [ 0 ] + 'js.html';
		let rootPath = '';
		dirs.forEach ( ( ) => rootPath += '../' );

		const navBuilder = new NavBuilder ( );

		// head
		let html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			`<link type="text/css" rel="stylesheet" href="${rootPath}../src/myDoc.css"></head><body>`;

		// nav
		html += navBuilder.build ( rootPath );

		html += `<h1>File : ${fileName}</h1>`;

		// body
		let lineCounter = 0;
		fileContent.split ( /\r\n|\r|\n/ ).forEach (
			line => {
				lineCounter ++;
				const strLineCounter = String ( lineCounter ).padStart ( 5, '_' );
				const htmlLine = line
					.replaceAll ( '\t', '&nbsp;&nbsp;&nbsp;&nbsp;' )
					.replaceAll ( ' ', '&nbsp;' )
					.replaceAll ( '<', '&lt;' )
					.replaceAll ( '>', '&gt;' );

				html +=
					`<div class="srcCode"><a id="L${strLineCounter}">${strLineCounter}</a>` +
					`&nbsp;&nbsp;&nbsp;&nbsp;${htmlLine}</div>`;
			}
		);

		html += navBuilder.footer;
		html +=
			'<script>document.getElementById ( new URL ( window.location' +
			' ).hash.substr( 1 ) )?.parentNode.classList.add ( \'hash\' )</script>';
		html += '</body></html>';

		// write file
		new FileWriter ( ).write ( dirs, htmlFileName, html );

	}
}

export default SourceHtmlBuilder;