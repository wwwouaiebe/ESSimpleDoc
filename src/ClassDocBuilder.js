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

/**
Build a doc object for a class
*/

class ClassDocBuilder {

	constructor ( ) {
		Object.freeze ( this );
	}

	build ( classDeclarationNode, fileName ) {

		/*
		const classDoc = {
			name : {string} the class name; found in ast
			superClass : {string|null} the super class name; found in ast
			methodsAndProperties : [] an array with the methods and properties docs; found in ast
			file : {string} the file name in witch the class is declared, including path since theConfig.docDir
			rootPath : rootPath, the path between the html file and theConfig.docDir
			line : {string} the line at witch the class is declared; found in ast
			commentsDoc : {Object|null} the doc found in the comments of the class
		};
		*/

		let rootPath = '';
		let rootPathCounter = fileName.split ( '/' ).length - 1;
		while ( 0 < rootPathCounter ) {
			rootPath += '../';
			rootPathCounter --;
		}

		const commentDocBuilder = new CommentDocBuilder ( );

		const classDoc = {
			name : classDeclarationNode.id.name,
			methodsAndProperties : [],
			file : fileName,
			rootPath : rootPath,
			line : classDeclarationNode.loc.start.line
		};

		if ( classDeclarationNode?.superClass?.name ) {
			classDoc.superClass = classDeclarationNode.superClass.name;
		}

		if ( classDeclarationNode.leadingComments ) {
			const comments = [];
			classDeclarationNode.leadingComments.forEach (
				comment => { comments.push ( comment?.value ); }
			);
			classDoc.commentsDoc = commentDocBuilder.build ( comments );
		}

		/*
		const methodOrPropertyDoc = {
			name : {string} the method or property name; found in ast
			static : {boolean} the method or property is static; found in ast
			async : {boolean} the method or property is async; found in ast
			kind : {string} the kind of method ( = 'get', 'set' or 'constructor' ); found in ast
			isA : {string} the type ( = 'method' or 'property' ); found in ast
			private : {boolean} the method or property is private; found in ast
			file : {string} the file name in witch the method or property is declared, including path since theConfig.docDir
			rootPath : rootPath, the path between the html file and theConfig.docDir
			line : {string} the line at witch the method or property is declared; found in ast
			commentsDoc : {Object|null} the doc found in the comments of the method or property
		};
		*/

		classDeclarationNode.body.body.forEach (
			methodOrPropertyNode => {

				// methodOrPropertyDoc
				const methodOrPropertyDoc = {
					name : methodOrPropertyNode?.key?.name || methodOrPropertyNode?.key?.id?.name,
					static : methodOrPropertyNode.static,
					async : methodOrPropertyNode.async,
					kind : methodOrPropertyNode?.kind,
					file : fileName,
					rootPath : rootPath,
					line : methodOrPropertyNode.loc.start.line
				};
				if ( methodOrPropertyNode.leadingComments ) {
					const comments = [];
					methodOrPropertyNode.leadingComments.forEach (
						comment => { comments.push ( comment?.value ); }
					);
					methodOrPropertyDoc.commentsDoc = commentDocBuilder.build ( comments );
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
					classDoc.methodsAndProperties.push ( Object.freeze ( methodOrPropertyDoc ) );
					break;
				case 'ClassProperty' :
					methodOrPropertyDoc.private = false;
					methodOrPropertyDoc.isA = 'property';
					classDoc.methodsAndProperties.push ( Object.freeze ( methodOrPropertyDoc ) );
					break;
				case 'ClassPrivateMethod' :
					methodOrPropertyDoc.private = true;
					methodOrPropertyDoc.isA = 'method';
					classDoc.methodsAndProperties.push ( Object.freeze ( methodOrPropertyDoc ) );
					break;
				case 'ClassMethod' :
					methodOrPropertyDoc.private = false;
					methodOrPropertyDoc.isA = 'method';
					classDoc.methodsAndProperties.push ( Object.freeze ( methodOrPropertyDoc ) );
					break;
				default :
					break;

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