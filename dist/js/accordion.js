'use strict';

(function ($) {

	$.fn.accordion = function (options) {
		this.each(function () {
			var $accordion = $(this),
			    contentID = $accordion.data('accordion'),
			    $content = $(contentID),
			    defaults = {};

			var toggle = function toggle() {
				if ($accordion.hasClass('accordion--open')) {
					close();
				} else {
					open();
				}
			};

			var open = function open() {
				$content.velocity('slideDown', {
					begin: function begin() {
						$accordion.addClass('accordion--transitioning');
					},
					complete: function complete() {
						$accordion.addClass('accordion--open').removeClass('accordion--transitioning');
						$content.addClass('accordion-content--open');
					}
				});
			};

			var close = function close() {
				$content.velocity('slideUp', {
					begin: function begin() {
						$accordion.addClass('accordion--transitioning');
					},
					complete: function complete() {
						$accordion.removeClass('accordion--open accordion--transitioning');
						$content.removeClass('accordion-content--open');
					}
				});
			};

			$accordion.on("toggleAccordion", toggle);

			$accordion.on("click", function () {
				$accordion.trigger("toggleAccordion");
			});
		});
	};

	$(document).ready(function () {
		$('[data-accordion]').accordion();
	});
})(jQuery);