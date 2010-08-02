$(function() {
	var doc = document
		,body = doc.body
		,dimTime = 10 * 1000
		,dimTimeout
		,store = ('localStorage' in window) && window['localStorage'] !== null ? window.localStorage : null
		;
		
	function getPref(name, defaultVal) {
		var p;
		if(store) p = store.getItem(name);
		return p ? p : defaultVal;
	}
	
	function setPref(name, value) {
		if(store) store.setItem(name, value);
	}
		
	function loadPrefs(defaults) {
		return defaults;
		// var p;
		// if(store) p = store.getItem(prefsKey);
		// return p ? $.parseJSON(p) : defaults;
	}

	function savePrefs() {
		// if(store)
		// 	store.setItem(prefsKey, (prefs));
	}

	function updateTime() {
		$('.colon .element').toggleClass('on');
		$('.number').removeClass("d0 d1 d2 d3 d4 d5 d6 d7 d8 d9");
		var now = new Date()
			,h = now.getHours()
			,m = now.getMinutes()
			,s = now.getSeconds()
			,n = $('.number')
			,hours = getPref("hr", 12)
			,ap = (h >= hours) ? "pm" : "am"
			;
		// If 12hr clock, adjust h for display, and set AM/PM
		if(hours == 12) {				
			h = (h == 0) ? 12 : (h > 12) ? h % 12 : h;
			$('.ampm').removeClass("am pm").addClass(ap);
		}

		// Javascript Pittsburgh-ese .. n.at :)
		// Set all the digits
		n.eq(0).addClass("d" + Math.floor(h / 10)).end()
			.eq(1).addClass("d" + (h % 10)).end()
			.eq(2).addClass("d" + Math.floor(m / 10)).end()
			.eq(3).addClass("d" + (m % 10)).end()
			.eq(4).addClass("d" + Math.floor(s / 10)).end()
			.eq(5).addClass("d" + (s % 10));
	}
			
	function brighten() {
		$(body).removeClass("dim");
		setupDim();
		return true;
	}
	
	function dim() {
		$(body).addClass("dim");			
	}
	
	function setupDim() {
		clearTimeout(dimTimeout);
		dimTimeout = setTimeout(dim, dimTime);
	}
	
	function setTheme(theme) {
		$(body).removeClass($(".theme").map(function(t) { return t.name; })).addClass(theme);
		$('.controls .dot.on').removeClass('on');
		$('.controls .dot.' + theme).addClass('on');
		setPref("theme", theme);
	}
	
	function setHours(hours) {
		$(body).removeClass("hr12 hr24").addClass('hr' + hours);
		setPref("hr", hours);
		updateTime();
	}

	setTheme(getPref("theme", "green"));
	setHours(getPref("hr", 12));
	
	updateTime();
	setupDim();
	setInterval(updateTime, 1000);

	$(body).mousemove(brighten).click(brighten);

	$('.controls .dot').click(function(e) { setTheme(this.name); });
	$('.controls .hours').click(function(e) { setHours(1*this.name); });	
});
