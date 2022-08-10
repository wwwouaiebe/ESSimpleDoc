/*
Copyright - 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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
	- v1.1.0:
		- Issue ♯1 : Improve colorization of sources files...
Doc reviewed 20211111
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import process from 'process';
import fs from 'fs';
import babelParser from '@babel/parser';
import traverse from '@babel/traverse';

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
A simple container to store the line, column and html tag value to insert in the source file
for comments, string literals, template literals and regexp literals
*/

class TagData {

	/**
	The line number in the source file where the tag must be inserted
	@type {Number}
	*/

	#line;

	/**
	The column number in the source file where the tag must be inserted
	@type {?Number}
	*/

	#column;

	/**
	The tag to insert.
	@type {String}
	*/

	#tag;

	/**
	The constructor
	@param {Number} line The line number in the source file where the tag must be inserted
	@param {?Number} column The column number in the source file where the tag must be inserted
	@param {String} tag The tag to insert.
	*/

	constructor ( line, column, tag ) {
		Object.freeze ( this );
		this.#line = line;
		this.#column = column;
		this.#tag = tag;
	}

	/**
	The line number in the source file where the tag must be inserted
	@type {Number}
	*/

	get line ( ) { return this.#line; }

	/**
	The column number in the source file where the tag must be inserted
	If the tag must be inserted at the end of the line the value is null
	@type {?Number}
	*/

	get column ( ) { return this.#column; }

	/**
	The tag to insert.
	To avoid  a replacement of the < ,> and " chars when creating the source html file
	the < char is replaced with §lt§, the > char with §gt§ and the " char with §quot§ and then
	replaced with the correct value inthe source html file.
	@type {String}
	*/

	get tag ( ) { return this.#tag; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Build the complete documentation: generate AST from the source files, then extracting doc objects from AST
and finally buid HTML pages from the doc objects.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DocBuilder {

	/**
	A SourceHtmlBuilder object used by the class
	@type {SourceHtmlBuilder}
	*/

	#sourceHtmlBuilder;

	/**
	A VariableDocBuilder object used by the class
	@type {VariableDocBuilder}
	*/

	#variableDocBuilder;

	/**
	A ClassDocBuilder object used by the class
	@type {ClassDocBuilder}
	*/

	#classDocBuilder;

	/**
	The generated ClassDoc objects
	@type {Array.<ClassDoc>}
	*/

	#classesDocs = [];

	/**
	The generated VariableDoc objects
	@type {Array.<VariableDoc>}
	*/

	#variablesDocs = [];

	/**
	The options for the babel/parser
	@type {Object}
	*/

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
	};

	/**
	A Map with all the TagData of all the source files ordered by SourceFileName
	@type {Map.<Array.<TagData>>}
	*/

	#tagsDataMap;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#classDocBuilder = new ClassDocBuilder ( );
		this.#variableDocBuilder = new VariableDocBuilder ( );
	}

	/**
	Build all the docs for a file
	@param {Object} ast The root
	[ast node](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md) given by the babel/parser
	@param {String} sourceFileName The source file name, including relative path since theConfig.srcDir
	*/

	#buildDocs ( ast, sourceFileName ) {
		ast.program.body.forEach (
			astNode => {
				switch ( astNode.type ) {
				case 'ClassDeclaration' :
					{
						const classDoc = this.#classDocBuilder.build ( astNode, sourceFileName );
						if ( ! classDoc?.commentsDoc?.ignore ) {
							this.#classesDocs.push ( classDoc );
						}
					}
					break;
				case 'VariableDeclaration' :
					{
						const variableDoc = this.#variableDocBuilder.build ( astNode, sourceFileName );
						if ( ! variableDoc?.commentsDoc?.ignore ) {
							this.#variablesDocs.push ( variableDoc );
						}
					}
					break;
				default :
					break;
				}
			}
		);
	}

	/**
	Traverse the ast created by the Babel parser and extract the TagData objects for the
	template literals, string literals, regexp literals and comments
	@param {Object} ast The root
	[ast node](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md) given by the babel/parser
	@param {String} sourceFileName The source file name, including relative path since theConfig.srcDir
	*/

	#traverseAst ( ast, sourceFileName ) {

		const tagsData = [];

		/*
		A helper function for extracting the comments TagData
		Yes, I know... I don't like functions, but traverse will not know this
		*/

		function addCommentTags ( comment ) {
			let currentLine = comment.loc.start.line;
			tagsData.push ( new TagData ( currentLine, comment.loc.start.column, '§lt§span class=§quot§Comment§quot§§gt§' ) );
			while ( currentLine !== comment.loc.end.line ) {
				tagsData.push ( new TagData ( currentLine, null, '§lt§/span§gt§' ) );
				currentLine ++;
				tagsData.push ( new TagData ( currentLine, 0, '§lt§span class=§quot§Comment§quot§§gt§' ) );
			}
			tagsData.push ( new TagData ( comment.loc.end.line, comment.loc.end.column, '§lt§/span§gt§' ) );
		}

		traverse.default (
			ast,
			{
				enter ( path ) {
					switch ( path.node.type ) {
					case 'TemplateLiteral' :
					case 'RegExpLiteral' :
					case 'StringLiteral' :
						tagsData.push (
							new TagData (
								path.node.loc.start.line,
								path.node.loc.start.column,
								'§lt§span class=' + '§quot§' + path.node.type + '§quot§§gt§'
							)
						);
						tagsData.push ( new TagData ( path.node.loc.end.line, path.node.loc.end.column, '§lt§/span§gt§' ) );
						break;
					default :
						break;
					}

					if ( path.node.leadingComments ) {
						path.node.leadingComments.forEach ( addCommentTags );
					}
					if ( path.node.trailingComments ) {
						path.node.trailingComments.forEach ( addCommentTags );
					}
				}
			}
		);
		this.#tagsDataMap.set ( sourceFileName, tagsData );
	}

	/**
	Build all the docs for the app and then build all the html files
	@param {Array.<String>} sourceFilesList The source files names, including relative path since theConfig.srcDir
	*/

	buildFiles ( sourceFilesList ) {
		let ast = null;
		this.#tagsDataMap = new Map ( );
		sourceFilesList.forEach (
			sourceFileName => {
				try {

					// Reading the source
					const fileContent = fs.readFileSync ( theConfig.srcDir + sourceFileName, 'utf8' );
					ast = babelParser.parse ( fileContent, this.#parserOptions );
				}
				catch ( err ) {
					console.error (
						`\n\t\x1b[31mError\x1b[0m parsing file \x1b[31m${sourceFileName}\x1b[0m` +
						` at line ${err.loc.line} column ${err.loc.column} : \n\t\t${err.message}\n`
					);

					process.exit ( 1 );
				}

				if ( ! theConfig.noSourcesColor ) {
					this.#traverseAst ( ast, sourceFileName );
				}

				// buiding docs for the source
				this.#buildDocs ( ast, sourceFileName );

				// buiding the links for the source
				const htmlFileName = sourceFileName.replace ( '.js', 'js.html' );
				theLinkBuilder.setSourceLink ( sourceFileName, htmlFileName );
			}
		);

		// Saving links for classes and variables
		this.#classesDocs.forEach ( classDoc => theLinkBuilder.setClassLink ( classDoc ) );
		this.#variablesDocs.forEach ( variableDoc => theLinkBuilder.setVariableLink ( variableDoc ) );

		// Validation
		if ( theConfig.validate ) {
			const docsValidator = new DocsValidator ( );
			docsValidator.validate ( this.#classesDocs, this.#variablesDocs );
		}

		if ( ! theConfig.noFiles ) {

			// Building classes html files
			const classHtmlBuilder = new ClassHtmlBuilder ( );
			this.#classesDocs.forEach ( classDoc => classHtmlBuilder.build ( classDoc ) );

			console. error ( `\n\tCreated ${classHtmlBuilder.classesCounter} class files` );

			// Building sources html files
			const sourceHtmlBuilder = new SourceHtmlBuilder ( );
			sourceFilesList.forEach (
				sourceFileName => {
					const fileContent = fs.readFileSync ( theConfig.srcDir + sourceFileName, 'utf8' );
					sourceHtmlBuilder.build ( fileContent, sourceFileName, this.#tagsDataMap.get ( sourceFileName ) );
				}
			);

			console.error ( `\n\tCreated ${sourceHtmlBuilder.sourcesCounter} source files` );

			// Building the variables html file
			new VariablesHtmlBuilder ( ).build ( this.#variablesDocs );

			// Building the index.html file
			new IndexHtmlBuilder ( ).build ( );
		}
	}
}

export default DocBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */