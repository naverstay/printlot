var browserWindow, doc, header, scrollTimer, resizeTimer, lastOrdersSlider, slideWidth, navSlider, deliveryCheck, deliveryAddress, paramReceiver, paramStack, customBlock, receivMarker, postprocessingVal;

$(function ($) {

    header = $('.header');
    deliveryAddress = $('#order_address');
    postprocessingVal = $('#postprocessing_val');
    deliveryCheck = $('#print_delivery');
    doc = $(document);
    browserWindow = $(window);

    init_chosen();

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

    var dpi_range = ['115', '130', '150', '170'];

    function pipsDPI(value, type) {
        return dpi_range[value];
    }

    $('#order_form').validationEngine({
        //binded                   : false,
        scroll: false,
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

    $('.radioSwipe').swipe({
        excludedElements: ".noSwipe, textarea, input, .radioSwipe",
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
                    checkbox.prop('checked', false);
                } else if (direction === 'right') {
                    checkbox.prop('checked', true);
                }
            }

            return false;
        }
    });

});

function init_chosen() {
    $('.chosen-select').chosen({
        width: "100%",
        disable_search_threshold: 3
    }).on('liszt:showing_dropdown', function (evt, params) {

        var firedEl = $(evt.currentTarget);

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

        if (doc.scrollTop() > 10) {
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
