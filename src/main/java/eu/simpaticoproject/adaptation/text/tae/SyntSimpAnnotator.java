package eu.simpaticoproject.adaptation.text.tae;

import edu.stanford.nlp.ling.CoreAnnotation;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.Annotator;
import edu.stanford.nlp.util.CoreMap;
import eu.fbk.utils.core.PropertiesUtils;
import eu.fbk.utils.gson.Network;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/**
 * Created by alessio on 19/12/16.
 */

public class SyntSimpAnnotator implements Annotator {

    private static final Logger LOGGER = LoggerFactory.getLogger(SyntSimpAnnotator.class);
    private static final int DEFAULT_PORT = 8012;

    private static final String DEFAULT_HOST = "localhost";
    private static final String DEFAULT_LANGUAGE = "en";
    private static final String DEFAULT_CONV = "false";
    private static final String DEFAULT_COMP = "false";

    private String host;
    private Integer port;
    private String language, comp, conf;

    public SyntSimpAnnotator(String annotatorName, Properties props) {
        Properties localProperties = PropertiesUtils.dotConvertedProperties(props, annotatorName);
        this.host = localProperties.getProperty("host", DEFAULT_HOST);
        this.port = PropertiesUtils.getInteger(localProperties.getProperty("port"), DEFAULT_PORT);
        this.language = localProperties.getProperty("language", DEFAULT_LANGUAGE);
        this.comp = localProperties.getProperty("comp", DEFAULT_COMP);
        this.conf = localProperties.getProperty("conf", DEFAULT_CONV);
    }

    @Override
    public void annotate(Annotation annotation) {

        StringBuffer simplifications = new StringBuffer();

        Boolean isGloballySyntSimplified = false;

        List<CoreMap> sentences = annotation.get(CoreAnnotations.SentencesAnnotation.class);

        // This "if" clause should be optimized
        if (sentences != null) {
            for (CoreMap sentence : sentences) {
                String sentenceText = sentence.get(CoreAnnotations.TextAnnotation.class);


                Map<String, String> pars = new HashMap<>();
                pars.put("sentence", sentenceText);
                pars.put("lang", this.language);
                pars.put("comp", this.comp);
                pars.put("conf", this.conf);

                String simplifiedVersion;
                try {
                    simplifiedVersion = Network.request(host, port, pars);
                } catch (Exception e) {
                    e.printStackTrace();
                    LOGGER.error(e.getMessage());
                    continue;
                }

                LOGGER.debug(simplifiedVersion);

                if (simplifiedVersion.toLowerCase().equals("null")) {
                    sentence.set(SimpaticoAnnotations.SyntSimplifiedAnnotation.class, sentenceText);
                    sentence.set(SimpaticoAnnotations.IsSyntSimplifiedAnnotation.class, false);
                    simplifications.append(sentenceText).append("\n");
                    continue;
                }

                String noSpaceText = sentenceText.replaceAll("\\s+", "").toLowerCase();
                String noSpaceSimplifiedText = simplifiedVersion.replaceAll("\\s+", "").toLowerCase();

                Boolean isSyntSimplified = !noSpaceText.equals(noSpaceSimplifiedText);
                if (isSyntSimplified) {
                    isGloballySyntSimplified = true;
                }

                sentence.set(SimpaticoAnnotations.SyntSimplifiedAnnotation.class, simplifiedVersion);
                sentence.set(SimpaticoAnnotations.IsSyntSimplifiedAnnotation.class, isSyntSimplified);
                simplifications.append(simplifiedVersion).append("\n");
            }

            annotation.set(SimpaticoAnnotations.SyntSimplifiedAnnotation.class, simplifications.toString());
            annotation.set(SimpaticoAnnotations.IsSyntSimplifiedAnnotation.class, isGloballySyntSimplified);
        } else {
            String text = annotation.get(CoreAnnotations.TextAnnotation.class);

            Map<String, String> pars = new HashMap<>();
            pars.put("sentence", text);
            pars.put("lang", this.language);
            pars.put("comp", this.comp);
            pars.put("conf", this.conf);

            String simplifiedVersion;
            try {
                simplifiedVersion = Network.request(host, port, pars);
            } catch (Exception e) {
                e.printStackTrace();
                LOGGER.error(e.getMessage());
                return;
            }

            if (simplifiedVersion.toLowerCase().equals("null")) {
                simplifiedVersion = text;
            }

            String noSpaceText = text.replaceAll("\\s+", "").toLowerCase();
            String noSpaceSimplifiedText = simplifiedVersion.replaceAll("\\s+", "").toLowerCase();

            Boolean isSyntSimplified = !noSpaceText.equals(noSpaceSimplifiedText);

            annotation.set(SimpaticoAnnotations.SyntSimplifiedAnnotation.class, simplifiedVersion);
            annotation.set(SimpaticoAnnotations.IsSyntSimplifiedAnnotation.class, isSyntSimplified);
        }
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
        return Collections.emptySet();

    }

}
