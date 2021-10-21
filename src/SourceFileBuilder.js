import theConfig from './Config.js';
import FileWriter from './FileWriter.js';

class SourceFileBuilder {

	#html = '';
	constructor ( ) {
	}

	build ( fileContent, fileName ) {
		
		const dirs = fileName.split ( '/' );
		const htmlFileName = dirs.pop ( ).split ( '.' ) [ 0 ]+ 'js.html';

		let rootPath = '';
		let rootPathCounter = dirs.length;
		while ( 0 < rootPathCounter ) {
			rootPath += '../';
			rootPathCounter --;
		};

		this.#html =
			`<!DOCTYPE html><html><head><meta charset="UTF-8">` +
			`<link type="text/css" rel="stylesheet" href="${rootPath}src/myDoc.css"></head><body>`;

		let lineCounter = 0;
		fileContent.split ( /\r\n|\r|\n/ ).forEach (
			line => {

				lineCounter ++;
				const strLineCounter = String ( lineCounter ).padStart ( 5, '_' );
				this.#html += `<div class="srcCode"><a id="L${strLineCounter}">${strLineCounter}</a>` +
					'&nbsp;&nbsp;&nbsp;&nbsp;' +
					`${line.replaceAll ( '\t', '&nbsp;&nbsp;&nbsp;&nbsp;' ).replaceAll ( ' ', '&nbsp;' )}</div>`;
			}
		);

		this.#html += '</body></html>';

		new FileWriter ( ).write ( dirs, htmlFileName, this.#html );
	}
}

export default SourceFileBuilder;