window.hatebyte = {}
window.hatebyte.DOMdetector = {};
window.hatebyte.DOMdetector = (function() {
  
	var uniqueInstance;
	
	function DOMdetectorConstructor() {
		
		MSIE													= 'MSIE';
		SAFARI													= 'Safari';
		ANDROID_BROWSER											= 'Android_Browser';
		CHROME													= 'Chrome';
		FIREFOX													= 'Firefox';
		OPERA													= 'Opera';
		
		COMPUTER												= 'computer';
		MOBILE_DEVICE											= 'mobile_device';
		WINDOWS													= 'windows';
		MACINTOSH												= 'macintosh';
		
		IPAD													= 'ipad';
		IPHONE													= 'iphone';
		IPOD													= 'ipod';
		ANDROID													= 'Android';
		WINDOWSPHONE											= 'Windowsphone';
		WEBOS													= 'webOS';
		this.data												= {};
		this.data.interaction									= {};
		this.data.device										= '';
		this.data.os											= '';
		this.data.osversion										= '';
		this.data.browser										= '';
		this.data.browserversion								= '';
		
		this.useragentString									= navigator.userAgent;
		
		function getDevice() {
			if (this.useragentString.match(/Mobile/i)) {
				if ( this.useragentString.match(/iPad/i)) {
					this.data.device							= IPAD;
				} else if ( this.useragentString.match(/iPhone/i)) {
					this.data.device							= IPHONE;
				} else if ( this.useragentString.match(/iPod/i)) {
					this.data.device							= IPOD;
				} else if ( this.useragentString.match(/Android/i)) {
					this.data.device							= ANDROID;
				} else if ( this.useragentString.match(/Windows Phone/i)) {
					this.data.device							= WINDOWSPHONE;
				}
				this.data.os									= MOBILE_DEVICE;
			} else {
				this.data.device								= COMPUTER;
				this.data.os									=(this.useragentString.match(/Macintosh/i)) ? MACINTOSH : WINDOWS;  
			}
			
			var interaction = this.data.interaction;
			switch (this.data.device) {
				case IPAD:
				case IPHONE:
				case IPOD:
				case ANDROID:
				case WINDOWSPHONE:
					interaction.down						= 'touchstart';
					interaction.up							= 'touchend';
					interaction.move						= 'touchmove';
					interaction.click						= 'touchend';
					break
				
				default:
					interaction.down						= 'mousedown';
					interaction.up							= 'mouseup';
					interaction.move						= 'mousemove';
					interaction.click						= 'click';
					break;
			}
		}
		
		function getBrowser() {
			if (this.data.device == ANDROID) {
				this.data.browser							= ANDROID_BROWSER;
				this.data.browserversion					= getVersionNumber(this.useragentString, /Version\/([\d._]{0,})/, 1);
			} else if( /Chrome[\/\s](\d+\.\d+)/.test(this.useragentString) ) {
				this.data.browser							= CHROME;
				this.data.browserversion					= getVersionNumber(this.useragentString, /Chrome\/([\d._]{0,})/, 1);
			} else if( /Firefox[\/\s](\d+\.\d+)/.test(this.useragentString) ) {
				this.data.browser							= FIREFOX;
				this.data.browserversion					= getVersionNumber(this.useragentString, /Firefox\/([\d._]{0,})/, 1);
			} else if( /Safari[\/\s](\d+\.\d+)/.test(this.useragentString) ) {
				this.data.browser							= SAFARI;
				this.data.browserversion					= getVersionNumber(this.useragentString, /Version\/([\d._]{0,})/, 1);
			} else if( /MSIE (\d+\.\d+);/.test(this.useragentString) ) {
				this.data.browser							= MSIE;
				this.data.browserversion					= getVersionNumber(this.useragentString, /MSIE ([\d._]{0,})/, 1);
			} else if( /Opera[\/\s](\d+\.\d+)/.test(this.useragentString) ) {
				this.data.browser							= Opera;
			}
		}
		
		function getOS() {
			if (this.data.device == COMPUTER) {
				this.data.osversion = getVersionNumber(this.useragentString, /((OS X |Windows NT )([\d._]{0,}))/, 3);
				if (this.data.os == WINDOWS) {
					switch (this.data.osversion) {
						case '5.1':
							this.data.osversion = 'XP';
							break;
						case '6.0':
							this.data.osversion = 'Vista';
							break;
						case '6.1':
							this.data.osversion = '7';
							break;
					} 	
				}
			} else {
				this.data.osversion = getVersionNumber(this.useragentString, /((OS |Android )([\d._]{0,}))/, 3);
			}
		}
		
		function getVersionNumber(agentString, versionRegEx, index) {
      		if (versionRegEx.exec(agentString) != null) {
      			var expArray = versionRegEx.exec(agentString)
      			return expArray[index];
      		} 
      		return null;
		}

		getDevice.call(this);
		getBrowser.call(this);
		getOS.call(this);
		
	}	
	
	return {
		getInstance : function() {
			if (!uniqueInstance) { 
				uniqueInstance = new DOMdetectorConstructor();
			}
			return uniqueInstance.data;
		}
	}
		
})();
