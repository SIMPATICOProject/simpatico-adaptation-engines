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
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;


import eu.simpaticoproject.adaptation.workflow.model.WorkFlowModelStore;
import eu.simpaticoproject.adaptation.workflow.model.wf.PageModel;
import eu.simpaticoproject.adaptation.workflow.model.wf.Variable;

/**
 * @author raman
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = TestConfig.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class WAEControllerTest {

	private static final String TEST_PROFILE = "test";
	private static final String TEST_URI = "test.uri";

	@Autowired
	private MockMvc mockMvc;
	
	@Autowired
	private MongoTemplate mongoTemplate;
	
	@Before
	public void setUp() {
		mongoTemplate.dropCollection(WorkFlowModelStore.class);
	}
	
	
	@Test
	public void testController() throws Exception{
		WorkFlowModelStore model = new WorkFlowModelStore();
		model.setProfileTypes(Collections.singletonList(TEST_PROFILE));
		model.setUri(TEST_URI);
		model.setModel(new PageModel());
		model.getModel().setContext(Collections.singletonMap("key", new Variable()));

		// create
		RequestBuilder request = MockMvcRequestBuilders.post("/wae/model")
				.content(new ObjectMapper().writeValueAsString(model))
				.header("Accept", MediaType.APPLICATION_JSON_VALUE)
				.header("Content-Type", MediaType.APPLICATION_JSON_VALUE);
		ResultActions result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful());
		String string = result.andReturn().getResponse().getContentAsString();
		WorkFlowModelStore savedModel = new ObjectMapper().readValue(string, WorkFlowModelStore.class);
		Assert.assertNotNull(savedModel);
		Assert.assertEquals(model.getModel(), savedModel.getModel());
		Assert.assertEquals(model.getUri(), savedModel.getUri());
		Assert.assertEquals(model.getProfileTypes(), savedModel.getProfileTypes());
		
		// update 
		request = MockMvcRequestBuilders.put("/wae/model/{objectId}", savedModel.getObjectId())
				.content(new ObjectMapper().writeValueAsString(model))
				.header("Accept", MediaType.APPLICATION_JSON_VALUE)
				.header("Content-Type", MediaType.APPLICATION_JSON_VALUE);
		result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful());
		string = result.andReturn().getResponse().getContentAsString();
		savedModel = new ObjectMapper().readValue(string, WorkFlowModelStore.class);
		Assert.assertNotNull(savedModel);
		Assert.assertEquals(model.getModel(), savedModel.getModel());
		Assert.assertEquals(model.getUri(), savedModel.getUri());
		Assert.assertEquals(model.getProfileTypes(), savedModel.getProfileTypes());
		
		// update incorrect data 
		request = MockMvcRequestBuilders.put("/wae/model/{objectId}", savedModel.getObjectId())
				.content("{abc:'def'}")
				.header("Accept", MediaType.APPLICATION_JSON_VALUE)
				.header("Content-Type", MediaType.APPLICATION_JSON_VALUE);
		result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().is5xxServerError());
		
		// update non existing
		request = MockMvcRequestBuilders.put("/wae/model/{objectId}", "12345")
				.content(new ObjectMapper().writeValueAsString(model))
				.header("Accept", MediaType.APPLICATION_JSON_VALUE)
				.header("Content-Type", MediaType.APPLICATION_JSON_VALUE);
		result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().isBadRequest());
		
		// read wrappers
		request = MockMvcRequestBuilders.get("/wae/model")
				.param("uri", TEST_URI)
				.header("Accept", MediaType.APPLICATION_JSON_VALUE);
		result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful());
		string = result.andReturn().getResponse().getContentAsString();
		TypeReference<List<WorkFlowModelStore>> tr = new TypeReference<List<WorkFlowModelStore>>() {};
		List<WorkFlowModelStore> savedModels = new ObjectMapper().readValue(string, tr);
		Assert.assertNotNull(savedModels);
		Assert.assertEquals(1, savedModels.size());
		Assert.assertEquals(model.getModel(), savedModels.get(0).getModel());
		Assert.assertEquals(model.getUri(), savedModels.get(0).getUri());
		Assert.assertEquals(model.getProfileTypes(), savedModels.get(0).getProfileTypes());

		// read model
		request = MockMvcRequestBuilders.get("/wae/model/page")
				.param("uri", TEST_URI)
				.header("Accept", MediaType.APPLICATION_JSON_VALUE);
		result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful());
		string = result.andReturn().getResponse().getContentAsString();
		PageModel pageModel = new ObjectMapper().readValue(string, PageModel.class);
		Assert.assertNotNull(pageModel);
		Assert.assertEquals(model.getModel(), pageModel);

		// read non existing
		request = MockMvcRequestBuilders.get("/wae/model/page")
				.param("uri", "12345")
				.header("Accept", MediaType.APPLICATION_JSON_VALUE);
		result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().is5xxServerError());

		
		// delete
		request = MockMvcRequestBuilders.delete("/wae/model/{objectId}",savedModel.getObjectId())
				.param("uri", TEST_URI)
				.header("Accept", MediaType.APPLICATION_JSON_VALUE);
		result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful());
		// read deleted
		request = MockMvcRequestBuilders.get("/wae/model/page")
				.param("uri", TEST_URI)
				.header("Accept", MediaType.APPLICATION_JSON_VALUE);
		result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().is5xxServerError());

	}
	
	
}
