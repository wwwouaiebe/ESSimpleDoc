/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
/*
Changes:
	- v1.0.0:
		- created
Doc reviewed 20211021
*/

import FileWriter from './FileWriter.js';
import theLinkBuilder from './LinkBuilder.js';
import NavHtmlBuilder from './NavHtmlBuilder.js';

/**
Build the html page for a class
*/

class ClassHtmlBuilder {

	/**
	The name of the class currently treated
	@type {String}
	*/

	#className;

	/**
	The html with the class documentation
	@type {String}
	*/

	#html;

	/**
	The path between the html file and theConfig.docDir ( something like '../../../', depending of the folders tree )
	@type {String}
	*/

	#rootPath;

	/**
	A array with the methods or properties that must be currently added to the html
	@type {Array.<MethodOrPropertyDoc>}
	*/

	#methodsOrPropertiesDoc;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Build an html table with the parameters from a MethodOrPropertyDoc object and
	include this table in the #html property. Parameters names are extracted from the code and parameters types
	and descriptions are extracted from the comments
	@param {MethodOrPropertyDoc} methodOrPropertyDoc The object with the extracted documentation for the method
	*/

	#buildParamsTable ( methodOrPropertyDoc ) {
		this.#html += '<h4>Parameters</h4>';
		this.#html += '<table><tr><th>Name</th> <th>Type</th> <th>Description</th></tr>';
		methodOrPropertyDoc.params.forEach (
			param => {
				const paramDoc = methodOrPropertyDoc?.commentsDoc?.params?.find ( first => first.name === param );
				const paramType = paramDoc ? theLinkBuilder.getTypeLinks ( paramDoc.type, this.#rootPath ) : '';
				const paramDesc = paramDoc ? paramDoc.desc : '';
				this.#html += `<tr><td>${param}</td> <td>${paramType}</td> <td>${paramDesc}</td></tr>`;
			}
		);
		this.#html += '</table>';
	}

	/**
	Build a string  with the parameters from a MethodOrPropertyDoc object and
	enclose the string in ( ). Parameters names are extracted from the code.
	@param {MethodOrPropertyDoc} methodOrPropertyDoc The object with the extracted documentation for the method
	@return {String} A string with the parameters
	*/

	#buildParamsHeader ( methodOrPropertyDoc ) {
		let params = '';
		if ( methodOrPropertyDoc.params ) {
			methodOrPropertyDoc.params.forEach (
				param => params += param + ', '
			);
			params = params.substr ( 0, params.length - 2 );
		}

		return ` ( ${params} )`;
	}

	/**
	Build the html for a method or property header
	@param {MethodOrPropertyDoc} methodOrPropertyDoc The object with the extracted documentation for the method or property
	*/

	#buildMethodOrPropertyHeader ( methodOrPropertyDoc ) {

		// header css class
		const cssClassName = methodOrPropertyDoc.private ? 'private' : 'public';

		// readonly flag. Only getter have the readonly flag, so we search a setter with the same name
		// to find the readonly flag
		const readOnlyPrefix =
			'get' ===
				methodOrPropertyDoc.kind
				&&
				! this.#methodsOrPropertiesDoc.find (
					method => 'set' === method.kind && methodOrPropertyDoc.name === method.name
				)
				?
				'<span>readonly </span>'
				:
				'';

		// get set flags
		const getSetPrefix =
			'set' === methodOrPropertyDoc.kind || 'get' === methodOrPropertyDoc.kind
				?
				'<span>' + methodOrPropertyDoc.kind + '</span> '
				:
				'';

		// async flag
		const asyncPrefix = methodOrPropertyDoc.async ? '<span>async</span> ' : '';

		// static flag
		const staticPrefix = methodOrPropertyDoc.static ? '<span>static</span> ' : '';

		// # flag
		const namePrefix = methodOrPropertyDoc.private ? '#' : '';

		// method name
		const methodName =
			'constructor' === methodOrPropertyDoc.name ? `<span>new</span> ${this.#className}` : methodOrPropertyDoc.name;

		// params
		const paramsPostfix =
			'method' === methodOrPropertyDoc.isA && 0 === getSetPrefix.length
				?
				this.#buildParamsHeader ( methodOrPropertyDoc )
				:
				'';

		// type flag
		const typePostfix =
			methodOrPropertyDoc?.commentsDoc?.type
				?
				' <span> : ' +
				theLinkBuilder.getTypeLinks ( methodOrPropertyDoc.commentsDoc.type, this.#rootPath ) +
				'</span>'
				:
				'';

		// building html
		this.#html += `<div class="${cssClassName}">`;
		this.#html +=
			`<h3>${readOnlyPrefix}${asyncPrefix}${staticPrefix}${getSetPrefix}${namePrefix}` +
			`${methodName}${paramsPostfix}${typePostfix}</h3>`;
	}

	/**
	Build the html for a method or property
	@param {MethodOrPropertyDoc} methodOrPropertyDoc The object with the extracted documentation for the method or property
	*/

	#buildMethodOrProperty ( methodOrPropertyDoc ) {

		// Header
		this.#buildMethodOrPropertyHeader ( methodOrPropertyDoc );

		// description
		let desc =
			methodOrPropertyDoc?.commentsDoc?.desc
				?
				theLinkBuilder.getDescLink ( methodOrPropertyDoc.commentsDoc.desc, this.#rootPath )
				:
				' ...No description provided. Coming soon?';

		if ( 'set' === methodOrPropertyDoc.kind ) {
			const getter = this.#methodsOrPropertiesDoc.find (
				method => 'get' === method.kind && methodOrPropertyDoc.name === method.name
			);
			desc = getter && getter?.commentsDoc?.desc ? '' /* theLinkBuilder.getDescLink ( getter.commentsDoc.desc)*/ : desc;
		}

		this.#html += `<div>${desc}</div>`;

		// source
		const sourceLink = theLinkBuilder.getSourceLink ( methodOrPropertyDoc );
		this.#html +=
			`<div>Source : <a href="${sourceLink}"> file ${methodOrPropertyDoc.file}` +
			` at line ${methodOrPropertyDoc.line}</a></div>`;

		// params
		if (
			methodOrPropertyDoc.params
			&&
			0 !== methodOrPropertyDoc.params.length
			&&
			'set' !== methodOrPropertyDoc.kind
			&&
			'get' !== methodOrPropertyDoc.kind
		) {
			this.#buildParamsTable ( methodOrPropertyDoc );
		}

		// returns
		if (
			methodOrPropertyDoc?.commentsDoc?.returns?.type &&
			methodOrPropertyDoc?.commentsDoc?.returns?.desc &&
			(
				'' !== methodOrPropertyDoc.commentsDoc.returns.type
				||
				'' !== methodOrPropertyDoc.commentsDoc.returns.desc
			)
		) {
			const returnType =
				theLinkBuilder.getTypeLinks ( methodOrPropertyDoc.commentsDoc.returns.type, this.#rootPath );
			this.#html += `<h4>Returns</h4><div>${methodOrPropertyDoc.commentsDoc.returns.desc}</div>` +
				`<div>Type : ${returnType}</div>`;
		}

		this.#html += '</div>';
	}

	/**
	Build the html for methods and properties
	@param {String} heading The header to add in the #html property before the methods and properties
	*/

	#buildMethodsAndProperties ( heading ) {

		// no methods or properties... returning
		if ( 0 === this.#methodsOrPropertiesDoc.length ) {
			return;
		}

		// heading
		this.#html += `${heading}`;

		// loop on methods and properties
		this.#methodsOrPropertiesDoc.forEach (
			methodOrPropertyDoc => this.#buildMethodOrProperty ( methodOrPropertyDoc )
		);
	}

	/**
	Build the html for a complete class
	@param {ClassDoc} classDoc The object with the class documentation
	*/

	build ( classDoc ) {

		// saving rootPath...
		this.#rootPath = classDoc.rootPath;

		// ... and className
		this.#className = classDoc.name;

		// start html build
		this.#html =
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			`<link type="text/css" rel="stylesheet" href="${classDoc.rootPath}SimpleESDoc.css"></head><body class='havePrivateButton'>`;

		// <nav> tag build
		const navHtmlBuilder = new NavHtmlBuilder ( );
		this.#html += navHtmlBuilder.build ( this.#rootPath );

		// Class header
		const superClass =
			classDoc?.superClass
				?
				'<span> extends ' + theLinkBuilder.getClassLink ( classDoc.superClass, this.#rootPath ) + '</span>'
				:
				'';

		this.#html += `<h1><span>Class</span> ${classDoc.name} ${superClass}</h1>`;

		// class description
		const desc =
			classDoc?.commentsDoc?.desc
				?
				theLinkBuilder.getDescLink ( classDoc.commentsDoc.desc, this.#rootPath )
				:
				' ...No description provided. Coming soon?';

		this.#html += `<div>${desc}</div>`;

		// class source
		const sourceLink = theLinkBuilder.getSourceLink ( classDoc );
		this.#html += `<div>Source : <a href="${sourceLink}"> file ${classDoc.file} at line ${classDoc.line}</a></div>`;

		// Filtering methodsOrPropertiesDoc to add the constructor
		this.#methodsOrPropertiesDoc = classDoc.methodsAndProperties.filter (
			methodOrProperty => (
				'method' === methodOrProperty.isA &&
					'constructor' === methodOrProperty.kind
			)
		);
		this.#buildMethodsAndProperties ( '<h2 class="public">Constructor</h2>' );

		// Filtering methodsOrPropertiesDoc to add public properties
		this.#methodsOrPropertiesDoc = classDoc.methodsAndProperties.filter (
			methodOrProperty => (
				'property' === methodOrProperty.isA &&
					! methodOrProperty.private
			)
		).sort ( ( first, second ) => first.name.localeCompare ( second.name ) );
		this.#buildMethodsAndProperties ( '<h2 class="public">Public properties</h2>' );

		// Filtering methodsOrPropertiesDoc to add public getter and setter
		this.#methodsOrPropertiesDoc = classDoc.methodsAndProperties.filter (
			methodOrProperty => (
				'method' === methodOrProperty.isA &&
					! methodOrProperty.private &&
					( 'set' === methodOrProperty.kind || 'get' === methodOrProperty.kind ) &&
					'constructor' !== methodOrProperty.kind
			)
		).sort ( ( first, second ) => ( first.name + first.kind ).localeCompare ( second.name + second.kind ) );
		this.#buildMethodsAndProperties ( '<h2 class="public">Public getters and setters</h2>' );

		// Filtering methodsOrPropertiesDoc to add public methods
		this.#methodsOrPropertiesDoc = classDoc.methodsAndProperties.filter (
			methodOrProperty => (
				'method' === methodOrProperty.isA &&
					! methodOrProperty.private &&
					'set' !== methodOrProperty.kind &&
					'get' !== methodOrProperty.kind	&&
					'constructor' !== methodOrProperty.kind
			)
		).sort ( ( first, second ) => first.name.localeCompare ( second.name ) );
		this.#buildMethodsAndProperties ( '<h2 class="public">Public methods</h2>' );

		// Filtering methodsOrPropertiesDoc to add private properties
		this.#methodsOrPropertiesDoc = classDoc.methodsAndProperties.filter (
			methodOrProperty => (
				'property' === methodOrProperty.isA &&
					methodOrProperty.private
			)
		).sort ( ( first, second ) => first.name.localeCompare ( second.name ) );
		this.#buildMethodsAndProperties ( '<h2 class="private">Private properties</h2>'	);

		// Filtering methodsOrPropertiesDoc to add private getter and setter
		this.#methodsOrPropertiesDoc = classDoc.methodsAndProperties.filter (
			methodOrProperty => (
				'method' === methodOrProperty.isA &&
					methodOrProperty.private &&
					( 'set' === methodOrProperty.kind || 'get' === methodOrProperty.kind ) &&
					'constructor' !== methodOrProperty.kind
			)
		).sort ( ( first, second ) => ( first.name + first.kind ).localeCompare ( second.name + second.kind ) );
		this.#buildMethodsAndProperties ( '<h2 class="private">Private getters and setters</h2>' );

		// Filtering methodsOrPropertiesDoc to add private methods
		this.#methodsOrPropertiesDoc = classDoc.methodsAndProperties.filter (
			methodOrProperty => (
				'method' === methodOrProperty.isA &&
					methodOrProperty.private &&
					'set' !== methodOrProperty.kind &&
					'get' !== methodOrProperty.kind	&&
					'constructor' !== methodOrProperty.kind
			)
		).sort ( ( first, second ) => first.name.localeCompare ( second.name ) );
		this.#buildMethodsAndProperties ( '<h2 class="private">Private methods</h2>' );

		// footer
		this.#html += navHtmlBuilder.footer;
		this.#html += '<script>' +
		`document.getElementById('showPrivateNav').addEventListener('click',()=>document.body.classList.toggle('showPrivate'))` +
		'</script>';
		this.#html += '</body></html>';

		// writting html to file
		const dirs = classDoc.file.split ( '/' );
		dirs.pop ( );
		new FileWriter ( ).write ( dirs, classDoc.name + '.html', this.#html );
	}
}

export default ClassHtmlBuilder;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/