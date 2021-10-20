import fs from 'fs';
import babelParser from '@babel/parser';
import DocBuilder from './DocBuilder.js';
import HtmlBuilder from './HtmlBuilder.js';
import SourceFileBuilder from './SourceFileBuilder.js';
import theConfig from './Config.js';

class AppLoader {

	#fileList = [];

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
		const fileNames = fs.readdirSync ( dir );

		fileNames.forEach (
			fileName => {
				const lstat = fs.lstatSync ( dir + fileName );
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
		this.#fileList = [];
		this.#readDir ( theConfig.srcDir );
	}

	#buildFiles ( ) {
		this.#fileList.forEach (
			fileName => {
				const fileContent = fs.readFileSync ( fileName, 'utf8' );
				const ast = babelParser.parse ( fileContent, this.#parserOptions );
				const doc = new DocBuilder ( ).build ( ast, fileName );
				new HtmlBuilder ( ).build ( doc );
				new SourceFileBuilder ( ).build ( fileContent, fileName );
			}
		);
	}

	loadApp ( ) {
		this.#createFileList ( );
		this.#buildFiles ( );
		console.error ( 'Done' );
	}
}

export default AppLoader;