/*
	Overflow by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var settings = {

		// Full screen header?
			fullScreenHeader: true,

		// Parallax background effect?
			parallax: true,

		// Parallax factor (lower = more intense, higher = less intense).
			parallaxFactor: 10,
 
        // Carousels
             carousels: {
             speed: 4,
             fadeIn: true,
             fadeDelay: 250
        }

	};

	skel.breakpoints({
		wide: '(max-width: 1680px)',
		normal: '(max-width: 1080px)',
		narrow: '(max-width: 840px)',
		mobile: '(max-width: 736px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');


		if (skel.vars.mobile) {

			settings.parallax = false;
			$body.addClass('is-scroll');

		}

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// CSS polyfills (IE<9).
			if (skel.vars.IEVersion < 9)
				$(':last-child').addClass('last-child');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on mobile.
			skel.on('+mobile -mobile', function() {
				$.prioritize(
					'.important\\28 mobile\\29',
					skel.breakpoint('mobile').active
				);
			});

		// Scrolly links.
			$('.scrolly-middle').scrolly({
				speed: 1000,
				anchor: 'middle'
			});

			$('.scrolly').scrolly({
				speed: 1000,
				offset: function() { return (skel.breakpoint('mobile').active ? 70 : 190); }
			});

		// Full screen header.
			if (settings.fullScreenHeader) {

				var $header = $('#header');

				if ($header.length > 0) {

					var $header_header = $header.find('header');

					$window
						.on('resize.overflow_fsh', function() {

							if (skel.breakpoint('mobile').active)
								$header.css('padding', '');
							else {

								var p = Math.max(192, ($window.height() - $header_header.outerHeight()) / 2);
								$header.css('padding', p + 'px 0 ' + p + 'px 0');

							}

						})
						.trigger('resize.overflow_fsh');

					$window.load(function() {
						$window.trigger('resize.overflow_fsh');
					});

				}

			}

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (skel.vars.browser == 'ie'
				||	skel.vars.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				var $dummy = $(), $bg;

				$window
					.on('scroll.overflow_parallax', function() {

						// Adjust background position.
							$bg.css('background-position', 'center ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');

					})
					.on('resize.overflow_parallax', function() {

						// If we're in a situation where we need to temporarily disable parallax, do so.
							if (!skel.breakpoint('wide').active
							||	skel.breakpoint('narrow').active) {

								$body.css('background-position', '');
								$bg = $dummy;

							}

						// Otherwise, continue as normal.
							else
								$bg = $body;

						// Trigger scroll handler.
							$window.triggerHandler('scroll.overflow_parallax');

					})
					.trigger('resize.overflow_parallax');

			}

		// Poptrox.
			$('.gallery').poptrox({
				useBodyOverflow: false,
				usePopupEasyClose: false,
				overlayColor: '#0a1919',
				overlayOpacity: (skel.vars.IEVersion < 9 ? 0 : 0.75),
				usePopupDefaultStyling: false,
				usePopupCaption: true,
				popupLoaderText: '',
				windowMargin: 10,
				usePopupNav: true
			});
      
      // Carousels.
      $('.carousel').each(function() {
          var    $t = $(this),
          $forward = $('<span class="forward"></span>'),
          $backward = $('<span class="backward"></span>'),
          $reel = $t.children('.reel'),
          $items = $reel.children('article');
          
          var    pos = 0,
          leftLimit,
          rightLimit,
          itemWidth,
          reelWidth,
          timerId;
          
          // Items.
          if (settings.carousels.fadeIn) {
          
          $items.addClass('loading');
          
          $t.onVisible(function() {
                       var    timerId,
                       limit = $items.length - Math.ceil($window.width() / itemWidth);
                       
                       timerId = window.setInterval(function() {
                                                    var x = $items.filter('.loading'), xf = x.first();
                                                    
                                                    if (x.length <= limit) {
                                                    
                                                    window.clearInterval(timerId);
                                                    $items.removeClass('loading');
                                                    return;
                                                    
                                                    }
                                                    
                                                    if (skel.vars.IEVersion < 10) {
                                                    
                                                    xf.fadeTo(750, 1.0);
                                                    window.setTimeout(function() {
                                                                      xf.removeClass('loading');
                                                                      }, 50);
                                                    
                                                    }
                                                    else
                                                    xf.removeClass('loading');
                                                    
                                                    }, settings.carousels.fadeDelay);
                       }, 50);
          }
          
          // Main.
          $t._update = function() {
          pos = 0;
          rightLimit = (-1 * reelWidth) + $window.width();
          leftLimit = 0;
          $t._updatePos();
          };
          
          if (skel.vars.IEVersion < 9)
          $t._updatePos = function() { $reel.css('left', pos); };
          else
          $t._updatePos = function() { $reel.css('transform', 'translate(' + pos + 'px, 0)'); };
          
          // Forward.
          $forward
          .appendTo($t)
          .hide()
          .mouseenter(function(e) {
                      timerId = window.setInterval(function() {
                                                   pos -= settings.carousels.speed;
                                                   
                                                   if (pos <= rightLimit)
                                                   {
                                                   window.clearInterval(timerId);
                                                   pos = rightLimit;
                                                   }
                                                   
                                                   $t._updatePos();
                                                   }, 10);
                      })
          .mouseleave(function(e) {
                      window.clearInterval(timerId);
                      });
          
          // Backward.
          $backward
          .appendTo($t)
          .hide()
          .mouseenter(function(e) {
                      timerId = window.setInterval(function() {
                                                   pos += settings.carousels.speed;
                                                   
                                                   if (pos >= leftLimit) {
                                                   
                                                   window.clearInterval(timerId);
                                                   pos = leftLimit;
                                                   
                                                   }
                                                   
                                                   $t._updatePos();
                                                   }, 10);
                      })
          .mouseleave(function(e) {
                      window.clearInterval(timerId);
                      });
          
          // Init.
          $window.load(function() {
                       reelWidth = $reel[0].scrollWidth;
                       skel.on('change', function() {
                               if (skel.vars.mobile) {
                               $reel
                               .css('overflow-y', 'hidden')
                               .css('overflow-x', 'scroll')
                               .scrollLeft(0);
                               $forward.hide();
                               $backward.hide();
        
                               }
                               else {
                               $reel
                               .css('overflow', 'visible')
                               .scrollLeft(0);
                               $forward.show();
                               $backward.show();

                               }
                               
                               $t._update();
                               
                               });
                       
                       $window.resize(function() {
                                      reelWidth = $reel[0].scrollWidth;
                                      $t._update();
                                      }).trigger('resize');
                       });
                          
                       
          });

	});

})(jQuery);
