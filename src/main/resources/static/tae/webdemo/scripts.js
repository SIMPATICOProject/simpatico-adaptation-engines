google.charts.load('current', {'packages': ['corechart', 'gauge', 'bar']});

var skipLT = ["ST_02_001", "ER_01_001", "ER_01_002", "ER_01_003", "ER_01_004"];

var gaugeOptions = {
    redFrom: 0,
    redTo: 40,
    yellowFrom: 40,
    yellowTo: 80,
    greenFrom: 80,
    greenTo: 100,
    minorTicks: 5,
    width: 130,
    height: 130
};
var gaugeLevelsOptions = {
    redFrom: 0,
    redTo: 40,
    yellowFrom: 40,
    yellowTo: 80,
    greenFrom: 80,
    greenTo: 100,
    minorTicks: 5,
    width: 360,
    height: 120
};
var posChartOptions = {
    width: 500,
    height: 300,
    orientation: "vertical",
    legend: {
        position: 'none'
    }
};

var language;

function changeView() {
    var lang = $("#simp-select").val();
    $(".simp-ff").css("display", "none");
    $("#simp-" + lang).css("display", "block");
    return false;
}

function escapeAttrNodeValue(value) {
    return value.replace(/(&)|(")|(\u00A0)/g, function (match, amp, quote) {
        if (amp) return "&amp;";
        if (quote) return "&quot;";
        return "&nbsp;";
    });
}

function addLI(ul, title, value) {
    var li = $("<li></li>");
    li.addClass("list-group-item");
    var span = $("<span></span>");
    span.addClass("badge");
    span.append(value);
    li.append(span);
    li.append(" " + title);
    // var b = $("<b></b>");
    // b.append(title);
    // li.append(b);
    // li.append(" " + value);
    ul.append(li);
}

function newInput(name, checked) {
    var input = $("<input>");
    input.attr("type", "checkbox");
    input.addClass("js-switch");
    if (checked) {
        input.attr("checked", "checked");
    }
    input.attr("name", name);
    input.attr("id", "switch-" + name);
    return input;
}

function updateSyntSimpText(i, lang) {
    var c = $("#switch-" + i + "-main").prop("checked");
    var orig = $("#origsentence" + i);
    var synt = $("#syntsentence" + i);
    var spinner = $("#spinner-" + i);

    if (c) {
        if (lang === "it") {
            var comp = $("#switch-" + i + "-comp").prop("checked");

            orig.hide();
            synt.show();
        }
        else {
            var comp = $("#switch-" + i + "-comp").prop("checked");
            var conf = $("#switch-" + i + "-conf").prop("checked");

            var data = {
                text: orig.html(),
                comp: comp ? "true" : "false",
                conf: conf ? "true" : "false",
                lang: language
            };

            spinner.show();

            $.ajax("../syntsimp", {
                dataType: "json",
                method: "POST",
                data: data,
                success: function (data) {
                    synt.removeClass();
                    spinner.hide();
                    if (data.isSyntSimplified) {
                        synt.addClass("synt-simp-sent");
                    }
                    synt.html(data.syntSimplifiedVersion);

                    orig.hide();
                    synt.show();
                }
            });
        }
    }
    else {
        orig.show();
        synt.hide();
    }
}

$(function () {
    $('#select_examples').change(function () {
        $('#text').val($('#select_examples').val());
    });

    $('button.has-spinner').click(function () {

        linguisticAnnotations = $('#linguistic-annotations-checkbox').prop("checked");
        dashboard = $('#dashboard-checkbox').prop("checked");

        if (!linguisticAnnotations && !dashboard) {
            alert("You must select at least one checkbox");
            return false;
        }

        var text = $('#text').val();
        // if (text.length < 10) {
        //     alert("You must enter at least 10 chars of text");
        //     return false;
        // }

        $(this).toggleClass('active');
        $(this).toggleClass('disabled');
        $('#text').attr('disabled', 'disabled');

        $.ajax("../simpform", {
            dataType: "json",
            method: "POST",
            data: {
                text: text
            },
            success: function (data) {

                $("#part1").slideUp(500);

                language = data.readability.language;
                $(".show-" + language).show();
                // Show language

                if (dashboard) {

                    var tooLongSentences = data.readability.tooLongSentences;
                    var textLen = text.length;

                    var allText = data.text;

                    var simpText = allText;
                    var defText = allText;
                    var linksText = allText;

                    var ffText = {};
                    var okSimp = {};

                    if (data.simplifications != undefined) {

                        data.simplifications.forEach(function (element) {
                            okSimp[element.start] = element;
                        });
                    }

                    if (data.ffs != undefined) {
                        Object.keys(data.ffs).forEach(function (lang) {
                            ffText[lang] = allText;
                            // console.log(lang);

                            var okFf = {};
                            data.ffs[lang].forEach(function (element) {
                                okFf[element.start] = element;
                            });

                            Object.keys(okFf).sort(function (a, b) {
                                return b - a;
                            }).forEach(function (start) {
                                var element = okFf[start];
                                var end = element.end;

                                var word = ffText[lang].substring(start, end);

                                var before;
                                var after = '</a>';

                                if (okSimp[start] == undefined) {
                                    before = '<a data-content="[No simplification]"' +
                                        ' tabindex="0" role="button" class="my-popover label label-light">';
                                }
                                else {
                                    var t = okSimp[start].simplification;
                                    before = '<a data-content="' + t.replace('"', "'") +
                                        // '" title="' + item.shortMessage.replace('"', "'") +
                                        '" tabindex="0" role="button" class="my-popover label label-danger">';
                                }

                                var newText = ffText[lang].substring(0, start);
                                newText += before;
                                newText += word;
                                newText += after;
                                newText += ffText[lang].substring(end);

                                ffText[lang] = newText;
                            });

                        });
                    }

                    // console.log(ffText);

                    // Definitions
                    if (data.readability != undefined) {
                        Object.keys(data.readability.forms).sort().reverse().forEach(function (start) {
                            var end = data.readability.forms[start].end;
                            var before = '<a data-content="' + data.readability.forms[start].description.description.replace('"', "'") +
                                // '" title="' + item.shortMessage.replace('"', "'") +
                                '" tabindex="0" role="button" class="my-popover label label-danger">';
                            var after = '</a>';

                            var newText = defText.substring(0, start);
                            newText += before;
                            newText += defText.substring(start, end);
                            newText += after;
                            newText += defText.substring(end);

                            defText = newText;
                        });
                    }

                    // Lexical simplifications
                    if (data.simplifications != undefined) {

                        Object.keys(okSimp).sort(function (a, b) {
                            return b - a;
                        }).forEach(function (start) {
                            var element = okSimp[start];
                            var end = element.end;
                            var before = '<a data-content="' + element.simplification.replace('"', "'") +
                                // '" title="' + item.shortMessage.replace('"', "'") +
                                '" tabindex="0" role="button" class="my-popover label label-danger">';
                            var after = '</a>';

                            var newText = simpText.substring(0, start);
                            newText += before;
                            newText += simpText.substring(start, end);
                            newText += after;
                            newText += simpText.substring(end);

                            simpText = newText;
                        });
                    }

                    // Links
                    if (data.linkings != undefined) {
                        var okLink = {};

                        data.linkings.forEach(function (element) {
                            okLink[element.offset] = element;
                        });

                        Object.keys(okLink).sort(function (a, b) {
                            return b - a;
                        }).forEach(function (start) {
                            start = parseInt(start);
                            var element = okLink[start];
                            var end = start + element["length"];
                            var page = element.page;
                            page = page.replace(/\.dbpedia\./gi, ".wikipedia.");
                            page = page.replace(/\/dbpedia\./gi, "/en.wikipedia.");
                            page = page.replace(/\/resource\//gi, "/wiki/");
                            page = encodeURI(page);

                            var before = '<a target="_blank" tabindex="0" role="button" ' +
                                'href="' + page + '" ' +
                                'data-content="' + page + '" ' +
                                'class="my-popover label label-danger">';
                            var after = '</a>';

                            var newText = linksText.substring(0, start);
                            newText += before;
                            newText += linksText.substring(start, end);
                            newText += after;
                            newText += linksText.substring(end);

                            linksText = newText;
                        });
                    }

                    if (language == "it") {
                        var simpDiv = '<div id="mother-language">Mother language: <select id="simp-select" onchange="changeView();">';
                        simpDiv += '<option value="none">[Not specified]</option>';
                        Object.keys(ffText).forEach(function (lang) {
                            simpDiv += '<option value="' + lang + '">' + lang + '</option>';
                        });
                        simpDiv += '</select></div>';

                        var textDiv = '<div class="simp-ff" id="simp-none">' + simpText + '</div>';
                        simpText = simpDiv + textDiv;

                        Object.keys(ffText).forEach(function (lang) {
                            simpText += '<div class="simp-ff" id="simp-' + lang + '">' + ffText[lang] + '</div>';
                        });

                    }

                    $("#text-original-simplifications").html(simpText);
                    $("#text-original-definitions").html(defText);
                    $("#text-original-links").html(linksText);

                    $.each(data.sentences, function (i, item) {
                        var p = $("<p></p>");

                        var text = item.text;
                        var beginSentence = item.characterOffsetBegin;
                        var endSentence = item.characterOffsetEnd;

                        var offsets = new Array();
                        for (var i = 0; i < text.length; i++) {
                            offsets[i] = i;
                        }

                        if (data.languagetool != undefined) {
                            data.languagetool.forEach(function (item) {
                                var originalOffset = item.offset;

                                var ruleID = item.rule.id;
                                if ($.inArray(ruleID, skipLT) > -1) {
                                    return;
                                }

                                var originalLength = item.length;
                                if (originalOffset < beginSentence || originalOffset >= endSentence) {
                                    return;
                                }

                                originalOffset -= beginSentence;
                                var offset = offsets[originalOffset];
                                var offEnd = offsets[originalOffset + originalLength];
                                var formID = "form_" + beginSentence + "_" + originalOffset;

                                var before = '<a data-content="' + item.message.replace('"', "'") +
                                    '" title="' + item.shortMessage.replace('"', "'") +
                                    '" tabindex="0" role="button" class="my-popover label label-danger" id="' +
                                    formID + '">';
                                var after = '</a>';
                                var newText = text.substring(0, offset);
                                newText += before;
                                newText += text.substring(offset, offEnd);
                                newText += after;
                                newText += text.substring(offEnd);

                                for (var i = originalOffset; i < text.length; i++) {
                                    offsets[i] += before.length;
                                }
                                for (var i = originalOffset + originalLength; i < text.length; i++) {
                                    offsets[i] += after.length;
                                }

                                text = newText;
                            });
                        }

                        p.append(text);
                        p.attr("id", "sentence" + i);
                        p.addClass("sentence");
                        if ($.inArray(item.index, tooLongSentences) > -1) {
                            p.addClass("too-long")
                        }
                        $("#text-original-content").append(p);
                    });

                    // Syntactic simplifications
                    $.each(data.sentences, function (i, item) {
                        var div = $("<div></div>");
                        var p = $("<p></p>");
                        var hiddenp = $("<p></p>");
                        var inputp = $("<p></p>");
                        var spinner = $("<span></span>");
                        spinner.addClass("synt-spinner");
                        spinner.attr("id", "spinner-" + i);
                        spinner.append('<i class="icon-spin icon-refresh"></i>');

                        // <span class="spinner"><i class="icon-spin icon-refresh"></i></span>

                        var input = newInput(i + "-main", true);
                        var input2 = newInput(i + "-comp", false);
                        var input3 = newInput(i + "-conf", false);

                        input.change(function () {
                            updateSyntSimpText(i, language);
                        });
                        input2.change(function () {
                            updateSyntSimpText(i, language);
                        });
                        input3.change(function () {
                            updateSyntSimpText(i, language);
                        });

                        var text = item.text;
                        hiddenp.append(text);
                        hiddenp.attr("id", "origsentence" + i);
                        hiddenp.hide();
                        if (item.isSyntSimplified) {
                            p.addClass("synt-simp-sent");
                            text = item.syntSimplifiedVersion;
                        }

                        // console.log(text)
                        // console.log(item.syntSimplifiedVersion);
                        // console.log(item.isSyntSimplified);
                        //
                        p.append(text);
                        p.attr("id", "syntsentence" + i);
                        div.addClass("sentence");
                        div.append(p);

                        inputp.append("Active: ");
                        inputp.append(input);
                        inputp.append(" Complexity checker: ");
                        inputp.append(input2);
                        if (language !== "it") {
                            inputp.append(" Confidence model: ");
                            inputp.append(input3);
                        }
                        inputp.append(" ");
                        inputp.append(spinner);

                        div.append(hiddenp);

                        // Really bad!
                        // if (language != "it") {
                        div.append(inputp);
                        // }

                        $("#text-original-ssimplifications").append(div);
                    });

                    // if (data.syntSimplifiedVersion != undefined) {
                    //     $("#text-original-ssimplifications").html(data.syntSimplifiedVersion.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                    // }
                    // else {
                    //     $("#text-original-ssimplifications").html($("#text-original-content").html());
                    // }

                    $("#part2").tooltip({
                        selector: '.too-long',
                        title: "Sentence too long"
                    });
                    $("#part2").popover({
                        selector: ".my-popover",
                        trigger: "focus"
                    });

                    // Gauges

                    var mainValue = data.readability.measures.main;
                    var mainName = data.readability.labels.main;
                    // if (language == "it") {
                    //     mainValue = data.readability.measures.gulpease;
                    //     mainName = "Gulpease";
                    // }
                    // if (language == "en") {
                    //     mainValue = data.readability.measures.flesch;
                    //     mainName = "Flesch";
                    // }
                    // if (language == "es") {
                    //     mainValue = data.readability.measures['flesch-szigriszt'];
                    //     mainName = "Flesch-Szigriszt";
                    // }
                    var level1 = (isNaN(data.readability.measures.level1) ? 0 : data.readability.measures.level1);
                    var level2 = (isNaN(data.readability.measures.level2) ? 0 : data.readability.measures.level2);
                    var level3 = (isNaN(data.readability.measures.level3) ? 0 : data.readability.measures.level3);

                    var gulpeaseChart = new google.visualization.Gauge(document.getElementById('gauge-gulpease'));
                    gulpeaseChart.draw(google.visualization.arrayToDataTable([
                        ['Label', 'Value'],
                        [mainName, mainValue]
                    ]), gaugeOptions);

                    var levelsChart = new google.visualization.Gauge(document.getElementById('gauge-levels'));
                    levelsChart.draw(google.visualization.arrayToDataTable([
                        ['Label', 'Value'],
                        ['Level1', level1],
                        ['Level2', level2],
                        ['Level3', level3]
                    ]), gaugeLevelsOptions);

                    $.each(data.readability.minYellowValues, function (key, value) {
                        var name = key;
                        var divName = key + "-gauge";
                        $("#difficulty-values-panel .panel-body .row").append("<div class='col-md-3' id='" + divName + "'>");

                        var myValue = data.readability[name];

                        var myChart = new google.visualization.Gauge(document.getElementById(divName));
                        var min = data.readability.minValues[name];
                        var max = data.readability.maxValues[name];
                        var tick = (max - min) / 20.0;

                        var minor = data.readability.minYellowValues[name];
                        var maior = data.readability.maxYellowValues[name];

                        // var ratio = 100.0 / max;
                        //
                        // min *= ratio;
                        // max *= ratio;
                        // minor *= ratio;
                        // maior *= ratio;
                        // tick *= ratio;
                        // myValue *= ratio;

                        var greenFrom = min;
                        var greenTo = minor;
                        var yellowFrom = minor;
                        var yellowTo = maior;
                        var redFrom = maior;
                        var redTo = max;
                        if (maior < minor) {
                            redFrom = min;
                            redTo = maior;
                            yellowFrom = maior;
                            yellowTo = minor;
                            greenFrom = minor;
                            greenTo = max;
                        }

                        myGaugeOptions = {
                            redFrom: redFrom,
                            redTo: redTo,
                            yellowFrom: yellowFrom,
                            yellowTo: yellowTo,
                            greenFrom: greenFrom,
                            greenTo: greenTo,
                            minorTicks: tick,
                            min: min,
                            max: max,
                            width: 120,
                            height: 120
                        };

                        // console.log(key);
                        // console.log(myGaugeOptions);
                        // console.log(name);
                        // console.log(myValue);
                        // console.log(myGaugeOptions);

                        myChart.draw(google.visualization.arrayToDataTable([
                            ['Label', 'Value'],
                            [name, myValue]
                        ]), myGaugeOptions);
                    });

                    // Statistics

                    var ul = $('<ul></ul>');
                    ul.addClass("list-group");
                    addLI(ul, "Language:", data.readability.language);
                    addLI(ul, "Sentences:", data.readability.sentenceCount);
                    addLI(ul, "Tokens:", data.readability.tokenCount);
                    addLI(ul, "Words:", data.readability.wordCount);
                    addLI(ul, "Content words:", data.readability.contentWordSize);
                    $("#statistics").append(ul);

                    // Pos chart

                    var posData = new google.visualization.DataTable();
                    posData.addColumn("string", "POS tag");
                    posData.addColumn("number", "Count");
                    $.each(data.readability.genericPosDescription, function (key, value) {
                        var num = data.readability.genericPosStats.support[key];
                        posData.addRow([value, num]);
                    });
                    var posChart = new google.visualization.ColumnChart(document.getElementById('pos-stats'));
                    posChart.draw(posData, posChartOptions);

                    if (textLen < 1000) {
                        var posDiv = $("#pos-distribution");
                        posDiv.appendTo($("#l-col"));
                    }

                    $("#part2").show();
                }

                // Stanford stuff

                if (linguisticAnnotations) {

                    if (typeof data == undefined || data.sentences == undefined) {
                        alert("Failed to reach server!");
                    } else {
                        // Empty divs
                        $('#annotations').empty();

                        // Re-render divs
                        function createAnnotationDiv(id, annotator, selector, label) {
                            // (make sure we requested that element)
                            if (annotators().indexOf(annotator) < 0) {
                                return;
                            }
                            // (make sure the data contains that element)
                            ok = false
                            if (typeof data[selector] != 'undefined') {
                                ok = true;
                            } else if (typeof data.sentences != 'undefined' && data.sentences.length > 0) {
                                if (typeof data.sentences[0][selector] != 'undefined') {
                                    ok = true;
                                } else if (typeof data.sentences[0].tokens != 'undefined' && data.sentences[0].tokens.length > 0) {
                                    ok = (typeof data.sentences[0].tokens[0][selector] != 'undefined');
                                }
                            }

                            // (render the element)
                            if (ok) {
                                $('#annotations').append('<h4 class="red">' + label + ':</h4> <div id="' + id + '"></div>');
                            }
                        }

                        // (create the divs)
                        //                  div id      annotator     field_in_data                          label
                        createAnnotationDiv('pos', 'pos', 'pos', 'Part-of-Speech');
                        // createAnnotationDiv('lemma',    'lemma',      'lemma',                               'Lemmas'                  );
                        // createAnnotationDiv('ner', 'ner', 'ner', 'Named Entity Recognition');
                        createAnnotationDiv('deps', 'depparse', 'basic-dependencies', 'Basic Dependencies');
                        // createAnnotationDiv('deps2',    'depparse',   'enhanced-plus-plus-dependencies',     'Enhanced++ Dependencies' );
                        // createAnnotationDiv('openie',   'openie',     'openie',                              'Open IE'                 );
                        // createAnnotationDiv('coref',    'coref',      'corefs',                              'Coreference'             );
                        // createAnnotationDiv('entities', 'entitylink', 'entitylink',                          'Wikidict Entities'       );
                        // createAnnotationDiv('kbp',      'kbp',        'kbp',                                 'KBP Relations'           );
                        // createAnnotationDiv('sentiment','sentiment',  'sentiment',                           'Sentiment'               );

                        // Render
                        render(data);
                        $("#part3").show();
                    }
                }

                // Load switchery
                var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
                elems.forEach(function (html) {
                    var switchery = new Switchery(html, {size: "small"});
                });

                $("#ttrValue-gauge").tooltip({
                    title: "Type-token ratio: a percentage of new types for every n tokens"
                });
                $("#subordinateRatio-gauge").tooltip({
                    title: "Ratio between subordinate and coordinate clauses"
                });
                $("#wordsAvg-gauge").tooltip({
                    title: "Average number of tokens for each clause"
                });
                $("#propositionsAvg-gauge").tooltip({
                    title: "Average number of clauses for each sentence"
                });
                $("#density-gauge").tooltip({
                    title: "Percentage of content words in the text"
                });
                $("#deepAvg-gauge").tooltip({
                    title: "Average depth of the dependency parse tree"
                });
            }
        });

        return false;
    })
    ;
})
;
