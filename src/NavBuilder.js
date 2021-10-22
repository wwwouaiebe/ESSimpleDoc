import theLinkBuilder from './LinkBuilder.js';

class NavBuilder {
	
	constructor ( ) {
		Object.freeze ( this );
	}
	
	build ( rootPath ) {
		const variablesLinks = theLinkBuilder.variablesLinks
		

		let navHtml = '<nav><div id="variablesNav">Globals</div><ul id="variablesNavList">';
		theLinkBuilder.variablesLinks.forEach (
			variableLink => {
				navHtml += `<li><a href="${rootPath + variableLink [ 1 ]}">${variableLink [ 0 ]}</a> </li>`
			}
		)
		navHtml += `</ul>`;
		navHtml += '<div id="classesNav">Classes</div><ul id="classesNavList">';
		theLinkBuilder.classesLinks.forEach (
			classLink => {
				navHtml += `<li><a href="${rootPath + classLink [ 1 ]}">${classLink [ 0 ]}</a> </li>`
			}
		)
		navHtml += `</ul></nav>`;
		return navHtml;
	}
}

export default NavBuilder;