package eu.simpaticoproject.adaptation.workflow.model.wf;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PageModel {
	private Map<String, Variable> context = new HashMap<String, Variable>();
	private List<Block> blocks = new ArrayList<Block>();
	private List<Field> fields = new ArrayList<Field>();
	private List<Map<String, Object>> services = new ArrayList<Map<String,Object>>();
	private List<Map<String, Object>> questions = new ArrayList<Map<String,Object>>();
	
	private Map<String, Object> description;
	private Map<String, Object> name;
	
	private List<WorkflowStep> workflow;
	
	public List<Block> getBlocks() {
		return blocks;
	}
	public void setBlocks(List<Block> blocks) {
		this.blocks = blocks;
	}
	public List<Field> getFields() {
		return fields;
	}
	public void setFields(List<Field> fields) {
		this.fields = fields;
	}
	public Map<String, Variable> getContext() {
		return context;
	}
	public void setContext(Map<String, Variable> context) {
		this.context = context;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PageModel other = (PageModel) obj;
		if (getBlocks() == null) {
			if (other.blocks != null)
				return false;
		} else if (!blocks.equals(other.blocks))
			return false;
		if (getContext() == null) {
			if (other.context != null)
				return false;
		} else if (!context.equals(other.context))
			return false;
		if (getFields() == null) {
			if (other.fields != null)
				return false;
		} else if (!fields.equals(other.fields))
			return false;
		return true;
	}
	public Map<String, Object> getDescription() {
		return description;
	}
	public void setDescription(Map<String, Object> description) {
		this.description = description;
	}
	public List<WorkflowStep> getWorkflow() {
		return workflow;
	}
	public void setWorkflow(List<WorkflowStep> workflow) {
		this.workflow = workflow;
	}
	public Map<String, Object> getName() {
		return name;
	}
	public void setName(Map<String, Object> name) {
		this.name = name;
	}
	public List<Map<String, Object>> getServices() {
		return services;
	}
	public void setServices(List<Map<String, Object>> services) {
		this.services = services;
	}
	public List<Map<String, Object>> getQuestions() {
		return questions;
	}
	public void setQuestions(List<Map<String, Object>> questions) {
		this.questions = questions;
	}
	
}
