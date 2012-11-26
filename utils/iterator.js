function _Iterator(args) {
	this.index						= 0;
	this.collection 				= args[0];
}

_Iterator.prototype = {

	next: function() {
		var i 						= this.index;
		this.index++;
		return this.collection[i];
	},
	
	previous: function() {
		var i 						= this.index;
		this.index--;
		return this.collection[i];
	},
		
	hasNext: function() {
		return (this.index < this.collection.length-1);
	},
	
	hasPrevious: function() {
		return (this.index > 0);
	},
	
	each: function(fn) {
		for (var i = 0, len = this.collection.length; i < len; i++) {
			fn.call(this, this.collection[i], i);
		}
	},
	
	length : function() {
		return this.collection.length;
	},
	
	reset : function() {
		this.index 					= 0;
	},
		
	randomize: function() {      
		this.collection.sort(this.randomSort);
		this.index 					= 0;
	},
	
	randomSort: function(a, b) {
		var temp 					= parseInt(Math.random() * 10);	// Get a random number between 0 and 10
		var isOddOrEven 			= temp % 2;						// Get 1 or 0, whether temp is odd or even
		var isPosOrNeg 				= temp > 5 ? 1 : -1;			// Get +1 or -1, whether temp greater or smaller than 5
		return (isOddOrEven * isPosOrNeg);							// Return -1, 0, or +1
	},
	
	getRandom: function() {
		var index 					= parseInt(Math.random() * this.collection.length);
		return this.collection[index];
	}

};

window.Iterator = function() {
	return new _Iterator(arguments);
}
