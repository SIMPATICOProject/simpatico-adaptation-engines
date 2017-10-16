// Simpatico main Interactive Front-End (simpatico-ife.js)
//-----------------------------------------------------------------------------
// This JavaScript is the main entry point to  the Interactive Front-End 
// component of the Simpatico Project (http://www.simpatico-project.eu/)
//
//-----------------------------------------------------------------------------

// It inits all the enabled features of IFE 
function initFeatures() {

  // Init the Auth component (see simpatico-auth.js)
  // - endpoint: the main URL of the used AAC instance
  // - clientID: the IFE Client ID registered
  // - authority: the used authentication mechanism or null if many allowed
  // - redirect: url redirect (default is /IFE/login.html)
  authManager.getInstance().init({
    endpoint: 'https://tn.smartcommunitylab.it/aac', 
    clientID: '8ab03990-d5dd-47ea-8fc6-c92a3b0c04a4',
    authority: null,
    redirect: 'https://simpatico.smartcommunitylab.it/simp-engines/wae/webdemo/logincb.html',
    greeting: 'Sign In to SIMPATICO'
  });
  
  // Init the LOG component (see log-core.js)
  // - endpoint: the main URL of the used LOG instance
  // - testMode: true if the data should not be sent to the LOG component
  logCORE.getInstance().init({
	  testMode: true,
	  endpoint: "https://simpatico.smartcommunitylab.it/simpatico-logs/api"
  });

  // Init the Citizenpedia component (see ctz-ui.js)
  // - endpoint: the main URL of the used Citizenpedia instance
  // - cpdDiagramEndpoint: endpoint of the CPD process summary service (should end with eService)
  // - primaryColor: Color used to highlight the enhanced components
  // - secondaryColor: Color used to paint the question boxes backgrounds
  // - elementsToEnhanceClassName: The CSS class used to define the enhanced elements
  // - questionsBoxClassName: The CSS class of the box which shows questions
  // - questionsBoxTitle: Title of the box hwich shows questions
  // - addQuestionLabel: Text exposed to show the action to create a question
  // - diagramNotificationImage: Image to show when a diagram is found
  // - diagramNotificationClassName: The CSS class of the img shown when a diagram is found
  // - diagramNotificationText: The text to notify that a diagram
  // - questionSelectionFilters: filters for text selection to ask question for
  citizenpediaUI.getInstance().init({
    endpoint: 'https://simpatico.smartcommunitylab.it/qae',
    cpdDiagramEndpoint: 'https://dev.smartcommunitylab.it/cpd/api/diagram/eService',
    primaryColor: "#24BCDA",
    secondaryColor:"#D3F2F8",
    elementsToEnhanceClassName: "simpatico-query-and-answer",
    questionsBoxClassName: "simp-ctz-ui-qb",
    questionsBoxTitle: "Related questions",
    addQuestionLabel: "+ Add new question",
    diagramNotificationImage: "./img/diagram.png",
    diagramNotificationClassName: "simp-ctz-ui-diagram",
    diagramNotificationText: "There is a visualization of a diagram in Citizenpedia",
    questionSelectionFilters: ['h1', '.Rigaintestazione', '.Rigaintestazioneridotta']
  });
  
  // Init the CDV component (see cdv-ui.js)
  // - endpoint: the main URL of the used cdv instance
  // - serviceID: the id corresponding to the e-service
  // - serviceName: name corresponding to the e-service
  // - serviceURL: the URL of the e-service page
  // - dataFields: eservice field ids mapped with cdv
  // - cdvColor: Color used to highlight the eservice fields enhanced with cdv 
  // - dialogTitle: Title of the dialog box of CDV component
  // - tabPFieldsTitle: tab label of personal data
  cdvUI.getInstance().init({
    endpoint: 'https://cdv.comune.trento.it/CDV',
    serviceID: simpaticoEservice,
	serviceName: simpaticoEserviceName,
    serviceURL: simpaticoEserviceURL,
    dataFields: simpaticoMapping,
    informedConsentLink: "https://cdv.comune.trento.it/CDV/IFE/informed_consent.html",
    cdvColor: '#008000',
    dialogTitle: 'Personal data',
    entryMessage: 'Personal data management',
    statusMessage: 'Now you can use your personal data to fill in the fields highlighted in green. Use the values saved previsously or add new values.',
    dialogSaveTitle: 'Data saved',
    dialogSaveMessage: 'Your personal data has been correctly saved.',
    statusMessageNoAccount: "No personal account has been associated. Create one?",
    statusMessageNoActive: "Personal data management is not active. Activate it now?",
    confirmSaveDataMessage: "Do you want to update your personal data?",
    buttonSaveData:"Save your data",
    buttonManageData:"Manage your data",
    buttonActivate:"Activate",
    buttonCreate: "Create",
    consentButton: "Accept",
    tabSettingsTitle: 'Settings',
	cdvDashUrl:'https://cdv.comune.trento.it/CDV/cdv-dashboard/index.html'
  });

  // Init the Text Adaptation Engine component (see tae-ui.js)
  // - endpoint: the main URL of the used TAE instance
  // - language: the language of the text to adapt by the TAE instance
  // - primaryColor: Color used to highlight the enhanced components
  // - secondaryColor: Color used to paint the simplification boxes backgrounds
  // - elementsToEnhanceClassName: The CSS class used to define the enhanced elements
  // - simplifyBoxClassName: The CSS class of the box which shows the simplifications
  // - simplifyBoxTitle: Title of the box which shows the simplifications
  // - wordPropertiesClassName: The CSS class of the word properties box
  // - synonimLabel: Label for synonyms
  // - definitionLabel: label for definitions
  // - emptyText: label for empty text
  taeUI.getInstance().init({
    endpoint: 'https://simpatico.smartcommunitylab.it/simp-engines/tae',
    language: 'it',
    primaryColor: "#DE453E",
    secondaryColor:"#F0ABA8",
    elementsToEnhanceClassName: "simpatico-text-paragraph",
    simplifyBoxClassName: "simp-tae-ui-sb",
    simplifyBoxTitle: "Simplified text",
    wordPropertiesClassName: "simp-tae-ui-word",
    synonymLabel:'Synonyms',
  	definitionLabel: 'Definitions',
  	emptyText: 'No simplifications found for this text'

  });

  // Init the Text Adaptation Engine component for free text selection (see tae-ui-popup.js)
  // - lang: the language of the text to adapt by the TAE instance
  // - endpoint: the main URL of the used TAE instance
  // - dialogTitle: popup title
  // - tabDefinitionsTitle: title of 'definitions' tab
  // - tabSimplificationTitle: title of 'simplifications' tab
  // - tabWikipediaTitle: title of 'wikipedia' tab
  // - entryMessage: label of 'enter text' hint
  // - notextMessage: label of 'no text selected' hint
  taeUIPopup.getInstance().init({
		lang: 'it',
		endpoint: 'https://simpatico.smartcommunitylab.it/simp-engines/tae',
		dialogTitle: 'Text enrichment',
		tabDefinitionsTitle: 'Definitions',
		tabSyntSimpTitle: 'Simplified text',
		tabSimplificationTitle: 'Lexical simplification',
		tabWikipediaTitle: 'Wikipedia',
		entryMessage: 'Select a help option',
		notextMessage: 'No text selected'
	});

  
  // Init the Workflow Adaptation Engine component (see wae-ui.js)
  // - lang: language used
  // - endpoint: the main URL of the used WAE instance
  // - prevButtonLabel: Label for 'previous step' button
  // - nextButtonLabel: Label for 'next step' button
  // - topBarHeight: height of the bar to control the scroll
  // - errorLabel: map with blockId - error message in case of block precondition fails
  waeUI.getInstance().init({
		lang: 'it',
	  	endpoint: 'https://simpatico.smartcommunitylab.it/simp-engines/wae',
		prevButtonLabel: 'Precedente',
		nextButtonLabel: 'Successivo',
		lastButtonLabel: 'Fine',
		descriptionLabel: 'Step-by-step compil',
		topBarHeight: 60,
		errorLabel: ERROR_LABELS
  });
  
  // Init the Session Feedback component (see sf-ui.js)
  // - buttonToShowSfId: the id of the button/link that opens the dialog of the feedback form
  // - apiEndpoint: the main URL of the logs API server (<site>/simpatico/api)
  // NOTE: Requires jquery-ui to work properly
  sfUI.getInstance().init({
    formSelector: 'form',
    listener: function() {
    	$('form').submit();
    },
    apiEndpoint: 'https://simpatico.smartcommunitylab.it/simpatico-logs/api',
  });

  // Init the Data Analysis component (see da-ui.js)
  // It is useful for UI elements like different tabs in the same view or an accordion.
  // - elementsToTrackTimeClassName: The CSS class used to define the different tabs
  // - apiEndpoint: the main URL of the logs API server (<site>/simpatico/api)
  daUI.getInstance().init({
    elementsToTrackTimeClassName: '',
    apiEndpoint: 'https://simpatico.smartcommunitylab.it/simpatico-logs/api'
  });

  // Declare here the buttons that will be available in the Simpatico Bar
  // The first one is the login button. This is mandatory but it also can be personalised
  // Options available:
  buttons = [{
                  id: "simp-bar-sw-login",
                  // Ad-hoc images to define the enabled/disabled images
                  imageSrcEnabled: "./img/login.png",
                  imageSrcDisabled: "./img/login.png",
                  alt: "Sign in",
                  // Ad-hoc css classes to define the enabled/disabled styles
                  styleClassEnabled: "simp-none", 
                  styleClassDisabled: "simp-none",
                  
                  isEnabled: function() { return authManager.getInstance().isEnabled(); },
                  enable: function() { authManager.getInstance().enable(); },
                  disable: function() { authManager.getInstance().disable(); },
				  text: "Sign In"
                },

                {
                  id: "simp-bar-sw-citizenpedia",
                  // Ad-hoc images to define the enabled/disabled images
                  imageSrcEnabled: "./img/citizenpedia.png",
                  imageSrcDisabled: "./img/citizenpedia.png",
                  alt: "Questions and answers",
                  // Ad-hoc css classes to define the enabled/disabled styles
                  styleClassEnabled: "simp-bar-btn-active",
                  styleClassDisabled: "simp-bar-btn-inactive",
                  isEnabled: function() { return citizenpediaUI.getInstance().isEnabled(); },
                  enable: function() { citizenpediaUI.getInstance().enable(); },
                  disable: function() { citizenpediaUI.getInstance().disable(); },
				  text: "Questions and Answers"
                },
{
                  id: "simp-bar-sw-tae",
                  // Ad-hoc images to define the enabled/disabled images
                  imageSrcEnabled: "./img/simplify.png",
                  imageSrcDisabled: "./img/simplify.png",
                  alt: "Simplify text",
                  // Ad-hoc css classes to define the enabled/disabled styles
                  styleClassEnabled: "simp-bar-btn-active-tae",
                  styleClassDisabled: "simp-bar-btn-inactive-tae",
                  isEnabled: function() { return taeUI.getInstance().isEnabled(); },
                  enable: function() { taeUI.getInstance().enable(); },
                  disable: function() { taeUI.getInstance().disable(); },
				  text: "Simplify"
                },                
                {
                    id: "simp-bar-sw-tae-popup",
                    // Ad-hoc images to define the enabled/disabled images
                    imageSrcEnabled: "./img/enrich.png",
                    imageSrcDisabled: "./img/enrich.png",
                    alt: "Text simplification",
                    // Ad-hoc css classes to define the enabled/disabled styles
                    styleClassEnabled: "simp-bar-btn-active",
                    styleClassDisabled: "simp-bar-btn-inactive",
                    isEnabled: function() { return false; },
                    enable: function() { 
                    	console.log(window.getSelection().toString().trim());
                    	taeUIPopup.getInstance().showDialog(); 
                    },
                    disable: function() { 
                    	taeUIPopup.getInstance().hideDialog(); 
                    },
                    exclusive: true,
  				  text: "Simplify (Popup)"
                  },
                {
                  id: "simp-bar-sw-cdv",
                  // Ad-hoc images to define the enabled/disabled images
                  imageSrcEnabled: "./img/cdv.png",
                  imageSrcDisabled: "./img/cdv.png",
                  alt: "Personal data",
                  // Ad-hoc css classes to define the enabled/disabled styles
                  styleClassEnabled: "simp-bar-btn-active",
                  styleClassDisabled: "simp-bar-btn-inactive",
                  isEnabled: function() { return cdvUI.getInstance().isEnabled(); },
                  enable: function() { cdvUI.getInstance().enable(); },
                  disable: function() { cdvUI.getInstance().disable(); },
                  exclusive: true,
				  text: "Personal data"
                },
                { // workflow adaptation. Switch to the modality, where the form adaptation starts
                  id: 'workflow',
                  imageSrcEnabled: "./img/forms.png",
                  imageSrcDisabled: "./img/forms.png",
                  alt: "Step-by-step execution",
                  // Ad-hoc css classes to define the enabled/disabled styles
                  styleClassEnabled: "simp-bar-btn-active",
                  styleClassDisabled: "simp-bar-btn-inactive",
                  isEnabled: function() { return waeUI.getInstance().isEnabled(); },
                  enable: function() { var idProfile = null; waeUI.getInstance().enable(idProfile); },
                  disable: function() { waeUI.getInstance().disable(); },
                  text: "Step by step compilation"
                }
            ];
}//initFeatures()

// It creates the HTML code corresponding to the button passed as parameter
// - button: The button object stored in buttons
function createButtonHTML(button) {
  return '<li class="'+ button.styleClassDisabled +'" id="' + button.id + '" ' +'onclick="toggleAction(\'' + button.id + '\');"'+
                          '">'+
                          //'<a href="#">' +
                          '<img ' + 
                            'alt="' + button.alt + '" ' + 
                            'title="' + button.alt + '" ' +
                            'id="' + button.id + '-img" ' +
                            'src="' + button.imageSrcDisabled + '" ' +
                            'width="50" height="50" />' +
                            (button.label ? ('<div class="toolbar-button-label">'+ button.label+'</div>') :'')+
                            //'</a>'+
	                    '<figcaption id="'+button.id +'-fig" style="text-align: center;">'+
                            button.text + 
                            '</figcaption>' + 
                          '</figure>' + 
                          '</li>';
}//createButtonHTMLbutton()

// It creates the Node corresponding to the button passed as parameter
// - button: The button object stored in buttons
function createButtonNode(button) {
  var template = document.createElement("div");
  template.innerHTML = createButtonHTML(button);
  return template.childNodes[0];
}//createButtonNode(button)

// It creates the configured buttons and adds them to the toolbar
// Called one time
function enablePrivateFeatures() {
  // Update the login button status
  var loginButton = document.getElementById(buttons[0].id);
  loginButton.childNodes[0].src = buttons[0].imageSrcEnabled;
  
  // For each button (without the login one) create and add the node
  var buttonsContainer = document.getElementById("simp-bar-container-left");
  while (buttonsContainer.firstChild) {
    cuttonsContainer.removeChild(buttonsContainer.firstChild);
  }
  for (var i = 1, len = buttons.length; i < len; i++) {
	if (document.getElementById(buttons[i].id) == null) {
		buttonsContainer.appendChild(createButtonNode(buttons[i]), loginButton);
	}
  }
  document.getElementById("simpatico-bar-copy").style.display = "none";
  document.getElementById("simp-bar-sw-login-fig").innerHTML = "Log Out";
}//enablePrivateFeatures(id)

// It inits all the configured buttons
// Called one time
function disablePrivateFeatures() {
  // Update the login button status
  var loginButton = document.getElementById(buttons[0].id);
  loginButton.childNodes[0].src = buttons[0].imageSrcDisabled;

  // For each button (without the login one) remove the node 
  for (var i = 1, len = buttons.length; i < len; i++) {
    currentButton = document.getElementById(buttons[i].id);
    if (null != currentButton) {
      buttons[i].disable();
      currentButton.parentNode.removeChild(currentButton);
    }
  }
  document.getElementById("simpatico-bar-copy").style.display = "inline-block";
  document.getElementById("simp-bar-sw-login-fig").innerHTML = "Sign In";
}//disablePrivateFeatures()

// It adds the Simpatico Toolbar inside the component of which id is passed 
// as parameter
// - containerID: the Id of the element which is going to contain the toolbar 
function addSimpaticoBar(containerID) {
  var simpaticoCopy = "SIMPATICO te ayudará con tus gestiones. Entra aquí";
  var simpaticoBarContainer = document.getElementById(containerID);
  if (simpaticoBarContainer == null) {
    var body = document.getElementsByTagName('body')[0];
    simpaticoBarContainer = document.createElement('div');
    body.insertBefore(simpaticoBarContainer, body.firstChild);
  }

  // Create the main div of the toolbar
  var simpaticoBarHtml = '<div id="simp-bar">' +
                            '<div style="margin: 1%;">' +
                              '<a href="#">' +
                                '<img src="./img/logo.png" ' +
                                'height="50px" ' +
                                'alt="Simpatico ">' +
                              '</a>' +
                            '</div>'+
			    '<div id="simpatico-bar-copy">'+simpaticoCopy+'</div>';

  // Add the left side of the toolbar
  //simpaticoBarHtml += '<ul id="simp-bar-container-left"></ul>';
  simpaticoBarHtml += '<ul id="simp-bar-container-left" style="position: absolute;"></ul>';

  // Add the right side of the toolbar
  simpaticoBarHtml += '<ul id="simp-bar-container-right">' + 
                         '<li><span id="simp-usr-data"></span></li>' +
                          createButtonNode(buttons[0]).outerHTML +
                      '</ul>';

  // Close the main div
  simpaticoBarHtml += '</div>';
  
  // Add the generated bar to the container
  simpaticoBarContainer.innerHTML = simpaticoBarHtml;
}//addSimpaticoBar()

// switch on/off the control buttons.
// -id: of the button which calls this function
function toggleAction(id) {
  var clickedButton;
  if (buttons[0].id == id) {
    // Login button
    clickedButton = buttons[0];
  } else {
    // Disable all the buttons
    for (var i = 1, len = buttons.length; i < len; i++) {
      if(buttons[i].id == id) {
        clickedButton = buttons[i];
      }
    } 
    if (!!clickedButton && clickedButton.exclusive) {
    	buttons.forEach(function(b){
    		if (b.exclusive && b.id != clickedButton.id) b.disable();
    	});
    }
  }
  // Enable/Disable the selected button
  if (clickedButton.isEnabled()) {
	  clickedButton.disable();
  } else {
	  clickedButton.enable();
  }
  updateButtonStyle(clickedButton);
} //toggleAction(id)


// Adds the corresponding styleClass depending on the current feature status
// - button: to be updated
function updateButtonStyle(button) {
  if (button.isEnabled()) {
    document.getElementById(button.id).classList.remove(button.styleClassDisabled);
    document.getElementById(button.id).classList.add(button.styleClassEnabled);
  } else {
    document.getElementById(button.id).classList.remove(button.styleClassEnabled);
    document.getElementById(button.id).classList.add(button.styleClassDisabled);
  }
}

// Once the document is loaded the Simpatico features are initialised and the 
// toolbar added
document.addEventListener('DOMContentLoaded', function () {
  initFeatures();
  addSimpaticoBar("simpatico_top");
  authManager.getInstance().updateUserData();
});
window.addEventListener('beforeunload', function (e) {
  logCORE.getInstance().logTimeEvent({});
});
