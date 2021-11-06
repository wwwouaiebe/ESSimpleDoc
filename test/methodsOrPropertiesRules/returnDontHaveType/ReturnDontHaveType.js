/**
ReturnDontHaveType test class. This class must return 4 errors 'Missing type for @return tag' and 3 errors 'Missing description for @return tag'
*/

class ReturnDontHaveType {
	
	/**
	Return tag don't have type
	@return Return tag don't have type
	*/
	
	returnDontHaveTypeOne ( ) {}
	
	/**
	Return tag don't have type
	@return { Return tag don't have type
	*/
	
	returnDontHaveTypeTwo ( ) {}
	
	/**
	Return tag don't have type
	@return {} Return tag don't have type
	*/
	
	returnDontHaveTypeThree ( ) {}
	
	/**
	Return tag don't have type
	@return {Number Return tag don't have type
	*/
	
	returnDontHaveTypeFour ( ) {}
	
	/**
	Return tag  have type
	@return {String} Return taghave type
	*/
	
	
	returnHaveType ( ) {}
}