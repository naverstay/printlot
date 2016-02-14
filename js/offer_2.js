var browserWindow, doc, header, scrollTimer, resizeTimer, lastOrdersSlider, slideWidth, navSlider, deliveryCheck, deliveryAddress, paramReceiver, paramStack, customBlock, receivMarker, postprocessingVal;

$(function ($) {

    header = $('.header');
    deliveryAddress = $('#order_address');
    postprocessingVal = $('#postprocessing_val');
    deliveryCheck = $('#print_delivery');
    customBlock = $('.customBlock');
    slideWidth = $('.slideWidth');
    paramReceiver = $('.paramReceiver');
    paramStack = $('.paramStack');
    receivMarker = $('.receivMarker');
    doc = $(document);
    browserWindow = $(window);

    init_chosen();

    var countries = [
        {value: 'Andorra', data: 'AD'},
        {value: 'Ukraine', data: 'UA'},
        {value: 'Russian Federation', data: 'RF'},
        {value: 'Andorra', data: 'AD'},
        {value: 'Ukraine', data: 'UA'},
        {value: 'Russian Federation', data: 'RF'},
        {value: 'Andorra', data: 'AD'},
        {value: 'Ukraine', data: 'UA'},
        {value: 'Russian Federation', data: 'RF'},
        {value: 'Andorra', data: 'AD'},
        {value: 'Ukraine', data: 'UA'},
        {value: 'Russian Federation', data: 'RF'},
        {value: 'Zimbabwe', data: 'ZZ'}
    ];

    $('.autoComplete').each(function (ind) {
        var inp = $(this);

        inp.autocomplete({
            //serviceUrl: '/autocomplete/countries',  todo uncomment with right url
            lookup: countries,
            orientation: 'auto',
            width: 'auto',
            zIndex: 1,
            appendTo: inp.parent(),
            onSelect: function (suggestion) {
                console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
            },
            onSearchComplete: function (query, suggestions) {
                console.log(query, suggestions);
            },
            beforeRender: function (container) {
                console.log(container);

                var firedEl = $(container);

                var niceScrollBlock = firedEl;

                if (niceScrollBlock.getNiceScroll().length) {
                    niceScrollBlock.getNiceScroll().resize().show();
                } else {
                    niceScrollBlock.niceScroll({
                        //cursorcolor : "#5c9942",
                        cursorwidth: 4,
                        cursorborderradius: 2,
                        cursorborder: 'none',
                        bouncescroll: false,
                        autohidemode: false,
                        horizrailenabled: false,
                        railsclass: firedEl.data('rails_class'),
                        railpadding: {top: 0, right: 0, left: 0, bottom: 0}
                    });

                    setTimeout(function () {
                        firedEl.show();
                    }, 3);
                }
            }
        })
    });

    $('.orderOtherBtn').on('click', function () {
        var firedEl = $(this).parent();
        if (!firedEl.hasClass('expanded')) firedEl.toggleClass('expanded');
        return false;
    });

    $('#file_attach').on('change', function () {

        $('#file_attach_name').val($('#file_attach').val());

    });

    $('.swipeVeil').on('click', function (e) {
        $(this).find('.unveilInput').focus();
    });

    $('.postProcessingCheck').on('change', function () {
        var firedEl = $(this), new_text = postprocessingVal.text();

        if (this.checked) {
            new_text = new_text + ", " + firedEl.next('.check_text').text();
        } else {
            new_text = new_text.replace(firedEl.next('.check_text').text(), '');
            new_text = new_text.replace(' , ', ' ');
            new_text = new_text.replace('  ', ' ');
        }

        new_text = new_text.trim();

        new_text = new_text.replace(/^,/i, ' ');
        new_text = new_text.replace(/,$/i, ' ');

        postprocessingVal.text(new_text.trim());

        return false;
    });

    $('.addParamBtnMob, .closeParamBtnMob').on('click', function () {
        customBlock.toggleClass('open');
        paramStack.parent().toggleClass('open');
        $('html').toggleClass('hide_overflow');

        return false;
    });

    $('.paramStackHolder').on('click', function (e) {

        if ($(e.target).hasClass('paramStackHolder') && customBlock.hasClass('open')) $('.closeParamBtnMob').click();

    });

    $('.paramStackOverlay').on('click', function (e) {

        if ($(e.target).hasClass('paramStackOverlay') && customBlock.hasClass('open')) $('.closeParamBtnMob').click();

    });

    paramReceiver.swipe({
        excludedElements: ".noSwipe, .radioSwipe",
        threshold: 5,
        allowPageScroll: "vertical",
        tap: function (e, w) {
            $(w).click();
        },
        swipe: function (event, direction) {
            var firedEl = $(event.target);

            if (firedEl.hasClass('clickOnSwipe')) {
                firedEl.click();
            } else {

                if (firedEl.closest('.custom_pu_inner').length) {
                    firedEl = firedEl.closest('.custom_pu_inner');
                }

                if (firedEl.hasClass('custom_pu_inner')) {
                    if (direction === 'left') {
                        firedEl.addClass('swipe_aside');
                    } else if (direction === 'right') {
                        firedEl.removeClass('swipe_aside');
                    }
                }
            }
        }
    });

    $('.radioSwipe').swipe({
        excludedElements: ".noSwipe",
        threshold: 5,
        allowPageScroll: "vertical",
        tap: function (e, w) {
            $(w).click();
        },
        swipe: function (event, direction) {
            var firedEl = $(event.target);

            if (!firedEl.hasClass('radioSwipe')) {
                firedEl = firedEl.closest('.radioSwipe');
            }

            var checkbox = $('#' + firedEl.attr('for'));

            if (checkbox.length) {
                if (direction === 'left') {
                    checkbox.prop('checked', device.desktop() ? true : false);
                } else if (direction === 'right') {
                    checkbox.prop('checked', device.desktop() ? false : true);

                    if (deliveryCheck[0] == checkbox[0]) {
                        deliveryAddress.addClass('validate[required]').focus();
                    } else {
                        deliveryAddress.attr('class', deliveryAddress.attr('class').replace(/input_error|validate\[.*\]/ig, ''));
                        deliveryAddress.closest('.form_cell').removeClass('input_error');
                    }
                }
            }

            return false;
        }
    });

    $('body').delegate('.addParamBtn', 'click', function () {
        var paramSpacer = $('<div class="paramSpacer param_spacer" style="height: 0;" />');

        var paramUnit, paramPU = $(this).closest('.custom_pu_inner');

        if (paramPU.hasClass('selected')) {  // удаление

            paramUnit = $('.paramStack').find('.paramUnit.collapsed.active:first');

            paramUnit.prependTo(paramStack);

            var h = paramPU.offset().top - paramUnit.offset().top + 16 + paramPU.height();

            paramUnit.animate({'paddingTop': paramPU.height() / 1.1}, speed(0));

            paramUnit.prepend(paramPU.removeClass('selected swipe_aside').css('top', h));

            if ($('.paramReceiver').find('.custom_pu_inner').length) {
                customBlock.addClass('add_custom');
            } else {
                customBlock.removeClass('add_custom');
            }

            paramPU.animate({'top': 0}, speed(0) * 1.3, function () {
                paramUnit.removeClass('active collapsed').attr('style', '').find('.paramSpacer').remove();

            });

        } else {  // добавление

            paramUnit = paramPU.removeClass('swipe_aside').closest('.paramUnit');

            paramUnit.css('height', paramPU.height()).addClass('active ');

            var h = receivMarker.offset().top - receivMarker.height() - paramPU.offset().top + 16;

            setTimeout(function () {
                paramUnit.addClass('collapsed').attr('style', '');

                //paramStack.animate({
                //  'paddingTop': paramReceiver.find('.custom_pu_inner').length ? paramPU.height() / 1.1 : '1px'
                //}, speed(0));

                paramPU.animate({'top': h}, speed(0), "linear", function () {
                    receivMarker.before(paramPU.attr('style', '').addClass('selected'));
                    //paramStack.css('paddingTop', '1px');
                    paramUnit.prependTo(paramStack);

                    if ($('.paramReceiver').find('.custom_pu_inner').length) {
                        customBlock.addClass('add_custom');

                        if ($('.paramStackOverlay').is(':visible')) $('.closeParamBtnMob').click();

                        setTimeout(function () {

                            console.log($(document).height(), $(window).height() - paramPU.offset().top);

                            $('html, body').stop().animate({
                                scrollTop: paramPU.offset().top - 85
                            }, 300);
                        }, 1);

                    } else {
                        customBlock.removeClass('add_custom');
                    }
                });

            }, 300);
        }

        return false;
    });

    browserWindow.on('scroll', function () {
        scroll_f();
    }).on('resize', function () {
        resize_f();
    }).on('load', function () {

        navSlider = new Swiper('.navSlider', {
            loop: false,
            setWrapperSize: true,
            slidesPerView: 'auto',
            //freeMode      : true,
            spaceBetween: 0,
            onInit: function () {

            }
        });

    });

    var dpi_range = ['115', '130', '150', '170'],
        type_range = ['Односторонняя', 'Двусторонняя'],
        size_range = ['Евро', 'A4', 'A5', 'A6'],
        delivery_range = ['Да', 'Нет'],
        size_range_label = ['Евро (210x99mm)', 'A4(220x99mm)', 'A5(230x99mm)', 'A6(240x99mm)'];

    function pipsDPI(value, type) {
        return dpi_range[value];
    }

    function pipsDEl(value, type) {
        return delivery_range[value];
    }

    function pipsSIDE(value, type) {
        return type_range[value];
    }

    function pipsSIZE(value, type) {
        return size_range[value];
    }

    $('#order_form').validationEngine({
        //binded                   : false,
        scroll: true,
        showPrompts: false,
        showArrow: true,
        addSuccessCssClassToField: 'input_success',
        addFailureCssClassToField: 'input_error',
        parentFieldClass: '.form_cell',
        parentFormClass: '.order_block',
        promptPosition: "centerRight",
        //doNotShowAllErrosOnSubmit: true,
        //focusFirstField          : false,
        autoHidePrompt: false,
        autoHideDelay: 2000,
        autoPositionUpdate: true,
        //prettySelect             : true,
        //useSuffix                : "_VE_field",
        addPromptClass: 'hidden_mode',
        showOneMessage: false
    });

    /*  var DELslider = $('#delivery_range_toddler'),
     DELfield = DELslider.find('.toddler_input'),
     DELVal = $('#delRange_val');

     noUiSlider.create(DELslider[0], {
     start  : 1,
     step   : 1,
     connect: 'lower',
     range  : {
     'min': 0,
     'max': type_range.length - 1
     },
     pips   : {
     mode   : 'count',
     format : {to: pipsDEl},
     values : type_range.length,
     density: 1000
     }
     });

     DELslider[0].noUiSlider.on('update', function(e, hndl){

     var newVal = parseInt(e[hndl]);

     DELVal.html(delivery_range[newVal]);

     DELfield.val(newVal);

     });*/

    var DPIslider = $('#dpi_range_toddler'),
        DPIfield = DPIslider.find('.toddler_input'),
        DPIVal = $('#dpiRange_val');

    noUiSlider.create(DPIslider[0], {
        start: 0,
        step: 1,
        connect: 'lower',
        range: {
            'min': 0,
            'max': dpi_range.length - 1
        },
        pips: {
            mode: 'count',
            format: {to: pipsDPI},
            values: dpi_range.length,
            density: 1000
        }
    });

    DPIslider[0].noUiSlider.on('update', function (e, hndl) {

        var newVal = parseInt(e[hndl]);

        DPIVal.html(dpi_range[newVal]);

        DPIfield.val(newVal);

    });

    /*  var SIDEslider = $('#side_range_toddler'),
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

     });*/

    var SIZEslider = $('#size_range_toddler'),
        SIZEfield = SIZEslider.find('.toddler_input'),
        SIZEVal = $('#sizeRange_val');

    noUiSlider.create(SIZEslider[0], {
        start: 1,
        step: 1,
        connect: 'lower',
        range: {
            'min': 0,
            'max': size_range.length - 1
        },
        pips: {
            mode: 'count',
            format: {to: pipsSIZE},
            values: size_range.length,
            density: 1000
        }
    });

    SIZEslider[0].noUiSlider.on('update', function (e, hndl) {

        var newVal = parseInt(e[hndl]);

        SIZEVal.html(size_range_label[newVal]);

        SIZEfield.val(newVal);

    });

});

function init_chosen() {
    $('.chosen-select').chosen({
        width: "100%",
        disable_search_threshold: 3
    }).on('liszt:showing_dropdown', function (evt, params) {

        var firedEl = $(evt.currentTarget);

        firedEl.closest('.custom_pu_inner').addClass('active_chosen');

        var niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results');

        if (niceScrollBlock.getNiceScroll().length) {
            niceScrollBlock.getNiceScroll().resize().show();
        } else {
            niceScrollBlock.niceScroll({
                //cursorcolor : "#5c9942",
                cursorwidth: 4,
                cursorborderradius: 2,
                cursorborder: 'none',
                bouncescroll: false,
                autohidemode: false,
                horizrailenabled: false,
                railsclass: firedEl.data('rails_class'),
                railpadding: {top: 0, right: 0, left: 0, bottom: 0}
            });
        }

    }).on('liszt:hiding_dropdown', function (evt, params) {
        var firedEl = $(evt.currentTarget);

        firedEl.closest('.custom_pu_inner').removeClass('active_chosen');

        var niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results');

        niceScrollBlock.getNiceScroll().hide();

        if (firedEl.parents('.form_validate').length) firedEl.validationEngine('validate');

    });

}

function resize_f() {

}

function scroll_f() {

    clearTimeout(scrollTimer);

    scrollTimer = setTimeout(function () {

        if (doc.scrollTop() > 25) {
            header.stop().addClass("sticky_logo");
        } else {
            header.stop().removeClass("sticky_logo");
        }

        if (doc.scrollTop() > 70) {
            header.stop().addClass("sticky");
        } else {
            header.stop().removeClass("sticky");
        }
    }, 10);
}

function delivery_validation(e) {

    if (deliveryCheck.is(':checked')) {
        deliveryAddress.addClass('validate[required]').focus();
    } else {
        deliveryAddress.attr('class', deliveryAddress.attr('class').replace(/input_error|validate\[.*\]/ig, ''));

        deliveryAddress.closest('.form_cell').removeClass('input_error');
    }

    return false;

}

function speed(distance) {
    return Math.abs(distance / 500 * 1000);
}