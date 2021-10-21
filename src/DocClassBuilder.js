import CommentsParser from './CommentsParser.js';

class DocClassBuilder {

	constructor ( ) {
	}

	build ( classDeclarationElement, fileName ) {
		
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

		const commentsParser = new CommentsParser ( );
		
		const classDoc = {
			name : classDeclarationElement.id.name,
			methodsAndProperties : [],
			file : fileName,
			rootPath : rootPath,
			line : classDeclarationElement?.loc?.start?.line ?? '0'
		};

		if ( classDeclarationElement?.superClass?.name ) {
			classDoc.superClass = classDeclarationElement.superClass.name;
		}
		
		if ( classDeclarationElement.leadingComments ) {
			const comments = [];
			classDeclarationElement.leadingComments.forEach (
				comment => { comments.push ( comment?.value ); }
			);
			classDoc.commentsDoc = commentsParser.parse ( comments );
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
			line : {string} the line at witch the method or property is declared; found in ast
			commentsDoc : {Object|null} the doc found in the comments of the method or property 
		};
		*/
		
		classDeclarationElement.body.body.forEach (
			bodyElement => {
				//methodOrPropertyDoc
				const methodOrPropertyDoc = {
					name : bodyElement?.key?.name || bodyElement?.key?.id?.name,
					static : bodyElement.static,
					async : bodyElement.async,
					kind : bodyElement?.kind,
					file : fileName,
					line : bodyElement.loc.start.line
				};
				if ( bodyElement.leadingComments ) {
					const comments = [];
					bodyElement.leadingComments.forEach (
						comment => { comments.push ( comment?.value ); }
					);
					methodOrPropertyDoc.commentsDoc = commentsParser.parse ( comments );
				}
				if ( bodyElement.params ) {
					methodOrPropertyDoc.params = [];
					bodyElement.params.forEach (
						param => { methodOrPropertyDoc.params.push ( param?.name ); }
					);
				}
				switch ( bodyElement.type ) {
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
		
		

		return Object.freeze ( classDoc );
	}
}

export default DocClassBuilder;