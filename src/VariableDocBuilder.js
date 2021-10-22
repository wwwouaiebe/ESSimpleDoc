import CommentDocBuilder from './CommentDocBuilder.js';

class VariableDocBuilder {

	constructor ( ) {
		Object.freeze ( this );
	}

	build ( variableDeclarationNode, fileName ) {

		/*
		const variableDoc = {
			name : {string} the variable name; found in ast
			kind : {string} the kind of variable ( = 'const', 'let'... ); found in ast
			file : {string} the file name in witch the variable is declared, including path since theConfig.docDir
			line : {string} the line at witch the variable is declared; found in ast
			commentsDoc : {Object|null} the doc found in the comments of the variable
		};
		*/

		const variableDoc = {
			name : variableDeclarationNode.declarations [ 0 ].id.name,
			kind : variableDeclarationNode?.kind,
			file : fileName,
			line : variableDeclarationNode.loc.start.line
		};
		if ( variableDeclarationNode.leadingComments ) {
			const comments = [];
			variableDeclarationNode.leadingComments.forEach (
				comment => { comments.push ( comment?.value ); }
			);
			variableDoc.commentsDoc = new CommentDocBuilder ( ).build ( comments );
		}

		return Object.freeze ( variableDoc );
	}
}

export default VariableDocBuilder;