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

import theLinkBuilder from './LinkBuilder.js';

/**
Validate the doc objects
*/

class docsValidator {

	/**
	A counter for the errors
	@type {Number}
	*/

	#errorsCounter;

	/**
	A counter for the warnings
	@type {Number}
	*/

	#warningsCounter;

	/**
	A map to store the classes names
	@type {Map.<String>}
	*/

	#classNames;

	/**
	The current class
	@type {String}
	*/

	#currentClassDoc;

	/**
	The rules to apply
	@type {Object}
	*/

	#rules = {
		classesRules : {
			duplicateClassName : {
				rule : classDoc => this.#classNames.get ( classDoc.name ),
				errorLevel : 'warning',
				ruleMessage : 'Duplicate class name',
				moreRule : classDoc => this.#classNames.set ( classDoc.name, classDoc.name )
			}
		},
		commonRules : {
			dontHaveDescription : {
				rule : doc => ! doc?.commentsDoc?.desc && 'set' !== doc.kind,
				errorLevel : 'error',
				ruleMessage : 'Missing description'
			},
			unknownType : {
				rule : doc => {
					if ( ! doc?.commentsDoc ) {
						return false;
					}
					let returnValue = false;
					const types = [];
					if ( doc?.commentsDoc?.type ) {
						types.push ( doc.commentsDoc.type );
					}
					if ( doc?.commentsDoc?.returns?.type ) {
						types.push ( doc.commentsDoc.returns.type );
					}
					if ( doc?.commentsDoc?.params ) {
						doc.commentsDoc.params.forEach (
							param => {
								if ( param?.type ) {
									types.push ( param.type );
								}
							}
						);
					}
					types.forEach (
						type => {
							type.split ( ' ' ).forEach (
								word => {
									if (
										'or' !== word
										&&
										'of' !== word
										&&
										'null' !== word
										&&
										! theLinkBuilder.isKnownType ( word )
									) {
										returnValue = true;
									}
								}
							);
						}
					);
					return returnValue;
				},
				errorLevel : 'warning',
				ruleMessage : 'Unknown type'
			}
		},
		methodsOrPropertiesRules : {
			constructorHaveReturn : {
				rule : methodOrPropertyDoc => 'constructor' === methodOrPropertyDoc.kind
					&&
					methodOrPropertyDoc?.commentsDoc?.returns,
				errorLevel : 'warning',
				ruleMessage : 'Constructor with @return tag'
			},
			getterDontHaveType : {
				rule : methodOrPropertyDoc => 'get' === methodOrPropertyDoc.kind
					&&
					! methodOrPropertyDoc?.commentsDoc?.type,
				errorLevel : 'error',
				ruleMessage : 'Missing @type tag for getter'
			},
			getterHaveReturn : {
				rule : methodOrPropertyDoc => 'get' === methodOrPropertyDoc.kind
					&&
					methodOrPropertyDoc?.commentsDoc?.returns,
				errorLevel : 'warning',
				ruleMessage : 'Getter with @return tag'
			},
			parametersMismatch : {
				rule : methodOrPropertyDoc => {
					if ( 'method' !== methodOrPropertyDoc.isA ) {
						return false;
					}
					if ( 'set' === methodOrPropertyDoc.kind ) {
						return false;
					}
					if ( methodOrPropertyDoc.params && ! methodOrPropertyDoc?.commentsDoc?.params ) {
						return true;
					}
					if ( ! methodOrPropertyDoc.params && methodOrPropertyDoc?.commentsDoc?.params ) {
						return true;
					}
					if ( ! methodOrPropertyDoc.params && ! methodOrPropertyDoc?.commentsDoc?.params ) {
						return false;
					}

					const codeParams = Array.from ( methodOrPropertyDoc.params );
					codeParams.sort ( ( first, second ) => first.localeCompare ( second ) );

					const commentsParams = Array.from ( methodOrPropertyDoc.commentsDoc.params, first => first.name );
					commentsParams.sort ( ( first, second ) => first.localeCompare ( second ) );

					if ( codeParams.length !== commentsParams.length ) {
						return true;
					}

					let returnValue = true;
					for ( let paramCounter = 0; paramCounter < codeParams.length; paramCounter ++ ) {

						/* eslint-disable-next-line no-bitwise */
						returnValue &= codeParams [ paramCounter ] === commentsParams [ paramCounter ];
					}

					return ! returnValue;
				},
				errorLevel : 'error',
				ruleMessage : 'Mismatch between the @param tags and parameters in the code'
			},
			propertyDontHaveType : {
				rule : methodOrPropertyDoc => 'property' === methodOrPropertyDoc.isA
					&&
					! methodOrPropertyDoc?.commentsDoc?.type,
				errorLevel : 'error',
				ruleMessage : 'Missing @type for property'
			},
			propertyHaveParam : {
				rule : methodOrPropertyDoc => 'property' === methodOrPropertyDoc.isA
					&&
					methodOrPropertyDoc?.commentsDoc?.params,
				errorLevel : 'warning',
				ruleMessage : 'Property with @param tag'
			},
			propertyHaveReturn : {
				rule : methodOrPropertyDoc => 'property' === methodOrPropertyDoc.isA
					&&
					methodOrPropertyDoc?.commentsDoc?.returns,
				errorLevel : 'warning',
				ruleMessage : 'Property with @return tag'
			},
			returnDontHaveDescription : {
				rule : methodOrPropertyDoc => methodOrPropertyDoc.commentsDoc
					&&
					methodOrPropertyDoc.commentsDoc.returns
					&&
					! methodOrPropertyDoc.commentsDoc.returns.desc,
				errorLevel : 'error',
				ruleMessage : 'Missing description for @return tag'
			},
			returnDontHaveType : {
				rule : methodOrPropertyDoc => methodOrPropertyDoc.commentsDoc
					&&
					methodOrPropertyDoc.commentsDoc.returns
					&&
					! methodOrPropertyDoc.commentsDoc.returns.type,
				errorLevel : 'error',
				ruleMessage : 'Missing type for @return tag'
			},
			setterHaveReturn : {
				rule : methodOrPropertyDoc => 'set' === methodOrPropertyDoc.kind && methodOrPropertyDoc?.commentsDoc?.returns,
				errorLevel : 'warning',
				ruleMessage : 'Setter with @return tag'
			},
			setterHaveType : {
				rule : methodOrPropertyDoc => 'set' === methodOrPropertyDoc.kind && methodOrPropertyDoc?.commentsDoc?.type,
				errorLevel : 'warning',
				ruleMessage : 'Setter with @type tag'
			},
			setterHaveGetterAndDoc : {
				rule : methodOrPropertyDoc => {
					if ( 'set' !== methodOrPropertyDoc.kind ) {
						return false;
					}
					const getter = this.#currentClassDoc.methodsAndProperties.find (
						methodOrProperty => 'get' === methodOrProperty.kind &&
							methodOrPropertyDoc.name === methodOrProperty.name &&
							methodOrPropertyDoc.commentsDoc
					);
					if ( getter ) {
						return true;
					}

					return false;
				},
				errorLevel : 'error',
				ruleMessage : 'Getter and Setter have documentation'
			},
			setterDontHaveGetterAndDesc : {
				rule : methodOrPropertyDoc => {
					if ( 'set' !== methodOrPropertyDoc.kind ) {
						return false;
					}
					const getter = this.#currentClassDoc.methodsAndProperties.find (
						methodOrProperty => 'get' === methodOrProperty.kind &&
							methodOrPropertyDoc.name === methodOrProperty.name
					);
					if ( ! getter && ! methodOrPropertyDoc?.commentsDoc?.desc ) {
						return true;
					}

					return false;
				},
				errorLevel : 'error',
				ruleMessage : 'Setter don\'t have getter and don\'t have description'
			}

		}
	}

	/**
	Display an error or warning on the screen
	@param {Object} rule The rule that have generated the error or warning
	@param {VariableDoc|ClassDoc|MethodOrPropertyDoc} doc The Doc object for witch the error is generated
	*/

	#logFault ( rule, doc ) {
		let color = '';
		if ( 'warning' === rule.errorLevel ) {
			this.#warningsCounter ++;
			color = '\x1b[96m';
		}
		else {
			this.#errorsCounter ++;
			color = '\x1b[31m';
		}
		const className = this?.#currentClassDoc?.name ? this.#currentClassDoc.name + '.' : '';
		const methodPrefix = doc.private ? '#' : '';
		console.error (
			`\t${color}${rule.errorLevel}\x1b[0m '${rule.ruleMessage}' for ` +
			`${className + methodPrefix + doc.name} in file ` +
			`${color}${doc.file}\x1b[0m at line ${color}${doc.line}\x1b[0m)`
		);
	}

	/**
	Apply a rule on a Doc object
	@param {Object} rule The rule that have tobe applied on the Doc Object
	@param {VariableDoc|ClassDoc|MethodOrPropertyDoc} doc The Doc object to validate
	*/

	#validateDoc ( rule, doc ) {
		if ( rule.rule ( doc ) ) {
			this.#logFault ( rule, doc );
		}
		if ( rule.moreRule ) {
			rule.moreRule ( doc );
		}
	}

	/**
	Validate a VariableDoc object
	@param {VariableDoc} variableDoc The Doc object to validate
	*/

	#validateVariableDoc ( variableDoc ) {
		for ( const rule in this.#rules.commonRules ) {
			this.#validateDoc ( this.#rules.commonRules [ rule ], variableDoc );
		}
	}

	/**
	Validate a MethodOrPropertyDoc object
	@param {MethodOrPropertyDoc} methodOrPropertyDoc The Doc object to validate
	*/

	#validateMethodOrPropertyDoc ( methodOrPropertyDoc ) {
		for ( const rule in this.#rules.commonRules ) {
			this.#validateDoc ( this.#rules.commonRules [ rule ], methodOrPropertyDoc );
		}
		for ( const rule in this.#rules.methodsOrPropertiesRules ) {
			this.#validateDoc ( this.#rules.methodsOrPropertiesRules [ rule ], methodOrPropertyDoc );
		}
	}

	/**
	Validate a ClassDoc object
	@param {ClassDoc} classDoc The Doc object to validate
	*/

	#validateClassDoc ( classDoc ) {
		this.#currentClassDoc = classDoc;
		for ( const rule in this.#rules.commonRules ) {
			this.#validateDoc ( this.#rules.commonRules [ rule ], classDoc );
		}
		for ( const rule in this.#rules.classesRules ) {
			this.#validateDoc ( this.#rules.classesRules [ rule ], classDoc );
		}
		if ( classDoc.methodsAndProperties ) {
			classDoc.methodsAndProperties.forEach (
				methodOrPropertyDoc => this.#validateMethodOrPropertyDoc ( methodOrPropertyDoc )
			);
		}
		this.#currentClassDoc = null;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#classNames = new Map ( );
	}

	/**
	Validate the documentation
	@param {Array.<ClassDoc>} classesDocs The classes Doc objects found in the documentation
	@param {Array.<VariableDoc>} variablesDocs The variable Doc objects found in the documentation
	*/

	validate ( classesDocs, variablesDocs ) {
		this.#classNames.clear ( );
		this.#errorsCounter = 0;
		this.#warningsCounter = 0;
		this.#currentClassDoc = null;

		classesDocs?.forEach ( classDoc => this.#validateClassDoc ( classDoc ) );
		variablesDocs?.forEach ( variableDoc => this.#validateVariableDoc ( variableDoc ) );

		console.error ( `\n\t${this.#errorsCounter} errors found` );
		console.error ( `\n\t${this.#warningsCounter} warnings found` );
	}

}

export default docsValidator;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of file

@------------------------------------------------------------------------------------------------------------------------------
*/