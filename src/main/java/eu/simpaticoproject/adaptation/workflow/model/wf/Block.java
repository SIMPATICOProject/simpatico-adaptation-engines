package eu.simpaticoproject.adaptation.workflow.model.wf;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Block {
	private String id;
	private String type;
	private Map<String, String> name;
	private String xpath;
	private List<String> tags = new ArrayList<String>();
	private List<String> fields = new ArrayList<String>();
	private List<String> blocks = new ArrayList<String>();
	private List<String> dependencies = new ArrayList<String>();
	private String condition;
	private String completed;
	private List<Map<String, Object>> annotations = new ArrayList<Map<String,Object>>();
	private Map<String,String> description;
	private List<String> concepts;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public List<String> getTags() {
		return tags;
	}
	public void setTags(List<String> tags) {
		this.tags = tags;
	}
	public List<String> getFields() {
		return fields;
	}
	public void setFields(List<String> fields) {
		this.fields = fields;
	}
	public List<String> getBlocks() {
		return blocks;
	}
	public void setBlocks(List<String> blocks) {
		this.blocks = blocks;
	}
	public List<String> getDependencies() {
		return dependencies;
	}
	public void setDependencies(List<String> dependencies) {
		this.dependencies = dependencies;
	}
	public String getCondition() {
		return condition;
	}
	public void setCondition(String condition) {
		this.condition = condition;
	}
	public String getCompleted() {
		return completed;
	}
	public void setCompleted(String completed) {
		this.completed = completed;
	}
	public String getXpath() {
		return xpath;
	}
	public void setXpath(String xpath) {
		this.xpath = xpath;
	}
	public Map<String, String> getDescription() {
		return description;
	}
	public void setDescription(Map<String, String> description) {
		this.description = description;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Block other = (Block) obj;
		if (getBlocks() == null) {
			if (other.blocks != null)
				return false;
		} else if (!blocks.equals(other.blocks))
			return false;
		if (getCompleted() == null) {
			if (other.completed != null)
				return false;
		} else if (!completed.equals(other.completed))
			return false;
		if (getCondition() == null) {
			if (other.condition != null)
				return false;
		} else if (!condition.equals(other.condition))
			return false;
		if (getDependencies() == null) {
			if (other.dependencies != null)
				return false;
		} else if (!dependencies.equals(other.dependencies))
			return false;
		if (getDescription() == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (getFields() == null) {
			if (other.fields != null)
				return false;
		} else if (!fields.equals(other.fields))
			return false;
		if (getId() == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (getTags() == null) {
			if (other.tags != null)
				return false;
		} else if (!tags.equals(other.tags))
			return false;
		if (getType() == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		if (getXpath() == null) {
			if (other.xpath != null)
				return false;
		} else if (!xpath.equals(other.xpath))
			return false;
		return true;
	}
	public Map<String, String> getName() {
		return name;
	}
	public void setName(Map<String, String> name) {
		this.name = name;
	}
	public List<Map<String, Object>> getAnnotations() {
		return annotations;
	}
	public void setAnnotations(List<Map<String, Object>> annotations) {
		this.annotations = annotations;
	}
	public List<String> getConcepts() {
		return concepts;
	}
	public void setConcepts(List<String> concepts) {
		this.concepts = concepts;
	}

	
}
