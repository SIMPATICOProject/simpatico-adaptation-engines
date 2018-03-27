package eu.simpaticoproject.adaptation.workflow.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import eu.simpaticoproject.adaptation.workflow.model.wf.ModalityModel;

public class DomainModelStore extends BaseObject {
	private String uri;
	private List<Map<String, Object>> concepts = new ArrayList<Map<String,Object>>();
	private List<Map<String, Object>> services = new ArrayList<Map<String,Object>>();
	private List<ModalityModel> modalities = new ArrayList<ModalityModel>();
	
	public String getUri() {
		return uri;
	}
	public void setUri(String uri) {
		this.uri = uri;
	}
	public List<ModalityModel> getModalities() {
		return modalities;
	}
	public void setModalities(List<ModalityModel> modalities) {
		this.modalities = modalities;
	}
	public List<Map<String, Object>> getConcepts() {
		return concepts;
	}
	public void setConcepts(List<Map<String, Object>> concepts) {
		this.concepts = concepts;
	}
	public List<Map<String, Object>> getServices() {
		return services;
	}
	public void setServices(List<Map<String, Object>> services) {
		this.services = services;
	}
	
	
}
