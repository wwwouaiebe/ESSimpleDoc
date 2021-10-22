import theConfig from './Config.js';
import FileWriter from './FileWriter.js';
import theLinkBuilder from './LinkBuilder.js';

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
		let htmlFilePath = '';
		let rootPathCounter = dirs.length;
		dirs.forEach ( 
			dir => {
				htmlFilePath += dir + '/';
				rootPath += '../';
			}
		);

		//head
		let html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			`<link type="text/css" rel="stylesheet" href="${rootPath}../src/myDoc.css"></head><body>`;

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
				
				html += `<div class="srcCode"><a id="L${strLineCounter}">${strLineCounter}</a>` +
					`&nbsp;&nbsp;&nbsp;&nbsp;${htmlLine}</div>`;
			}
		);

		html += '</body></html>';

		// write file
		new FileWriter ( ).write ( dirs, htmlFileName, html );

		// Saving link
		theLinkBuilder.setSourceLink ( fileName, htmlFilePath + htmlFileName );
	}
}

export default SourceHtmlBuilder;