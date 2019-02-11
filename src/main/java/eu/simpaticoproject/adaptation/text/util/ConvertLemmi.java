package eu.simpaticoproject.adaptation.text.util;

import com.google.common.base.Charsets;
import com.google.common.io.Files;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.internal.LinkedTreeMap;
import eu.fbk.dh.tint.readability.GlossarioEntry;
import eu.fbk.dh.tint.readability.it.ItalianReadability;
import eu.fbk.twm.utils.FrequencyHashSet;
import eu.fbk.utils.core.CommandLine;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.*;

public class ConvertLemmi {
    public static void main(String[] args) {
        try {
            final CommandLine cmd = CommandLine
                    .parser()
                    .withName("./convert-lemmi")
                    .withHeader("Convert Lemmi_inverso file from formario")
                    .withOption("i", "input", "Input file", "FILE", CommandLine.Type.FILE_EXISTING, true, false, true)
//                    .withOption("g", "glossario", "Glossario file", "FILE", CommandLine.Type.FILE_EXISTING, true, false, true)
                    .withOption("o", "output", "Output file", "FILE", CommandLine.Type.FILE, true, false, true)
                    .withLogger(LoggerFactory.getLogger("eu.fbk")).parse(args);

            File inputFile = cmd.getOptionValue("input", File.class);
//            File glossarioFile = cmd.getOptionValue("glossario", File.class);
            File outputFile = cmd.getOptionValue("output", File.class);

            FrequencyHashSet<String> frequencies = new FrequencyHashSet<>();
            BufferedReader reader = new BufferedReader(new FileReader(inputFile));
            String line;
            boolean firstLine = true;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                if (line.length() == 0) {
                    continue;
                }

                String frequency = line.substring(0, 10).trim();
                String lemma = line.substring(55, 155).trim();
                lemma = lemma.toLowerCase();

                Set<String> lemmas = new HashSet<>();

                lemmas.add(lemma);

                String lemma2 = lemma;
                String lemma3 = lemma;

                lemma3 = lemma3.replace("a'", "à");
                lemma3 = lemma3.replace("e'", "è");
                lemma3 = lemma3.replace("i'", "ì");
                lemma3 = lemma3.replace("o'", "ò");
                lemma3 = lemma3.replace("u'", "ù");

                lemma2 = lemma2.replace("a'", "à");
                lemma2 = lemma2.replace("e'", "é");
                lemma2 = lemma2.replace("i'", "ì");
                lemma2 = lemma2.replace("o'", "ò");
                lemma2 = lemma2.replace("u'", "ù");

                lemmas.add(lemma2);
                lemmas.add(lemma3);

                for (String l : lemmas) {
                    frequencies.add(l, Integer.parseInt(frequency));
                }
            }
            reader.close();

//            HashMap<String, GlossarioEntry> glossario = new HashMap<>();
//            HashMap<String, LinkedTreeMap> glossarioTmp;
//            Gson gson = new GsonBuilder().create();
//            glossarioTmp = gson.fromJson(Files.toString(glossarioFile, Charsets.UTF_8), HashMap.class);
//
//            List<String> glossarioKeys = new ArrayList<>(glossarioTmp.keySet());
//            Collections.sort(glossarioKeys, new ItalianReadability.StringLenComparator());
//
//            for (String form : glossarioKeys) {
//                LinkedTreeMap linkedTreeMap = glossarioTmp.get(form);
//
//                ArrayList<String> arrayList = (ArrayList<String>) linkedTreeMap.get("forms");
//                String[] strings = new String[arrayList.size()];
//                strings = arrayList.toArray(strings);
//                String description = (String) linkedTreeMap.get("description");
//                GlossarioEntry entry = new GlossarioEntry(strings, description);
//
//                if (skipModel.getSkipList().contains(form)) {
//                    continue;
//                }
//                glossario.put(form, entry);
//            }


            BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile));
            for (String word : frequencies.keySet()) {
                writer.append(word).append("\t").append(frequencies.get(word).toString()).append("\n");
            }
            writer.close();

        } catch (Exception e) {
            CommandLine.fail(e);
        }
    }
}
