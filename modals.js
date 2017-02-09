(function($) {

    $.fn.modal = function(options) {
    	this.each(function() {

	        const 
	        	$modal = $(this),       	
	        	$body = $('body'), 
	        	transitionSpeed = 600,
	        	addedClass = 'modal--open',
	        	triggerId = $modal.attr('id'),
	            $trigger = $(`[data-modal-id=${triggerId}]`),
	            $closeBtn = $modal.find('[data-modal-close]'),
	            
	            defaults = {

	            };

	        let currentScrollPosition = null,
	        	settings = $.extend(defaults, options);

			const isDesktop = function(){
	            return $(window).width() > 768 ? true : false;
	        };

	        const setAriaHidden = function(boolean) {
	            $modal.attr("aria-hidden", boolean);
	        };

	        const fixPage = function(){
	            $body.addClass("no-scroll");
	        };

	        const unFixPage = function(){
	            $body.removeClass("no-scroll");
	        };

	        const setPageHeight = function(){
	            const windowHeight = window.innerHeight || $(window).height();
	            $body.css({
	                height: windowHeight
	            });
	        };

	        const unsetPageHeight = function(){
	            $body.css({
	                height: "auto"
	            });
	        };

	        const setHiddenPosition = function(){
	            const modalHeight = $modal.outerHeight();
	            if (isDesktop()) {
	                $modal.css({
	                    "bottom": "auto",
	                    "display": "block",
	                });
	            } else {
	                $modal.css({
	                    bottom: -modalHeight,
	                    display: "block"
	                });
	            }
	        };

			const animateInModal = function(){
	            const self = this,
	                mobileAnimationIn = {
	                    bottom: 0
	                },
	                desktopAnimationIn = "fadeIn";
	            
	            let animationIn = isDesktop() ? desktopAnimationIn : mobileAnimationIn;
	            
	            $modal.velocity(animationIn, {
	                duration: transitionSpeed,

	                begin(){
	                    $modal.trigger("modalBeginOpening");
	                    setHiddenPosition();
	                },
	                complete(){
	                    fixPage();
	                    setPageHeight();
	                    $modal
	                    	.addClass(addedClass)
	                    	.removeAttr('style')
	                    	.trigger("modalCompleteOpening");
	                }
	            });
	        };

	        const animateOutModal = function() {
	            const modalHeight = $modal.outerHeight();
	            const mobileAnimationOut = {
	                bottom: -modalHeight
	            };
	            const desktopAnimationOut = "fadeOut";
	            let animationOut = isDesktop() ? desktopAnimationOut : mobileAnimationOut;

	            $modal.velocity(animationOut, {
	                duration: transitionSpeed,
	                begin(){
	                    $modal.trigger("modalBeginClosing");
	                    
	                },
	                complete(){
	                    $modal
	                    	.trigger("modalCompleteClosing")
	                    	.removeClass(addedClass)
	                    	.removeClass("no-scroll");
	                }
	            });
	        };

	        const open = function() {
	            currentScrollPosition = $(document).scrollTop();
	            animateInModal();
	            setAriaHidden( false );
	        };

	        const close = function(){
	            animateOutModal();
	            setAriaHidden( true );
	            $(document).scrollTop(currentScrollPosition);
	            unsetPageHeight();
	            unFixPage();
	        };

	        const resize = function(){
				if ($modal.hasClass( addedClass )) {
					setPageHeight();
					$modal.trigger( "modalResize" );
				}
	        };

	    	$modal.on( "openModal", open );
			$modal.on( "closeModal", close )
			
			$trigger.on( "click", function() {
	            $modal.trigger( "openModal" );
	        });

	        $closeBtn.on( "click", function() {
	            $modal.trigger( "closeModal" );
	        });

	    	$(window).on( "resize" , debounce(function() {
	    		resize();
	    	}, 250));
		});
    };

 
    $(document).ready(function() {
        $('div[data-modal]').modal();
    });
}(jQuery));
