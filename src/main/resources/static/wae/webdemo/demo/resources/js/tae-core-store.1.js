$( function() {
	$(document).tooltip();
});
/**
 * TAE UI OPERATIONS
 */
var taeInlinePopup = (function () {
  var _instance; // Singleton Instance of the UI component

  function Singleton() {
      _instance = this;

      _instance.sentences = [];
      _instance.simpDataURL = "https://simpatico.smartcommunitylab.it/simp-engines/tae/model";
      
      _instance.globalTextCheckboxVal = false;
      _instance.globalWordCheckboxVal = false;
      _instance.localPrepareResult;
      _instance.loadFirstTimeText = true;
      _instance.loadFirstTime=true;

      _instance.init = function(config) {
        getTextsAndsetSpan(_instance);
        //
        jQuery.getJSON(_instance.simpDataURL + "?pageId=" + pageID,function(jsonResponse,status) {
          if(status=="success"){
            _instance.localPrepareResult=jsonResponse['blocks'];
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
                url: _instance.simpDataURL,
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                type: "POST",
                data: JSON.stringify(sendData),
                success: function (msg) {
                  if (msg != null) {
                    jQuery.getJSON(_instance.simpDataURL + "?pageId=" + pageID,function(jsonResponse) {
                      _instance.localPrepareResult=jsonResponse['blocks'];
                    });
                  } 
                }
              });
            }, 1000);
          });   
        });
    
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
        $('#simpaticoTutorialPopup').click(function() {
          simpaticoTutorial('simpaticoTutorialPopup');
        });
  
        $('#textTools').on('click', function () {
          $('#textTutorialPopup').popover('destroy');
          $('#textTools').popover({
            html : true, 
            content: function() {
              $(document.getElementById("textCheckbox")).attr("checked", _instance.globalTextCheckboxVal);
              $(document.getElementById("wordCheckbox")).attr("checked", _instance.globalWordCheckboxVal); 
              return $("#popoverText").html();
            },
            placement: 'top',
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
      }
      
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
      function getTextsAndsetSpan(instance){
          
        var elements = document.getElementsByTagName("p");
        
        for(var i = 0; i < elements.length; i++) {
          var current = elements[i];
          var val = current.textContent.trim();
          if(current.textContent.trim().length !== 0 && current.textContent.replace(/ |\n/g,'') !== '') {
            instance.sentences.push(val);      
            // current.innerHTML="<span class='"+i+"' id='"+i+"'>"+val+"</span>";
            var index = instance.sentences.length-1;
            $(current).wrapInner("<span class='"+index+"' id='"+index+"'></span>");
          }
        } 
      }

      /**
      * call api for all sentances and get data
      *
      **/
      function getAPIResults(instance) {
        var deferred = new $.Deferred();
        var prepareResult=[];
        var textURL="https://simpatico.smartcommunitylab.it/simp-engines/tae/simp";
        $.each(instance.sentences, function (index, value){
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
              if(index== instance.sentences.length-1) { 
                deferred.resolve(prepareResult); 
                }
            });
            
        });  
        return deferred.promise();
      }


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
      _instance.clickTextCheckbox = function(){
        var textElementVal=document.getElementById("textCheckbox");
        if(_instance.globalTextCheckboxVal){
          _instance.globalTextCheckboxVal=false;
          $(textElementVal).attr("checked", _instance.globalTextCheckboxVal);
          onTextSimplification(_instance, false);
          console.log("TextCheckbox is unchecked.");
        }else{
          _instance.globalTextCheckboxVal=true;
          $(textElementVal).attr("checked", _instance.globalTextCheckboxVal);
          onTextSimplification(_instance, true);
          console.log("TextCheckbox is checked.");
        }
        _instance.loadFirstTimeText=false;
      }

      /**
      * 
      *
      **/
      _instance.clickWordCheckbox = function(){
        var wordElementVal=document.getElementById("wordCheckbox");
        if(_instance.globalWordCheckboxVal){
          _instance.globalWordCheckboxVal=false;
          $(wordElementVal).attr("checked", _instance.globalWordCheckboxVal);
          onWordSimplification(_instance, false);
          console.log("WordCheckbox is unchecked.");
        }else{
          _instance.globalWordCheckboxVal=true;
          $(wordElementVal).attr("checked", _instance.globalWordCheckboxVal);
          onWordSimplification(_instance, true);
          console.log("WordCheckbox is checked.");
        }
        _instance.loadFirstTime=false;
      }

      /**
      * 
      *
      **/
      function onTextSimplification(instance, color){
        
        $.each(instance.localPrepareResult, function (index, value){
          if(color == true){
            if(value['syntSimplifiedVersion']){
              makeColorOfText(value['elementID'],color);
              if(instance.loadFirstTimeText){
                $('.'+value['elementID']).append("<div id='popupText"+value['elementID']+"' class='popupText'><h4>Simplified text</h4><p>"+value['syntSimplifiedVersion']+"</p></div>");
              }
              
              $('#popupText'+value['elementID']).popup({type: 'tooltip'});
              $('.'+value['elementID']).on({
                mouseenter: function(event) {
                  if(instance.globalTextCheckboxVal){
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
                mouseleave: function() {
                  if(instance.globalTextCheckboxVal){
                    $('#popupText'+value['elementID']).popup('hide');
                  }
                }
              });
              // $('#'+value['elementID']).mouseover(function(){
              //   console.log("come in onmouseover");
              // });
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
      function onWordSimplification(instance, color){
        
        $.each(instance.localPrepareResult, function (index, value){
          if(color == true){
            if(value['words']){
              makeColorOfWord(instance, value['elementID'],color,value['words']);
              setPopupForWord(instance, value['elementID'],color,value['words']);        
            }
          }else if(color == false){
            makeColorOfWord(instance, value['elementID'],color,value['words']);
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
          console.log("make yellow color");
        }
        else if(color == false){
          $('.'+id).css('background-color', 'transparent');
          console.log("make white color");
        }  
      }
      /**
      * 
      *
      **/ 
      function makeColorOfWord(instance, id,color,arrWord){
        var replaceStrArray=[],previousStart,lastEnd;
        var str = document.getElementById(id);
        var myString= str.innerHTML;
        $.each(arrWord, function (index, value){
          if(color== true){

            if(instance.loadFirstTime){
              if(index==0){
                if(value['start']==0){
                  replaceStrArray.push( "<span class='wordColor' id='"+id+"-"+index+"'>"+value['originalWord']+" </span>");
                }else{
                  replaceStrArray.push( myString.substring(0,value['start'])+"<span class='wordColor' id='"+id+"-"+index+"'>"+value['originalWord']+" </span>");
                } 
              }else{
                replaceStrArray.push( myString.substring(lastEnd,value['start'])+"<span class='wordColor' id='"+id+"-"+index+"'>"+value['originalWord']+" </span>");
              }
              lastEnd=value['end'];
            }else if(instance.loadFirstTime == false){
              $( "#"+id+"-"+index ).addClass( "wordColor" );
            }
            
          }else if(color == false){
            $( "#"+id+"-"+index ).removeClass( "wordColor" );
          }
        });
        if(instance.loadFirstTime){
          replaceStrArray.push( myString.substring(lastEnd,myString.length));
          str.innerHTML=replaceStrArray.join("");
          console.log("replaceStrArray:",replaceStrArray.join(""));
        }    
      }

      function setPopupForWord(instance, id,color,arrWord){
        $.each(arrWord, function (index, value){
          if(color== true){
            var definition='',synonyms='',wikilink='';
            if(value['definition']){
              definition="<h4>Definition</h4><p>"+value['definition']+"</p>";
            }if(value['synonyms']){
              synonyms="<h4>Synonyms</h4><p>"+value['synonyms']+"</p>";
            }if(value['wikilink']){
              wikilink="<h4>Wikipedia</h4><p>"+value['wikilink']+"</p>";
            }
            if(instance.loadFirstTime){
              $( "#"+id+"-"+index ).append("<div id='popupWord"+id+"-"+index+"' class='popupWord'>"+definition+synonyms+wikilink+"</div>");
            }
            $('#popupWord'+id+"-"+index).popup({type: 'tooltip'});
            $("#"+id+"-"+index ).on({
              mouseenter: function(event) {
                if(instance.globalWordCheckboxVal){
                  $('#popupText'+id).popup('hide');
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
                if(instance.globalWordCheckboxVal){
                  // $('#popupText'+id).popup({type: 'tooltip'});
                  $('#popupWord'+id+"-"+index).popup('hide');
                }
              }
            });
          }
        });
      }
    };
    return {
    	getInstance: function() {
    		if(!_instance) _instance = new Singleton();
    		return _instance;
    	}
    };
})();

