import FileWriter from './FileWriter.js';
import theLinkBuilder from './LinkBuilder.js';

class ClassHtmlBuilder {

	#html = '';
	#rootPath = '';

	constructor ( ) { 
		Object.freeze ( this );
	}

	#buildParamsTable ( methodOrPropertyDoc ) {
		this.#html += '<h4>Parameters</h4>';
		this.#html += '<table><tr><th>Name</th> <th>Type</th> <th>Description</th></tr>';
		methodOrPropertyDoc.params.forEach (
			param => {
				const paramDoc = methodOrPropertyDoc?.commentsDoc?.params.find ( first => first.name === param );
				const paramType = paramDoc ? paramDoc.type : '';
				const paramDesc = paramDoc ? paramDoc.desc : '';
				this.#html += `<tr><td>${param}</td> <td>${paramType}</td> <td>${paramDesc}</td></tr>`;
			}
		);
		this.#html += '</table>';
	}
	
	#buildParamsHeader ( methodOrPropertyDoc ) {
		let params = '';
		if ( methodOrPropertyDoc.params ) {
			methodOrPropertyDoc.params.forEach ( param => params += param +', ' );
			params = params.substr ( 0, params.length - 2 );
		}

		
		return ` ( ${params} )`;
	}

	#buildMethodsAndProperties ( methodsOrPropertiesDoc, heading ) {
		if ( 0 === methodsOrPropertiesDoc.length ) {
			return;
		}
		this.#html += `${heading}`;
		methodsOrPropertiesDoc.forEach (
			methodOrPropertyDoc => {
				// header class
				const cssClassName = methodOrPropertyDoc.private ? 'private' : 'public';
				
				// header readonly
				const readOnlyPrefix = 
					'get' === methodOrPropertyDoc.kind && ! methodsOrPropertiesDoc.find ( method => 'set' === method.kind && methodOrPropertyDoc.name === method.name )
						?
						'<span>readonly </span>'
						:
						'';
						
				// header get set
				const getSetPrefix =
					'set' === methodOrPropertyDoc.kind || 'get' === methodOrPropertyDoc.kind
						?
						'<span>' + methodOrPropertyDoc.kind + '</span> '
						:
						'';
						
				// header async
				const asyncPrefix = methodOrPropertyDoc.async ? '<span>async</span> ' : '';

				// header static
				const staticPrefix = methodOrPropertyDoc.static ? '<span>static</span> ' : '';

				// header #
				const namePrefix = methodOrPropertyDoc.private ? '#' : '';
				
				// header params
				const paramsPostfix = 
					'method' === methodOrPropertyDoc.isA && 0 === getSetPrefix.length 
						?
						this.#buildParamsHeader ( methodOrPropertyDoc )
						: 
						'';
						
				// header type
				const typePostfix = methodOrPropertyDoc?.commentsDoc?.type ? ' <span> : ' + methodOrPropertyDoc.commentsDoc.type + '</span>' : '';

				this.#html += `<div class="${cssClassName}">`;
				this.#html +=
					`<h3>${readOnlyPrefix}${asyncPrefix}${staticPrefix}${getSetPrefix}${namePrefix}${methodOrPropertyDoc.name}${paramsPostfix}${typePostfix}</h3>`;
					
				// description
				this.#html += `<div>${methodOrPropertyDoc?.commentsDoc?.desc ?? '...description coming soon?'}</div>`;

				// source
				const sourceLink = theLinkBuilder.getSourceLink ( methodOrPropertyDoc );
				this.#html += `<div>Source : <a href="${sourceLink}"> file ${methodOrPropertyDoc.file} at line ${methodOrPropertyDoc.line}</a></div>`;

				// params
				if ( methodOrPropertyDoc.params && 0 !== methodOrPropertyDoc.params.length && 0 === getSetPrefix.length ) {
					this.#buildParamsTable ( methodOrPropertyDoc );
				}

				// returns
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
		this.#html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			`<link type="text/css" rel="stylesheet" href="${classDoc.rootPath}../src/myDoc.css"></head><body>`;

		const superClass = classDoc?.superClass ? ' extends ' + classDoc.superClass : '';

		this.#html += `<h1>Class ${classDoc.name} ${superClass}</h1>`;

		if ( classDoc?.commentsDoc?.desc ) {
			this.#html += `<div>${classDoc.commentsDoc.desc}</div>`;
		}

		const sourceLink = theLinkBuilder.getSourceLink ( classDoc );
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

export default ClassHtmlBuilder;