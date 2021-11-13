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
Doc reviewed 20211111
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import CommentsDocBuilder from './CommentsDocBuilder.js';
import { MethodOrPropertyDoc, ClassDoc } from './Docs.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Build a ClassDoc object for a class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ClassDocBuilder {

	/**
	The path between the html file and theConfig.destDir ( something like '../../../', depending of the folders tree )
	@type {String}
	*/

	#rootPath;

	/**
	The file name ( with the path since theConfig.srcDir ) in witch the current class is declared
	@type {String}
	*/

	#fileName;

	/**
	A CommentsDocBuilder object
	@type {CommentsDocBuilder}
	*/

	#commentsDocBuilder;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#commentsDocBuilder = new CommentsDocBuilder ( );
	}

	/**
	Build a MethodOrPropertyDoc object from an
	[ast node](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md)
	@param {Object} methodOrPropertyNode An ast node of type **ClassPrivateProperty**, **ClassProperty**,
	**ClassPrivateMethod** or **ClassMethod**
	@return {MethodOrPropertyDoc} The created object
	*/

	#buildMethodOrPropertyDoc ( methodOrPropertyNode ) {

		const methodOrPropertyDoc = new MethodOrPropertyDoc ( );

		methodOrPropertyDoc.name = methodOrPropertyNode?.key?.name || methodOrPropertyNode?.key?.id?.name;
		methodOrPropertyDoc.static = methodOrPropertyNode?.static;
		methodOrPropertyDoc.async = methodOrPropertyNode?.async;
		methodOrPropertyDoc.kind = methodOrPropertyNode?.kind;
		methodOrPropertyDoc.file = this.#fileName;
		methodOrPropertyDoc.rootPath = this.#rootPath;
		methodOrPropertyDoc.line = methodOrPropertyNode?.loc?.start?.line;
		methodOrPropertyDoc.commentsDoc = this.#commentsDocBuilder.build ( methodOrPropertyNode?.leadingComments );

		if ( methodOrPropertyNode?.params?.length ) {
			methodOrPropertyDoc.params = [];
			methodOrPropertyNode.params.forEach (
				param => { methodOrPropertyDoc.params.push ( param?.name ); }
			);
		}

		switch ( methodOrPropertyNode.type ) {
		case 'ClassPrivateProperty' :
			methodOrPropertyDoc.private = true;
			methodOrPropertyDoc.isA = 'property';
			break;
		case 'ClassProperty' :
			methodOrPropertyDoc.private = false;
			methodOrPropertyDoc.isA = 'property';
			break;
		case 'ClassPrivateMethod' :
			methodOrPropertyDoc.private = true;
			methodOrPropertyDoc.isA = 'method';
			break;
		case 'ClassMethod' :
			methodOrPropertyDoc.private = false;
			methodOrPropertyDoc.isA = 'method';
			break;
		default :
			break;
		}

		return Object.freeze ( methodOrPropertyDoc );
	}

	/**
	Build a ClassDoc object from an [ast node](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md)
	@param {Object} classDeclarationNode An ast node of type classDeclarationNode
	@param {String} fileName The file name with the path since theConfig.srcDir
	@return {ClassDoc} The created object
	*/

	build ( classDeclarationNode, fileName ) {

		// Saving the fileName for others methods
		this.#fileName = fileName;

		// Computing rootPath
		this.#rootPath = '';
		let rootPathCounter = this.#fileName.split ( '/' ).length - 1;
		while ( 0 < rootPathCounter ) {
			this.#rootPath += '../';
			rootPathCounter --;
		}

		// Creating the ClassDoc object
		const classDoc = new ClassDoc;
		classDoc.name = classDeclarationNode.id.name;
		classDoc.file = this.#fileName;
		classDoc.rootPath = this.#rootPath;
		classDoc.line = classDeclarationNode.loc.start.line;

		if ( classDeclarationNode?.superClass?.name ) {
			classDoc.superClass = classDeclarationNode.superClass.name;
		}

		classDoc.commentsDoc = this.#commentsDocBuilder.build ( classDeclarationNode.leadingComments );

		// Adding methods and properties
		classDeclarationNode.body.body.forEach (
			methodOrPropertyNode => {
				const methodOrPropertyDoc = this.#buildMethodOrPropertyDoc ( methodOrPropertyNode, this.#fileName );
				if ( methodOrPropertyDoc.isA && ! methodOrPropertyDoc?.commentsDoc?.ignore ) {
					classDoc.methodsAndProperties = ( classDoc.methodsAndProperties ?? [] );
					classDoc.methodsAndProperties.push ( methodOrPropertyDoc );
				}
			}
		);

		Object.freeze ( classDoc.methodsAndProperties );
		Object.freeze ( classDoc );

		return classDoc;
	}
}

export default ClassDocBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */