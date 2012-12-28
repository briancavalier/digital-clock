/*
(c) copyright 2010-2012, Brian Cavalier

LICENSE: see the LICENSE.txt file. If file is missing, this file is subject to the MIT
License at the following url: http://www.opensource.org/licenses/mit-license.php.
*/
$(function() {
	var doc, body, clock, digits, separator, ampm, themes, dimTime, dimTimeout, store, fl;

	doc = document;
	body = $(doc.body);

	// Cache selectors that won't change
	clock = $('.clock');
	digits = $('.digit');
	separator = $('.sep');
	ampm = $('.ampm');
	themes = $('.theme').map(function() { return this.name; }).toArray().join(' ');

	dimTime = 10 * 1000;
	store = ('localStorage' in window) && window['localStorage'] !== null ? window.localStorage : null;
	fl = Math.floor;

	// Set the initial theme and 12 vs. 24
	setTheme(getPref('theme', 'green'));
	setHours(getPref('hr', 12));

	// Run the clock
	updateTime();
	setupDim();
	setInterval(updateTime, 1000);

	// Un-dim the clock when the user is active
	clock.on('mousemove click', brighten);

	// Set the theme and 12/24 when the user selects them
	$('.controls .dot').click(function() { setTheme(this.name); });
	$('.controls .hours').click(function() { setHours(this.name); });

	function getPref(name, defaultVal) {
		return store ? (store.getItem(name) || defaultVal) : defaultVal;
	}

	function setPref(name, value) {
		if(store) store.setItem(name, value);
	}

	function updateTime() {
		var now, h, m, s, nowstr, tz, hours, ap;

		separator.toggleClass('on');

		now = new Date();
		h = now.getHours();
		m = now.getMinutes();
		s = now.getSeconds();
		nowstr = now.toString();
		tz = (nowstr.match(/\b([A-Z]{1,4}).$/) || ['']).pop();
		hours = getPref('hr', 12);
		ap = (h >= hours) ? 'pm' : 'am';

		clock.addClass('tz-' + tz.toLowerCase());

		// If 12hr clock, adjust h for display, and set AM/PM
		if(hours == 12) {
			h = (h === 0) ? 12 : (h > 12) ? h % 12 : h;
			ampm.removeClass('am pm').addClass(ap);
		}

		// Set all the digits
		digits.removeClass('d0 d1 d2 d3 d4 d5 d6 d7 d8 d9')
		.eq(0).addClass('d' + fl(h / 10)).end()
		.eq(1).addClass('d' + (h % 10)).end()
		.eq(2).addClass('d' + fl(m / 10)).end()
		.eq(3).addClass('d' + (m % 10)).end()
		.eq(4).addClass('d' + fl(s / 10)).end()
		.eq(5).addClass('d' + (s % 10));
	}

	function brighten() {
		body.removeClass('dim');
		setupDim();
		return true;
	}

	function dim() {
		body.addClass('dim');
	}

	function setupDim() {
		clearTimeout(dimTimeout);
		dimTimeout = setTimeout(dim, dimTime);
	}

	function setTheme(theme) {
		body.removeClass(themes).addClass(theme);
		$('.controls .dot.on').removeClass('on');
		$('.controls .dot.' + theme).addClass('on');
		setPref('theme', theme);
	}

	function setHours(hours) {
		clock.removeClass('hr12 hr24').addClass('hr' + hours);
		setPref('hr', hours);
		updateTime();
	}
});
