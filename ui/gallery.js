function _Gallery(obj) {
	this.imgArray					= $('.galleryContent div');
	this.iterator					= new Iterator(this.imgArray);
	this.gallery					= $('#gallery');
	this.startPath					= obj['path'];
	this.isIphone					= obj['isIphone'];
	
	this.init();
}


_Gallery.prototype = {
		
	init : function() {
		var that 					= this;
		this.setDimensions();
		var width					= this.dimensions.img.width;
		var height					= this.dimensions.img.height;
		
		// add container and images
		this.gallery.css({'width':this.dimensions.width + 'px', 'height':this.dimensions.height + 'px'});	
		var action 					=(this.isIphone) ? 'tap' : 'click';
		this.directions  			= $('<div/>').attr({'class':'directions'}).text('Double '+action+' to close').appendTo(this.gallery);
		this.container 				= $('<div/>').attr({'class':'container'}).appendTo(this.gallery);

		this.iterator.each(function(data) {
			var block 				= $('<div/>', {'class':'block'}).appendTo(that.container);
			var imgHolder 			= $('<div/>', {'class':'imgHolder'}).appendTo(block);
			var img 				= $('<img/>').appendTo(imgHolder);
		});
		
		// add controls
		this.leftButton = $('<div/>', {'id':'leftButton', 'class':'button arrow-left'}).appendTo(this.gallery).hide();
		this.rightButton = $('<div/>', {'id':'rightButton', 'class':'button arrow-right'}).appendTo(this.gallery).hide();
		
		this.addHandlers();
	},
		
	open : function(index) {
		this.loadNext(index-1);
		this.loadNext(index);
		this.loadNext(index+1);
		this.iterator.index = index;
		this.move(index, true);
		this.gallery.fadeIn();
		this.resize();
		
		var that = this;
		this.gallery.gesture({
			swipe 					: function(e) { that.swipeHandler(e); },
			//singleTap 			: function(e) { },
			doubleTap 				: {
				delay					: 250,
				success		 			: function(e) {
					that.doubleTapHandler(e); 
 				}
			},
			isPhone 				: this.isIphone
		});
	},
	
	doubleTapHandler : function(e) {
		if (e.target.className == "button arrow-right") return;
		this.close();  
	},
	
	swipeHandler : function(e) {
		if (e.x != null) {
			if (e.x == "left") this.previous();
			else this.next();
		}
	},
	
	close : function() {
		this.gallery.gesture('stop');
		this.gallery.fadeOut();
	},
	
	loadNext : function(index) {
		if (index >= this.imgArray.length || index < 0) return;
		var that = this;
		var pageDiv = this.imgArray[index];
		var img = $(pageDiv).children(':first-child');
		var src = img.data('large');
		var blockDiv = $(this.container.children('div')[index]);
		var imgHolder = blockDiv.children(':first-child');
		var currImage = imgHolder.children(':first-child');

		currImage[0].src = this.startPath+src;
		this.centerImage($(pageDiv), blockDiv, imgHolder);
	},	

	addHandlers : function() {
		var that = this;
		this.leftButton.bind('click', function() { that.showButtons(); that.previous(); });
		this.rightButton.bind('click', function() { that.showButtons(); that.next(); });
		if (!this.isIphone) { this.gallery.bind('click', function(e) { that.galleryClickHandler(e); }); }
	},
	
	showButtons : function() {
		this.leftButton.show();
		this.rightButton.show();
	},
	
	galleryClickHandler : function(e) {
		if ($(e.target).hasClass('container') || $(e.target).hasClass('block')) this.close();
	},
	
	setDimensions : function() {
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		var scale = .8;
		
		if (this.isIphone) {
			windowHeight += 60;
		}
		this.dimensions = {
			width : windowWidth,
			height : windowHeight,
			img : {
				width : windowWidth * scale,
				height : windowHeight * scale,
			}
		} 		
		this.dimensions.img.paddingleft =  (this.dimensions.width - this.dimensions.img.width) * .5,
		this.dimensions.img.paddingtop = (this.dimensions.height - this.dimensions.img.height) * .5
	},
	
	next : function() {
		if (!this.iterator.hasNext()) return;

		var img = this.iterator.next();
		this.move(this.iterator.index);
		this.loadNext(this.iterator.index+1);
		
		if (!this.iterator.hasNext()) {
			this.rightButton.hide();
			return;
		}
	}, 
	
	previous : function() {
		if (!this.iterator.hasPrevious()) return;

		var img = this.iterator.previous();
		this.move(this.iterator.index);
		
		if (!this.iterator.hasPrevious()) {
			this.leftButton.hide();
			return; 
		} else this.loadNext(this.iterator.index-1);
	},
	
	move : function(index, tweenOff) {
		if (!this.isIphone) {
			this.showButtons()		
			if (index == 0)	this.leftButton.hide();
			if (index == this.imgArray.length-1) this.rightButton.hide();
		}
	
		var offset = -index * (this.dimensions.img.width + this.dimensions.img.paddingleft);
		if (tweenOff) {
			this.container.css({'left':offset+'px'});
		} else {
			this.container.stop().animate({'left':offset+'px'}, 500);
		}
	},
	
	resize : function() {
		this.setDimensions();
		var imgWidth					= this.dimensions.img.width;
		var imgHeight					= this.dimensions.img.height;
		var that 						= this;
		
		this.gallery.css({'width':this.dimensions.width + 'px', 'height':this.dimensions.height + 'px'});	
		this.container 				= this.container.css({
			'width': ((this.dimensions.img.width + this.dimensions.img.paddingleft) * this.iterator.length()) + this.dimensions.img.paddingleft,
			'height': this.dimensions.height,
		});

		var block = this.container.children('div.block');
		block.each(function(index) {
			$(this).css({
				'width':imgWidth+'px',
				'height':imgHeight+'px',
				'margin': that.dimensions.img.paddingtop + 'px 0 0 ' + that.dimensions.img.paddingleft + 'px'
			});
			var fromTemplate = $(that.imgArray[index]);
			var imgHolder = $(this).children(':first-child');
			that.centerImage(fromTemplate, $(this), imgHolder);			
		});
		
		var h = (this.dimensions.height - 50)* .5;
		this.leftButton.css({'top':h+'px'});
		this.rightButton.css({'top':h+'px'});

		if ( arguments.length == 0 ) this.move(this.iterator.index, true);
	},
	
	centerImage : function(pageDiv, blockDiv, imgDiv) {
		var w, h, scale;		
		scale = blockDiv.height() / pageDiv.height();
		imgDiv.width(pageDiv.width() * scale);
		imgDiv.height(pageDiv.height() * scale);
		var buffer = (blockDiv.width() - imgDiv.width()) * .5;
		imgDiv.css({'left':buffer+'px'});
	},
	
}

window.Gallery = function(args) {
	return new _Gallery(args);
}
