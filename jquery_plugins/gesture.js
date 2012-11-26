(function($) {
	var _private = {
		pinch_last_angle : undefined,
		pinch_init_distance : undefined,
		pinch_init_angle : undefined,
		
		setEvents : function(isPhone) {
			return (isPhone) ? {
				start : 'touchstart',
				move : 'touchmove',
				end : 'touchend',
				mobile : isPhone
			} : {
				start : 'mousedown',
				move : 'mousemove',
				end : 'mouseup'
			}
		},
		getPythagoreanDist : function(point1, point2) {
			return Math.sqrt( ((point1.pageX - point2.pageX) * (point1.pageX - point2.pageX)) + ((point1.pageY - point2.pageY) * (point1.pageY - point2.pageY)) ).toFixed(3);
		},
		getPythagoreanAngle : function(point1, point2) { 
			return (Math.atan2(point2.pageY - point1.pageY, point2.pageX - point1.pageX) * (180 / Math.PI) ).toFixed(3);
		},
		getDirection : function(vel, arr) {
			if (Math.abs(vel) > 20) { 
				return (vel > 0) ? arr[0] : arr[1]; 
			}
			return null;
		},
		pinchInfo : function(point1, point2) {
			var angle						= _private.getPythagoreanAngle(point1, point2);
			var dist 						= _private.getPythagoreanDist(point1, point2);
			var pinch						= {};
			pinch['distance'] 				= dist; 
			pinch['percentage'] 			= dist/_private.pinch_init_distance;
			pinch['angle'] 					= angle;
			pinch['angleStart'] 			= _private.pinch_init_angle;
			pinch['angleDifference'] 		= _private.pinch_init_angle - angle;
			pinch['angleVelocity']			= _private.pinch_last_angle - angle;
			_private.pinch_last_angle 		= angle;
			return pinch;
		}
	}
	
	var _public = {
		init : function(options) {
			var that = this;
			var startX, startY, dx, dy, oldX, oldY, oldAngle = 0;
			var tapTimeout, directionX, directionY, isSwipe, isPinch;
			var delay = (options.doubleTap && options.doubleTap.delay) == null ? 300 : options.doubleTap.delay;
			var events = _private.setEvents(options.isPhone);
			that.data('events', events);
			
			$(document).bind("selectstart", function(e){
			  	e.preventDefault();
			});
			
			that.bind(events['start'], function(e){
			  	e.preventDefault();
				e.stopPropagation();
				isPinch = false;
				// Swipe data
				//-------------------------------------------------/
			    if (events['mobile']) {
			    	var touches = e.originalEvent.touches;
				    event = touches[0];
					// Pinch data
					//-------------------------------------------------/
				    if (touches.length == 2 && (typeof options.pinch == 'object' && typeof options.pinch.start == 'function')) {
						isPinch = true;
						_private.pinch_init_distance 	= _private.getPythagoreanDist(touches[0], touches[1]);
						_private.pinch_init_angle 		= _private.getPythagoreanAngle( touches[0], touches[1]);
						_private.pinch_last_angle 		= 0;
						e['pinch']						= _private.pinchInfo.call(that, touches[0], touches[1]);
						options.pinch.start( e );
				    }
			    } else {
				    event = e;
			    }
			    startX = event.pageX;
			    startY = event.pageY;
			
			}).bind(events['move'], function(e){
				  	e.preventDefault();
					e.stopPropagation();
					// Swipe data
					//-------------------------------------------------/
					if (events['mobile']) {
						var touches = e.originalEvent.touches || e.originalEvent.changedTouches;
						event = touches[0];
						// Pinch data
						//-------------------------------------------------/
						if (touches.length == 2 && (typeof options.pinch == 'object' && typeof options.pinch.move == 'function')) {
							e['pinch']						= _private.pinchInfo.call(that, touches[0], touches[1]);
							options.pinch.move( e );
							return;
						} 
					} else {
						event = e;
					}
					dx = event.pageX - startX;
					dy = event.pageY - startY;
					
					if (typeof options.swipe.move == 'function') {
						var angle						= _private.getPythagoreanAngle(event, {pageX:startX, pageY:startY});
						e['distance']					= _private.getPythagoreanDist(event, {pageX:oldX, pageY:oldY});
						e['angle']						= oldAngle - angle;
						options.swipe.move(e);
						oldX = event.pageX;
						oldY = event.pageY;
						oldAngle = angle;
					}
				}).bind(events['end'], function(e){
				  	e.preventDefault();
					e.stopPropagation();
					
					//that.unbind(events['move']);
					//that.unbind(events['end']);
					// Pinch data
					//-------------------------------------------------/
					if (isPinch && (typeof options.pinch == 'object' && typeof options.pinch.end == 'function')) { 
						isPinch = false;
						_private.pinch_init_angle = 0;
						_private.pinch_init_distance = 0;
						options.pinch.end(e);
						return; 
					}
					// Swipe data
					//-------------------------------------------------/
					if ( typeof options.swipe.end == 'function' ) { 
						directionX = _private.getDirection(dx, ['left', 'right']);
						directionY = _private.getDirection(dy, ['up', 'down']);
						if (directionX != null || directionY != null) {
							e['x'] = directionX; 
							e['y'] = directionY;
							options.swipe.end(e);
							dx = dy= directionX = directionY = undefined;
							return;
						}
					}
					// Tap data
					//-------------------------------------------------/
					clearTimeout(tapTimeout);
					var firstTapTime = new Date().getTime(); 
					var lastTouch = that.data('last_end') || firstTapTime;
					var interval = firstTapTime - lastTouch;
					if (interval < delay && interval > 0) {
						if(options.doubleTap && typeof options.doubleTap.success == 'function'){
							options.doubleTap.success(e);
						}
					} else {
						that.data('last_end', firstTapTime);		
						tapTimeout = setTimeout(function(evt) {
							if(typeof options.singleTap == 'function'){
								options.singleTap(evt);
							}
							clearTimeout(tapTimeout);
						}, delay, [e]);
					}
					that.data('last_end', firstTapTime); // sets up after first tap
				});



			return this;
		},
		stop : function() {
			var events = this.data('events');
			$(document).unbind("selectstart");
			this.unbind(events['start']);
			this.unbind(events['move']);
			this.unbind(events['end']);
			this.data('last_end', null);
			this.data('pinch_init_distance', null);
			this.data('pinch_init_angle', null);
			return this;
		}
	}
	
	$.fn.gesture = function(method) {
	    if (method == 'stop') {
	      return _public.stop.apply(this);
	    } else if (typeof method === 'object') {
	      return _public.init.apply(this, arguments);
	    } else {
	      $.error('Method ' +  method + ' does not exist on jQuery.gesture');
	    }    
	}
})(jQuery);