dojo.ready(function() {
	var dimTime = 10 * 1000
		,dimTimeout
		,hasLocalStorage = ('localStorage' in window) && window['localStorage'] !== null
		,prefsKey = "digitalClock.prefs"
		,prefs = loadPrefs({ theme: "green", hours: 12 });
		;

	function loadPrefs(defaults) {
		var p;
		if(hasLocalStorage) p = window.localStorage.getItem(prefsKey);
		return p ? dojo.fromJson(p) : defaults;
	}

	function savePrefs() {
		if(hasLocalStorage)
			window.localStorage.setItem(prefsKey, dojo.toJson(prefs));
	}

	function updateTime() {
		dojo.query('.colon .element').toggleClass('on');
		dojo.query('.number').removeClass(["d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9"]);
		var now = new Date()
			,h = now.getHours()
			,m = now.getMinutes()
			,s = now.getSeconds()
			,n = dojo.query('.number')
			,hours = prefs.hours
			,ap = (h >= hours) ? "pm" : "am"
			;
		// If 12hr clock, adjust h for display, and set AM/PM
		if(hours == 12) {				
			h = (h == 0) ? 12 : (h > 12) ? h % 12 : h;
			dojo.query('.ampm').removeClass(["am", "pm"]).addClass(ap);
		}

		// Javascript Pittsburgh-ese .. n.at :)
		// Set all the digits
		n.at(0).addClass("d" + Math.floor(h / 10)).end()
			.at(1).addClass("d" + (h % 10)).end()
			.at(2).addClass("d" + Math.floor(m / 10)).end()
			.at(3).addClass("d" + (m % 10)).end()
			.at(4).addClass("d" + Math.floor(s / 10)).end()
			.at(5).addClass("d" + (s % 10));
	}
			
	function brighten() {
		dojo.query(document.body).removeClass("dim");
		setupDim();
	}
	
	function dim() {
		dojo.query(document.body).addClass("dim");			
	}
	
	function setupDim() {
		clearTimeout(dimTimeout);
		dimTimeout = setTimeout(dim, dimTime);
	}
	
	function setTheme(theme) {
		dojo.query(document.body).removeClass(["green", "blue", "red", "lcd1"]).addClass(theme);
		dojo.query('.controls .dot.on').removeClass('on');
		dojo.query('.controls .dot.' + theme).addClass('on');
		prefs.theme = theme;
		savePrefs();
	}
	
	function setHours(hours) {
		dojo.query(document.body).removeClass(["hr12", "hr24"]).addClass('hr' + hours);
		prefs.hours = hours;
		savePrefs();
		updateTime();
	}

	setTheme(prefs.theme);
	setHours(prefs.hours);
	
	updateTime();
	setupDim();
	setInterval(updateTime, 1000);
	dojo.query(document.body).onmousemove(brighten).onclick(brighten);
	
	dojo.query('.controls .dot').onclick(function(e) { setTheme(dojo.attr(this, "name")); });
	dojo.query('.controls .hours').onclick(function(e) { setHours(1*dojo.attr(this, "name")); });	
});
