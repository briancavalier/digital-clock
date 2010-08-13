$(function() {
	var doc = document
		,body = doc.body
		,dimTime = 10 * 1000
		,dimTimeout
		,store = ('localStorage' in window) && window['localStorage'] !== null ? window.localStorage : null
		,fl = Math.floor
		;
		
	function getPref(name, defaultVal) {
		return store ? (store.getItem(name) || defaultVal) : defaultVal;
	}
	
	function setPref(name, value) {
		if(store) store.setItem(name, value);
	}

	function updateTime() {
		$('.colon .element').toggleClass('on');
		$('.digit').removeClass("d0 d1 d2 d3 d4 d5 d6 d7 d8 d9");
		var now = new Date()
			,h = now.getHours()
			,m = now.getMinutes()
			,s = now.getSeconds()
			,n = $('.digit')
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
		n.eq(0).addClass("d" + fl(h / 10)).end()
			.eq(1).addClass("d" + (h % 10)).end()
			.eq(2).addClass("d" + fl(m / 10)).end()
			.eq(3).addClass("d" + (m % 10)).end()
			.eq(4).addClass("d" + fl(s / 10)).end()
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
		$(body).removeClass($(".theme").map(function() { return this.name; }).toArray().join(" ")).addClass(theme);
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

    $('.controls .dot').click(function() { setTheme(this.name); });
    $('.controls .hours').click(function() { setHours(1*this.name); });	
});
