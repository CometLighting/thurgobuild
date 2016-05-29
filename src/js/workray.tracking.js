workray.analytics = {};
workray.goSquared = {};
workray.goSquared.retryCount = 0;
workray.goSquared.loaded = $.Deferred();
workray.goSquared.Loaded = function() {
	workray.goSquared.retryCount++;
	if (window._gs) workray.goSquared.loaded.resolve();
	else if(workray.goSquared.retryCount<4) setTimeout("workray.goSquared.Loaded()", 500);
	else console.log("Failed to load tracking module or tracking disabled.");
};
// Check we have loaded GoSquared Javascript Tracker before attaching event handlers
workray.goSquared.Loaded();

$.when(workray.goSquared.loaded).done(function () {
	workray.goSquared.trackEvent = function(){
		if (window._gs) _gs(
			'event',
			$(this).data("interactionName"),
			$(this).data("interactionValues") ? $.parseJSON($(this).data("interactionValues")) : {}
		);
	};
	if(workray.newUser)
		if(window._gs) _gs( 'event', 'New Registration', {} );
	$('.interaction').on({
		"click.trackingGS": workray.goSquared.trackEvent,
		"submit.trackingGS": workray.goSquared.trackEvent
	});
});

workray.analytics.trackEvent = function(){
	if(typeof ga!=='undefined') ga(
		'send',
		'event',
		'Interaction',
		$(this).data("interactionName")
	);
};

if(workray.newUser)
	if(typeof ga!=='undefined') ga( 'send', 'event', 'Interaction', 'New Registration' );
$('.interaction').on({
	"click.trackingGA": workray.analytics.trackEvent,
	"submit.trackingGA": workray.analytics.trackEvent
});
