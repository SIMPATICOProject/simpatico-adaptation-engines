 
// $(document).ready(function() {
  var sentences=[];
  
  var globalTextCheckboxVal=false;
  var globalWordCheckboxVal=false;
  var loadFirstTimeText=true;
  var loadFirstTime=true;
  var simpDataURL ="https://simpatico.smartcommunitylab.it/simp-engines/tae/model";
  var pageID="simpTagP1";
  var localPrepareResult;
  getTextsAndsetSpan();
  //
  jQuery.getJSON(simpDataURL + "?pageId=" + pageID,function(jsonResponse,status) {
    if(status=="success"){
      localPrepareResult=jsonResponse['blocks'];
    }
  }).done(function() {
    console.log( "second success" );
  })
  .fail(function() {
    var sendData;
    getAPIResults().then(function(result){
      sendData={
        "blocks":result,
        "pageId":pageID
      };
      setTimeout(function(){
        $.ajax({
          url: simpDataURL,
          dataType: "json",
          contentType: "application/json;charset=utf-8",
          type: "POST",
          data: JSON.stringify(sendData),
          success: function (msg) {
            if (msg != null) {
              jQuery.getJSON(simpDataURL + "?pageId=" + pageID,function(jsonResponse) {
                      localPrepareResult=jsonResponse['blocks'];
                    });
            } 
          }
        });
      }, 1000);
    });   
  });
  console.log("total sentences:",sentences);

  
// set in local storage
// setTimeout(function(){
//     // Check browser support
//   if (typeof(Storage) !== "undefined") {
//     // Store
//     localStorage.setItem("localStorageResult", JSON.stringify(localPrepareResult));
//     // Retrieve
//     console.log("localStorageResult:",JSON.parse(localStorage.getItem("localStorageResult")));
//   } else {
//     console.log("localStorageResult:", "Sorry, your browser does not support Web Storage...");
//   }
// }, 2000);

  $('[data-toggle="tooltip"]').tooltip();
  // $('[data-toggle="tooltip"]').on('click', function () {
  //   $(this).tooltip('hide');
  // });
  // Modal show for Procedure
  $("#btnModalProcedure").click(function(){
    $('#procedureTutorialPopup').popover('destroy');
    $("#modalProcedure").modal();
  });
  // Modal show for question
  $("#btnModalQuestion").click(function(){
    $('#questionTutorialPopup').popover('destroy');
    $("#questionModal").modal();
  });
  $('#accessID').on('click', function () { 
    console.log("come in accessID::");
    $('#accessTutorialPopup').popover('destroy');   
    $('#accessID').popover({
      template: '<div class="popover popoverAccess " role="tooltip"><div class="arrow"></div><h3>SIGN IN</h3></div>',
      placement : "top"
    });
    //$('#accessTutorialPopup').tooltip('hide');
    $('#accessID').popover('show');
  });
  

  // $('#textTutorialPopup').on('hidden.bs.popover', function () {
  //   $('#textTutorialPopup').popover('destroy');
  // });

  $('#textTools').on('click', function () {
    //$("#testData").html(JSON.stringify(prepareResult)); 
    $('#textTutorialPopup').popover('destroy');
    $('#textTools').popover({
      html : true, 
      content: function() {
        $(document.getElementById("textCheckbox")).attr("checked", globalTextCheckboxVal);
        $(document.getElementById("wordCheckbox")).attr("checked", globalWordCheckboxVal); 
        return $("#popoverText").html();
      },
      // title: function() {
      //     return $("#example-popover-title").html();
      // },
      placement: 'top',
      // trigger: 'hover'
    });
    
    $('#textTools').popover('show');
    $('#textTutorialPopup').tooltip('hide');
  });
// kill popovers on click in outside of popover
$(document).on('click', function (e) {
  $('[data-toggle="popover"],[data-original-title]').each(function () {
      //the 'is' for buttons that trigger popups
      //the 'has' for icons within a button that triggers a popup
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {                
          (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false  // fix for BS 3.3.6
      }

  });
});
// });



/**
* function for make tutorial
* @ paramiter: 
* nodeName: nodeName is define which element show the tutorial
* time: time "second" mean call come form PREVIOUS button 
**/
function simpaticoTutorial(nodeName,time){
  if(nodeName =="simpaticoTutorialPopup"){
    if(time=="second"){
      $('#textTutorialPopup').popover('hide');
      $('#simpaticoTutorialPopup').popover('show');
    }else{
      $('#simpaticoTutorialPopup').popover({
        template: "<div class='popover popover-tutorial' role='tooltip'><div class='arrow'></div><h3>Simpatico</h3><p>This tool enchances your experience with the Public Administration. Some features require an account.</p><br/><div class='followTutorial'><span onclick=simpaticoTutorial('"+"textTutorialPopup"+"')>LEARN MORE</span></div></div>",
        placement : "left"
      });
      $('#simpaticoTutorialPopup').popover('show');
    }
    
  }else if(nodeName =="textTutorialPopup"){
    if(time=="second"){
      $('#procedureTutorialPopup').popover('hide');
      $('#textTutorialPopup').popover('show');
    }else{
      $('#simpaticoTutorialPopup').popover('hide');
      $('#textTutorialPopup').popover({
        template: "<div class='popover popover-text' role='tooltip'><div class='arrow arrowTutorial'></div><h3>Text simplification</h3><p>Simplifiy a text that is difficult to understand of find the definition of complex terms. Registered users enjoy of personalized suggestions.</p><br/><div class='followTutorial'><span onclick=simpaticoTutorial('"+"simpaticoTutorialPopup"+"','second')>PREVIOUS</span> <span style='display:inline-block; width: 15px;'></span>   <span onclick=simpaticoTutorial('"+"procedureTutorialPopup"+"')>NEXT</span></div></div>",
        placement : "top"
      });
      $('#textTutorialPopup').popover('show');
    }
    
  }else if(nodeName =="procedureTutorialPopup"){
    if(time=="second"){
      $('#accessTutorialPopup').popover('hide');
      $('#procedureTutorialPopup').popover('show');
    }else{
      $('#textTutorialPopup').popover('hide');
      $('#procedureTutorialPopup').popover({
        template: "<div class='popover popover-procedure' role='tooltip'><div class='arrow arrowTutorial'></div><h3>Procedure description</h3><p>Find a summary of this administrative procedure.</p><br/><div class='followTutorial'><span onclick=simpaticoTutorial('"+"textTutorialPopup"+"','second')>PREVIOUS</span> <span style='display:inline-block; width: 15px;'></span><span onclick=simpaticoTutorial('"+"accessTutorialPopup"+"')>NEXT</span></div></div>",
        placement : "top"
      });
      $('#procedureTutorialPopup').popover('show');
    }
  }else if(nodeName =="accessTutorialPopup"){
    if(time=="second"){
      $('#questionTutorialPopup').popover('hide');
      $('#accessTutorialPopup').popover('show');
    }else{
      $('#procedureTutorialPopup').popover('hide');
      $('#accessTutorialPopup').popover({
        template: "<div class='popover popover-access' role='tooltip'><div class='arrow arrowTutorial'></div><h3>Citizen Data Vault</h3><p>Store your personal data to fill in automatically forms and receive personalized suggestions.</p><br/><div class='followTutorial'><span onclick=simpaticoTutorial('"+"procedureTutorialPopup"+"','second')>PREVIOUS</span> <span style='display:inline-block; width: 15px;'></span><span onclick=simpaticoTutorial('"+"questionTutorialPopup"+"')>NEXT</span></div></div>",
        placement : "top"
      });
      $('#accessTutorialPopup').popover('show');
    }
  }else if(nodeName =="questionTutorialPopup"){
    $('#accessTutorialPopup').popover('hide');
    $('#questionTutorialPopup').popover({
      template: "<div class='popover popover-question' role='tooltip'><div class='arrow arrowTutorial'></div><h3>Questions and answers</h3><p>Find questions sent by other members of the community or send your own questions. Requires to be registered.</p><br/><div class='followTutorial'><span onclick=simpaticoTutorial('"+"accessTutorialPopup"+"','second')>PREVIOUS</span> <span style='display:inline-block; width: 15px;'></span><span onclick=simpaticoTutorial('"+"endTutorialPopup"+"')>END</span></div></div>",
      placement : "top"
    });
    $('#questionTutorialPopup').popover('show');
  }else if(nodeName =="endTutorialPopup"){
    $('#questionTutorialPopup').popover('hide');
  }
  
};
/**
* 
*
**/
function getTextsAndsetSpan(){
    
  var elements = document.body.getElementsByTagName("p");
  
  for(var i = 0; i < elements.length; i++) {
    var current = elements[i];
    var val = current.textContent.trim();
    if(current.textContent.trim().length !== 0 && current.textContent.replace(/ |\n/g,'') !== '') {
      sentences.push(val);      
      // current.innerHTML="<span class='"+i+"' id='"+i+"'>"+val+"</span>";
      var index=sentences.length-1;
      $(current).wrapInner("<span class='"+index+"' id='"+index+"'></span>");
    }
  } 
  
  /*
  var tataltexts= $("#main").find('p').text().split(/(?:\n)+/);
  //var tataltexts= $("body").text().split(/(?:\n)+/);
  //var tataltexts= $("p").text().split(/(?:\n)+/);
  console.log("total number of text in the body:",tataltexts);
  //collect all sentances in this page
  $.each(tataltexts, function (index, value){
    if(value.trim()){//remove all extra space
      // if(value.includes(".") && !value.includes("@")){//check sentances with '.' & not contain '@'
      //   var tempSen = value.split('.');// maybe one <p> have more sentances for that split with '.'
      //   var tempAppendSen="<p>";
      //   $.each(tempSen, function(index2, value2){
      //     if(value2.trim() && value2.length>16){//remove extra space & get sentances that more then 16 letter
      //       sentences.push($.trim(value2));	
      //       tempAppendSen=tempAppendSen+"<span id='rap"+sentences.length-1+"'>"+value2+".</span>";
      //       tempAppendSen=tempAppendSen+"<span>"+value2+".</span>";
      //     }
      //   });
      //   if(tempAppendSen.includes("<span>")){
      //     $("p:contains("+value+")").replaceWith(tempAppendSen+"</p>" );
      //   }
      // }
      
      var tempSen = value.split('.');
      $.each(tempSen, function(index2, value2){
        var val = $.trim(value2);
        if($('p:contains("'+val+'")') && val.length>16){
          sentences.push(val);
          var i=sentences.length-1;
          //for p
          if($('p:contains("'+val+'")')){
            $('p:contains("'+val+'")').wrapInner("<span id='"+i+"'></span>");
          }
          if($('ul>li:contains("'+val+'")')){
            $('ul>li:contains("'+val+'")').wrapInner("<span id='"+i+"'></span>"); 
          }
          
            // $('p:contains("'+$.trim(value)+'")').html(function(_, html) {
            //     var valEx='/(+'+$.trim(value)+'$)/g';
            //    return html.replace(valEx, '<span class="smallcaps">$1</span>');
            // });
            // $('p:contains("'+$.trim(value)+'")').html(function(_, html) {
            //     var regex = new RegExp("/" + escapeRegExp($.trim(value)) + "$/g",'gi');
            //     var str = "<span class='smallcaps'>"+$.trim(value)+"</span>";
            //     return  html.replace(regex, str);
            // });
        }
      });
      //if($( "p" ).contents().find( val )){
      
      
      // if($('li:contains("'+$.trim(value)+'")').contents().not($('li').children())){
      //     //$($('li').contents().not($('li').children())).$('li:contains("'+$.trim(value)+'")').wrapInner("<span id='"+i+"'></span>");
      //     console.log("li is=> ",$.trim(value));
      //     console.log("li(not'a')=> ",$('li:contains("'+$.trim(value)+'")').contents().not($('li').children()).text());
      // }
      // if($('nav>ul>li>a:contains("'+$.trim(value)+'")')){
      //     $('nav>ul>li>a:contains("'+$.trim(value)+'")').wrapInner("<span id='"+i+"'></span>");
      // }
      
      //for ul>li
      // if($('ul>li:contains("'+$.trim(value)+'")')){
      //     $('ul>li:contains("'+$.trim(value)+'")').wrapInner("<span id='"+i+"'></span>");
      // }

      //for h3
      // if($('h3:contains("'+$.trim(value)+'")')){
      //     $('h3:contains("'+$.trim(value)+'")').wrapInner("<span id='"+i+"'></span>");
      // }
    }
  });
  */
}

/**
* call api for all sentances and get data
*
**/
var getAPIResults=function(){
  var deferred = new $.Deferred();
  var prepareResult=[];
  var textURL="https://simpatico.smartcommunitylab.it/simp-engines/tae/simp";
  $.each(sentences, function (index, value){
    jQuery.getJSON(textURL + "?text=" + value,
      function(jsonResponse) {
        var words=[];
        var syntSimplifiedVersion;
        if(String(jsonResponse.text) != String(jsonResponse.syntSimplifiedVersion)){
          syntSimplifiedVersion=jsonResponse.syntSimplifiedVersion;
        }else{
          syntSimplifiedVersion=null;
        }
        $.each(jsonResponse.simplifications, function(index2, value2){
          words.push({
            "originalWord":value2.originalValue,
            "start":value2.start,
            "end":value2.end,
            "synonyms":value2.simplification,
            "definition":getDescription(value2.originalValue,jsonResponse.readability.forms),
            "wikilink":getWikiLink(value2.originalValue,jsonResponse.linkings)
          });
        });
        prepareResult.push({
          "elementID":index,
          "originalText":jsonResponse.text,
          "syntSimplifiedVersion":syntSimplifiedVersion,
          "words":words
        });
      }).done(function() {
        if(index== sentences.length-1) { 
          deferred.resolve(prepareResult); 
          }
      });
      
  });
  //return prepareResult;
  
  return deferred.promise();
}
/**
* 
*
**/
// Array.prototype.getWikiLink = function( word ){
//   for ( var i in this )
//   {
//     if(this[i].originalText == word){
//       return this[i].page;
//     }
//   }
//   return -1;
// }
function getWikiLink(word, arr){
  for ( var i in arr )
  {
    if(arr[i].originalText == word){
      return arr[i].page;
    }
  }
  return null;
}
/**
* 
*
**/
function getDescription(word, arr){
  var result = null;
  $.each(arr, function( key, value ) {
    if(value.description.forms[0].search(new RegExp(word, 'i')) !== -1){
      result=value.description.description;
      return false;
    }
  });
  return result;
}
/**
* 
*
**/
function clickTextCheckbox(){
  var textElementVal=document.getElementById("textCheckbox");
  if(globalTextCheckboxVal){
    globalTextCheckboxVal=false;
    $(textElementVal).attr("checked", globalTextCheckboxVal);
    onTextSimplification(false);
    console.log("TextCheckbox is unchecked.");
  }else{
    globalTextCheckboxVal=true;
    $(textElementVal).attr("checked", globalTextCheckboxVal);
    onTextSimplification(true);
    console.log("TextCheckbox is checked.");
  }
  loadFirstTimeText=false;
}

/**
* 
*
**/
function clickWordCheckbox(){
  var wordElementVal=document.getElementById("wordCheckbox");
  if(globalWordCheckboxVal){
    globalWordCheckboxVal=false;
    $(wordElementVal).attr("checked", globalWordCheckboxVal);
    onWordSimplification(false);
    console.log("WordCheckbox is unchecked.");
  }else{
    globalWordCheckboxVal=true;
    $(wordElementVal).attr("checked", globalWordCheckboxVal);
    onWordSimplification(true);
    console.log("WordCheckbox is checked.");
  }
  loadFirstTime=false;
}

/**
* 
*
**/
function onTextSimplification(color){
  
  $.each(localPrepareResult, function (index, value){
    if(color == true){
      if(value['syntSimplifiedVersion']){
        makeColorOfText(value['elementID'],color);
        //if(loadFirstTimeText){
          $('.'+value['elementID']).append("<div id='popupText"+value['elementID']+"' class='popupText'><h4><b>Simplified text</b></h4><p>"+value['syntSimplifiedVersion']+"</p></div>");
        //}
        $('#popupText'+value['elementID']).popup({type: 'tooltip'});
        $('.'+value['elementID']).on({
          mouseenter: function(event) {
            if(globalTextCheckboxVal){
              $('#popupText'+value['elementID']).popup({
                tooltipanchor: event.target,
                autoopen: true,
                type: 'tooltip',
                opacity:0.5,
                background: true,
                horizontal: 'leftedge',
                vertical:'bottom'
              });
            }
          },
          mouseleave: function(event) {
            if($('#popupText'+value['elementID']).is(':hover')){
              $('#popupText'+value['elementID']).on({
                mouseenter: function(event) {},
                mouseleave: function() {$('#popupText'+value['elementID']).popup('hide');}
              });
            }else{$('#popupText'+value['elementID']).popup('hide');}
          }
        });
      }
    }else if(color == false){
      makeColorOfText(value['elementID'],color);
    }
    
  });
  
 
}

/**
* 
*
**/
function onWordSimplification(color){
  
  $.each(localPrepareResult, function (index, value){
    if(color == true){
      if(value['words']){
        makeColorOfWord(value['elementID'],color,value['words']);
        setPopupForWord(value['elementID'],color,value['words']);        
      }
    }else if(color == false){
      makeColorOfWord(value['elementID'],color,value['words']);
    }
    
  });
}
/**
* 
*
**/ 
function makeColorOfText(id,color){

  if(color == true){
    $('.'+id).css('background-color', '#FFFF99');
    // console.log("make yellow color");
  }
  else if(color == false){
    $('.'+id).css('background-color', 'transparent');
    $('#popupText'+id).popup('destroy');
    // console.log("make white color");
  }  
}
/**
* 
*
**/ 
function makeColorOfWord(id,color,arrWord){
  var replaceStrArray=[],previousStart,lastEnd=0;
  var str = document.getElementById(id);
  var myString= str.innerHTML;
  $.each(arrWord, function (index, value){
    if(color== true){

      if(loadFirstTime){
        // word
        // var word = value['originalWord'];
        // // create a regex
        // var re = new RegExp(word, "ig");
        // // replace word with color
        // var reText = "<span class='wordColor' id='"+id+"-"+index+"'>"+word+"</span>";
        // // replace the inner html
        // var str=document.getElementById(id);
        // var res = str.innerHTML.replace(re, reText);
        // str.innerHTML = res;
        ///
        // if(index==0){
        //   if(value['start']==0){
        //     replaceStrArray.push( "<span class='wordColor' id='"+id+"-"+index+"'>"+value['originalWord']+" </span>");
        //   }else{
        //     replaceStrArray.push( myString.substring(0,value['start'])+"<span class='wordColor' id='"+id+"-"+index+"'>"+value['originalWord']+" </span>"+" ");
        //   } 
        // }else{
          replaceStrArray.push( myString.substring(lastEnd,value['start'])+"<span class='wordColor' id='"+id+"-"+index+"'>"+value['originalWord']+"</span>");
        //}
        lastEnd=value['end'];
      }else if(loadFirstTime == false){
        $( "#"+id+"-"+index ).addClass( "wordColor" );
      }
      
    }else if(color == false){
      $( "#"+id+"-"+index ).removeClass( "wordColor" );
    }
  });
  if(loadFirstTime){
    replaceStrArray.push( myString.substring(lastEnd,myString.length));
    str.innerHTML=replaceStrArray.join("");
    console.log("replaceStrArray:",replaceStrArray.join(""));
  }    
}

function setPopupForWord(id,color,arrWord){
  $.each(arrWord, function (index, value){
    if(color== true){
      var definition='',synonyms='',wikilink='';
      if(value['definition']){
        definition="<h4><b>Definition</b></h4><p>"+value['definition']+"</p>";
      }if(value['synonyms']){
        synonyms="<h4><b>Synonyms</b></h4><p>"+value['synonyms']+"</p>";
      }if(value['wikilink']){
        wikilink="<h4><b>Wikipedia</b></h4><a href='"+value['wikilink']+"' target='_blank'>"+value['wikilink']+"</a>";
      }
      if(loadFirstTime){
        $( "#"+id+"-"+index ).append("<div id='popupWord"+id+"-"+index+"' class='popupWord'>"+definition+synonyms+wikilink+"</div>");
      }
      $('#popupWord'+id+"-"+index).popup({type: 'tooltip'});
      $("#"+id+"-"+index ).on({
        mouseenter: function(event) {
          if(globalWordCheckboxVal){
            setTimeout(function(){
              $('#popupText'+id).popup('hide');
            },100);
            
            $('#popupWord'+id+"-"+index).popup({
              tooltipanchor: event.target,
              autoopen: true,
              type: 'tooltip',
              opacity:0.5,
              background: true,
              horizontal: 'leftedge',
              vertical:'bottom'
            });
            
          }
        },
        mouseleave: function() {
          if(globalWordCheckboxVal){
            //$('#popupText'+id).popup({type: 'tooltip'});
            //$('#popupWord'+id+"-"+index).popup('hide');
            if($('#popupWord'+id+"-"+index).is(':hover')){
              $('#popupWord'+id+"-"+index).on({
                mouseenter: function(event) {},
                mouseleave: function() {$('#popupWord'+id+"-"+index).popup('hide');}
              });
            }else{$('#popupWord'+id+"-"+index).popup('hide');}
          }
        }
      });
    }
  });
}