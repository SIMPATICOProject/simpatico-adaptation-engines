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

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import eu.simpaticoproject.adaptation.text.tae.SimpaticoInput;
import eu.simpaticoproject.adaptation.text.tae.SimpaticoOutput;

/**
 * @author raman
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = TestConfig.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class TAEControllerTest {

	@Autowired
	private MockMvc mockMvc;
	
	@Test
	public void testIT() throws Exception{
		String word = "prova", lang = "it";
		testWordSimplification(word, lang);
	}

	@Test
	public void testES() throws Exception{
		String word = "hola", lang = "es";
		testWordSimplification(word, lang);
	}

	@Test
	public void testEN() throws Exception{
		String word = "hello", lang = "en";
		testWordSimplification(word, lang);
	}

	@Test
	public void testNonExisting() throws Exception {
		String word = "!!!!", lang = "aa";
		// get
		RequestBuilder request = MockMvcRequestBuilders.get("/tae/simp")
				.param("word", word)
				.param("lang", lang)
				.header("Accept", MediaType.APPLICATION_JSON_VALUE);
		ResultActions result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().is5xxServerError());
	}

	private void testWordSimplification(String word, String lang) throws Exception, UnsupportedEncodingException,
			IOException, JsonParseException, JsonMappingException, JsonGenerationException {
		// get
		RequestBuilder request = MockMvcRequestBuilders.get("/tae/simp")
				.param("word", word)
				.param("lang", lang)
				.header("Accept", MediaType.APPLICATION_JSON_VALUE);
		ResultActions result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful());
		String string = result.andReturn().getResponse().getContentAsString();
		Assert.assertNotNull(string);
		SimpaticoOutput output = new ObjectMapper().readValue(string, SimpaticoOutput.class);
		Assert.assertNotNull(output);
		
		// post
		SimpaticoInput input = new SimpaticoInput();
		input.setLang(lang);
		input.setWord(word);
		request = MockMvcRequestBuilders.post("/tae/simp")
				.content(new ObjectMapper().writeValueAsString(input))
				.header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
				.header("Accept", MediaType.APPLICATION_JSON_VALUE);
		result = mockMvc.perform(request);
		result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful());
		string = result.andReturn().getResponse().getContentAsString();
		Assert.assertNotNull(string);
		output = new ObjectMapper().readValue(string, SimpaticoOutput.class);
		Assert.assertNotNull(output);
	}
	
	
}
