import CommentDocBuilder from './CommentDocBuilder.js';

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