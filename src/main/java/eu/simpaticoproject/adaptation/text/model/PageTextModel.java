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
package eu.simpaticoproject.adaptation.text.model;

import java.util.List;

import org.springframework.data.annotation.Id;

/**
 * @author raman
 *
 */
public class PageTextModel {

	@Id
	private String id;
	private String pageId;
	private List<TextBlock> blocks; 

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPageId() {
		return pageId;
	}

	public void setPageId(String pageId) {
		this.pageId = pageId;
	}

	public List<TextBlock> getBlocks() {
		return blocks;
	}

	public void setBlocks(List<TextBlock> blocks) {
		this.blocks = blocks;
	}
	
	
	public static class TextBlock {
		private String elementID, originalText, syntSimplifiedVersion;
		private List<WordBlock> words;
		public String getElementID() {
			return elementID;
		}
		public void setElementID(String elementID) {
			this.elementID = elementID;
		}
		public String getOriginalText() {
			return originalText;
		}
		public void setOriginalText(String originalText) {
			this.originalText = originalText;
		}
		public String getSyntSimplifiedVersion() {
			return syntSimplifiedVersion;
		}
		public void setSyntSimplifiedVersion(String syntSimplifiedVersion) {
			this.syntSimplifiedVersion = syntSimplifiedVersion;
		}
		public List<WordBlock> getWords() {
			return words;
		}
		public void setWords(List<WordBlock> words) {
			this.words = words;
		}
	}

	public static class WordBlock {
		private String originalWord, Synonyms, definition, wikilink;
		private int start, end;
		public String getOriginalWord() {
			return originalWord;
		}
		public void setOriginalWord(String originalWord) {
			this.originalWord = originalWord;
		}
		public String getSynonyms() {
			return Synonyms;
		}
		public void setSynonyms(String synonyms) {
			Synonyms = synonyms;
		}
		public String getDefinition() {
			return definition;
		}
		public void setDefinition(String definition) {
			this.definition = definition;
		}
		public String getWikilink() {
			return wikilink;
		}
		public void setWikilink(String wikilink) {
			this.wikilink = wikilink;
		}
		public int getStart() {
			return start;
		}
		public void setStart(int start) {
			this.start = start;
		}
		public int getEnd() {
			return end;
		}
		public void setEnd(int end) {
			this.end = end;
		}
	}

}
