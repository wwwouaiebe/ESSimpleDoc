import theLinkBuilder from './LinkBuilder.js';

class NavBuilder {

	constructor ( ) {
		Object.freeze ( this );
	}

	build ( rootPath ) {

		let navHtml = '<nav><div id="sourcesNav">Sources</div><ul id="sourcesNavList">';
		theLinkBuilder.sourcesLinks.forEach (
			sourceLink => {
				navHtml += `<li><a href="${rootPath + sourceLink [ 1 ]}">${sourceLink [ 0 ]}</a> </li>`;
			}
		);
		navHtml += '</ul>';

		navHtml += '<div id="variablesNav">Globals</div><ul id="variablesNavList">';
		theLinkBuilder.variablesLinks.forEach (
			variableLink => {
				navHtml += `<li><a href="${rootPath + variableLink [ 1 ]}">${variableLink [ 0 ]}</a> </li>`;
			}
		);
		navHtml += '</ul>';

		navHtml += '<div id="classesNav">Classes</div><ul id="classesNavList">';
		theLinkBuilder.classesLinks.forEach (
			classLink => {
				navHtml += `<li><a href="${rootPath + classLink [ 1 ]}">${classLink [ 0 ]}</a> </li>`;
			}
		);
		navHtml += '</ul></nav>';
		return navHtml;
	}

	get footer ( ) {
		return '<footer>Documentation generated with ' +
			'<a href="https://github.com/wwwouaiebe/SimpleESDoc" target="_blank" rel="noopener noreferrer">' +
			'SimpleESDoc</a></footer>';
	}
}

export default NavBuilder;