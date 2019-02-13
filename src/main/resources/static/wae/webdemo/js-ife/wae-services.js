var waeServices = new function() {
	function invokeService(service, serviceDescription) {
		return new Promise(function(resolve, reject) {
			setTimeout(function() {
				var varMap = {};
				if(service.uri == "http://simpatico.org/services/account") {
					varMap = {
							"me@http://simpatico.org/domain/trento/fiscalid" : "1122334455"
					}
				} else if(service.uri == "http://simpatico.org/services/trento/getICEF") {
					varMap = {
							"me@http://simpatico.org/domain/trento/icef#fiscalid" : "1122334455", 
							"me@http://simpatico.org/domain/trento/icef#name" : "Gino", 
							"me@http://simpatico.org/domain/trento/icef#surname" : "Rivieccio", 
							"me@http://simpatico.org/domain/trento/icef#date" : "01-04-2018", 
							"me@http://simpatico.org/domain/trento/icef#value" : 1.23
					}
				} else if(service.uri == "http://simpatico.org/services/trento/getFamily") {
					varMap = {
							"member1@http://simpatico.org/domain/trento/family_member#fiscalid" : "1122334455", 
							"member1@http://simpatico.org/domain/trento/family_member#name" : "Gino", 
							"member1@http://simpatico.org/domain/trento/family_member#surname" : "Rivieccio", 
							"member1@http://simpatico.org/domain/trento/family_member#birth_date" : "31-01-1958", 
							"member1@http://simpatico.org/domain/trento/family_member#gender" : "M",
							"member1@http://simpatico.org/domain/trento/family_member#relation" : "P",
							"member2@http://simpatico.org/domain/trento/family_member#fiscalid" : "44444444", 
							"member2@http://simpatico.org/domain/trento/family_member#name" : "Elena", 
							"member2@http://simpatico.org/domain/trento/family_member#surname" : "Rossi", 
							"member2@http://simpatico.org/domain/trento/family_member#birth_date" : "31-02-1958", 
							"member2@http://simpatico.org/domain/trento/family_member#gender" : "F",
							"member2@http://simpatico.org/domain/trento/family_member#relation" : "M",
							"member3@http://simpatico.org/domain/trento/family_member#fiscalid" : "AABBCCDD", 
							"member3@http://simpatico.org/domain/trento/family_member#name" : "Mario", 
							"member3@http://simpatico.org/domain/trento/family_member#surname" : "Rivieccio", 
							"member3@http://simpatico.org/domain/trento/family_member#birth_date" : "31-01-2017", 
							"member3@http://simpatico.org/domain/trento/family_member#gender" : "M",
							"member3@http://simpatico.org/domain/trento/family_member#relation" : "I",
					}
				} else if(service.uri == "http://simpatico.org/services/trento/getPersonlData") {
						if(service.input[0].type == "me@http://simpatico.org/domain/trento/fiscalid") {
							varMap = {
									"me@http://simpatico.org/domain/trento/citizen#fiscalid" : "1122334455", 
									"me@http://simpatico.org/domain/trento/citizen#name" : "Gino", 
									"me@http://simpatico.org/domain/trento/citizen#surname" : "Rivieccio", 
									"me@http://simpatico.org/domain/trento/citizen#nationality" : "ITALIA", 
									"me@http://simpatico.org/domain/trento/citizen#birth_date" : "31-01-1958", 
									"me@http://simpatico.org/domain/trento/citizen#birth_place" : "Rovereto", 
									"me@http://simpatico.org/domain/trento/citizen#gender" : "M", 
									"me@http://simpatico.org/domain/trento/citizen#address.street" : "Via", 
									"me@http://simpatico.org/domain/trento/citizen#address.number" : "Numero", 
									"me@http://simpatico.org/domain/trento/citizen#address.bar" : "Barra",
									"me@http://simpatico.org/domain/trento/citizen#address.cap" : "38123",
									"me@http://simpatico.org/domain/trento/citizen#address.city" : "Trento",
									"me@http://simpatico.org/domain/trento/citizen#address.province" : "TN",
									"me@http://simpatico.org/domain/trento/parent_role": "padre"
							}
						} else {
							varMap = {
									"child@http://simpatico.org/domain/trento/citizen#fiscalid" : "AABBCCDD", 
									"child@http://simpatico.org/domain/trento/citizen#name" : "Mario", 
									"child@http://simpatico.org/domain/trento/citizen#surname" : "Rivieccio", 
									"child@http://simpatico.org/domain/trento/citizen#nationality" : "ITALIA", 
									"child@http://simpatico.org/domain/trento/citizen#birth_date" : "31-01-2017", 
									"child@http://simpatico.org/domain/trento/citizen#birth_place" : "Trento", 
									"child@http://simpatico.org/domain/trento/citizen#gender" : "M", 
									"child@http://simpatico.org/domain/trento/citizen#address.street" : "Via", 
									"child@http://simpatico.org/domain/trento/citizen#address.number" : "Numero", 
									"child@http://simpatico.org/domain/trento/citizen#address.bar" : "Barra",
									"child@http://simpatico.org/domain/trento/citizen#address.cap" : "38123",
									"child@http://simpatico.org/domain/trento/citizen#address.city" : "Trento",
									"child@http://simpatico.org/domain/trento/citizen#address.province" : "TN"
							}
						}
				}
				var result = {
						'service' : service,
						'varMap' : varMap
				};
				resolve(result);
			}, 1000);	
		});
	}
	this.invokeService = invokeService 
}