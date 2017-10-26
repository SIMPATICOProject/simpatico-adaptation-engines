package eu.simpaticoproject.adaptation.text.tae;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.*;

/**
 * Created by alessio on 19/12/16.
 */

public class SyntSimpAnnotator implements Annotator {

    private static final Logger LOGGER = LoggerFactory.getLogger(SyntSimpAnnotator.class);
    private static final int DEFAULT_PORT = 8012;
    private static final String DEFAULT_HOST = "localhost";
    private static final String DEFAULT_LANGUAGE = "en";

    private String host;
    private Integer port;
    private String language;

    public SyntSimpAnnotator(String annotatorName, Properties props) {
        Properties localProperties = PropertiesUtils.dotConvertedProperties(props, annotatorName);
        this.host = localProperties.getProperty("host", DEFAULT_HOST);
        this.port = PropertiesUtils.getInteger(localProperties.getProperty("port"), DEFAULT_PORT);
        this.language = localProperties.getProperty("language", DEFAULT_LANGUAGE);
    }

    @Override
    public void annotate(Annotation annotation) {

        StringBuffer simplifications = new StringBuffer();

        List<CoreMap> sentences = annotation.get(CoreAnnotations.SentencesAnnotation.class);
        for (CoreMap sentence : sentences) {
            String sentenceText = sentence.get(CoreAnnotations.TextAnnotation.class);


            Map<String, String> pars = new HashMap<>();
            pars.put("sentence", sentenceText);
            pars.put("lang", this.language);

            String simplifiedVersion;
            try {
                simplifiedVersion = Network.request(host, port, pars);
            } catch (IOException e) {
                e.printStackTrace();
                LOGGER.error(e.getMessage());
                continue;
            }

            LOGGER.info(simplifiedVersion);

            if (simplifiedVersion.toLowerCase().equals("null")) {
                simplifications.append(sentenceText).append("\n");
                continue;
            }

            sentence.set(SimpaticoAnnotations.SyntSimplifiedAnnotation.class, simplifiedVersion);
            simplifications.append(simplifiedVersion).append("\n");
        }

        annotation.set(SimpaticoAnnotations.SyntSimplifiedAnnotation.class, simplifications.toString());
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
