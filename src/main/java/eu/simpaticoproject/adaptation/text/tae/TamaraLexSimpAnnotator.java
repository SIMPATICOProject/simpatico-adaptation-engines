package eu.simpaticoproject.adaptation.text.tae;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.stream.JsonReader;
import edu.stanford.nlp.ling.CoreAnnotation;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.Annotator;
import edu.stanford.nlp.util.ArraySet;
import edu.stanford.nlp.util.CoreMap;
import eu.fbk.dh.tint.readability.ReadabilityAnnotations;
import eu.fbk.utils.core.PropertiesUtils;
import eu.fbk.utils.gson.Network;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

/**
 * Created by alessio on 19/12/16.
 */

public class TamaraLexSimpAnnotator implements Annotator {

    private static final Logger LOGGER = LoggerFactory.getLogger(TamaraLexSimpAnnotator.class);
    //    private static final int DEFAULT_MIN_DIFF = 3;
//    private static final int DEFAULT_DIFF = 4;
    private static final int DEFAULT_PORT = 9005;
    private static final String DEFAULT_HOST = "localhost";
    private static final String DEFAULT_LANGUAGE = "es";

    private String host;
    private Integer port;
    private String language;
//    private Integer minDiff;
//    private Integer position;

    public TamaraLexSimpAnnotator(String annotatorName, Properties props) {
        Properties localProperties = PropertiesUtils.dotConvertedProperties(props, annotatorName);
        this.host = localProperties.getProperty("host", DEFAULT_HOST);
        this.port = PropertiesUtils.getInteger(localProperties.getProperty("port"), DEFAULT_PORT);
        this.language = localProperties.getProperty("language", DEFAULT_LANGUAGE);
//        this.minDiff = PropertiesUtils.getInteger(localProperties.getProperty("min_difficult"), DEFAULT_MIN_DIFF);
//        this.position = PropertiesUtils.getInteger(localProperties.getProperty("offset"), -1);
    }

    @Override
    public void annotate(Annotation annotation) {

        List<RawSimplification> simplificationList = new ArrayList<>();
        Gson gson = new Gson();
        Map<Integer, String> simplifications = new HashMap<>();

        List<CoreMap> sentences = annotation.get(CoreAnnotations.SentencesAnnotation.class);
        for (CoreMap sentence : sentences) {
            String text = sentence.get(CoreAnnotations.TextAnnotation.class);
            Map<String, String> pars = new HashMap<>();
            pars.put("text", text);
            pars.put("lang", this.language);

            try {
                HttpClientExample hce = new HttpClientExample();
                String response = hce.post(String.format("http://%s:%d", host, port), gson.toJson(pars));
//                String response = Network.request(host, port, pars);
//                System.out.println(response);
                JsonObject myJsonObject = gson.fromJson(response, JsonObject.class);
                for (Map.Entry<String, JsonElement> entry : myJsonObject.entrySet()) {
                    JsonObject jsonEntry = entry.getValue().getAsJsonObject();
                    StringBuffer buffer = new StringBuffer();
                    for (JsonElement jsonIndex : jsonEntry.get("synonyms").getAsJsonArray()) {
                        buffer.append(", ").append(jsonIndex.getAsString());
                    }

                    for (JsonElement jsonIndex : jsonEntry.get("indexes").getAsJsonArray()) {
                        int index = jsonIndex.getAsInt();
                        simplifications.put(sentence.get(CoreAnnotations.CharacterOffsetBeginAnnotation.class) + index, buffer.substring(2));
                    }

                }
            } catch (IOException e) {
                e.printStackTrace();
            }

            for (CoreLabel token : sentence.get(CoreAnnotations.TokensAnnotation.class)) {
                int index = token.beginPosition();
                if (simplifications.containsKey(index)) {
                    String simplifiedVersion = simplifications.get(index);
                    RawSimplification simplification = new RawSimplification(
                            index,
                            token.endPosition(),
                            simplifiedVersion
                    );
                    simplification.setOriginalValue(token.word());
                    simplificationList.add(simplification);
                    token.set(SimpaticoAnnotations.SimplifiedAnnotation.class, simplifiedVersion);
                }
            }
        }

        annotation.set(SimpaticoAnnotations.SimplificationsAnnotation.class, simplificationList);
    }

    /**
     * Returns a set of requirements for which tasks this annotator can
     * provide.  For example, the POS annotator will return "pos".
     */
    @Override
    public Set<Class<? extends CoreAnnotation>> requirementsSatisfied() {
        return Collections.emptySet();
    }

    /**
     * Returns the set of tasks which this annotator requires in order
     * to perform.  For example, the POS annotator will return
     * "tokenize", "ssplit".
     */
    @Override
    public Set<Class<? extends CoreAnnotation>> requires() {
        return Collections.unmodifiableSet(new ArraySet<>(Arrays.asList(
                CoreAnnotations.TokensAnnotation.class,
                CoreAnnotations.SentencesAnnotation.class
        )));

    }

}
