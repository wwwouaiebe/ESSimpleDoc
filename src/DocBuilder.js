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

import fs from 'fs';
import babelParser from '@babel/parser';

import ClassDocBuilder from './ClassDocBuilder.js';
import VariableDocBuilder from './VariableDocBuilder.js';
import theConfig from './Config.js';
import SourceHtmlBuilder from './SourceHtmlBuilder.js';
import ClassHtmlBuilder from './ClassHtmlBuilder.js';
import VariablesHtmlBuilder from './VariablesHtmlBuilder.js';
import theLinkBuilder from './LinkBuilder.js';
import DocsValidator from './DocsValidator.js';
import IndexHtmlBuilder from './IndexHtmlBuilder.js';

/**
Build the complete documentation: generate AST from the source files, then extracting doc objects from AST 
and finally buid HTML pages from the doc objects.
*/

class DocBuilder {

	#sourceHtmlBuilder = null;
	#variableDocBuilder = null;
	#classDocBuilder = null;

	#classesDocs = [];

	#variablesDocs = [];

	#parserOptions = {
		allowAwaitOutsideFunction : true,
		allowImportExportEverywhere : true,
		allowReturnOutsideFunction : true,
		allowSuperOutsideMethod : true,
		plugins : [
			[ 'decorators', {
				decoratorsBeforeExport : true
			} ],
			'doExpressions',
			'exportDefaultFrom',
			'functionBind',
			'importMeta',
			[ 'pipelineOperator', {
				proposal : 'minimal'
			} ],
			'throwExpressions'
		],
		ranges : true,
		sourceType : 'module'
	}

	constructor ( ) {
		Object.freeze ( this );
		this.#sourceHtmlBuilder = new SourceHtmlBuilder ( );
		this.#classDocBuilder = new ClassDocBuilder ( );
		this.#variableDocBuilder = new VariableDocBuilder ( );
	}

	#buildFile ( ast, fileName ) {
		ast.program.body.forEach (
			astNode => {
				switch ( astNode.type ) {
				case 'ClassDeclaration' :
					this.#classesDocs.push ( this.#classDocBuilder.build ( astNode, fileName ) );
					break;
				case 'VariableDeclaration' :
					this.#variablesDocs.push ( this.#variableDocBuilder.build ( astNode, fileName ) );
					break;
				default :
					break;
				}
			}
		);
	}

	buildFiles ( filesList ) {
		filesList.forEach (
			fileName => {
				const fileContent = fs.readFileSync ( theConfig.srcDir + fileName, 'utf8' );
				const ast = babelParser.parse ( fileContent, this.#parserOptions );
				this.#buildFile ( ast, fileName );
				const htmlFileName = fileName.replace ( '.js', 'js.html' );
				theLinkBuilder.setSourceLink ( fileName, htmlFileName );

			}
		);

		// Saving link
		this.#classesDocs.forEach ( classDoc => theLinkBuilder.setClassLink ( classDoc ) );
		this.#variablesDocs.forEach ( variableDoc => theLinkBuilder.setVariableLink ( variableDoc ) );

		if ( theConfig.validate ) {
			const docsValidator = new DocsValidator ( );
			docsValidator.validate ( this.#classesDocs );
		}

		const classHtmlBuilder = new ClassHtmlBuilder ( );
		this.#classesDocs.forEach ( classDoc => classHtmlBuilder.build ( classDoc ) );

		filesList.forEach (
			fileName => {
				const fileContent = fs.readFileSync ( theConfig.srcDir + fileName, 'utf8' );
				this.#sourceHtmlBuilder.build ( fileContent, fileName );
			}
		);

		new VariablesHtmlBuilder ( ).build ( this.#variablesDocs );
		
		new IndexHtmlBuilder ( ).build ( );
	}

	get classesDocs ( ) { return this.#classesDocs; }

	get variablesDocs ( ) { return this.#variablesDocs; }
}

export default DocBuilder;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/