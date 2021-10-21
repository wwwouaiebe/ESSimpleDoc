import fs from 'fs';
import babelParser from '@babel/parser';
import DocClassBuilder from './DocClassBuilder.js';
import DocVariableBuilder from './DocVariableBuilder.js';
import theConfig from './Config.js';
import SourceFileBuilder from './SourceFileBuilder.js';
import HtmlClassBuilder from './HtmlClassBuilder.js';
import HtmlVariablesBuilder from './HtmlVariablesBuilder.js';

class DocBuilder {

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
	}

	#buildFile ( ast, fileName ) {
		this.#classesDocs.length = 0;
		this.#variablesDocs.length = 0;

		ast.program.body.forEach (
			bodyElement => {
				switch ( bodyElement.type ) {
				case 'ClassDeclaration' :
					this.#classesDocs.push ( new DocClassBuilder ( ).build ( bodyElement, fileName ) );
					break;
				case 'VariableDeclaration' :
					this.#variablesDocs.push ( new DocVariableBuilder ( ).build ( bodyElement, fileName ) );
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
				new SourceFileBuilder ( ).build ( fileContent, fileName );
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