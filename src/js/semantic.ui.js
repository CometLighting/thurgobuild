if($(window).width()>990){
	$('.statistic').removeClass('large').addClass('huge');
}
(function($,sr){
	// Debouncing function from John Hann. http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function (func, threshold, execAsap) {
		var timeout;
		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if(!execAsap)
					func.apply(obj, args);
				timeout = null;
			};
			if(timeout)
				clearTimeout(timeout);
			else if(execAsap)
				func.apply(obj, args);
			timeout = setTimeout(delayed, threshold || 100);
		};
	}
	// smartresize
	jQuery.fn[sr] = function(fn){ return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
})(jQuery,'smartResize');
	$(window).smartResize(function(){
		if($('.ui.left.sidebar').sidebar('is visible'))
			$('.ui.left.sidebar').sidebar('hide');
		if($('.ui.right.sidebar').sidebar('is visible'))
			$('.ui.right.sidebar').sidebar('hide');
	});
(function($) {
	$('.ui.left.sidebar').sidebar('setting', 'transition', 'uncover').sidebar('attach events', '.toc.item');
	$('.ui.bottom.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('attach events', '.feedback').sidebar('attach events', '.feedback-close', 'hide');

	var popupCenter = function(url, title, w, h) {
		var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
		var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
		var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
		var left = ((width / 2) - (w / 2)) + dualScreenLeft;
		var top = ((height / 3) - (h / 3)) + dualScreenTop;
		var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
		if (newWindow && newWindow.focus) newWindow.focus();
	};
	$(document).on('click', '.popupWindow', {}, function popUp(e) {
		var self = $(this);
		popupCenter(self.attr('href'), self.attr('title'), 580, 470);
		e.preventDefault();
	});

	$('.ui.checkbox').checkbox();

	//Main Right Sidebar Feedback
	$('.feedback').one("click.loadForm", function () {
		$('#feedback .feedbackForm').html('<iframe src="https://docs.google.com/forms/d/1FlhjSF-w_Qslx-88CXAvklmSRE8dbwsPsBqK57qKwMc/viewform?embedded=true" width="100%" height="541" frameborder="0" marginheight="0" marginwidth="0">Loading&hellip;</iframe>');
	});

	$('.menuNav a').on('click', function () {
		$(this).parent().addClass("active");
		$(this).parent().siblings().removeClass("active");
	});

	$('.scrollspy').on('click', function () {
		$('#objective').velocity("scroll", { duration: 1000, easing: "ease-in-out" });
		return false;
	});

	$('#subscribe').on("submit", function (e) {
		e.preventDefault();
		if($("#email").val()=="") return $("#email").parent().addClass("error");
		var subscription = $(this).serialize();
		if($("#email").val().toLowerCase().match(/(\@gmail\.com)|(\@googlemail\.com)$/)) {
			window.location = "/login";
		} else {
			$.post("/subscribe", subscription)
				.done(function(data) {
					if(data.exists) var $toastContent = 'Thank you, you have already subscribed';
					else var $toastContent = 'Thank you for subscribing, we will keep you posted';
					workray.toast($toastContent, 4000, 'rounded');
				})
				.fail(function(err) {
					if(typeof console!=="undefined") console.error(err.responseText);
				});
		}
	});

	$('#gmailLogin').on('click', function (e) {
		e.preventDefault();
		setTimeout(function(){
			document.location.replace(window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/login');
		}, 200);
	});
})(jQuery);
