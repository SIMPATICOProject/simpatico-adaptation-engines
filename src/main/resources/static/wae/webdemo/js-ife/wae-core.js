/**
 * WORKFLOW ADAPTATION ENGINE
 */
var waeEngine = new function() {
	
	var endpoint = "/wae";
	
	var domainModel = null;
	var workflowModel = null;
	var actualBlockIndex = -1;
	var prevBlockIndex = -1;
	var actualBlockId = null;
	var prevBlockId = null;
	var moveToBlock = true;
	var ruleMap = {};
	var blockCompiledMap = {};
	var blockMap = {};
	var fieldMap = {};
	var uncompletedFieldMap = {};
	var contextVar = {};
	var serviceDefinitionMap = {};
	var conceptMap = {};
	var interactionModality = "original";
	var profile = {};
	
	/**
	 * INIT THE ENGINE CONFIG. PARAMETERS:
	 * - endpoint: URL OF THE WAE REPOSITORY FOR LOADINF MODELS
	 */
	this.init = function(config) {
		config = config || {};
		if (config.endpoint) {
			endpoint = config.endpoint;
		}
	}
	
	/**
	 * Return if the model is already loaded and initialized (i.e., compillation in progress)
	 */
	this.isLoaded = function() {
		return workflowModel != null;
	}
	
	/**
	 * Reset the module to the initial state
	 */
	this.reset = function(){
		actualBlockIndex = -1;
		prevBlockIndex = -1;
		actualBlockId = null;
		prevBlockId = null;
		moveToBlock = true;
		blockCompiledMap = {};
		uncompletedFieldMap = {};
		contextVar = {};
	}
	
	function getActualBlockIndex() {
		return actualBlockIndex;
 	}; 	
 	/**
 	 * RETURN CURRENT BLOCK INDEX
 	 */
	this.getActualBlockIndex = getActualBlockIndex;
 	/**
 	 * RETURN CURRENT BLOCK ID
 	 */
	this.getActualBlockId = function() {
		return actualBlockId;
	};
	
	function getBlocksNum() {
		return workflowModel.blocks.length;
	}; 
	/**
	 * RETURN NUMBER OF BLOCKS
	 */
	this.getBlocksNum = getBlocksNum;
	
	function getSimpaticoBlockElement(simpaticoId) {
		var element = $("[data-simpatico-block-id='" + simpaticoId + "']");
		return element;
	};
	/**
	 * RETURN DOM NODE CORRESPONDING TO THE SPECIFIED BLOCK
	 */
	this.getSimpaticoBlockElement = getSimpaticoBlockElement;

	function getSimpaticoFieldElement(simpaticoId) {
		var element = $("[data-simpatico-field-id='" + simpaticoId + "']");
		return element;
	};
	/**
	 * RETURN DOM NODE CORRESPONDING TO THE SPECIFIED FIELD
	 */
	this.getSimpaticoFieldElement= getSimpaticoFieldElement;

	function getSimpaticoContainer() {
		var container = $("[data-simpatico-id='simpatico_edit_block']");
		return container;
	};
	this.getSimpaticoContainer = getSimpaticoContainer;

	function loadModel(uri, idProfile, callback, errorCallback) {
		//TODO get profile from id
		setEntity("urn:simpaticoproject:profile#interaction_capability", "MEDIUM");
		var urlDomain = endpoint + "/model/domain?uri=" + uri + (!!idProfile ? ("&idProfile="+idProfile) : "");
		var urlWorkflow = endpoint + "/model/page?uri=" + uri + (!!idProfile ? ("&idProfile="+idProfile) : "");
		$.getJSON(urlDomain)
	  .done(function(json) {
	  	domainModel = json;
	  	json.concepts.forEach(function(c) {
	  		conceptMap[c.uri] = c;
	  	});
	  	json.services.forEach(function(s) {
	  		serviceDefinitionMap[s.uri] = s;
	  	});
	  	$.getJSON(urlWorkflow)
	  	.done(function(json) {
		  	workflowModel = json;
		  	json.blocks.forEach(function(b) {
		  		blockMap[b.id] = b;
		  	});
		  	json.fields.forEach(function(f) {
		  		fieldMap[f.id] = f;
		  	});
		  	json.services.forEach(function(s) {
		  		s.called = false;
		  	});
		  	//console.log(JSON.stringify(json));
		  	initModule();
				//check services to invoke
				if(interactionModality != "original") {
					invokeServices().then(function() {
						if (callback) callback(blockMap);
					});
				} else {
					if (callback) callback(blockMap);
				}
	  	})
	  })
	  .fail(function( jqxhr, textStatus, error) {
	  	console.log(textStatus + ", " + error);
	  	if (errorCallback) errorCallback(textStatus + ", " + error);
	  });
	};
	/**
	 * LOAD ADAPTED WORKFLOW MODEL FOR THE SPECIFIED FORM AND USER
	 */
	this.loadModel = loadModel;

	function evalBlockEdited(blockId) {
		var blockEdited = blockCompiledMap[blockId];
		return (blockEdited != null);
	};

	function evalContextVar(expression) {
		var context = contextVar;
		var result = eval(expression);
		return result;
	};
	
	function getEntity(entity) {
		var origin = entity;
		var name = "me";
		var index = entity.indexOf("@");
		if(index > -1) {
			name = entity.substring(0, index);
			entity = entity.substring(index + 1);
		}
		if(!contextVar[name]) {
			return null;
		}
		var uri = entity; 
		var complexPath = false;
		index = entity.indexOf("#");
		if(index > -1) {
			uri = entity.substring(0, index);
			complexPath = true;
			entity = entity.substring(index + 1);
		}
		if(!contextVar[name][uri]) {
			return null;
		}
		if(!complexPath) {
			return contextVar[name][uri];
		} else {
			var attributes = entity.split(".");
			if(attributes.length == 1) {
				return contextVar[name][uri][entity];
			} else {
				var result = contextVar[name][uri];
				attributes.forEach((attribute) => {
					result = result[attribute];
				});
				return result;
			}
		}
	}

	function setEntity(entity, value) {
		var origin = entity;
		var name = "me";
		var index = entity.indexOf("@");
		if(index > -1) {
			name = entity.substring(0, index);
			entity = entity.substring(index + 1);
		}
		var uri = entity;
		var complexPath = false;
		index = entity.indexOf("#");
		if(index > -1) {
			uri = entity.substring(0, index);
			complexPath = true;
			entity = entity.substring(index + 1);
		} 
		if(!contextVar[name]) {
			contextVar[name] = {};
		}
		if(!complexPath) {
			contextVar[name][uri] = value;
		} else {
			if(!contextVar[name][uri]) {
				contextVar[name][uri] = {};
			}
			var attributes = entity.split(".");
			if(attributes.length == 1) {
				contextVar[name][uri][entity] = value;
			} else {
				var parentObject = contextVar[name][uri];
				for(i = 0; i < (attributes.length - 1); i++) {
					var attribute = attributes[i];
					var childObject = parentObject[attribute];
					if(!childObject) {
						parentObject[attribute] = {};
						childObject = parentObject[attribute];
					}
					parentObject = childObject;
				}
				parentObject[attributes[attributes.length - 1]] = value;
			}
		}
	}
	
	function setActualBlock(index) {
		prevBlockId = actualBlockId;
		prevBlockIndex = actualBlockIndex;
		actualBlockIndex = index;
		actualBlockId = workflowModel.blocks[actualBlockIndex] ? workflowModel.blocks[actualBlockIndex].id : null;
		moveToBlock = true;
	};

	function checkDependencies(block) {
		var result = true;
		if(block.dependencies) {
			for(var i = 0; i < block.dependencies.length; i++) {
				var blockId = block.dependencies[i];
				var completed = evalBlockEdited(blockId);
				if(!completed) {
					result = false;
					break;
				}
			}
		}
		return result;
	};

	function getNextBlock() {
		moveToBlock = false;
		for(var i = actualBlockIndex+1; i < workflowModel.blocks.length; i++) {
			var block = workflowModel.blocks[i];
			if(block.type == "CONTAINER") {
				continue;
			}
			if(!checkDependencies(block)) {
				continue;
			}
			if(block.condition) {
				if(!evalContextVar(block.condition)) {
					continue;
				}
			}
			setActualBlock(i);
			break;
		}
	};

	function getPrevBlock() {
		moveToBlock = false;
		for(var i = actualBlockIndex-1; i >= 0; i--) {
			var block = workflowModel.blocks[i];
			var rule = ruleMap[block.id];
			if(block.type == "CONTAINER") {
				continue;
			}
			if(!checkDependencies(block)) {
				continue;
			}
			if(block.condition) {
				if(!evalContextVar(block.condition)) {
					continue;
				}
			}
			setActualBlock(i);
			break;
		}
	};

	function initModule() {
		//check interaction modality
		domainModel.modalities.forEach((modality) => {
			if(evalContextVar(modality.condition)) {
				interactionModality = modality.type;
			}
		});
		for(var i = 0; i < workflowModel.blocks.length; i++) {
			var block = workflowModel.blocks[i];
			var element = document.evaluate(block.xpath, document, null, 
					XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if(element != null) {
				//add id
				$(element).attr("data-simpatico-block-id", block.id);
				//hide element
				//showElement(block.id, "HIDE");
			}
		}
		for(var i = 0; i < workflowModel.fields.length; i++) {
			var field = workflowModel.fields[i];
			var element = document.evaluate(field.xpath, document, null, 
					XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if(element != null) {
				//add id
				$(element).attr("data-simpatico-field-id", field.id);
			}
		}
	};
	
	function invokeServices() {
		return new Promise(function(resolve, reject) {
			var invocableService = false;
			for(var i = 0; i < workflowModel.services.length; i++) {
				var service = workflowModel.services[i];
				if(service.called) {
					continue;
				}
				//check if exists all the input parameters
				var invokable = true;
				if(service.input) {
					for(var j = 0; j < service.input.length; j++) {
						var input = service.input[j];
						var value = getEntity(input.type);
						if(value == null) {
							invokable = false;
							break;
						}
					}
				}
				if(invokable) {
					invocableService = true;
					var serviceDefinition = serviceDefinitionMap[service.uri];
					invocableService = true;
					waeServices.invokeService(service, serviceDefinition).
					then(function ok(result) {
							console.log("called service:" + result.service.uri);
							result.service.called = true;
							var keys = Object.keys(result.varMap);
							if(keys) {
								keys.forEach((key) => {
									var value = result.varMap[key];
									setEntity(key, value);
								});
							}
							invokeServices().then(function(result) {
								resolve();
							});
						}
					)
					.catch(function notOk(err) {
						console.error(err);
						invokeServices().then(function(result) {
							resolve();
						});
					});
					break;
				}
			}	
			if(!invocableService) {
				resolve();
			}
		});
	};
	
	function setBlockVars(blockId) {
		var block = blockMap[blockId];
		if(block != null) {
			block.fields.forEach(function(f) {
				var fieldId = f;
				var field = fieldMap[fieldId];
				if(field != null) {
					if(field.mapping.binding == "OUT" || field.mapping.binding == "INOUT") {
						var element = getSimpaticoFieldElement(field.id);
						if(element != null) {
							var value = getInputValue(element);
							setEntity(field.mapping.key, value);
						}
					}
				}
			});
		}
	};

	function revertBlockVars(blockId) {
		var block = blockMap[blockId];
		if(block != null) {
			block.fields.forEach(function(f) {
				var fieldId = f;
				var field = fieldMap[fieldId];
				if(field != null) {
					delete contextVar[field.mapping.key];
				}
			});	
		}
	};

	function prevBlock(callback, errorCallback) {
		//TODO reset form?
		if(actualBlockId) {
			delete blockCompiledMap[actualBlockId];
			//revertBlockVars(actualBlockId);
		}
		getPrevBlock();
		var actions = {};
		if(!moveToBlock) {
			callback(actions);
			return;
		}
		if(prevBlockId != null) {
			actions[prevBlockId] = "HIDE";
		}
		actions[actualBlockId] = "SHOW";
		callback(actions);
	};
	/**
	 * MOVE TO THE PREVIOUS BLOCK
	 */
	this.prevBlock = prevBlock;

	function nextBlock(callback, errorCallback) {
		if(actualBlockId) {
			setBlockVars(actualBlockId);
			if(isBlockCompleted(actualBlockId)) {
				blockCompiledMap[actualBlockId] = true;
			} else {
				delete blockCompiledMap[actualBlockId];
				revertBlockVars(actualBlockId);
				errorCallback(JSON.stringify(uncompletedFieldMap));
			}
		}
		getNextBlock();
		var actions = {};
		if(!moveToBlock) {
			callback(actions);
			return;
		}
		if(prevBlockId != null) {
			actions[prevBlockId] = "HIDE";
		}
		fillBlock();
		actions[actualBlockId] = "SHOW";
		callback(actions);
	};
	/**
	 * MOVE TO THE NEXT BLOCK
	 */
	this.nextBlock = nextBlock;

	/**
	 * RETURN BLOCK DESCRIPTION
	 */
	this.getBlockDescription = function() {
		if (!!workflowModel && !!workflowModel.blocks && workflowModel.blocks[actualBlockIndex]) {
			return workflowModel.blocks[actualBlockIndex].description;
		}
	}
	
	this.restartBlock = function(callback, errorCallback) {
		setActualBlock(actualBlockIndex -1);
		this.nextBlock(callback,errorCallback);
	}
	
	function fillBlock() {
		var block = blockMap[actualBlockId];
		if(block != null) {
			block.fields.forEach(function(f) {
				var fieldId = f;
				var field = fieldMap[fieldId];
				if(field != null) {
					if(field.mapping.binding == "IN" || field.mapping.binding == "INOUT") {
						var value = getEntity(field.mapping.key);
						var element = this.getSimpaticoFieldElement(field.id);
						if(element != null) {
							setElementValue(element, value);
						}
					}
				}
			});	
		}
	}

	function isBlockCompleted(blockId) {
		uncompletedFieldMap = {};
		var result = true;
		var block = blockMap[blockId];
		if(block != null) {
			if(block.completed) {
				var completedCondition = evalContextVar(block.completed);
				if(!completedCondition) {
					result = false;
					uncompletedFieldMap[blockId] = block.completed;
				}
			}
		}
		return result;
	} 

	function getInputValue(element) {
		//TODO get input value
		if($(element).is(':checkbox')) {
			if($(element).is(':checked')) {
				return $(element).val();
			}
		} else if($(element).is(':radio')) {
			if($(element).is(':checked')) {
				return $(element).val();
			}
		} else {
			return $(element).val();
		}
		return null;
	}

	function setElementValue(element, value) {
		$(element).val(value);
	}
	
}