function SlideShow(obj) {
	this.container					= $('#slideshow');
	this.interval					= obj['interval'];
	this.isMobile					= obj['isMobile'];
	this.isIphone					= obj['isIphone'];
	this.imgs 						= obj['images'];
	this.path 						= obj['path'];
	this.iterator					= new Iterator(this.imgs);
	this.init();
}

SlideShow.prototype = {
	
	init : function() {
		this.container.empty();
		this.animation				= 0;
		this.load();
		this.update();
		this.resize();
	},
	
	load : function() {
		var that					= this;
		this.nextimg				= $(new Image());
		this.nextimg.attr({'src':this.path+this.iterator.next()});
		this.nextimg.width(this.container.width());
		this.nextimg.height(this.container.height());
		this.nextimg.appendTo(this.container);
		
		if (!this.iterator.hasNext()) {
			this.iterator.reset();		
		}
	},
	
	update : function() {
		if (this.isPaused) return;
		var that					= this;
		this.nextimg.fadeIn(this.animation, function() {
			that.animation 			= 1000;
			if (that.currentimg != null) that.currentimg.remove();
			that.currentimg 			= that.nextimg;
			that.load(); 
			this.timeout				= setTimeout(function() {
				that.update();
			}, that.interval);
		});
	},
	
	resize : function() {
		var w = this.container.parent().width();
		if (!this.isMobile) {
			w =(w < 960) ? 960 : w;
			this.container.width(w);
			this.container.height(w * .625);
		} else {
			this.container.parent().height(w * .625);
			var h = this.container.parent().height();
			this.container.width(h / .625);
			this.container.height(h);
		}
		
		$(this.nextimg).width(this.container.width());
		$(this.nextimg).height(this.container.height());
		$(this.currentimg).width(this.container.width());
		$(this.currentimg).height(this.container.height());
		
		var offX = (this.container.parent().width() - this.container.width()) * .5;
		var offY = (this.container.parent().height() - this.container.height()) * .5;
		this.container.css({'top':offY+'px', 'left':offX+'px'});
	},
	
	// user controls
	stop : function() {
		this.isPaused 				= true;
		clearTimeout(this.timeout);
	},
	
	resume : function() {
		this.isPaused 				= false;
		this.update();
	},
	
	toggle : function() {
		if (this.isPaused) this.resume();
		else this.stop();
	}
	
	
	
}