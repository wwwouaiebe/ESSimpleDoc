import CommentsParser from './CommentsParser.js';

class DocVariableBuilder {

	constructor ( ) {
	}

	build ( variableDeclarationElement, fileName ) {

		const variableDoc = {
			name : variableDeclarationElement.declarations [ 0 ].id.name,
			kind : variableDeclarationElement?.kind,
			file : fileName,
			line : variableDeclarationElement?.loc?.start?.line ?? '0'
		};
		if ( variableDeclarationElement.leadingComments ) {
			const comments = [];
			variableDeclarationElement.leadingComments.forEach (
				comment => { comments.push ( comment?.value ); }
			);
			variableDoc.doc = new CommentsParser ( ).parse ( comments );
		}

		return variableDoc;
	}
}

export default DocVariableBuilder;