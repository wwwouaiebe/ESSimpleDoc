/**
ParametersMismatch test class. This class must return 4 errors
*/

class ParametersMismatch {
	/**
	Method one with param mismatch
	@param {string} one A param mismatch
	*/
	
	methodWithParamsMismatchOne ( ) {}

	/**
	Method two with param mismatch
	*/
	
	methodWithParamsMismatchTwo ( one ) {}
	
	/**
	Method three with param mismatch
 	@param {string} One ... A param mismatch
	*/
	
	methodWithParamsMismatchThree ( one ) {}
	
	/**
	Method four with param mismatch
  	@param {string} three ... No param mismatch
 	@param {string} one ... No param mismatch
 	@param {string} two ... No param mismatch
	*/
	
	methodWithParamsMismatchFour ( one, two, Three ) {}

	/**
	Method one without param mismatch
	*/
	
	methodWithoutParamsMismatchOne ( ) {}
	
	/**
	Method two without param mismatch
 	@param {string} three ... No param mismatch
 	@param {string} one ... No param mismatch
 	@param {string} two ... No param mismatch
	*/
	
	methodWithoutParamsMismatchTwo ( one, two, three ) {}
}