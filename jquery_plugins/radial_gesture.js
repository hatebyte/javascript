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
			if (Math.abs(vel) > 5) { 
				return (vel > 0) ? arr[0] : arr[1]; 
			}
			return null;
		},
		pinchInfo : function(point1, point2) {
			var angle						= _private.getPythagoreanAngle(point1, point2);
			//var dist 						= _private.getPythagoreanDist(point1, point2);
			//var pinch						= {};
			//pinch['distance'] 				= dist; 
			//pinch['percentage'] 			= dist/_private.pinch_init_distance;
			//pinch['angle'] 					= angle;
			//pinch['angleStart'] 			= _private.pinch_init_angle;
			//pinch['angleDifference'] 		= _private.pinch_init_angle - angle;
			
			var av			= _private.pinch_last_angle - angle;
			_private.pinch_last_angle 		= angle;
			return av;
		}
	}
	
	var _public = {
		init : function(options) {
			var that = this;
			var startX, startY, dx, dy, oldX, oldY, oldAngle = 0;
			var tapTimeout, directionX, directionY, isSwipe;
			var events = _private.setEvents(options.isPhone);
			that.data('events', events);

			var centerPoint = { pageX: (that.width() * .5) + that.offset().left,  pageY: (that.height() * .5) + that.offset().top }
			
			//$('#placer').css({"top":+centerPoint.pageY+"px", "left":centerPoint.pageX+"px"})
			
			$(document).bind("selectstart", function(e){
			  	e.preventDefault();
			});


			that.bind(events['start'], function(startevt){
			  	startevt.preventDefault();
				startevt.stopPropagation();
				// Swipe data
				//-------------------------------------------------/
				var startevent;
			    if (events['mobile']) {
			    	var touches = startevt.originalEvent.touches;
				    startevent = touches[0];
			    } else {
				    startevent = startevt;
			    }

				startevt["x"] = startevent.pageX;
				startevt["y"] = startevent.pageY;
				options.start( startevt );
				// _private.pinch_last_angle = 0;
				var lastevent;
			    that.bind(events['move'], function(moveevt){
				  	moveevt.preventDefault();
					moveevt.stopPropagation();
					// Swipe data
					//-------------------------------------------------/
					var moveevent;
					if (events['mobile']) {
						var touches = moveevt.changedTouches || moveevt.originalEvent.touches;
						moveevent = touches[0];
					} else {
						moveevent = moveevt;
					}
					
					var angle						= _private.getPythagoreanAngle(centerPoint, moveevent);
					moveevt['angleVelocity']		= oldAngle - angle;
					oldAngle 						= angle;
					//dx = event.pageX - startX;
					//dy = event.pageY - startY;
					lastevent = moveevent;
					options.move( moveevt );

					//endX = moveevent.pageX;
				}).bind(events['end'], function(endevt){
				  	endevt.preventDefault();
					endevt.stopPropagation();
					/*
					directionY = _private.getDirection(dy, ['up', 'down']);
					endevt['setpostive']				 = false;
					endevt['setnegative']				 = false;					
					if (endX < centerPoint.pageX) {
						if (directionY == 'up') endevt['setpostive'] = true;
						else  endevt['setnegative'] = true;
					}
					*/
					
					endevt["x"] = lastevent.pageX;
					endevt["y"] = lastevent.pageY;					
					
					options.end( endevt );
					
					//_private.pinch_last_angle = 0;
					
					$(this).unbind(events['move']);
					$(this).unbind(events['end']);

				});

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