package eu.simpaticoproject.adaptation.text.tae;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.internal.LinkedTreeMap;
import eu.fbk.dh.tint.readability.GlossarioEntry;
import eu.fbk.dh.tint.readability.it.ItalianReadability;
import eu.fbk.dh.tint.readability.it.ItalianReadabilityModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.*;

/**
 * Created by alessio on 26/09/16.
 */
public class FakeSimModel {

    private static final Logger LOGGER = LoggerFactory.getLogger(ItalianReadabilityModel.class);
    private static FakeSimModel ourInstance = null;
    private HashMap<String, GlossarioEntry> glossario = new HashMap<>();
//    File inputFile = new File("/Users/alessio/Documents/out-sinonimicontrari-lemmatized-noinvert.txt");

    public static FakeSimModel getInstance(Properties globalProperties, Properties localProperties, SkipModel skipModel) {
        if (ourInstance == null) {
            HashMap<String, GlossarioEntry> glossario = new HashMap<>();

            try {
                HashMap<String, LinkedTreeMap> glossarioTmp;

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
                    stream = FakeSimModel.class.getResourceAsStream("/out-sinonimicontrari-lemmatized-noinvert.txt");
                }

                Gson gson = new GsonBuilder().create();
                glossarioTmp = gson.fromJson(new InputStreamReader(stream), HashMap.class);

                List<String> glossarioKeys = new ArrayList<>(glossarioTmp.keySet());
                Collections.sort(glossarioKeys, new ItalianReadability.StringLenComparator());

                for (String form : glossarioKeys) {
                    LinkedTreeMap linkedTreeMap = glossarioTmp.get(form);

                    ArrayList<String> arrayList = (ArrayList<String>) linkedTreeMap.get("forms");
                    String[] strings = new String[arrayList.size()];
                    strings = arrayList.toArray(strings);
                    String description = (String) linkedTreeMap.get("description");
                    GlossarioEntry entry = new GlossarioEntry(strings, description);

                    if (skipModel.getSkipList().contains(form)) {
                        continue;
                    }
                    glossario.put(form, entry);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }

            ourInstance = new FakeSimModel(glossario);
        }
        return ourInstance;
    }

    private FakeSimModel(
            HashMap<String, GlossarioEntry> glossario) {
        this.glossario = glossario;
    }

    public HashMap<String, GlossarioEntry> getGlossario() {
        return glossario;
    }
}
