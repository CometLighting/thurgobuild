if(/dashboard(|#|\/#|\/)$/.test(window.location.href)
	&& (workray.localStorage && sessionStorage.getItem('hideNotifications')==null)){

	workray.dashboard.notificationCoachModel = {
		retrieved: ko.observable(false)
	};
	workray.dashboard.notificationCoachModel.notifications = ko.observableArray([]);
	workray.dashboard.trackNotification = function (interactionName, eventName){
		var clickInteraction = eventName + ' ' + interactionName;
		if(window._gs) _gs('event', clickInteraction, {});
		if(typeof ga!=='undefined') ga('send', 'event', 'Interaction', clickInteraction);
	};

	workray.dashboard.notificationsList = function (){
		var self = this;
		self.lines = workray.dashboard.notificationCoachModel.notifications;

		self.openCTA = function (notification) {
			var notificationId = '#' + notification.notificationId;
			$(notificationId).click();
			if ($(notificationId).attr('target') === '_blank'){
				var newTab = window.open('', 'newTab');
				newTab.location.href = $(notificationId).attr('href');
			} else {
				window.location.href = $(notificationId).attr('href');
			}
		};

		self.clickCTA = function (notification){
			workray.dashboard.trackNotification(notification.interactionName, 'Click');
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('DELETE', '/api/notifications/'+ notification.notificationId, false);
			xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			xmlhttp.send(null);
			sessionStorage.setItem('hideNotifications', '1');
			workray.dashboard.notificationCoachModel.retrieved(false);
			return true;
		};
	};

	workray.dashboard.removeNotification = function (notification){
		workray.dashboard.trackNotification(notification.interactionName, 'Hide');
		$.ajax({
			url: '/api/notifications/'+ notification.notificationId,
			type: 'DELETE',
			success: function() {
				sessionStorage.setItem('hideNotifications', '1');
				workray.dashboard.notificationCoachModel.retrieved(false);
			}
		});
	};

	workray.dashboard.getNotifications = function (){
		$.get("/api/notifications").done(function (data){
			workray.dashboard.notificationCoachModel.notifications(data);
			workray.dashboard.notificationCoachModel.retrieved(true);
			if (data.length){
				var displayInteraction = 'Display ' + data[0].interactionName;
				if(window._gs) _gs('event', displayInteraction, {});
				if(typeof ga!=='undefined') ga('send', 'event', 'Interaction', displayInteraction);
			}
		}).fail(function (status){
			var response = JSON.parse(status.responseText);
			workray.dashboard.errorHandler(response);
		});
	};

	ko.applyBindings({ notifications: new workray.dashboard.notificationsList()}, document.getElementById("notificationCoach"));
	workray.dashboard.getNotifications();

}
