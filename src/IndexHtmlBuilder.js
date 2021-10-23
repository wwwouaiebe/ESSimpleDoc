import fs from 'fs';
import theConfig from './Config.js'
import NavBuilder from './NavBuilder.js'

class IndexHtmlBuilder {
	constructor ( ) {
		Object.freeze ( this );
	}
	
	build ( ) {
		const navBuilder = new NavBuilder ( );
		let html = 
			'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
			`<link type="text/css" rel="stylesheet" href="SimpleESDoc.css"></head><body>`;

		// nav
		html += navBuilder.build ( '' );
		
		if ( fs.existsSync ( theConfig.srcDir + 'indexUserContent.html' ) ) {
			html += fs.readFileSync ( theConfig.srcDir + 'indexUserContent.html' );
		}
		else {
			html += '<div><p>Move the mouse on one of blue, green or red rectangles on top of the page to display the menus and select an item in the menu.<p></div>'
		}
		
		html += navBuilder.footer;
		
		html += '</body></html>';

		fs.writeFileSync ( theConfig.docDir + 'index.html', html );
	}
}

export default IndexHtmlBuilder;