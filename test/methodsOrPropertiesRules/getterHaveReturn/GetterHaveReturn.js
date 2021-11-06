
/**
GetterHaveReturn test class. This class must return 1 warning
*/

class GetterHaveReturn {
	
	/**
	getter have return
	@type {Number}
	@return {Number} Bad return
	*/
	
	get getterHaveReturn () { return 0; }

	/**
	getter don't have return
	@type {Number}
	*/
	
	get getterDontHaveReturn () { return 0; }
}
