import fs from 'fs';
import babelParser from '@babel/parser';
import DocBuilder from './DocBuilder.js';
import HtmlClassBuilder from './HtmlClassBuilder.js';
import SourceFileBuilder from './SourceFileBuilder.js';
import theConfig from './Config.js';

class AppLoader {

	#rootDir = '';
	#fileList = [];
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

	#readDir ( dir ) {
		const fileNames = fs.readdirSync ( this.#rootDir + dir );

		fileNames.forEach (
			fileName => {
				const lstat = fs.lstatSync ( this.#rootDir + dir + fileName );
				if ( lstat.isDirectory ( ) ) {
					this.#readDir ( dir + fileName + '/' );
				}
				else if ( lstat.isFile ( ) ) {
					if ( 'js' === fileName.split ( '.' ).reverse ( )[ 0 ] ) {
						this.#fileList.push ( dir + fileName );
					}
				}
			}
		);
	}

	#createFileList ( ) {
		this.#rootDir = theConfig.srcDir;
		this.#fileList = [];
		this.#readDir ( '' );
	}

	#buildFiles ( ) {
		const docBuilder = new DocBuilder ( );
		this.#fileList.forEach (
			fileName => {
				const fileContent = fs.readFileSync ( this.#rootDir + fileName, 'utf8' );
				const ast = babelParser.parse ( fileContent, this.#parserOptions );
				docBuilder.build ( ast, fileName );
				this.#classesDocs = this.#classesDocs.concat ( docBuilder.classesDocs );
				this.#variablesDocs = this.#variablesDocs.concat ( docBuilder.variablesDocs );
				new SourceFileBuilder ( ).build ( fileContent, fileName );
			}
		);
		
		const htmlClassBuilder = new HtmlClassBuilder ( );
		this.#classesDocs.forEach ( classDoc => htmlClassBuilder.build ( classDoc ) );
	}

	loadApp ( ) {
		this.#createFileList ( );
		this.#buildFiles ( );
		console.error ( 'Done' );
	}
}

export default AppLoader;