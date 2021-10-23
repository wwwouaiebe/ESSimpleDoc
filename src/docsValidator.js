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

/**
Validate the doc objects
*/

class docsValidator {
	
	#errorsCounter = 0;
	
	#classNames = null;
	
	#classRules = [
		// No name for class
		{
			rule : classDoc => ! classDoc?.name || '' === classDoc?.name ,
			errorLevel : 'error',
			ruleMessage : 'No name for class' 
		},
		// Duplicate class name
		{
			rule : classDoc => this.#classNames.get ( classDoc.name ),
			errorLevel : 'error',
			ruleMessage : 'Duplicate class name' ,
			moreRule : classDoc => this.#classNames.set ( classDoc.name, classDoc.name  )
		},
		// No class documentation
		{
			rule : classDoc => ! classDoc.commentsDoc,
			errorLevel : 'error',
			ruleMessage : 'No class documentation' 
		},
		// No class description
		{
			rule : classDoc => ! classDoc?.commentsDoc?.desc || '' === classDoc?.commentsDoc?.desc,
			errorLevel : 'error',
			ruleMessage : 'No class description' 
		},
	];


	#methodsOrPropertiesRules = [
		{
			rule : methodOrPropertyDoc => ! methodOrPropertyDoc.commentsDoc,
			errorLevel : 'error',
			ruleMessage : `No method or property documentation`
		},
		{
			rule : methodOrPropertyDoc => ! methodOrPropertyDoc.commentsDoc?.desc || ''===methodOrPropertyDoc.commentsDoc?.desc,
			errorLevel : 'error',
			ruleMessage : `No method or property description`
		},
	];
	
	#logFault ( rule, doc ) {
		this.#errorsCounter ++;
		console.error ( 
			`${rule.errorLevel} '${rule.ruleMessage}' for ${doc.name} in file \x1b[31m${doc.file}\x1b[0m at line \x1b[31m${doc.line}\x1b[0m: `
		);
	}
	
	#validateRule ( rule, doc )  {
		if ( rule.rule ( doc ) ) {
			this.#logFault ( rule, doc  );
		}
		else if ( rule.moreRule ) {
			rule.moreRule ( doc );
		}
	}
	
	#validateMethodOrPropertyDoc ( methodOrPropertyDoc ) {
		this.#methodsOrPropertiesRules.forEach ( rule => this.#validateRule ( rule, methodOrPropertyDoc ) );
	}
	
	#validateClassDoc ( classDoc ) {
		this.#classRules.forEach ( rule => this.#validateRule ( rule, classDoc ) );
		/*
		classDoc.methodsAndProperties.forEach (
			methodOrPropertyDoc => this.#validateMethodOrPropertyDoc ( methodOrPropertyDoc )
		);
		*/
	}
	
	constructor ( ) {
		Object.freeze ( this );
		this.#classNames = new Map ( );
	}
	
	validate ( classesDocs ) {
		this.#classNames.clear ( );
		classesDocs.forEach ( classDoc => this.#validateClassDoc ( classDoc ) );
		
		console.error ( `${this.#errorsCounter} errors found` );
	}
	
}

export default docsValidator;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/