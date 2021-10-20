import CommentsParser from './CommentsParser.js';

class DocClassBuilder {
	
	constructor ( ) {
	}
	
	build ( classDeclarationElement, fileName ) {

		const commentsParser = new CommentsParser ( );
		const classDoc = {
			name : classDeclarationElement.id.name,
			superClass : classDeclarationElement?.superClass?.name,
			methodsAndProperties : [],
			file : fileName,
			line : classDeclarationElement?.loc?.start?.line ?? '0'
		}	
		
		classDeclarationElement.body.body.forEach ( 
			bodyElement => {
				const doc = {
					name: bodyElement?.key?.name || bodyElement?.key?.id?.name,
					static : bodyElement?.static,
					async : bodyElement?.async,
					kind : bodyElement?.kind,
					isA : null,
					private : null,
					file : fileName,
					line : bodyElement?.loc?.start?.line ?? '0'
				}
				if ( bodyElement.leadingComments ) {
					const comments = [];
					bodyElement.leadingComments.forEach ( comment =>{ comments.push ( comment?.value ); } );
					doc.doc = commentsParser.parse ( comments );
				}
				if ( bodyElement.params ) {
					doc.params = [];
					bodyElement.params.forEach ( param =>{ doc.params.push ( param?.name ); } );
				}
				switch ( bodyElement.type ) {
					case 'ClassPrivateProperty' :
						doc.private = true;
						doc.isA = 'property';
						classDoc.methodsAndProperties.push ( doc );
						break;
					case 'ClassProperty' :
						doc.private = false;
						doc.isA = 'property';
						classDoc.methodsAndProperties.push ( doc );
						break;
					case 'ClassPrivateMethod':
						doc.private = true;
						doc.isA = 'method';
						classDoc.methodsAndProperties.push ( doc )
						break;
					case 'ClassMethod':
						doc.private = false;
						doc.isA = 'method';
						classDoc.methodsAndProperties.push ( doc )
						break;
					default:
						break;
					
				}
			}
		);
		
		return classDoc
	}
}


export default DocClassBuilder;