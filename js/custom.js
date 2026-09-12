// sticky header
$(window).scroll(function () {
    if ($(this).scrollTop() > 600) {
        $('#topHeader').addClass("sticky");
    } else {
        $('#topHeader').removeClass("sticky");
    }
});

// initialize home banner slider with custom dots, arrow, and progress indicator
if ($('#bannerSlider').length) {
    var $bannerSlider = $('#bannerSlider');
    var $bannerProgress = $('.banner_progress span');
    var bannerAutoplaySpeed = 4500;

    function startBannerProgress() {
        $bannerProgress.stop(true, true).css('width', '0');
        $bannerProgress.animate({ width: '100%' }, bannerAutoplaySpeed, 'linear');
    }

    $bannerSlider.on('init', function () {
        startBannerProgress();
    });

    $bannerSlider.on('beforeChange', function () {
        $bannerProgress.stop(true, true).css('width', '0');
    });

    $bannerSlider.on('afterChange', function () {
        startBannerProgress();
    });

    $bannerSlider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: bannerAutoplaySpeed,
        speed: 700,
        fade: true,
        cssEase: 'linear',
        dots: true,
        arrows: true,
        appendDots: $('.banner_dots'),
        nextArrow: $('.banner_next'),
        prevArrow: '<button type="button" class="banner_prev" aria-label="Previous slide"></button>',
        pauseOnHover: false,
        pauseOnFocus: false
    });
}

// demo product data used to power the search suggestions/results (replace with an API call when the backend is ready)
var searchDemoData = [
    { type: "suggestion", label: "Sofa Set" },
    { type: "suggestion", label: "Sofa cum bed" },
    { type: "suggestion", label: "Sofa cover" },
    { type: "suggestion", label: "Sofa cum bed 3 seater" },
    { type: "product", name: "FRIDHAULT", category: "Sofa bed", img: "" },
    { type: "product", name: "Wooden Sofa", category: "Sofa bed", img: "" }
];

// open the search box on search icon click
$('#searchIconBtn').on('click', function () {
    $('#searchBox').fadeIn(200);
    $('#searchOverlay').fadeIn(200);
    $('#searchInput').val('').focus();
    renderSearchResults('');
});

// close the search box (close icon or overlay click)
function closeSearchBox() {
    $('#searchBox').fadeOut(200);
    $('#searchOverlay').fadeOut(200);
}
$('#searchCloseBtn').on('click', closeSearchBox);
$('#searchOverlay').on('click', closeSearchBox);

// close search box on ESC key
$(document).on('keyup', function (e) {
    if (e.key === 'Escape') {
        closeSearchBox();
    }
});

// filter suggestions/results live as the user types
$('#searchInput').on('keyup', function () {
    renderSearchResults($(this).val());
});

function renderSearchResults(term) {
    var $suggestions = $('#searchSuggestions').empty();
    var $results = $('#searchResults').empty();
    var keyword = term.trim().toLowerCase();

    if (!keyword) {
        return;
    }

    var matches = searchDemoData.filter(function (item) {
        var text = item.type === 'suggestion' ? item.label : item.name;
        return text.toLowerCase().indexOf(keyword) !== -1;
    });

    matches.forEach(function (item) {
        if (item.type === 'suggestion') {
            var highlighted = highlightMatch(item.label, keyword);
            $suggestions.append('<li><i class="fa-solid fa-magnifying-glass"></i>' + highlighted + '</li>');
        } else {
            var placeholderStyle = item.img ? ' style="background-image:url(' + item.img + ')"' : '';
            $results.append(
                '<div class="search_result_item">' +
                '<div class="img_placeholder"' + placeholderStyle + '></div>' +
                '<div class="result_info">' +
                '<h4>' + item.name + '</h4>' +
                '<p>' + item.category + '</p>' +
                '</div>' +
                '</div>'
            );
        }
    });
}

// wraps the matched keyword portion of a suggestion in <strong> to mimic bold match highlighting
function highlightMatch(label, keyword) {
    var index = label.toLowerCase().indexOf(keyword);
    if (index === -1) {
        return label;
    }
    var before = label.substring(0, index);
    var match = label.substring(index, index + keyword.length);
    var after = label.substring(index + keyword.length);
    return before + '<strong>' + match + '</strong>' + after;
}

// clicking a suggestion fills the input with that suggestion text
$(document).on('click', '.search_suggestions li', function () {
    var text = $(this).text();
    $('#searchInput').val(text);
    renderSearchResults(text);
});

// toggle password visibility (eye icon) in signup/login modals
$(document).on('click', '.toggle_password', function () {
    var $input = $(this).siblings('.password_input');
    var $icon = $(this).find('i');
    if ($input.attr('type') === 'password') {
        $input.attr('type', 'text');
        $icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        $input.attr('type', 'password');
        $icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
});

// switch between signup modal and login modal via the "Sign In" / "Sign up" links
$(document).on('click', '.switch_modal', function () {
    var targetModal = $(this).data('bs-target');
    var $currentModal = $(this).closest('.modal');

    $currentModal.one('hidden.bs.modal', function () {
        $(targetModal).modal('show');
    });
    $currentModal.modal('hide');
});

// open the mobile menu on hamburger click
$('#hamburgerBtn').on('click', function () {
    $('#mobileMenu').addClass('show');
    $('#mobileMenuOverlay').fadeIn(200);
    $(this).attr('aria-expanded', 'true');
});

// close the mobile menu (close icon or overlay click)
function closeMobileMenu() {
    $('#mobileMenu').removeClass('show');
    $('#mobileMenuOverlay').fadeOut(200);
    $('#hamburgerBtn').attr('aria-expanded', 'false');
}
$('#mobileMenuClose').on('click', closeMobileMenu);
$('#mobileMenuOverlay').on('click', closeMobileMenu);

// accordion toggle for mobile category submenus
$(document).on('click', '.mobile_cmenu_link', function () {
    var $item = $(this).closest('.mobile_cmenu_item');
    $item.toggleClass('open').find('.mobile_submenu').slideToggle(200);
});

// close the mobile menu on ESC key
$(document).on('keyup', function (e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// auto-close the mobile menu if the viewport is resized back up to desktop width
$(window).on('resize', function () {
    if ($(window).width() > 991) {
        closeMobileMenu();
    }
});

// Contemporary product slider
if ($('.product_slider').length) {
    var $productSlider = $('.product_slider');
    var $counter = $('.slider_counter');

    function updateSliderCounter(slick, currentSlideIndex) {
        var totalSlides = slick.slideCount || 5;
        var current = (currentSlideIndex !== undefined ? currentSlideIndex : slick.currentSlide) + 1;
        $counter.text(current + '/' + totalSlides);
    }

    $productSlider.on('init reInit afterChange', function (event, slick, currentSlide) {
        updateSliderCounter(slick, currentSlide);
    });

    $productSlider.slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        speed: 700,
        arrows: true,
        prevArrow: $('.slider_prev'),
        nextArrow: $('.slider_next'),
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    centerPadding: '40px'
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '120px',
                    arrows: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '60px',
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '40px',
                    arrows: false
                }
            }
        ]
    });
}

// Collections slider with category tabs
if ($('.collection_slider').length) {
    var $collSlider = $('.collection_slider');
    var $collCards = $collSlider.find('.collection_card');

    var collSliderSettings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,

        centerMode: true,
        centerPadding: '15%',

        autoplay: false,
        autoplaySpeed: 3000,
        speed: 600,
        arrows: false,
        dots: false,

        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    centerPadding: '10%'
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    centerPadding: '8%'
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    centerPadding: '12%'
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '20%'
                }
            }
        ]
    };

    $collSlider.slick(collSliderSettings);

    $('.collection_tabs .tab_btn').on('click', function () {
        var filter = $(this).data('filter');

        if ($(this).hasClass('active')) {
            return;
        }

        $('.collection_tabs .tab_btn').removeClass('active');
        $(this).addClass('active');

        var $matched = filter === 'all'
            ? $collCards
            : $collCards.filter('[data-category="' + filter + '"]');

        if (!$matched.length) {
            $matched = $collCards;
        }

        $collSlider.slick('unslick');
        $collSlider.empty().append($matched.clone(true));
        $collSlider.slick(collSliderSettings);
    });
}
