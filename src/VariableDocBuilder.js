import CommentsParser from './CommentsParser.js';

class VariableDocBuilder {

	constructor ( ) {
	}

	build ( variableDeclarationElement, fileName ) {

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
			name : variableDeclarationElement.declarations [ 0 ].id.name,
			kind : variableDeclarationElement?.kind,
			file : fileName,
			line : variableDeclarationElement.loc.start.line
		};
		if ( variableDeclarationElement.leadingComments ) {
			const comments = [];
			variableDeclarationElement.leadingComments.forEach (
				comment => { comments.push ( comment?.value ); }
			);
			variableDoc.commentsDoc = new CommentsParser ( ).parse ( comments );
		}

		return Object.freeze ( variableDoc );
	}
}

export default VariableDocBuilder;