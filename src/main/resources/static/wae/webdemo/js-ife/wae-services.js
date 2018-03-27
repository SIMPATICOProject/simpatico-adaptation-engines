var waeServices = new function() {
	function invokeService(service, serviceDescription, callback, errorCallback) {
		var result = {}
		if(service.uri == "http://simpatico.org/services/account") {
			result = {
					"me@http://simpatico.org/domain/trento/fiscalid" : "1122334455"
			}
		}
		if(callback) {
			callback(service, result)
		}
	}
	this.invokeService = invokeService 
}