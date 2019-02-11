package eu.simpaticoproject.adaptation.text.tae;

import edu.stanford.nlp.ling.CoreAnnotation;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.Annotator;
import edu.stanford.nlp.util.ArraySet;
import edu.stanford.nlp.util.CoreMap;
import eu.fbk.utils.core.PropertiesUtils;
import eu.fbk.utils.gson.Network;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.*;

/**
 * Created by alessio on 19/12/16.
 */

public class SyntFakeAnnotator implements Annotator {

    private static final Logger LOGGER = LoggerFactory.getLogger(SyntFakeAnnotator.class);
    private FakeSynSimModel model;

    public SyntFakeAnnotator(String annotatorName, Properties props) {
        Properties localProperties = PropertiesUtils.dotConvertedProperties(props, annotatorName);
        model = FakeSynSimModel.getInstance(props, localProperties);
    }

    @Override
    public void annotate(Annotation annotation) {
        String text = annotation.get(CoreAnnotations.TextAnnotation.class);
        for (String key : model.getSentences().keySet()) {
//            System.out.println("Key: " + key);
//            System.out.println("Index: " + text.indexOf(key));
            text = text.replace(key, model.getSentences().get(key));
        }

//        System.out.println("Final text: " + text);
        annotation.set(SimpaticoAnnotations.SyntSimplifiedAnnotation.class, text);
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
