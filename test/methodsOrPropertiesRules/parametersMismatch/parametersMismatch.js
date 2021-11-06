/**
ParametersMismatch test class. This class must return 4 errors
*/

class ParametersMismatch {
	/**
	Method one with param mismatch
	@param {String} one A param mismatch
	*/
	
	methodWithParamsMismatchOne ( ) {}

	/**
	Method two with param mismatch
	*/
	
	methodWithParamsMismatchTwo ( one ) {}
	
	/**
	Method three with param mismatch
 	@param {String} One A param mismatch
	*/
	
	methodWithParamsMismatchThree ( one ) {}
	
	/**
	Method four with param mismatch
  	@param {String} three No param mismatch
 	@param {String} one No param mismatch
 	@param {String} two No param mismatch
	*/
	
	methodWithParamsMismatchFour ( one, two, Three ) {}

	/**
	Method one without param mismatch
	*/
	
	methodWithoutParamsMismatchOne ( ) {}
	
	/**
	Method two without param mismatch
  	@param {String} three ... No param mismatch
	@param {String} one ... No param mismatch
 	@param {String} two ... No param mismatch
	*/
	
	methodWithoutParamsMismatchTwo ( one, two, three ) {}
}