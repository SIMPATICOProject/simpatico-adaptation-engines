package eu.simpaticoproject.adaptation.text.tae;

import eu.fbk.dh.tint.readability.it.ItalianReadabilityModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.*;

/**
 * Created by alessio on 26/09/16.
 */
public class FakeSynSimModel {

    private static final Logger LOGGER = LoggerFactory.getLogger(ItalianReadabilityModel.class);
    private static FakeSynSimModel ourInstance = null;
    private HashMap<String, String> sentences = new HashMap<>();

    public static FakeSynSimModel getInstance(Properties globalProperties, Properties localProperties) {
        if (ourInstance == null) {
            HashMap<String, String> sentences = new HashMap<>();

            try {
                String listFileName = localProperties.getProperty("list");

                InputStream stream = null;
                if (listFileName != null) {
                    try {
                        stream = new FileInputStream(listFileName);
                    } catch (FileNotFoundException e) {
                        // continue
                    }
                }
                if (stream == null) {
                    stream = FakeSynSimModel.class.getResourceAsStream("/sentence-comune.txt");
                }

                // Read file
                Scanner s = new Scanner(stream).useDelimiter("\\n{2,}");
                while (s.hasNext()) {
                    String simplification = s.next();
                    simplification = simplification.trim();
                    String[] parts = simplification.split("\\n");
                    if (parts.length != 2) {
                        continue;
                    }
                    sentences.put(parts[0], parts[1]);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }

            ourInstance = new FakeSynSimModel(sentences);
        }
        return ourInstance;
    }

    private FakeSynSimModel(HashMap<String, String> sentences) {
        this.sentences = sentences;
    }

    public HashMap<String, String> getSentences() {
        return sentences;
    }

    public static void main(String[] args) {
        String fileName = "/Users/alessio/Desktop/sentence-comune.txt";

        Properties properties = new Properties();
        properties.setProperty("list", fileName);
        FakeSynSimModel.getInstance(properties, properties);
    }
}
