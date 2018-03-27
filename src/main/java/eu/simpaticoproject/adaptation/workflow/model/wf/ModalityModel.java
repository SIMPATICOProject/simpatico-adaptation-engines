package eu.simpaticoproject.adaptation.workflow.model.wf;

import java.util.HashMap;
import java.util.Map;

public class ModalityModel {
	private String condition;
	private String type;
	private Map<String, Object> configuration = new HashMap<String, Object>();
	
	public String getCondition() {
		return condition;
	}
	public void setCondition(String condition) {
		this.condition = condition;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Map<String, Object> getConfiguration() {
		return configuration;
	}
	public void setConfiguration(Map<String, Object> configuration) {
		this.configuration = configuration;
	}
	
	
}
