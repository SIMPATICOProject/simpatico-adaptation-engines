/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package eu.simpaticoproject.adaptation;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import eu.simpaticoproject.adaptation.workflow.model.WorkFlowModelStore;
import eu.simpaticoproject.adaptation.workflow.model.wf.Block;
import eu.simpaticoproject.adaptation.workflow.model.wf.Field;
import eu.simpaticoproject.adaptation.workflow.model.wf.Mapping;
import eu.simpaticoproject.adaptation.workflow.model.wf.PageModel;
import eu.simpaticoproject.adaptation.workflow.model.wf.Variable;
import eu.simpaticoproject.adaptation.workflow.storage.RepositoryManager;

/**
 * @author raman
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = TestConfig.class)
@WebAppConfiguration
public class RepoManagerTest {

	private static final String TEST_PROFILE = "test";
	private static final String TEST_URI = "test.uri";

	@Autowired
	private RepositoryManager manager;
	
	@Autowired
	private MongoTemplate template;
	
	@Before
	public void setUp() {
		template.dropCollection(WorkFlowModelStore.class);
	}
	
	
	@Test
	public void testManager() {
		WorkFlowModelStore model = new WorkFlowModelStore();
		model.setProfileTypes(Collections.singletonList(TEST_PROFILE));
		model.setUri(TEST_URI);
		model.setModel(new PageModel());
		model.getModel().setContext(Collections.singletonMap("key", new Variable()));
		
		// create
		WorkFlowModelStore modelSaved = manager.saveModel(model);
		Assert.assertNotNull(modelSaved.getObjectId());
		Assert.assertEquals(model.getUri(), modelSaved.getUri());
		Assert.assertEquals(model.getProfileTypes(), modelSaved.getProfileTypes());
		Assert.assertNotNull(modelSaved.getCreationDate());
		Assert.assertNotNull(modelSaved.getLastUpdate());
		Assert.assertNotNull(modelSaved.getModel().getContext().get("key"));
		
		// read single
		modelSaved = manager.getModelByProfile(TEST_URI, TEST_PROFILE);
		Assert.assertNotNull(modelSaved);
		Assert.assertNotNull(modelSaved.getModel().getContext().get("key"));
		
		// read all
		List<WorkFlowModelStore> models = manager.getModels(TEST_URI);
		Assert.assertNotNull(models);
		Assert.assertEquals(1, models.size()); 
		
		// update
		modelSaved = manager.saveModel(modelSaved);
		Assert.assertNotNull(modelSaved.getObjectId());
		modelSaved = manager.getModelByProfile(TEST_URI, TEST_PROFILE);
		Assert.assertNotNull(modelSaved);
		Assert.assertNotNull(modelSaved.getModel().getContext().get("key"));

		// update wrong 
		WorkFlowModelStore wrongModel = new WorkFlowModelStore();
		wrongModel.setProfileTypes(Collections.singletonList(TEST_PROFILE));
		wrongModel.setUri(TEST_URI);
		wrongModel.setObjectId("12345");
		
		try {
			modelSaved = manager.saveModel(wrongModel);
			Assert.assertTrue(false);
		} catch (IllegalArgumentException e) {
		}

		// delete
		manager.deleteModel(modelSaved.getObjectId());
		models = manager.getModels(TEST_URI);
		Assert.assertEquals(0, models.size()); 
		
	}
	
	@Test
	public void testModel() {
		WorkFlowModelStore model = new WorkFlowModelStore();
		model.setProfileTypes(Collections.singletonList(TEST_PROFILE));
		model.setUri(TEST_URI);
		model.setModel(new PageModel());
		Variable v = new Variable();
		v.setTags(Collections.singletonList("tag"));
		v.setValue("value");
		model.getModel().setContext(Collections.singletonMap("key", v));
		model.getModel().setBlocks(new LinkedList<>());
		Block b = new Block();
		b.setBlocks(new LinkedList<>());
		b.setCompleted("completed");
		b.setCondition("condition");
		b.setDescription(Collections.singletonMap("en", "description"));
		b.setId("1");
		b.setDependencies(Collections.singletonList("dependency"));
		b.setFields(Collections.singletonList("field"));
		b.setTags(Collections.singletonList("tag"));
		b.setType("type");
		b.setXpath("xpath");
		model.getModel().getBlocks().add(b);
		model.getModel().setFields(new LinkedList<>());
		Field f = new Field();
		f.setId("fid");
		f.setXpath("fxpath");
		f.setMapping(new Mapping());
		f.getMapping().setBinding("binding");
		f.setId("mid");
		f.setXpath("mxpath");
		model.getModel().getFields().add(f);
		
		// create
		WorkFlowModelStore modelSaved = manager.saveModel(model);
		Assert.assertNotNull(modelSaved.getObjectId());
		modelSaved = manager.getModelByProfile(TEST_URI, TEST_PROFILE);
		Assert.assertEquals(model.getModel(), modelSaved.getModel());
	}

}
