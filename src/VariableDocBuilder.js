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
Build the doc object for a variable
*/

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
			rootPath : '',
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
/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/