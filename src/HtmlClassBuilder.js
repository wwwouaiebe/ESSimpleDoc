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
			methodOrPropertyDoc => {
				const cssClassName = methodOrPropertyDoc.private ? 'private' : 'public';
				const asyncPrefix = methodOrPropertyDoc.async ? '<span>async</span> ' : '';
				const staticPrefix = methodOrPropertyDoc.static ? '<span>static</span> ' : '';
				const namePrefix = methodOrPropertyDoc.private ? '#' : '';
				const getSetPrefix =
					'set' === methodOrPropertyDoc.kind || 'get' === methodOrPropertyDoc.kind
						?
						'<span>' + methodOrPropertyDoc.kind + '</span> '
						:
						'';
				const type = methodOrPropertyDoc?.commentsDoc?.type ? '<span> : ' + methodOrPropertyDoc.commentsDoc.type + '</span>' : '';
				this.#html += `<div class="${cssClassName}">`;
				this.#html +=
					`<h3>${asyncPrefix}${staticPrefix}${getSetPrefix}${namePrefix}${methodOrPropertyDoc.name} ${type}</h3>`;
				this.#html += `<div>${methodOrPropertyDoc?.commentsDoc?.desc ?? '...description coming soon?'}</div>`;

				this.#html += `<div>Source : file ${methodOrPropertyDoc.file} at line ${methodOrPropertyDoc.line}</div>`;

				if ( methodOrPropertyDoc.params && 0 !== methodOrPropertyDoc.params.length && 0 === getSetPrefix.length ) {
					this.#buildParams ( methodOrPropertyDoc );
				}

				if (
					methodOrPropertyDoc.commentsDoc &&
					( '' !== methodOrPropertyDoc.commentsDoc.returns.type || '' !== methodOrPropertyDoc.commentsDoc.returns.desc )
				) {
					this.#html += `<h4>Returns</h4><div>${methodOrPropertyDoc.commentsDoc.returns.desc}</div>` +
						`<div>Type : ${methodOrPropertyDoc.commentsDoc.returns.type}</div>`;
				}

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

		if ( classDoc?.commentsDoc?.desc ) {
			this.#html += `<div>${classDoc.commentsDoc.desc}</div>`;
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