dojo.ready(function() {
	var doc = document
		,body = doc.body
		,$ = dojo.query
		,dimTime = 10 * 1000
		,dimTimeout
		,hasLocalStorage = ('localStorage' in window) && window['localStorage'] !== null
		,prefsKey = "digitalClock.prefs"
		,prefs = loadPrefs({ theme: "green", hours: 12 });
		;
		
	function isTouch() {
		var el = doc.createElement('div');
		el.setAttribute('ongesturestart', 'return;');
		return typeof el.ongesturestart == "function";
	}
	
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
		$('.colon .element').toggleClass('on');
		$('.number').removeClass(["d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9"]);
		var now = new Date()
			,h = now.getHours()
			,m = now.getMinutes()
			,s = now.getSeconds()
			,n = $('.number')
			,hours = prefs.hours
			,ap = (h >= hours) ? "pm" : "am"
			;
		// If 12hr clock, adjust h for display, and set AM/PM
		if(hours == 12) {				
			h = (h == 0) ? 12 : (h > 12) ? h % 12 : h;
			$('.ampm').removeClass(["am", "pm"]).addClass(ap);
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
		prefs.theme = theme;
		savePrefs();
	}
	
	function setHours(hours) {
		$(body).removeClass(["hr12", "hr24"]).addClass('hr' + hours);
		prefs.hours = hours;
		savePrefs();
		updateTime();
	}

	setTheme(prefs.theme);
	setHours(prefs.hours);
	
	updateTime();
	setupDim();
	setInterval(updateTime, 1000);

	var events = isTouch() ? ["ontouchstart"] : ["onmousemove", "onclick"];	
	$(".clock").forEach(function(node) {
		for(var i=0; i<events.length; i++)
			dojo.connect(node, events[i], brighten);
	});
	
	$('.controls .dot').onclick(function(e) { setTheme(dojo.attr(this, "name")); });
	$('.controls .hours').onclick(function(e) { setHours(1*dojo.attr(this, "name")); });	
});
