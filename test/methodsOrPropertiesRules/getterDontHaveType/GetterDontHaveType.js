
/**
GetterDontHaveType test class. This class must return 4 errors
*/

class GetterDontHaveType {
	/**
	getter don't have type
	*/
	
	get getterDontHaveTypeOne () { return 0; }
	
	/**
	getter with bad type
	@type
	*/
	
	get getterDontHaveTypeTwo () { return 0; }
	
	/**
	getter with bad type
	@type {
	*/
	
	get getterDontHaveTypeThree () { return 0; }

	/**
	getter with empty type
	@type {}
	*/
	
	get getterDontHaveTypeFour () { return 0; }
	
	/**
	getter with type
	@type {Number}
	*/
	
	get getterHaveType () { return 0; }
}