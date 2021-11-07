
/**
A clas with bad documented returns 
*/

class BadDocumentedReturns {
	
	/**
	A method with missing type in the return tag
	@return bad documented return ( missing type )
	*/
	
	BadDocMethod1 ( ) {	}

	/**
	A method with missing desc in the return tag
	@return {String}
	*/
	
	BadDocMethod2 ( ) {	}

	/**
	A method with missing type and desc in the return tag
	@return
	*/
	
	BadDocMethod3 ( ) {	}
	
	/**
	A method with missing type and desc in the return tag and the end of comment directly after
	@return*/
	
	BadDocMethod4 ( ) {	}
	
	/**
	A method correctly documented
	@return {String} A good return
	*/
	
	GoodMethod1 ( ) { }
	
	/**
	A method correctly documented
	@return
	{String} A good return
	*/
	
	GoodMethod2 ( ) { }

	/**
	A method correctly documented
	@return {String}
	A good return
	*/
	
	GoodMethod3 ( ) { }

	/**
	A method correctly documented
	@return {String} A 
	good return
	*/
	
	GoodMethod3 ( ) { }
}

/**
A clas with bad documented params
*/

class BadDocumentedParams {
	
	/**
	A method with missing type in the param tag
	@param param A param with missing type
	*/
	
	BadDocMethod1 ( param ) {	}
	
	/**
	A method with missing description in the param tag
	@param {String} param  
	*/
	
	BadDocMethod2 ( param ) {	}

	
	/**
	A method with missing name and description in the param tag
	@param {String}
	*/
	
	BadDocMethod3 ( param ) {	}
	
	/**
	A method with missing type name and description in the param tag
	@param
	*/
	
	BadDocMethod4 ( param ) {	}

	/**
	Another method with missing type name and description in the param tag
	@param*/
	
	BadDocMethod5 ( param ) {	}
	
	/**
	A method correctly documented
	@param {String} param A correctly documented param
	*/
	
	GoodDocMethod1 ( param ) { }

	/**
	A method correctly documented
	@param {String} param 
	A correctly documented param
	*/
	
	GoodDocMethod2 ( param ) { }

	/**
	A method correctly documented
	@param {String} 
	param 
	A correctly documented param
	*/
	
	GoodDocMethod3 ( param ) { }

	/**
	A method correctly documented
	@param 
	{String} 
	param 
	A correctly documented param
	*/
	
	GoodDocMethod4 ( param ) { }

	
}