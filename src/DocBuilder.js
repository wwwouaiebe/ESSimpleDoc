import fs from 'fs';
import babelParser from '@babel/parser';
import DocClassBuilder from './DocClassBuilder.js';
import DocVariableBuilder from './DocVariableBuilder.js';
import theConfig from './Config.js';
import SourceFileBuilder from './SourceFileBuilder.js';
import HtmlClassBuilder from './HtmlClassBuilder.js';
import HtmlVariablesBuilder from './HtmlVariablesBuilder.js';


class DocBuilder {
	
	#sourceFileBuilder = null;
	#docVariableBuilder = null;
	#docClassBuilder = null;

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
		this.#sourceFileBuilder = new SourceFileBuilder ( );
		this.#docClassBuilder =  new DocClassBuilder ( );
		this.#docVariableBuilder = new DocVariableBuilder ( );
	}

	#buildFile ( ast, fileName ) {
		ast.program.body.forEach (
			bodyElement => {
				switch ( bodyElement.type ) {
				case 'ClassDeclaration' :
					this.#classesDocs.push ( this.#docClassBuilder.build ( bodyElement, fileName ) );
					break;
				case 'VariableDeclaration' :
					this.#variablesDocs.push ( this.#docVariableBuilder.build ( bodyElement, fileName ) );
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
				this.#sourceFileBuilder.build ( fileContent, fileName );
			}
		);

		const htmlClassBuilder = new HtmlClassBuilder ( );
		this.#classesDocs.forEach ( classDoc => htmlClassBuilder.build ( classDoc ) );

		new HtmlVariablesBuilder ( ).build ( this.#variablesDocs );
	}

	get classesDocs ( ) { return this.#classesDocs; }
	get variablesDocs ( ) { return this.#variablesDocs; }
}

export default DocBuilder;