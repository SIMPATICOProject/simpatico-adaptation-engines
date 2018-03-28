var waeServices = new function() {
	function invokeService(service, serviceDescription, callback, errorCallback) {
		setTimeout(function() {
			var result = {}
			if(service.uri == "http://simpatico.org/services/account") {
				result = {
						"me@http://simpatico.org/domain/trento/fiscalid" : "1122334455"
				}
			} else if(service.uri == "http://simpatico.org/services/trento/getICEF") {
				result = {
						"me@http://simpatico.org/domain/trento/icef#fiscalid" : "1122334455", 
						"me@http://simpatico.org/domain/trento/icef#name" : "Gino", 
						"me@http://simpatico.org/domain/trento/icef#surname" : "Rivieccio", 
						"me@http://simpatico.org/domain/trento/icef#date" : "01-04-2018", 
						"me@http://simpatico.org/domain/trento/icef#value" : 1.23
				}
			} else if(service.uri == "http://simpatico.org/services/trento/getFamily") {
				result = {
						"me@http://simpatico.org/domain/trento/family_member#fiscalid" : "1122334455", 
						"me@http://simpatico.org/domain/trento/family_member#name" : "Gino", 
						"me@http://simpatico.org/domain/trento/family_member#surname" : "Rivieccio", 
						"me@http://simpatico.org/domain/trento/family_member#bith_date" : "31-01-1958", 
						"me@http://simpatico.org/domain/trento/family_member#gender" : "M"
				}
			} else if(service.uri == "http://simpatico.org/services/trento/getPersonlData") {
					if(service.input[0].type == "me@http://simpatico.org/domain/trento/fiscalid") {
						result = {
								"me@http://simpatico.org/domain/trento/citizen#fiscalid" : "1122334455", 
								"me@http://simpatico.org/domain/trento/citizen#name" : "Gino", 
								"me@http://simpatico.org/domain/trento/citizen#surname" : "Rivieccio", 
								"me@http://simpatico.org/domain/trento/citizen#nationality" : "Italiana", 
								"me@http://simpatico.org/domain/trento/citizen#bith_date" : "31-01-1958", 
								"me@http://simpatico.org/domain/trento/citizen#bith_place" : "LuogoNascita", 
								"me@http://simpatico.org/domain/trento/citizen#gender" : "M", 
								"me@http://simpatico.org/domain/trento/citizen#address.street" : "Via", 
								"me@http://simpatico.org/domain/trento/citizen#address.number" : "Numero", 
								"me@http://simpatico.org/domain/trento/citizen#address.bar" : "Barra",
								"me@http://simpatico.org/domain/trento/citizen#address.cap" : "CAP",
								"me@http://simpatico.org/domain/trento/citizen#address.city" : "Comune",
								"me@http://simpatico.org/domain/trento/citizen#address.province" : "Provincia"
						}
					} else {
						result = {
								"child@http://simpatico.org/domain/trento/citizen#fiscalid" : "AABBCCDD", 
								"child@http://simpatico.org/domain/trento/citizen#name" : "Mario", 
								"child@http://simpatico.org/domain/trento/citizen#surname" : "Rivieccio", 
								"child@http://simpatico.org/domain/trento/citizen#nationality" : "Nazionalita", 
								"child@http://simpatico.org/domain/trento/citizen#bith_date" : "DataNascita", 
								"child@http://simpatico.org/domain/trento/citizen#bith_place" : "LuogoNascita", 
								"child@http://simpatico.org/domain/trento/citizen#gender" : "Sesso", 
								"child@http://simpatico.org/domain/trento/citizen#address.street" : "Via", 
								"child@http://simpatico.org/domain/trento/citizen#address.number" : "Numero", 
								"child@http://simpatico.org/domain/trento/citizen#address.bar" : "Barra",
								"child@http://simpatico.org/domain/trento/citizen#address.cap" : "CAP",
								"child@http://simpatico.org/domain/trento/citizen#address.city" : "Comune",
								"child@http://simpatico.org/domain/trento/citizen#address.province" : "Provincia"
						}
					}
			}
			if(callback) {
				callback(service, result)
			}
		}, 1000);
	}
	this.invokeService = invokeService 
}