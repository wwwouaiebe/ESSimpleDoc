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
			`${rule.errorLevel} '${rule.ruleMessage}' for ${doc.name} in file ${doc.file} at line ${doc.line}: `
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
		classDoc.methodsAndProperties.forEach (
			methodOrPropertyDoc => this.#validateMethodOrPropertyDoc ( methodOrPropertyDoc )
		);
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