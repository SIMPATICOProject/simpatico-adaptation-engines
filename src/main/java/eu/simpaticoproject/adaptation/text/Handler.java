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
package eu.simpaticoproject.adaptation.text;

import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import eu.fbk.dkm.pikes.twm.MachineLinking;
import eu.fbk.utils.core.PropertiesUtils;
import eu.fbk.utils.corenlp.outputters.JSONOutputter;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import javax.annotation.Nullable;
import javax.annotation.PostConstruct;
import javax.naming.OperationNotSupportedException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * @author raman
 */
@Component
public class Handler {

    @Value("${config.file}")
    private String config;

    @Value("${tae.mode.proxy.enabled}")
    private Boolean modeProxy = false;

    @Value("${tae.mode.proxy.endpoint}")
    private String proxyEndpoint = null;

    @Autowired
    private ApplicationContext applicationContext;

    static Logger LOGGER = Logger.getLogger(Handler.class.getName());
    //    protected Properties itProps, enProps, esProps, generalProps;
    protected Properties generalProps;
    protected Map<String, Properties> props = new HashMap<>();

    protected static Set<String> supportedLanguages = new HashSet<>();
    //            = Stream.of("it", "en", "es")
//            .collect(Collectors.toCollection(HashSet::new));
    protected MachineLinking machineLinking;

    protected RestTemplate rest = new RestTemplate();

    private String DEFAULT_CONFIG = "classpath:/simpatico-default.props";

    private LoadingCache<CacheKey, String> simplificationCache = CacheBuilder.newBuilder()
    		.maximumSize(1000)
    		.expireAfterWrite(1, TimeUnit.DAYS)
    		.build(new CacheLoader<CacheKey, String>(){
				@Override
				public String load(CacheKey key) throws Exception {
					return doService(key.word, key.position, key.lang, key.text);
				}
    		});
    
    @PostConstruct
    public void init() throws IOException {
        if (modeProxy) {
            return;
        }

        Resource res = applicationContext.getResource(DEFAULT_CONFIG);
        generalProps = new Properties();
        if (res != null) {
            generalProps.load(res.getInputStream());
        }

        if (config != null && config.length() > 0 && !config.equals(DEFAULT_CONFIG)) {
            File configFile = new File(config);
            if (configFile.exists()) {
                Properties additionalProperties = new Properties();
                additionalProperties.load(new FileInputStream(configFile));
                generalProps.putAll(additionalProperties);
            }
        }

        String supportedLanguagesString = generalProps.getProperty("supportedLanguages");
        if (supportedLanguagesString != null) {
            String[] strings = supportedLanguagesString.split(",");
            for (String string : strings) {
                supportedLanguages.add(string.trim());
            }

        }

        Properties allProps = PropertiesUtils.dotConvertedProperties(generalProps, "all");
        for (String lang : supportedLanguages) {
            props.put(lang, PropertiesUtils.dotConvertedProperties(generalProps, lang));
            props.get(lang).putAll(allProps);
        }

        Properties mlProperties = new Properties();
        mlProperties.setProperty("address", generalProps.getProperty("ml_address"));
        mlProperties.setProperty("min_confidence", generalProps.getProperty("ml_min_confidence"));
        machineLinking = new MachineLinking(mlProperties);
    }

    public String service(String word, Integer position, String lang, String text) throws Exception {
    	return simplificationCache.get(new CacheKey(word, text, lang, position));
    }
    private String doService(String word, Integer position, String lang, String text) throws Exception {
    	
        if (modeProxy) {
            String res = rest.getForObject(proxyEndpoint + "?lang={lang}&text={text}&position={position}", String.class, lang, text, position);
            res = res.replace(" NaN", " null");
            return res;
        } else {
        	 String res = serviceLocal(lang, text, word, position);
             res = res.replace(" NaN", " null");
        	 return res;
        }
    }

    private String serviceLocal(String lang, String text, @Nullable String word, @Nullable Integer position) throws Exception {
        LOGGER.debug("Starting service");

        Annotation annotation = null;

        if (lang == null || !supportedLanguages.contains(lang)) {
            lang = machineLinking.lang(text);
        }

        if (!props.containsKey(lang)) {
            throw new OperationNotSupportedException("Language " + lang + " is not supported");
        }

        Properties additionalProps = new Properties();
        if (position != null) {
            additionalProps.put("lsimp.offset", position.toString());
        } else {
            additionalProps.put("lsimp.offset", "-1");
        }

        for (String tmpLang : supportedLanguages) {
            props.get(tmpLang).putAll(additionalProps);
        }

        StanfordCoreNLP pipeline = new StanfordCoreNLP(props.get(lang));
        annotation = new Annotation(text);
        pipeline.annotate(annotation);

        String json = "";
        if (annotation == null) {
            throw new OperationNotSupportedException();
        } else {
            json = JSONOutputter.jsonPrint(annotation);
        }
        return json;
    }

    private static class CacheKey {
    	private String word, text, lang;
    	private int position;
    	
		public CacheKey(String word, String text, String lang, int position) {
			super();
			this.word = word;
			this.text = text;
			this.lang = lang;
			this.position = position;
		}
		@Override
		public int hashCode() {
			final int prime = 31;
			int result = 1;
			result = prime * result + ((lang == null) ? 0 : lang.hashCode());
			result = prime * result + position;
			result = prime * result + ((text == null) ? 0 : text.hashCode());
			result = prime * result + ((word == null) ? 0 : word.hashCode());
			return result;
		}
		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			CacheKey other = (CacheKey) obj;
			if (lang == null) {
				if (other.lang != null)
					return false;
			} else if (!lang.equals(other.lang))
				return false;
			if (position != other.position)
				return false;
			if (text == null) {
				if (other.text != null)
					return false;
			} else if (!text.equals(other.text))
				return false;
			if (word == null) {
				if (other.word != null)
					return false;
			} else if (!word.equals(other.word))
				return false;
			return true;
		}
    }
}
