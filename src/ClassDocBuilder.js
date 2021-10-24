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

import CommentDocBuilder from './CommentDocBuilder.js';
import { MethodOrPropertyDoc, ClassDoc } from './Docs.js';

/**
Build a doc object for a class
*/

class ClassDocBuilder {

	#rootPath = null;

	#fileName = null;

	#commentDocBuilder = null;

	constructor ( ) {
		Object.freeze ( this );
		this.#commentDocBuilder = new CommentDocBuilder ( );
	}

	#buildMethodOrPropertyDoc ( methodOrPropertyNode ) {

		// methodOrPropertyDoc
		const methodOrPropertyDoc = new MethodOrPropertyDoc ( );

		methodOrPropertyDoc.name = methodOrPropertyNode?.key?.name || methodOrPropertyNode?.key?.id?.name;
		methodOrPropertyDoc.static = methodOrPropertyNode.static;
		methodOrPropertyDoc.async = methodOrPropertyNode.async;
		methodOrPropertyDoc.kind = methodOrPropertyNode?.kind;
		methodOrPropertyDoc.file = this.#fileName;
		methodOrPropertyDoc.rootPath = this.#rootPath;
		methodOrPropertyDoc.line = methodOrPropertyNode.loc.start.line;

		if ( methodOrPropertyNode.leadingComments ) {
			const comments = [];
			methodOrPropertyNode.leadingComments.forEach (
				comment => { comments.push ( comment?.value ); }
			);
			methodOrPropertyDoc.commentsDoc = this.#commentDocBuilder.build ( comments );
		}
		if ( methodOrPropertyNode.params ) {
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

	build ( classDeclarationNode, fileName ) {

		this.#fileName = fileName;

		this.#rootPath = '';
		let rootPathCounter = fileName.split ( '/' ).length - 1;
		while ( 0 < rootPathCounter ) {
			this.#rootPath += '../';
			rootPathCounter --;
		}

		const classDoc = new ClassDoc;

		classDoc.name = classDeclarationNode.id.name;
		classDoc.file = fileName;
		classDoc.rootPath = this.#rootPath;
		classDoc.line = classDeclarationNode.loc.start.line;

		if ( classDeclarationNode?.superClass?.name ) {
			classDoc.superClass = classDeclarationNode.superClass.name;
		}

		if ( classDeclarationNode.leadingComments ) {
			const comments = [];
			classDeclarationNode.leadingComments.forEach (
				comment => { comments.push ( comment?.value ); }
			);
			classDoc.commentsDoc = this.#commentDocBuilder.build ( comments );
		}

		classDeclarationNode.body.body.forEach (
			methodOrPropertyNode => {
				const methodOrPropertyDoc = this.#buildMethodOrPropertyDoc ( methodOrPropertyNode, fileName );
				if ( methodOrPropertyDoc.isA ) {
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

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/