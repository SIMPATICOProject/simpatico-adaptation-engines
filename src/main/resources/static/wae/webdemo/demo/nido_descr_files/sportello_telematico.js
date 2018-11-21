var something_blinkin = false;

function openSection(id_sezione) {

  //id_sezione = id_sezione.toUpperCase();

  $("fieldset.collapsible").each(function (i) {
    $(this).addClass("collapsed");
  }
  );
  $("div.fieldset-wrapper").each(function (i) {
    $(this).css("display", "none");
  }
  );


  if (id_sezione.slice(-10) != "bollettino") {
    if (id_sezione.slice(-8) == "allegati") {
      $("#" + id_sezione.substr(0, id_sezione.length - 9)).removeClass("collapsed");
      $("#" + id_sezione.substr(0, id_sezione.length - 9)).children("div.fieldset-wrapper").css("display", "block");
    }
    if (id_sezione.slice(-7) == "reports") {
      $("#" + id_sezione.substr(0, id_sezione.length - 8)).removeClass("collapsed");
      $("#" + id_sezione.substr(0, id_sezione.length - 8)).children("div.fieldset-wrapper").css("display", "block");
    }
    $("#" + id_sezione).removeClass("collapsed");
    $("#" + id_sezione).children("div.fieldset-wrapper").css("display", "block");
  } else {
    $("#" + id_sezione.substr(0, id_sezione.length - 11)).removeClass("collapsed");
    $("#" + id_sezione.substr(0, id_sezione.length - 11)).children("div.fieldset-wrapper").css("display", "block");
  }

  goToByScroll(id_sezione);
  blink($('#' + id_sezione));

}

function goToByScroll(id) {

  $('html,body').animate({scrollTop: $("#" + id).offset().top}, 'slow');
}


function blink(elem) {
  if (!something_blinkin) {
    something_blinkin = true;
    inter_id = setInterval(function () {
      if (elem.css('visibility') == 'hidden') {
        elem.css('visibility', 'visible');
      } else {
        elem.css('visibility', 'hidden');
      }
    }, 200);

    setTimeout(function () {
      clearInterval(inter_id);
    }, 1200);
    setTimeout(function () {
      elem.css('visibility', 'visible');
    }, 1250);
    setTimeout(function () {
      something_blinkin = false;
    }, 1300);
  }

}

$(document).ready(function () {

  var img_invio = $('<img/>');
  img_invio.error(function () {
    $(this).attr('src', 'https://sportello.comune.trento.it/sites/all/modules/custom/sportello_telematico/imgs/in_invio.gif');
  });
  img_invio.attr('src', 'https://sportello.comune.trento.it/sites/all/modules/custom/sportello_telematico/trunk/imgs/in_invio.gif');


  ente = readCookie('ente_attivo');
  if (ente) {
    $('#edit-lista-comuni').val(ente);
  }

  $('#bottone_telematica').click(function () {
    var comune = $('#edit-lista-comuni option:selected').html();
    if (comune) {
      if (comune != "Scegli l'ente") {
        return confirm("Si sta presentando un'istanza al " + comune + ". Se necessario modificare l'ente destinatario.");
      } else {
        alert('Per proseguire è necessario selezionare l’ente destinatario dell’istanza.');
        return false;
      }
    }
  });

  $('#edit-lista-comuni').change(function () {
    var comune = $("#edit-lista-comuni").val();
    createCookie('ente_attivo', comune, 0);
    $.ajax({
      async: false,
      url: "/sportello_telematico/set_default_extent/" + comune,
      success: function (data) {
      }
    });
    location.reload();
  });

  $('.basta-compilazioni').click(function () {
    alert("È stato raggiunto il numero massimo di compilazioni previste per questo modulo");
  });

  $('.basta-firma').click(function () {
    alert("È già stata fornita la versione firmata del modulo");
  });

  $('.basta-copie').click(function () {
    alert("È stato caricato il numero massimo di copie previste per questo allegato");
  });

  $('.basta-ricompila').click(function () {
    alert("Non è possibile modificare la compilazione di procura");
  });


  $('.compil-incompleta').click(function () {
    alert("Devi completare la compilazione prima di poterla scaricare e firmare");
  });

  $('#link_invio').click(function () {
    $(this).replaceWith(img_invio);
  });

  $('#edit-file-upload-allegato').change(function () {
    if (!$('#edit-descrizione').val()) {
      filename = $(this).val().replace(/^.*[\\\/]/, '');
      $('#edit-descrizione').val(filename);
    }
  });

  $('#edit-submit').click(function () {
    img_invio.css('vertical-align', 'bottom');
    img_invio.css('margin-left', '10px');
    $(this).parent().append(img_invio);
  });

  $('img[src*="imgs/pdf.png"]').click(function () {
    alert('Attenzione:\nquando sarà richiesto dal browser, è necessario scegliere di salvare il file e NON di aprirlo.\nSalvando il file dal programma di visualizzazione dei file PDF si rischia che questo sia modificato e non possa più essere caricato dopo la firma.');
  });



});


function createCookie(name, value, days) {
  if (days)
  {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
  }
  else
    var expires = "";

  var string =
          document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++)
  {
    var c = ca[i];
    while (c.charAt(0) == ' ')
      c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0)
      return c.substring(nameEQ.length, c.length);
  }
  return null;
}
