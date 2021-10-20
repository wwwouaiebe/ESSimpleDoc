import theConfig from './Config.js';
import fs from 'fs';

class SourceFileBuilder {

	#html = '';
	constructor ( ) {
	}

	build ( fileContent, fileName ) {

		this.#html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			'<link type="text/css" rel="stylesheet" href="../src/myDoc.css"></head><body>';

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
		const sourceFileName =
			theConfig.docDir +
			fileName.split ( '/' ).reverse ( ) [ 0 ].split ( '.' ) [ 0 ] +
			'js.html';
		fs.writeFileSync ( sourceFileName, this.#html );
	}
}

export default SourceFileBuilder;