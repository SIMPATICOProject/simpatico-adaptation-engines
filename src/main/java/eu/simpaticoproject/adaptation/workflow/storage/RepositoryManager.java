package eu.simpaticoproject.adaptation.workflow.storage;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import eu.simpaticoproject.adaptation.text.Handler;
import eu.simpaticoproject.adaptation.workflow.model.DomainModelStore;
import eu.simpaticoproject.adaptation.workflow.model.WorkFlowModelStore;

@Component
public class RepositoryManager {
	static Logger logger = Logger.getLogger(Handler.class.getName());

	@Autowired
	private MongoTemplate mongoTemplate;

	public DomainModelStore getDomainModelByProfile(String uri, String profileType) {
		Criteria c = new Criteria("uri").is(uri);
		if (!StringUtils.isEmpty(profileType)) {
			c.and("profileTypes").is(profileType);
		}
		Query query = new Query(c);
		DomainModelStore result = mongoTemplate.findOne(query, DomainModelStore.class);
		return result;
	}

	public WorkFlowModelStore getModelByProfile(String uri, String profileType) {
		Criteria c = new Criteria("uri").is(uri);
		if (!StringUtils.isEmpty(profileType)) {
			c.and("profileTypes").is(profileType);
		}
		Query query = new Query(c);
		WorkFlowModelStore result = mongoTemplate.findOne(query, WorkFlowModelStore.class);
		return result;
	}

	public List<WorkFlowModelStore> getModels(String uri) {
		Query query = new Query(new Criteria("uri").is(uri));
		List<WorkFlowModelStore> list = mongoTemplate.find(query, WorkFlowModelStore.class);
		return list;
	}

	public WorkFlowModelStore saveModel(WorkFlowModelStore model) throws IllegalArgumentException {
		if (!StringUtils.isEmpty(model.getObjectId())) {
			// update
			Query query = new Query(new Criteria("objectId").is(model.getObjectId()));
			WorkFlowModelStore dbModel = mongoTemplate.findOne(query, WorkFlowModelStore.class);
			if (dbModel == null) {
				throw new IllegalArgumentException("entity not found");
			}
			Date now = new Date();
			Update update = new Update();
			update.set("uri", model.getUri());
			update.set("profileTypes", model.getProfileTypes());
			update.set("model", model.getModel());
			update.set("lastUpdate", now);
			mongoTemplate.updateFirst(query, update, WorkFlowModelStore.class);
		} else {
			// create
			Date now = new Date();
			model.setObjectId(generateObjectId());
			model.setCreationDate(now);
			model.setLastUpdate(now);
			mongoTemplate.save(model);
		}
		return model;
	}

	public void deleteModel(String objectId) {
		Query query = new Query(new Criteria("objectId").is(objectId));
		mongoTemplate.findAndRemove(query, WorkFlowModelStore.class);
	}

	private String generateObjectId() {
		return UUID.randomUUID().toString();
	}

}
