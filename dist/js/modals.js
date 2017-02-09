'use strict';

(function ($) {

		$.fn.modal = function (options) {
				this.each(function () {

						var $modal = $(this),
						    $body = $('body'),
						    transitionSpeed = 600,
						    addedClass = 'modal--open',
						    triggerId = $modal.attr('id'),
						    $trigger = $('[data-modal-id=' + triggerId + ']'),
						    $closeBtn = $modal.find('[data-modal-close]'),
						    defaults = {};

						var currentScrollPosition = null,
						    settings = $.extend(defaults, options);

						var isDesktop = function isDesktop() {
								return $(window).width() > 768 ? true : false;
						};

						var setAriaHidden = function setAriaHidden(boolean) {
								$modal.attr("aria-hidden", boolean);
						};

						var fixPage = function fixPage() {
								$body.addClass("no-scroll");
						};

						var unFixPage = function unFixPage() {
								$body.removeClass("no-scroll");
						};

						var setPageHeight = function setPageHeight() {
								var windowHeight = window.innerHeight || $(window).height();
								$body.css({
										height: windowHeight
								});
						};

						var unsetPageHeight = function unsetPageHeight() {
								$body.css({
										height: "auto"
								});
						};

						var setHiddenPosition = function setHiddenPosition() {
								var modalHeight = $modal.outerHeight();
								if (isDesktop()) {
										$modal.css({
												"bottom": "auto",
												"display": "block"
										});
								} else {
										$modal.css({
												bottom: -modalHeight,
												display: "block"
										});
								}
						};

						var animateInModal = function animateInModal() {
								var self = this,
								    mobileAnimationIn = {
										bottom: 0
								},
								    desktopAnimationIn = "fadeIn";

								var animationIn = isDesktop() ? desktopAnimationIn : mobileAnimationIn;

								$modal.velocity(animationIn, {
										duration: transitionSpeed,

										begin: function begin() {
												$modal.trigger("modalBeginOpening");
												setHiddenPosition();
										},
										complete: function complete() {
												fixPage();
												setPageHeight();
												$modal.addClass(addedClass).removeAttr('style').trigger("modalCompleteOpening");
										}
								});
						};

						var animateOutModal = function animateOutModal() {
								var modalHeight = $modal.outerHeight();
								var mobileAnimationOut = {
										bottom: -modalHeight
								};
								var desktopAnimationOut = "fadeOut";
								var animationOut = isDesktop() ? desktopAnimationOut : mobileAnimationOut;

								$modal.velocity(animationOut, {
										duration: transitionSpeed,
										begin: function begin() {
												$modal.trigger("modalBeginClosing");
										},
										complete: function complete() {
												$modal.trigger("modalCompleteClosing").removeClass(addedClass).removeClass("no-scroll");
										}
								});
						};

						var open = function open() {
								currentScrollPosition = $(document).scrollTop();
								animateInModal();
								setAriaHidden(false);
						};

						var close = function close() {
								animateOutModal();
								setAriaHidden(true);
								$(document).scrollTop(currentScrollPosition);
								unsetPageHeight();
								unFixPage();
						};

						var resize = function resize() {
								if ($modal.hasClass(addedClass)) {
										setPageHeight();
										$modal.trigger("modalResize");
								}
						};

						$modal.on("openModal", open);
						$modal.on("closeModal", close);

						$trigger.on("click", function () {
								$modal.trigger("openModal");
						});

						$closeBtn.on("click", function () {
								$modal.trigger("closeModal");
						});

						$(window).on("resize", debounce(function () {
								resize();
						}, 250));
				});
		};

		$(document).ready(function () {
				$('div[data-modal]').modal();
		});
})(jQuery);