import fs from 'fs';
import theConfig from './Config.js';
import theLinkBuilder from './LinkBuilder.js';
import NavBuilder from './NavBuilder.js';

class VariablesHtmlBuilder {

	#html = '';

	constructor ( ) {
		Object.freeze ( this );
	}

	#buildVariable ( variableDoc ) {
		if ( ! variableDoc.commentsDoc || ! variableDoc.commentsDoc.global ) {
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
		if ( variableDoc.commentsDoc?.desc && '' !== variableDoc.commentsDoc.desc ) {
			this.#html += `<div>${variableDoc.commentsDoc.desc}</div>`;
		}

		// source

		const sourceLink = theLinkBuilder.getSourceLink ( variableDoc );
		this.#html += `<div>Source : <a href="${sourceLink}"> file ${variableDoc.file} at line ${variableDoc.line}</a></div>`;
	}

	build ( variablesDocs ) {
		variablesDocs.sort ( ( first, second ) => first.name.localeCompare ( second.name ) );
		this.#html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			'<link type="text/css" rel="stylesheet" href="../src/myDoc.css"></head><body>';
			
		this.#html += new NavBuilder ( ).build ( '' );

		this.#html += '<h1>Global variables</h1>';
		variablesDocs.forEach ( variableDoc => this.#buildVariable ( variableDoc ) );
		this.#html += '</body></html>';
		fs.writeFileSync ( theConfig.docDir + 'variables.html', this.#html );
	}
}

export default VariablesHtmlBuilder;