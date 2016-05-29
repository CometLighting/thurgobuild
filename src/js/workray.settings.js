if(/dashboard\/settings/.test(window.location.href)){
	$('.labelling').on('click', function() {
		if($(this).hasClass('checked'))
			var label = true;
		else var label = false;
		$('#labels').prop('checked', label);
		$.get("/user/settings/labelmessages?label=" + label).done(function(data) {
			if(data) var $toastContent = "Thanks, we&#39;ll label your job related emails";
			else var $toastContent = "Thanks, we&#39;ll stop labelling your emails";
			workray.toast($toastContent, 4000, 'rounded');
		})
		.fail(function(err) {
			if(typeof console!=="undefined")console.error(err.responseText);
		});
	});
}
