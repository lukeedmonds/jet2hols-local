(function($) {

    $.fn.accordion = function(options) {
    	this.each(function() {
			const 
	        	$accordion = $(this),
	        	contentID = $accordion.data('accordion'),
	        	$content = $(contentID),
	            
	            defaults = {

	            };

			const toggle = function() {
				if ($accordion.hasClass('accordion--open')) {
					close();
				} else {
					open();
				}
			};

			const open = function() {
				$content.velocity('slideDown', {
					begin() {
						$accordion.addClass('accordion--transitioning');
					},
					complete() {
						$accordion.addClass('accordion--open').removeClass('accordion--transitioning');
						$content.addClass('accordion-content--open');
					}
				});
			};

			const close = function() {
				$content.velocity('slideUp', {
					begin() {
						$accordion.addClass('accordion--transitioning');
					},
					complete() {
						$accordion.removeClass('accordion--open accordion--transitioning');
						$content.removeClass('accordion-content--open');
					},
				});
			};

	    	$accordion.on( "toggleAccordion", toggle );
			
			$accordion.on( "click", function() {
	            $accordion.trigger( "toggleAccordion" );
	        });
		});
    };

 
    $(document).ready(function() {
        $('[data-accordion]').accordion();
    });
}(jQuery));
