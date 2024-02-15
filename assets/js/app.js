var windowWidth = document.documentElement.clientWidth;
window.addEventListener("resize", () => {
	windowWidth = document.documentElement.clientWidth;
});

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
	let $childUl = $parent.find('> li > ul');
	if ($childUl.length === 0) {
		return;
	}

	if ($callFunction) {
		$parent.find('> li a').each(function () {
			$(this).attr('data-href', $(this).attr('href'))
		});
	}

	if (windowWidth <= 991) {

		let $objParentAttr = {};
		let $objChildrenAttr = {
			'data-bs-parent': '#' + $parent.attr('id')
		}

		if ($firstItem) {
			let $parentID = 'menu-' + Math.random().toString(36).substring(7);
			$parent.attr('id', $parentID);
			$objParentAttr = {
				'data-bs-parent': '#' + $parentID
			}

			$objChildrenAttr = {};
		}

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');
			let $parentListItemAnchor = $parentListItem.children('a');

			let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

			$parentUl.addClass('collapse').attr({
				'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
			});

			$parentListItemAnchor.replaceWith(function () {
				return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
			})

			handleApplyCollapse($parentUl, false);

			$parentUl.on('show.bs.collapse', function () {
				$parent.find('.collapse.show').not($parentUl).collapse('hide');
			});
		});
	} else {
		$parent.removeAttr('id');

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');

			$parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
			$parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

			$parentListItem.children('button').replaceWith(function () {
				return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
			})

			handleApplyCollapse($parentUl);
		});
	}
}

let handleCallMenu = function () {
	const $body = $('body');
	const handleBody = function ($toggle = false) {
		if ($body.hasClass('is-navigation')) {
			$body.removeClass('is-navigation');
			if ($body.hasClass('is-overflow')) {
				$body.removeClass('is-overflow');
			}

			$('#header-navigation ul').collapse('hide');
		} else {
			if ($toggle) {
				$body.addClass('is-navigation is-overflow')
			}
		}
	}

	if (windowWidth <= 991) {
		const $hamburger = $('#hamburger-button');
		if ($hamburger.length) {
			$hamburger.click(function () {
				handleBody(true)
			});
		}

		const $overlay = $('#header-overlay');
		if ($overlay.length) {
			$overlay.click(function () {
				handleBody();
			});
		}
	} else {
		handleBody();
	}
}

const handleStickHeader = function () {
	$(window).scroll(function (e) {
		if ($(document).scrollTop() > $('#header').innerHeight()) {
			$('#header').addClass('is-scroll');
		} else {
			$('#header').removeClass('is-scroll');
		}
	});
}

const handleCopyValue = function () {
	const copyButtons = document.querySelectorAll('.button-copy');
	if (copyButtons) {
		copyButtons.forEach(function (copyButton) {
			copyButton.addEventListener('click', function () {
				const valueToCopy = copyButton.getAttribute('data-value');

				const tempTextArea = document.createElement('textarea');
				tempTextArea.style.cssText = 'position: absolute; left: -99999px';
				tempTextArea.setAttribute("id", "textareaCopy");
				document.body.appendChild(tempTextArea);

				let textareaElm = document.getElementById('textareaCopy');
				textareaElm.value = valueToCopy;
				textareaElm.select();
				textareaElm.setSelectionRange(0, 99999);
				document.execCommand('copy');

				document.body.removeChild(textareaElm);

				if (copyButton.getAttribute('data-bs-toggle') === 'tooltip') {
					copyButton.setAttribute('title', 'ÄÃ£ sao chÃ©p');

					const tooltip = bootstrap.Tooltip.getInstance(copyButton);
					tooltip.setContent({'.tooltip-inner': 'ÄÃ£ sao chÃ©p'})
				}
			});
		})
	}
}

const handleInitFancybox = function () {
	if (windowWidth <= 991 && $('.initFancybox').length) {
		$('.initFancybox').each(function () {
			let elm = $(this);
			Fancybox.bind(`[data-fancybox=${elm.attr('data-fancybox')}]`, {
				thumbs: {
					autoStart: true,
				},
			});
		});
	}
}

const handleDropdownInTable = function () {
	const callDropdown = $('.callDropdown');
	if (callDropdown.length) {
		callDropdown.click(function () {
			let elmParent = $(this).parents('.action-dropdown');
			if (!elmParent.hasClass('is-dropdown')) {
				if ($('.manager-table .action-dropdown.is-dropdown').length) {
					$('.manager-table .action-dropdown').removeClass('is-dropdown');
				}

				elmParent.addClass('is-dropdown');
				if (windowWidth > 991) {
					elmParent.closest('.table-responsive').css('overflow', 'inherit');
				}
			} else {
				elmParent.removeClass('is-dropdown');
				if (windowWidth > 991) {
					elmParent.closest('.table-responsive').css('overflow-x', 'auto');
				}
			}
		});


		$(document).mouseup(function (e) {
			let elm = $('.action-dropdown.is-dropdown');
			elm.is(e.target) || 0 !== elm.has(e.target).length || (
				elm.removeClass('is-dropdown') && elm.closest('.table-responsive').css('overflow-x', 'auto')
			)
		})
	}
}

let handleCallSidebar = function () {
	const $body = $('body');
	const handleBody = function ($toggle = false) {
		if ($body.hasClass('is-sidebar')) {
			$body.removeClass('is-sidebar');
			$('#manager-sidebar ul').collapse('hide');
		} else {
			if ($toggle) {
				$body.addClass('is-sidebar')
			}
		}
	}

	if (windowWidth <= 991) {
		const $callSidebar = $('#callSidebar');
		if ($callSidebar.length) {
			$callSidebar.click(function () {
				handleBody(true)
			});
		}

		const $overlay = $('#manager-overlay');
		if ($overlay.length) {
			$overlay.click(function () {
				handleBody();
			});
		}
	} else {
		handleBody();
	}
}

let handleCheckInTable = function (){
	$('.check-all').click(function () {
		if ($(this).is(':checked')) {
			$('.check-only').each(function () {
				$(this).prop('checked', true);
			});
		} else {
			$('.check-only').each(function () {
				$(this).prop('checked', false);
			});
		}
	});

	$('.check-only').click(function () {
		if (!$(this).is(':checked')) {
			$('.check-all').prop('checked', false);
		}
	});
}

const handleViewPass = function () {
	$(document).on('click', '.buttonViewPassword', function () {
		let elm = $(this),
			elmID = elm.attr('data-id');
		if (elm.hasClass('is-show')) {
			elm.html('<i class="fal fa-eye">');
			elm.removeClass('is-show');
			$('#' + elmID).attr('type', 'password');
		} else {
			elm.html('<i class="fal fa-eye-slash">');
			elm.addClass('is-show');
			$('#' + elmID).attr('type', 'text');
		}
	});
}

$(function () {
	handleApplyCollapse($('#header-navigation > ul'), true, true);
	handleCallMenu();
	$(window).resize(function () {
		handleApplyCollapse($('#header-navigation > ul'));
		handleCallMenu();
	})

	handleStickHeader();

	if ($('#slider-hero').length) {
		new Swiper('#slider-hero .swiper', {
			speed: 500,
			slidesPerView: 1,
			preloadImages: false,

			loop: true,
			autoplay: {
				delay: 8000,
				disableOnInteraction: false,
			},
			navigation: {
				nextEl: "#slider-hero .banner-button_next",
				prevEl: "#slider-hero .banner-button_prev",
			}, pagination: {
				el: "#slider-hero .banner-pagination",
				clickable: true,
				renderBullet: function (index, className) {
					return `<span class="${className}">0${index + 1}</span>`;
				},
			}
		});
	}

	if ($('#slider-service').length) {
		new Swiper('#slider-service .swiper', {
			speed: 500,
			slidesPerView: 4,
			preloadImages: false,
			spaceBetween: 24,
			loop: true,
			autoplay: {
				delay: 6000,
				disableOnInteraction: false,
			},
			pagination: {
				el: "#slider-service .slider-pagination",
				clickable: true
			},
			breakpoints: {
				320: {

					slidesPerView: 1,
				}, 375: {

					slidesPerView: 2,
				}, 768: {

					slidesPerView: 3.5,
				}, 991: {

					slidesPerView: 4,
				}, 1200: {

					slidesPerView: 4,
				}
			},
		});
	}

	if ($('#slider-new').length) {
		new Swiper('#slider-new .swiper', {
			speed: 500,
			slidesPerView: 4,
			preloadImages: false,
			spaceBetween: 24,
			loop: true,
			autoplay: {
				delay: 6000,
				disableOnInteraction: false,
			},
			autoplay: false,
			pagination: {
				el: "#slider-new .slider-pagination",
				clickable: true
			},
			breakpoints: {
				320: {

					slidesPerView: 1,
				}, 375: {

					slidesPerView: 2,
				}, 768: {

					slidesPerView: 3.5,
				}, 991: {

					slidesPerView: 4,
				}, 1200: {

					slidesPerView: 4,
				}
			},
		});
	}

	if ($('#slider-partner').length) {
		new Swiper('#slider-partner .swiper', {
			speed: 500,
			slidesPerView: 6,
			preloadImages: false,
			spaceBetween: 24,
			loop: true,
			autoplay: {
				delay: 6000,
				disableOnInteraction: false,
			},
			pagination: {
				el: "#slider-partner .slider-pagination",
				clickable: true
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				375: {
					slidesPerView: 2.5,
				},
				768: {
					slidesPerView: 3.5,
				},
				991: {
					slidesPerView: 4.5,
				},
				1200: {
					slidesPerView: 5,
				}
			},
		});
	}

	if ($('#slider-procedure').length) {
		new Swiper('#slider-procedure .swiper', {
			speed: 500,
			slidesPerView: 4,
			preloadImages: false,
			spaceBetween: 0,
			breakpoints: {
				320: {
					slidesPerView: 1.25,
					spaceBetween: 10,
				}, 768: {
					slidesPerView: 2.25,
					spaceBetween: 10,
				}, 991: {
					slidesPerView: 3.25,
					spaceBetween: 10,
				}, 1200: {
					slidesPerView: 4,
				}
			},
		});
	}

	if ($('#article-content table').length > 0) {
		$('#article-content table').map(function () {
			$(this).addClass('table table-bordered');
			$(this).wrap('<div class="table-responsive"></div>');
		})
	}

	handleCopyValue();
	if ($('[data-bs-toggle="tooltip"]').length) {
		$('[data-bs-toggle="tooltip"]').tooltip({
			trigger: 'hover',
		});
	}

	handleInitFancybox();
	handleDropdownInTable();
	handleCallSidebar();
	handleCheckInTable();
	handleViewPass();
});