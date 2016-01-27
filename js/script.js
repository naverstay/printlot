$(function($){

  $(".scrollTo").click(function(){
    var firedEl = $(this), target = $(firedEl.attr('href'));

    if(target.length){
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000);
    }

    return false;
  });

  var dpi_range = ['115', '130', '150', '170'],
      type_range = ['Односторонняя', 'Двусторонняя'];

  function pipsDPI(value, type){
    return dpi_range[value];
  }

  function pipsSIDE(value, type){
    return type_range[value];
  }

  $('#order_form').validationEngine({
    //binded                   : false,
    scroll                   : true,
    showPrompts              : false,
    showArrow                : false,
    addSuccessCssClassToField: 'input_success',
    addFailureCssClassToField: 'input_error',
    parentFieldClass         : '.form_cell',
    parentFormClass          : '.order_block',
    promptPosition           : "centerRight",
    //doNotShowAllErrosOnSubmit: true,
    //focusFirstField          : false,
    autoHidePrompt           : false,
    autoHideDelay            : 2000,
    autoPositionUpdate       : false,
    //prettySelect             : true,
    //useSuffix                : "_VE_field",
    addPromptClass           : 'hidden_mode',
    showOneMessage           : false
  });

  var DPIslider = $('#dpi_range_toddler'),
      DPIfield = DPIslider.find('.toddler_input'),
      DPIVal = $('#dpiRange_val');

  noUiSlider.create(DPIslider[0], {
    start  : 0,
    step   : 1,
    connect: 'lower',
    range  : {
      'min': 0,
      'max': dpi_range.length - 1
    },
    pips   : {
      mode   : 'count',
      format : {to: pipsDPI},
      values : dpi_range.length,
      density: 1000
    }
  });

  DPIslider[0].noUiSlider.on('update', function(e, hndl){

    var newVal = parseInt(e[hndl]);

    DPIVal.html(dpi_range[newVal]);

    DPIfield.val(newVal);

  });

  var SIDEslider = $('#side_range_toddler'),
      SIDEfield = SIDEslider.find('.toddler_input'),
      SIDEVal = $('#sideRange_val');

  noUiSlider.create(SIDEslider[0], {
    start  : 1,
    step   : 1,
    connect: 'lower',
    range  : {
      'min': 0,
      'max': type_range.length - 1
    },
    pips   : {
      mode   : 'count',
      format : {to: pipsSIDE},
      values : type_range.length,
      density: 1000
    }
  });

  SIDEslider[0].noUiSlider.on('update', function(e, hndl){

    var newVal = parseInt(e[hndl]);

    SIDEVal.html(type_range[newVal]);

    SIDEfield.val(newVal);

  });

});

