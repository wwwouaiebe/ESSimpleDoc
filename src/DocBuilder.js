import fs from 'fs';
import babelParser from '@babel/parser';
import ClassDocBuilder from './ClassDocBuilder.js';
import VariableDocBuilder from './VariableDocBuilder.js';
import theConfig from './Config.js';
import SourceHtmlBuilder from './SourceHtmlBuilder.js';
import ClassHtmlBuilder from './ClassHtmlBuilder.js';
import VariablesHtmlBuilder from './VariablesHtmlBuilder.js';


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
		this.#classDocBuilder =  new ClassDocBuilder ( );
		this.#variableDocBuilder = new VariableDocBuilder ( );
	}

	#buildFile ( ast, fileName ) {
		ast.program.body.forEach (
			bodyElement => {
				switch ( bodyElement.type ) {
				case 'ClassDeclaration' :
					this.#classesDocs.push ( this.#classDocBuilder.build ( bodyElement, fileName ) );
					break;
				case 'VariableDeclaration' :
					this.#variablesDocs.push ( this.#variableDocBuilder.build ( bodyElement, fileName ) );
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
				this.#sourceHtmlBuilder.build ( fileContent, fileName );
			}
		);

		const classHtmlBuilder = new ClassHtmlBuilder ( );
		this.#classesDocs.forEach ( classDoc => classHtmlBuilder.build ( classDoc ) );

		new VariablesHtmlBuilder ( ).build ( this.#variablesDocs );
	}

	get classesDocs ( ) { return this.#classesDocs; }
	
	get variablesDocs ( ) { return this.#variablesDocs; }
}

export default DocBuilder;