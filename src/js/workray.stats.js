workray.postStats = function () {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST','/stats/timer', false);
	xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	var timeSpentOnPage = parseInt(TimeMe.getTimeOnCurrentPageInSeconds(), 10);
	var timeOnSite = parseInt(workray.stats.allTime.timeOnline, 10);
	var updatedTimeOnSite = timeOnSite + timeSpentOnPage;
	xmlhttp.send('{"timeOnline":"' + updatedTimeOnSite + '"}');
	workray.stats.allTime.timeOnline = updatedTimeOnSite;
}

workray.updateStats = function (page) {
	TimeMe.stopTimer();
	workray.postStats();
	TimeMe.setCurrentPageName(page);
	TimeMe.startTimer();
}

if (/dashboard/.test(window.location.href)){
	if (typeof window.TimeMe!=='undefined'){
		TimeMe.setIdleDurationInSeconds(30);
		if(/dashboard\/jobs/.test(window.location.href))
			TimeMe.setCurrentPageName('dashboard-jobs');
		else if(/dashboard\/applications/.test(window.location.href))
			TimeMe.setCurrentPageName('dashboard-applications');
		else if(/dashboard\/interviews/.test(window.location.href))
			TimeMe.setCurrentPageName('dashboard-interviews');
		else TimeMe.setCurrentPageName('dashboard');
		TimeMe.initialize();

		window.onbeforeunload = function (event) {
			workray.postStats();
		};
	}
	$.get('/stats', function (data) {
		workray.stats = data;
		var timeOnline = moment(new Date()).subtract(parseInt(workray.stats.allTime.timeOnline, 10), 's').fromNow(true);
		$('.timeOnline').html(timeOnline);
		$('.emailsRead').html(workray.stats.lastUpdate.emailsProcessed);
		$('.jobsRead').html(workray.stats.lastUpdate.jobsProcessed);
	});
}
