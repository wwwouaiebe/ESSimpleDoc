import DocClassBuilder from './DocClassBuilder.js';
import DocVariableBuilder from './DocVariableBuilder.js';

class DocBuilder {

	#classesDocs = [];
	#variablesDocs = [];

	constructor ( ) {
	}

	build ( ast, fileName ) {
		this.#classesDocs.length = 0;
		this.#variablesDocs.length = 0;
		
		ast.program.body.forEach (
			bodyElement => {
				switch ( bodyElement.type ) {
				case 'ClassDeclaration' :
					this.#classesDocs.push ( new DocClassBuilder ( ).build ( bodyElement, fileName ) );
					break;
				case 'VariableDeclaration' :
					this.#variablesDocs.push ( new DocVariableBuilder ( ).build ( bodyElement, fileName ) );
				default :
					break;
				}
			}
		);
	}
	
	get classesDocs ( ) {return this.#classesDocs;}
	get variablesDocs ( ) {return this.#variablesDocs;}
}

export default DocBuilder;