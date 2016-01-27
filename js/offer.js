var browserWindow, doc, header, scrollTimer, resizeTimer, lastOrdersSlider, slideWidth, navSlider;

$(function ($) {

    header = $('.header');
    slideWidth = $('.slideWidth');
    doc = $(document);
    browserWindow = $(window);

    $('.orderOtherBtn').on('click', function () {
        var firedEl = $(this).parent();
        if (!firedEl.hasClass('expanded')) firedEl.toggleClass('expanded');
        return false;
    });

    browserWindow.on('scroll', function () {
        scroll_f();
    }).on('resize', function () {
        resize_f();
    }).on('load', function () {

        lastOrdersSlider = new Swiper('.lastOrdersSlider', {
            loop: false,
            setWrapperSize: true,
            slidesPerView: 'auto',
            //freeMode      : true,
            spaceBetween: 0,
            onInit: function () {
                setTimeout(function () {
                    $(lastOrdersSlider.slides).eq(0).parent().addClass('loaded');
                    fixSlideSize();
                }, 1);
            }
        });

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

});

function fixSlideSize() {

    if (lastOrdersSlider !== void 0) {
        $(lastOrdersSlider.slides).width(slideWidth.width());
        lastOrdersSlider.update();
    }

}

function resize_f() {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {
        fixSlideSize();
    }, 10);
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