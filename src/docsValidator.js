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
	
	#commonRules = [

		// no-name
		{
			rule : doc => ! doc?.name || '' === doc?.name,
			errorLevel : 'error',
			ruleMessage : 'Missing name',
			ruleName : 'missing-name'
		},

		// no-documentation
		{
			rule : doc => !doc?.commentsDoc,
			errorLevel : 'error',
			ruleMessage : 'Missing documentation',
			ruleName : 'missing-documentation'
		},

		// no-description
		{
			rule : doc => ! doc?.commentsDoc?.desc || '' === doc.commentsDoc.desc,
			errorLevel : 'error',
			ruleMessage : 'Missing description',
			ruleName : 'missing-description'
		}

	]

	#classRules = [
	
		// duplicate-class-name
		{
			rule : classDoc => this.#classNames.get ( classDoc.name ),
			errorLevel : 'error',
			ruleMessage : 'Duplicate class name',
			ruleName : 'duplicate-class-name',
			moreRule : classDoc => this.#classNames.set ( classDoc.name, classDoc.name )
		},

	];

	#methodsOrPropertiesRules = [
		{
			rule : methodOrPropertyDoc => 'set' === methodOrPropertyDoc.kind && methodOrPropertyDoc?.commentsDoc?.type,
			errorLevel : 'warning',
			ruleMessage : 'Setter with @type tag',
			ruleName : 'SetterHaveType'
		},
		{
			rule : methodOrPropertyDoc => 'set' === methodOrPropertyDoc.kind && methodOrPropertyDoc?.commentsDoc?.returns,
			errorLevel : 'warning',
			ruleMessage : 'Setter with @return tag',
			ruleName : 'SetterHaveReturn'
		},
		{
			rule : methodOrPropertyDoc => 'get' === methodOrPropertyDoc.kind && ! methodOrPropertyDoc?.commentsDoc?.type,
			errorLevel : 'error',
			ruleMessage : 'Missing type for getter',
			ruleName : 'MissingTtypeGetter'
		},
		{
			rule : methodOrPropertyDoc => 'get' === methodOrPropertyDoc.kind && methodOrPropertyDoc?.commentsDoc?.returns,
			errorLevel : 'warning',
			ruleMessage : 'Getter with @return tag',
			ruleName : 'GetterHaveReturn'
		},
		{
			rule : methodOrPropertyDoc => 'constructor' === methodOrPropertyDoc.kind &&  methodOrPropertyDoc?.commentsDoc?.returns,
			errorLevel : 'warning',
			ruleMessage : 'Constructor with @return tag',
			ruleName : 'ConstructorHaveReturn'
		},
		{
			rule : methodOrPropertyDoc => 'property' === methodOrPropertyDoc.isA &&  ! methodOrPropertyDoc?.commentsDoc?.type,
			errorLevel : 'error',
			ruleMessage : 'Missing type for property',
			ruleName : 'MissingTypeProperty'
		},
		{
			rule : methodOrPropertyDoc => 'property' === methodOrPropertyDoc.isA &&  methodOrPropertyDoc?.commentsDoc?.returns,
			errorLevel : 'warning',
			ruleMessage : 'Property with @return tag',
			ruleName : 'PropertyHaveReturn'
		},
		{
			rule : methodOrPropertyDoc => 'property' === methodOrPropertyDoc.isA &&  methodOrPropertyDoc?.commentsDoc?.params,
			errorLevel : 'warning',
			ruleMessage : 'Property with @param tag',
			ruleName : 'PropertyHaveParam'
		},
		{ 
			rule : methodOrPropertyDoc => {
				if ( 'method' !== methodOrPropertyDoc.isA ) {
					return false;
				}
				if ( methodOrPropertyDoc.params && ! methodOrPropertyDoc?.commentsDoc?.params ) {
					return true;
				}
				if ( ! methodOrPropertyDoc.params &&  methodOrPropertyDoc?.commentsDoc?.params ) {
					return true;
				}
				if ( ! methodOrPropertyDoc.params &&  !methodOrPropertyDoc?.commentsDoc?.params ) {
					return false;
				}
				
				const codeParams = Array.from ( methodOrPropertyDoc.params );
				codeParams.sort ( ( first, second ) => first.localeCompare ( second ) );

				const commentsParams = Array.from ( methodOrPropertyDoc.commentsDoc.params , first => first.name );
				commentsParams.sort ( ( first, second ) => first.localeCompare ( second ) );
				
				if ( codeParams.length !== commentsParams.length ) {
					return true
				}
				
				let returnValue = true;
				for ( let paramCounter = 0; paramCounter < codeParams.length; paramCounter++ ) {
					returnValue &= codeParams [ paramCounter ] === commentsParams [ paramCounter ];
				}
				
				return ! returnValue
			},
			errorLevel : 'error',
			ruleMessage : 'Mismatch in the parameters',
			ruleName : 'MismatchParameters'
		},
		{
			rule : methodOrPropertyDoc =>  methodOrPropertyDoc.commentsDoc && methodOrPropertyDoc.commentsDoc.returns && ! methodOrPropertyDoc.commentsDoc.returns.desc,
			errorLevel : 'error',
			ruleMessage : 'Missing description for @return tag',
			ruleName : 'MissingDescriptionReturn'
		},
		{
			rule : methodOrPropertyDoc =>  methodOrPropertyDoc.commentsDoc && methodOrPropertyDoc.commentsDoc.returns && ! methodOrPropertyDoc.commentsDoc.returns.type,
			errorLevel : 'error',
			ruleMessage : 'Missing type for @return tag',
			ruleName : 'MissingTypeReturn'
		},
	];

	#logFault ( rule, doc ) {
		this.#errorsCounter ++;
		console.error (
			`\t\x1b[31m${rule.errorLevel}\x1b[0m '${rule.ruleMessage}' for ${doc.name} in file \x1b[31m${doc.file}\x1b[0m at line \x1b[31m${doc.line}\x1b[0m ( ${rule.ruleName} )`
		);
	}

	#validateRule ( rule, doc ) {
		if ( rule.rule ( doc ) ) {
			this.#logFault ( rule, doc );
		}
		if ( rule.moreRule ) {
			rule.moreRule ( doc );
		}
	}

	#validateVariableDoc ( variableDoc ) {
		this.#commonRules.forEach ( rule => this.#validateRule ( rule, variableDoc ) );
	}

	#validateMethodOrPropertyDoc ( methodOrPropertyDoc ) {
		this.#commonRules.forEach ( rule => this.#validateRule ( rule, methodOrPropertyDoc ) );
		this.#methodsOrPropertiesRules.forEach ( rule => this.#validateRule ( rule, methodOrPropertyDoc ) );
	}

	#validateClassDoc ( classDoc ) {
		this.#commonRules.forEach ( rule => this.#validateRule ( rule, classDoc ) );
		this.#classRules.forEach ( rule => this.#validateRule ( rule, classDoc ) );

		if ( classDoc.methodsAndProperties ) {
			classDoc.methodsAndProperties.forEach ( 
				methodOrPropertyDoc => this.#validateMethodOrPropertyDoc ( methodOrPropertyDoc )
			);
		}

	}

	constructor ( ) {
		Object.freeze ( this );
		this.#classNames = new Map ( );
	}

	validate ( classesDocs, variablesDocs ) {
		this.#classNames.clear ( );
		
		classesDocs?.forEach ( classDoc => this.#validateClassDoc ( classDoc ) );
		variablesDocs?.forEach ( variableDoc => this.#validateVariableDoc ( variableDoc ) );

		console.error ( `${this.#errorsCounter} errors found` );
	}

}

export default docsValidator;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/