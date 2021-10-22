import fs from 'fs';
import theConfig from './Config.js';

class VariablesHtmlBuilder {

	#html = '';

	constructor ( ) {
	}

	#buildVariable ( variableDoc ) {
		if ( ! variableDoc.commentsDoc ) {
			return;
		}
		this.#html +=
			`<a id="${variableDoc.name}"></a><h3><span>${variableDoc?.kind ?? ''} </span>` +
			`${variableDoc.name}` +
			` : <span>${variableDoc.commentsDoc?.type ?? ''}</span></h3>`;

		if ( variableDoc.commentsDoc?.desc && '' !== variableDoc.commentsDoc.desc ) {
			this.#html += `<div>${variableDoc.commentsDoc.desc}</div>`;
		}
		this.#html += `<div>Source : file ${variableDoc.file} at line ${variableDoc.line}</div>`;
	}

	build ( variablesDocs ) {
		this.#html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			'<link type="text/css" rel="stylesheet" href="../src/myDoc.css"></head><body>';
		this.#html += '<h1>Global variables</h1>';
		variablesDocs.forEach ( variableDoc => this.#buildVariable ( variableDoc ) );
		this.#html += '</body></html>';
		fs.writeFileSync ( theConfig.docDir + 'variables.html', this.#html );
	}
}

export default VariablesHtmlBuilder;