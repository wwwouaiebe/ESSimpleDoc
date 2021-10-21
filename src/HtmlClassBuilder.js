import FileWriter from './FileWriter.js';
import LinkBuilder from './LinkBuilder.js';

class HtmlClassBuilder {

	#html = '';
	#rootPath = '';
	#linkBuilder = null;

	constructor ( ) { }

	#buildParams ( methodOrProperty ) {
		this.#html += '<h4>Parameters</h4>';
		this.#html += '<table><tr><th>Name</th> <th>Type</th> <th>Description</th></tr>';
		methodOrProperty.params.forEach (
			param => {
				const paramDoc = methodOrProperty?.doc?.params.find ( first => first.name === param );
				const paramType = paramDoc ? paramDoc.type : '';
				const paramDesc = paramDoc ? paramDoc.desc : '';
				this.#html += `<tr><td>${param}</td> <td>${paramType}</td> <td>${paramDesc}</td></tr>`;
			}
		);
		this.#html += '</table>';
	}

	#buildMethodsAndProperties ( methodsOrPropertiesDoc, heading ) {
		if ( 0 === methodsOrPropertiesDoc.length ) {
			return;
		}
		this.#html += `${heading}`;
		methodsOrPropertiesDoc.forEach (
			methodOrProperty => {
				const cssClassName = methodOrProperty.private ? 'private' : 'public';
				const asyncPrefix = methodOrProperty.async ? '<span>async</span> ' : '';
				const staticPrefix = methodOrProperty.static ? '<span>static</span> ' : '';
				const namePrefix = methodOrProperty.private ? '#' : '';
				const getSetPrefix =
					'set' === methodOrProperty.kind || 'get' === methodOrProperty.kind
						?
						'<span>' + methodOrProperty.kind + '</span> '
						:
						'';
				const type = methodOrProperty?.doc?.type ? '<span> : ' + methodOrProperty.doc.type + '</span>' : '';
				this.#html += `<div class="${cssClassName}">`;
				this.#html +=
					`<h3>${asyncPrefix}${staticPrefix}${getSetPrefix}${namePrefix}${methodOrProperty.name} ${type}</h3>`;
				this.#html += `<div>${methodOrProperty?.doc?.desc ?? '...description coming soon?'}</div>`;

				if ( methodOrProperty.params && 0 !== methodOrProperty.params.length && 0 === getSetPrefix.length ) {
					this.#buildParams ( methodOrProperty );
				}

				if (
					methodOrProperty.doc &&
					( '' !== methodOrProperty.doc.returns.type || '' !== methodOrProperty.doc.returns.desc )
				) {
					this.#html += `<h4>Returns</h4><div>${methodOrProperty.doc.returns.desc}</div>` +
						`<div>Type : ${methodOrProperty.doc.returns.type}</div>`;
				}

				this.#html += `<div>Source : file ${methodOrProperty.file} at line ${methodOrProperty.line}</div>`;
				this.#html += '</div>';
			}
		);
	}

	build ( classDoc ) {
		this.#linkBuilder = new LinkBuilder ( );
		this.#html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			`<link type="text/css" rel="stylesheet" href="${classDoc.rootPath}../src/myDoc.css"></head><body>`;

		const superClass = classDoc?.superClass ? ' extends ' + classDoc.superClass : '';

		this.#html += `<h1>Class ${classDoc.name} ${superClass}</h1>`;

		if ( classDoc?.doc?.desc ) {
			this.#html += `<div>${classDoc.doc.desc}</div>`;
		}

		const sourceLink = this.#linkBuilder.getSourceLink ( classDoc );

		this.#html += `<div>Source : <a href="${sourceLink}"> file ${classDoc.file} at line ${classDoc.line}</a></div>`;
		this.#buildMethodsAndProperties (
			classDoc.methodsAndProperties.filter (
				methodOrProperty => (
					'property' === methodOrProperty.isA &&
						methodOrProperty.private
				)
			).sort ( ( first, second ) => first.name.localeCompare ( second.name ) ),
			'<h2 class="private">Private properties</h2>'
		);

		this.#buildMethodsAndProperties (
			classDoc.methodsAndProperties.filter (
				methodOrProperty => (
					'method' === methodOrProperty.isA &&
						methodOrProperty.private &&
						( 'set' === methodOrProperty.kind || 'get' === methodOrProperty.kind ) &&
						'constructor' !== methodOrProperty.kind
				)
			).sort ( ( first, second ) => ( first.name + first.kind ).localeCompare ( second.name + second.kind ) ),
			'<h2 class="private">Private getters and setters</h2>'
		);

		this.#buildMethodsAndProperties (
			classDoc.methodsAndProperties.filter (
				methodOrProperty => (
					'method' === methodOrProperty.isA &&
						methodOrProperty.private &&
						'set' !== methodOrProperty.kind &&
						'get' !== methodOrProperty.kind	&&
						'constructor' !== methodOrProperty.kind
				)
			).sort ( ( first, second ) => first.name.localeCompare ( second.name ) ),
			'<h2 class="private">Private methods</h2>'
		);

		this.#buildMethodsAndProperties (
			classDoc.methodsAndProperties.filter (
				methodOrProperty => (
					'method' === methodOrProperty.isA &&
						'constructor' === methodOrProperty.kind
				)
			),
			'<h2 class="public">Constructor</h2>'
		);

		this.#buildMethodsAndProperties (
			classDoc.methodsAndProperties.filter (
				methodOrProperty => (
					'property' === methodOrProperty.isA &&
						! methodOrProperty.private
				)
			).sort ( ( first, second ) => first.name.localeCompare ( second.name ) ),
			'<h2 class="public">Public properties</h2>'
		);

		this.#buildMethodsAndProperties (
			classDoc.methodsAndProperties.filter (
				methodOrProperty => (
					'method' === methodOrProperty.isA &&
						! methodOrProperty.private &&
						( 'set' === methodOrProperty.kind || 'get' === methodOrProperty.kind ) &&
						'constructor' !== methodOrProperty.kind
				)
			).sort ( ( first, second ) => ( first.name + first.kind ).localeCompare ( second.name + second.kind ) ),
			'<h2 class="public">Public getters and setters</h2>'
		);

		this.#buildMethodsAndProperties (
			classDoc.methodsAndProperties.filter (
				methodOrProperty => (
					'method' === methodOrProperty.isA &&
						! methodOrProperty.private &&
						'set' !== methodOrProperty.kind &&
						'get' !== methodOrProperty.kind	&&
						'constructor' !== methodOrProperty.kind
				)
			).sort ( ( first, second ) => first.name.localeCompare ( second.name ) ),
			'<h2 class="public">Public methods</h2>'
		);

		this.#html += '</body></html>';

		const dirs = classDoc.file.split ( '/' );
		dirs.pop ( );
		new FileWriter ( ).write ( dirs, classDoc.name + '.html', this.#html );
	}
}

export default HtmlClassBuilder;