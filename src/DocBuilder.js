import DocClassBuilder from './DocClassBuilder.js';

class DocBuilder {

	#docs = [];

	constructor ( ) {
	}

	build ( ast, fileName ) {
		ast.program.body.forEach (
			bodyElement => {
				switch ( bodyElement.type ) {
				case 'ClassDeclaration' :
					this.#docs.push ( new DocClassBuilder ( ).build ( bodyElement, fileName ) );
					break;
				default :
					break;
				}

			}
		);

		return this.#docs;
	}
}

export default DocBuilder;