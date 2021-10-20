import fs from 'fs';
import theConfig from './Config.js';

class HtmlBuilder {

	#html = ''

	constructor ( ) { }

	#buildParams ( methodOrProperty ) {
		this.#html += '<h4>Parameters</h4>';
		methodOrProperty.params.forEach (
			param => {
				const paramDoc = methodOrProperty?.doc?.params.find ( first => first.name === param );
				const paramType = paramDoc ? paramDoc.type : '';
				const paramDesc = paramDoc ? paramDoc.desc : '';
				this.#html += `<div>${param}</div> <div>${paramType}</div> <div>${paramDesc}</div>`;
			}
		);
	}

	#buildMethodsAndProperties ( methodsOrPropertiesDoc, heading ) {
		if ( 0 === methodsOrPropertiesDoc.length ) {
			return;
		}
		this.#html += `${heading}`;
		methodsOrPropertiesDoc.forEach (
			methodOrProperty => {
				const className = methodOrProperty.private ? 'private' : 'public';
				const asyncPrefix = methodOrProperty.async ? 'async ' : '';
				const staticPrefix = methodOrProperty.static ? 'static ' : '';
				const namePrefix = methodOrProperty.private ? '#' : '';
				const getSetPrefix =
					'set' === methodOrProperty.kind || 'get' === methodOrProperty.kind
						?
						methodOrProperty.kind + ' '
						:
						'';
				const type = methodOrProperty?.doc?.type ?? '';
				this.#html += `<div class="${className}">`;
				this.#html +=
					`<h3>${asyncPrefix}${staticPrefix}${getSetPrefix}${namePrefix}${methodOrProperty.name} ${type}</h3>`;
				this.#html += `<div>${methodOrProperty?.doc?.desc ?? '...description coming soon?'}</div>`;

				if ( methodOrProperty.params && 0 !== methodOrProperty.params.length ) {
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

	#buildClass ( classDoc ) {
		this.#html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			'<link type="text/css" rel="stylesheet" href="myDoc.css"></head><body>';

		const superClass = classDoc?.superClass ? ' extends ' + classDoc.superClass : '';

		this.#html += `<h1>Class ${classDoc.name} ${superClass}</h1>`;

		this.#html += `<div>Source : file ${classDoc.file} at line ${classDoc.line}</div>`;
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

		fs.writeFileSync ( theConfig.docDir + classDoc.name + '.html', this.#html );
	}

	build ( doc ) {
		doc.forEach (
			classDoc => {
				this.#buildClass ( classDoc );
			}
		);
	}

}

export default HtmlBuilder;