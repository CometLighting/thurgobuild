if (/dashboard/.test(window.location.href)){
	workray.dashboard.daysback = parseInt($('#daysbackToggle .active').data('daysback'), 10) || 1;
	workray.dashboard.jobBoards = $("body").data("boards"); // "totaljobs,jobsite,indeed,linkedin,reed,jobserve,cvlibrary,careerbuilder,dice"
	workray.dashboard.usBoards = $('.inactive[data-job-board="careerbuilder"],.inactive[data-job-board="dice"],.interaction[data-interaction-name="Subscribe Dice"],.interaction[data-interaction-name="Subscribe Careerbuilder"],#moreJobSites .careerbuilder,#moreJobSites .dice,#yourJobSites .careerbuilder,#yourJobSites .dice');

	workray.dashboard.interactionName = function (string) {
		return string.capitalizeFirstLetter();
	};
	workray.dashboard.iconLink = function (jobBoard){
		return '<img class="ui tiny circular image" src="' + workray.assetBase + '/images/icons/' + jobBoard + '.png" alt="' + jobBoard.capitalizeFirstLetter() + '" />';
	};
	workray.dashboard.humanDate = function (date){
		return new Date(parseInt(date, 10)).toDateString();
	};
	workray.dashboard.salaryIcon = function (jobBoard){
		return (jobBoard=="careerbuilder" || jobBoard=="dice") ? 'grey dollar icon' : 'grey pound icon';
	};
	workray.dashboard.salaryFix = function (string){
		return string.replace('&#xA3;', '&pound;');
	};
	workray.dashboard.aposFix = function (string){
		return string.replace('&amp;#39;', '&#39;');
	};
	workray.dashboard.errorHandler = function (resp){
		if(resp.error=="Missing required parameter: refresh_token")
			window.location = "/auth/google/force";
	};

	// Declare Models for different Email templates
	workray.dashboard.topJobModel = {
		retrieving: /dashboard(|#|\/#|\/)$/.test(window.location.href) ? ko.observable(true) : ko.observable(false),
		topJobsView: /dashboard(|#|\/#|\/)$/.test(window.location.href) ? ko.observable(true) : ko.observable(false)
	};
	workray.dashboard.topJobModel.topJobs = ko.observableArray([]);
	workray.dashboard.topJobsList = function (body) {
		var self = this;
		self.lines = workray.dashboard.topJobModel.topJobs;
		self.openJobLink = function(topJob){
			var interactionName = topJob.jobBoard + " Job Link",
				interactionValue =	{
										jobTitle: topJob.title,
										jobBoard: workray.dashboard.interactionName(topJob.jobBoard),
										jobSalary: workray.dashboard.salaryFix(topJob.salary),
										jobCompany: topJob.company,
										jobLocation: topJob.location,
										jobType: topJob.type
									};
			if(window._gs) _gs('event', interactionName, interactionValue);
			if(typeof ga!=='undefined') ga('send', 'event', 'Interaction', interactionName);
			workray.dashboard.updateJobViews(interactionValue.jobBoard);
			if (workray.userAgent.match(/iPhone|iPad|iPod/i))
				location.href = topJob.link;
			else
				window.open(topJob.link, '_blank');
		};
	};
	workray.dashboard.jobModel = {
		retrieving: /dashboard\/jobs/.test(window.location.href) ? ko.observable(true) : ko.observable(false),
		jobsView: /dashboard\/jobs/.test(window.location.href) ? ko.observable(true) : ko.observable(false)
	};
	workray.dashboard.jobModel.jobs = ko.observableArray([]);
	workray.dashboard.jobsList = function (body) {
		var self = this;
		self.lines = workray.dashboard.jobModel.jobs;
		self.openJobLink = function(job){
			var interactionName = job.jobBoard + " Job Link",
				interactionValue =	{
										jobTitle: job.title,
										jobBoard: workray.dashboard.interactionName(job.jobBoard),
										jobSalary: workray.dashboard.salaryFix(job.salary),
										jobCompany: job.company,
										jobLocation: job.location,
										jobType: job.type
									};
			if(window._gs) _gs('event', interactionName, interactionValue);
			if(typeof ga!=='undefined') ga('send', 'event', 'Interaction', interactionName);
			workray.dashboard.updateJobViews(interactionValue.jobBoard);
			if (workray.userAgent.match(/iPhone|iPad|iPod/i))
				location.href = job.link;
			else
				window.open(job.link, '_blank');
		};
	};
	workray.dashboard.applicationModel = {
		retrieving: /dashboard\/applications/.test(window.location.href) ? ko.observable(true) : ko.observable(false),
		appsView: /dashboard\/applications/.test(window.location.href) ? ko.observable(true) : ko.observable(false)
	};
	workray.dashboard.applicationModel.applications = ko.observableArray([]);
	workray.dashboard.applicationsList = function (body) {
		var self = this;
		self.lines = workray.dashboard.applicationModel.applications;
		self.openAppLink = function(application){
			var interactionName = application.jobBoard + " Application Link",
				interactionValue =	{
										jobTitle: application.title,
										jobBoard: workray.dashboard.interactionName(application.jobBoard),
										jobSalary: workray.dashboard.salaryFix(application.salary),
										jobCompany: application.company,
										jobLocation: application.location,
										jobType: application.type
									};
			if (window._gs) _gs('event', interactionName, interactionValue);
			if(typeof ga!=='undefined') ga('send', 'event', 'Interaction', interactionName);
			if (workray.userAgent.match(/iPhone|iPad|iPod/i))
				location.href = application.link;
			else
				window.open(application.link, '_blank');
		};
	};
/*	workray.dashboard.interviewModel = {
		retrieving: /dashboard\/applications/.test(window.location.href) ? ko.observable(true) : ko.observable(false),
		intsView: /dashboard\/applications/.test(window.location.href) ? ko.observable(true) : ko.observable(false)
	};
	workray.dashboard.interviewModel.interviews = ko.observableArray([]);
	workray.dashboard.interviewsList = function (body) {
		var self = this;
		self.lines = workray.dashboard.interviewModel.interviews;
		self.openIntLink = function(interview){
			var interactionName = interview.interviewTitle,
				interactionValue =	{
										interviewTitle: interview.interviewTitle,
										interviewCompany: interview.interviewCompany,
										interviewLocation: interview.interviewLocation,
										interviewTime: interview.interviewTime,
									};
			if (window._gs) _gs('event', interactionName, interactionValue);
			if(typeof ga!=='undefined') ga('send', 'event', 'Interaction', interactionName);
			window.open('https://mail.google.com/mail/u/0/#inbox/' + interview.gmailId, '_blank');
		};
	};
*/
	// Apply all Model bindings to be observed by templates
	ko.applyBindings({
		topJobs: new workray.dashboard.topJobsList(),
		jobs: new workray.dashboard.jobsList(),
		applications: new workray.dashboard.applicationsList()
	//	interviews: new workray.dashboard.interviewsList()
	}, document.getElementById("mail-app"));

	workray.dashboard.getTopJobs = function (daysback){
		workray.dashboard.daysback = daysback;
		var queryObj = {
			"jobBoards": workray.dashboard.jobBoards,
			"topJobs": 1
		};
		if(workray.dashboard.jobBoards != "")
			$.get("/api/topJobs/" + daysback, queryObj).done(function (data, status){
				workray.dashboard.updateUserStats(data.stats);
				workray.dashboard.updateBoardStats(data.stats);
				// Update view model properties
				var topJobs = data.topJobs ? data.topJobs : data.jobs;
				workray.dashboard.topJobModel.topJobs(topJobs);
				workray.dashboard.topJobModel.retrieving(false);
				$('.ui.icon.message:visible + .topPicks').hide();
			}).fail(function (status){
				var response = JSON.parse(status.responseText);
				workray.dashboard.errorHandler(response);
			});
		else workray.dashboard.topJobModel.retrieving(false);
	};

	workray.dashboard.getJobs = function (daysback){
		workray.dashboard.daysback = daysback;
		var queryObj = {
			"jobBoards": workray.dashboard.jobBoards
		};
		if(workray.dashboard.jobBoards != "")
			$.get("/api/jobs/" + daysback, queryObj).done(function (data, status){
				workray.dashboard.updateUserStats(data.stats);
				workray.dashboard.updateBoardStats(data.stats);
				// Update view model properties
				workray.dashboard.jobModel.jobs(data.jobs);
				workray.dashboard.jobModel.retrieving(false);
				$('.ui.icon.message:visible + .jobsView').hide();
			}).fail(function (status){
				var response = JSON.parse(status.responseText);
				workray.dashboard.errorHandler(response);
			});
		else workray.dashboard.jobModel.retrieving(false);
	};

	workray.dashboard.getApplications = function (daysback){
		var queryObj = {
			"jobBoards": workray.dashboard.jobBoards
		};
		if(workray.dashboard.jobBoards != "")
			$.get("/api/applications/" + daysback, queryObj).done(function (data, status){
				// Update view model properties
				workray.dashboard.applicationModel.applications(data.applications);
				workray.dashboard.applicationModel.retrieving(false);
				//workray.dashboard.updateBoardStats(data.stats);
				$('.ui.icon.message:visible + .appsView').hide();
			}).fail(function (status){
				var response = JSON.parse(status.responseText);
				workray.dashboard.errorHandler(response);
			});
		else workray.dashboard.applicationModel.retrieving(false);
	};
/*
	workray.dashboard.getInterviews = function (daysback){
		if(workray.dashboard.jobBoards != "")
			$.get("/api/interviews/" + daysback).done(function (data, status){
				// Update view model properties
				workray.dashboard.interviewModel.interviews(data.interviews);
				//workray.dashboard.updateBoardStats(data.stats);
				$('.ui.icon.message:visible + .intsView').hide();
			}).fail(function (status){
				var response = JSON.parse(status.responseText);
				workray.dashboard.errorHandler(response);
			});
		workray.dashboard.interviewModel.retrieving(false);
	};
*/
	workray.dashboard.updateBoardStats = function (stats){
		$('.jobBoards .item').each(function () {
			var $meta = $(this).children(".content").children(".description").children(".meta");
			var $jobBoard = $(this).data("jobBoard");
			var thisBoard = "jobViews" + $jobBoard.capitalizeFirstLetter();
			if(!$(this).hasClass("inactive")){
				$meta.children(".jobsCount").text(stats[$jobBoard + "/jobs"]);
				$meta.children(".emailsCount").text(stats[$jobBoard + "/email"]);
			}
			$meta.children(".viewsCount").text(workray.stats.allTime[thisBoard]);
		});
	};

	workray.dashboard.updateUserStats = function (stats){
		if(workray.stats.allTime.emailsProcessed>=0 && workray.stats.allTime.jobsProcessed>=0)
			if(workray.dashboard.daysback===1 && workray.stats.lastUpdate.emailsProcessed!==stats.totalemails && workray.stats.lastUpdate.jobsProcessed!==stats.totaljobs){
				var emailsDiff = Math.abs(parseInt(workray.stats.lastUpdate.emailsProcessed, 10) - parseInt(stats.totalemails, 10));
				var jobsDiff = Math.abs(parseInt(workray.stats.lastUpdate.jobsProcessed, 10) - parseInt(stats.totaljobs, 10));
				if(emailsDiff!==0 && jobsDiff!==0){
					var newEmailTotal = parseInt(workray.stats.allTime.emailsProcessed, 10) + emailsDiff;
					var newJobsTotal = parseInt(workray.stats.allTime.jobsProcessed, 10) + jobsDiff;
					$('.emailsRead').html(newEmailTotal);
					$('.jobsRead').html(newJobsTotal);
					// Update user statistics
					workray.stats.lastUpdate.emailsProcessed = parseInt(stats.totalemails, 10);
					workray.stats.lastUpdate.jobsProcessed = parseInt(stats.totaljobs, 10);
					workray.stats.allTime.emailsProcessed = newEmailTotal;
					workray.stats.allTime.jobsProcessed = newJobsTotal;
					// Send updated stats to server
					var xmlhttp = new XMLHttpRequest();
					xmlhttp.open('POST','/stats/update', true);
					xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
					xmlhttp.send('{"lastEmailsProcessed":"'
									+ workray.stats.lastUpdate.emailsProcessed
									+ '", "lastJobsProcessed":"'
									+ workray.stats.lastUpdate.jobsProcessed
									+ '", "allTimeEmailsProcessed":"'
									+ workray.stats.allTime.emailsProcessed
									+ '", "allTimeJobsProcessed":"'
									+ workray.stats.allTime.jobsProcessed
									+ '"}');
				}
			}else{
				$('.emailsRead').html(workray.stats.allTime.emailsProcessed);
				$('.jobsRead').html(workray.stats.allTime.jobsProcessed);
			}
	};

	workray.dashboard.updateJobViews = function (board){
		var $thisBoard = $('.jobBoards div[data-job-board="' + board.toLowerCase() + '"]').children(".content").children(".description").children(".meta").children(".viewsCount");
		var thisBoardValue = parseInt($thisBoard.text(), 10);
		thisBoardValue++;
		$thisBoard.text(thisBoardValue);
		// Send job view increment to server
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST','/stats/view', true);
		xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xmlhttp.send('{"jobBoard":"' + board + '"}');
	};

	workray.dashboard.updateCounts = function (counts){
		$('.statistic.newJobs .value').html(counts.jobs);
		$('.statistic.applications .value').html(counts.applications);
	//	$('.statistic.interviews .value').html(counts.interviews);
	};

	workray.dashboard.pollCounts = function (){
		var jobsCount = "/api/jobs/count/1",
			appsCount = "/api/applications/count/30";
		if (workray.dashboard.jobBoards !="")
			$.when(
				$.ajax({ url: jobsCount, data: {"jobBoards": workray.dashboard.jobBoards} }),
				$.ajax({ url: appsCount, data: {"jobBoards": workray.dashboard.jobBoards} })
			//	$.ajax("/api/interviews/count/"+"30")
			).done(function (jobs, apps, ints) {
				var counts = {
					jobs: $(jobs)[0].count,
					applications: $(apps)[0].count
				//	interviews: $(ints)[0].count
				};
				workray.dashboard.counts = counts;
				workray.dashboard.updateCounts(counts);
				if(workray.localStorage){
					localStorage.setItem(workray.localStorageKey + '_counts', JSON.stringify(counts));
				}
				setTimeout(function() {
					workray.dashboard.pollCounts();
				}, 300000); // 5 minutes
			});
		else {
			var counts = {
				jobs: 0,
				applications: 0
			//	interviews: 0
			};
			workray.dashboard.updateCounts(counts);
		}
	};

	workray.dashboard.instantSignup = function (board, userSignup){
		$.post("/signup/" + board, userSignup).done(function (data) {
			if(data.result===1){
				workray.toast(board.capitalizeFirstLetter() + ' signup successful', 4000, 'rounded');
				$('.signup.'+board).transition('fade').remove();
				$('.jobBoards .inactive[data-job-board="'+board+'"] .description').html('<div class="meta"><span class="emailsCount">0</span>&nbsp;emails <span class="separator">|</span><span class="jobsCount">0</span>&nbsp;jobs <span class="separator">|</span><span class="viewsCount">0</span>&nbsp;views</div>');
			}
			else{
				$('.signup.'+board).removeClass('loading');
				workray.toast(board.capitalizeFirstLetter() + ' signup currently unavailable', 4000, 'rounded');
			}
		}).fail(function (err){
			console.error(err);
			$('.signup.'+board).removeClass('loading');
			workray.toast(board.capitalizeFirstLetter() + ' signup currently unavailable', 4000, 'rounded');
		});
	};

	if(!/dashboard\/(settings|services)/.test(window.location.href)) $('.jobsNav,.appsNav').on('click', function (e){
		e.preventDefault();
		Path.history.pushState({}, $(this).attr("title"), $(this).attr("href"));
	});

	$('#daysbackToggle a').on('click', function (){
		var self = $(this);
		if(self.hasClass("active")) return;
		$(self.addClass("active").siblings().removeClass("active"));
		if($('.jobsNav').hasClass("active")){
		//	workray.dashboard.interviewModel.retrieving(false);
		//	workray.dashboard.interviewModel.intsView(false);
			workray.dashboard.applicationModel.retrieving(false);
			workray.dashboard.applicationModel.appsView(false);
			workray.dashboard.topJobModel.retrieving(false);
			workray.dashboard.topJobModel.topJobsView(false);
			workray.dashboard.jobModel.retrieving(true);
			workray.dashboard.jobModel.jobsView(true);
			workray.dashboard.getJobs(parseInt(self.data('daysback'), 10));
		}
	});

	$('.statistic.applications').on('click', function () {
		$('.appsNav').click();
	});
	$('.statistic.newJobs').on('click', function () {
		$('.jobsNav').click();
	});

	$('#closeAccountModal').modal('attach events', '.closeAccount', 'show');

	$('#addServiceModal').modal('attach events', '.addService', 'show');
	$('#addService').on("submit", function (e) {
		e.preventDefault();
		if($("#service").val()=="") return $("#service").parent().addClass("error");
		var service = $(this).serialize();
		$.post("/add-service", service)
			.done(function(data) {
				$('#addServiceModal').modal('hide');
				var $toastContent = 'Thank you, we will work on adding ' + data.sent + ' service soon';
				workray.toast($toastContent, 4000, 'rounded');
				if(typeof ga!=='undefined') ga(
					'send',
					'event',
					'Interaction',
					'Submit new service',
					data.sent
				);
				if(window._gs) _gs(
					'event',
					'Submit new service',
					{ "service": data.sent }
				);
			})
			.fail(function(err) {
				console.error(err.responseText);
			});
	});

	if(workray.localStorage){
		if(localStorage.getItem(workray.localStorageKey + '_user')!=null && JSON.parse(localStorage.getItem(workray.localStorageKey + '_user')).country_code!="US")
			workray.dashboard.usBoards.remove();
		else if(localStorage.getItem(workray.localStorageKey + '_user')==null)
			if(workray.geolocate()!="US") workray.dashboard.usBoards.remove();
	}
	else if(workray.geolocate()!="US")
		workray.dashboard.usBoards.remove();

	workray.dashboard.mainLoad = function() {
		workray.dashboard.applicationModel.retrieving(false);
		workray.dashboard.applicationModel.appsView(false);
	//	workray.dashboard.interviewModel.retrieving(false);
	//	workray.dashboard.interviewModel.intsView(false);
		workray.dashboard.jobModel.retrieving(false);
		workray.dashboard.jobModel.jobsView(false);
		workray.dashboard.topJobModel.retrieving(true);
		workray.dashboard.topJobModel.topJobsView(true);
		if(!workray.newUser && !/dashboard\/(settings|services)/.test(window.location.href)) {
			workray.dashboard.getTopJobs(parseInt(workray.dashboard.daysback, 10));
		}
		else if(!workray.newUser && /dashboard\/services/.test(window.location.href)) {
			workray.dashboard.getJobs(7);
		}
		else $.get("/api/new-user").done(function (data, status){
				var foundBoards = [];
				for (var key in data.stats){
					if (data.stats.hasOwnProperty(key) && key!=="totaljobs" && key!=="totalemails")
						foundBoards.push(key.split("/")[0]);
				}
				workray.dashboard.jobBoards = foundBoards.reduce(function(a,b){
					if (a.indexOf(b) < 0 ) a.push(b);
					return a;
				},[]).toString();
				workray.dashboard.updateUserStats(data.stats);
				workray.dashboard.updateBoardStats(data.stats);
				// Update view model properties
				workray.dashboard.topJobModel.topJobs(data.topJobs);
				workray.dashboard.topJobModel.retrieving(false);
				$('.ui.icon.message:visible + .topPicks').hide();
				workray.dashboard.updateCounts({ jobs: data.stats.totaljobs, applications: 0 });
			}).fail(function (status){
				var response = JSON.parse(status.responseText);
				workray.dashboard.errorHandler(response);
			});
	};

	workray.dashboard.jobsLoad = function (){
		$('.jobsNav').addClass('active').siblings().removeClass('active');
		$('.ui.left.sidebar').sidebar('hide');
		workray.dashboard.applicationModel.retrieving(false);
		workray.dashboard.applicationModel.appsView(false);
		//	workray.dashboard.interviewModel.retrieving(false);
		//	workray.dashboard.interviewModel.intsView(false);
		workray.dashboard.topJobModel.retrieving(false);
		workray.dashboard.topJobModel.topJobsView(false);
		workray.dashboard.jobModel.jobsView(true);
		if(workray.onboarding)
			if(workray.onboarding.fetchedJobs.length){
				// Full onboarding returning Jobsite jobs
				workray.dashboard.jobModel.retrieving(false);
				$('#dashboard-jobs #noBoards').remove();
				workray.onboarding.renderFetchedJobs($('#jobs'));
				return false;
			} else {
				// Onboarding skipped but still a new user, just use topJobs
				workray.dashboard.jobModel.retrieving(false);
				$('#dashboard-jobs #noBoards').remove();
				workray.dashboard.jobModel.jobs(workray.dashboard.topJobModel.topJobs());
				return false;
			}
		$('.daysback').show();
		$('.moreJobs').remove();
		workray.dashboard.jobModel.retrieving(true);
		workray.dashboard.getJobs(parseInt(workray.dashboard.daysback, 10));
	};

	workray.dashboard.applicationsLoad = function (){
		$('.appsNav').addClass('active').siblings().removeClass('active');
		$('.ui.left.sidebar').sidebar('hide');
		$('.daysback').hide();
		$('.topPicksAttached').remove();
		workray.dashboard.topJobModel.retrieving(false);
		workray.dashboard.topJobModel.topJobsView(false);
		workray.dashboard.jobModel.retrieving(false);
		workray.dashboard.jobModel.jobsView(false);
		workray.dashboard.applicationModel.appsView(true);
		workray.dashboard.applicationModel.retrieving(true);
		//	workray.dashboard.interviewModel.retrieving(true);
		//	workray.dashboard.interviewModel.intsView(true);
		workray.dashboard.getApplications(30);
		//	workray.dashboard.getInterviews(30);
	};

	Path.map('/dashboard/jobs').to(workray.dashboard.jobsLoad);
	Path.map('/dashboard/applications').to(workray.dashboard.applicationsLoad);
	Path.map('/dashboard').to(workray.dashboard.mainLoad);

	$(document).ready(function (){
		Path.history.listen();
		if (/dashboard\/jobs/.test(window.location.href))
			workray.dashboard.jobsLoad();
		else if (/dashboard\/applications/.test(window.location.href))
			workray.dashboard.applicationsLoad();
		else if (/dashboard(|#|\/#|\/)$/.test(window.location.href))
			workray.dashboard.mainLoad();
	});

	if(/dashboard(|#|\/#|\/)$/.test(window.location.href)){
		if(workray.localStorage &&
			Number.isNaN(parseInt($('.statistic.newJobs .value').html())) &&
			Number.isNaN(parseInt($('.statistic.applications .value').html()))
		//	Number.isNaN(parseInt($('.statistic.interviews .value').html()))
		){
			if(localStorage.getItem(workray.localStorageKey + '_counts')!=null){
				workray.dashboard.counts = JSON.parse(localStorage.getItem(workray.localStorageKey + '_counts'));
				workray.dashboard.updateCounts(workray.dashboard.counts);
			}
		}
		workray.dashboard.pollCounts();
	}

	$('.jobBoards .signup').on('click', function(){
		var user_title = $("#jobtitle_criteria").val(),
			user_location = $("#user_location_criteria").val(),
			user_salary = $("#user_salary_criteria").val();
		if(user_title=="" || user_location=="")
			return $('#criteria').modal('show');
		$(this).addClass('loading');
		var criteria = (user_title ? ("jobtitle=" + user_title) : "")
					 + (user_title && user_location ? "&" : "")
					 + (user_location ? ("user_location=" + user_location) : "")
					 + (user_title || user_location ? "&" : "")
					 + (user_salary ? ("user_salary=" + user_salary) : "");
		var userSignup = encodeURI(criteria),
			searchTitle = user_title.replace(/\s/g, "+"),
			searchLocation = user_location.replace(/\s/g, "+"),
			rLocIdRegEx = /\s*"LocationId"\s*:\s*(.+?)\s*,/g,
			matchedLocId = "";
		if($(this).hasClass('jobsite'))
			workray.dashboard.instantSignup("jobsite", userSignup);
		else if($(this).hasClass('totaljobs'))
			workray.dashboard.instantSignup("totaljobs", userSignup);
		else if($(this).hasClass('cwjobs'))
			workray.dashboard.instantSignup("cwjobs", userSignup);
		else if($(this).hasClass('reed')){
			$.get("/rsearch/" + user_location.toLowerCase().replace(/\s/g, "-") + "?keywords=" + searchTitle, function (data){
				matchedLocId = rLocIdRegEx.exec(data);
				userSignup = encodeURI(criteria) + "&rLocationId=" + matchedLocId[1];
				workray.dashboard.instantSignup("reed", userSignup);
			});
		}
	});

}

if($("#onboarding").length || $("#criteria").length){
	var ext = !$("#onboarding").length ? "_criteria" : "";
	workray.onboarding = {};

	window.initAutocomplete = function () {
		workray.onboarding.autocomplete = new google.maps.places.Autocomplete((document.getElementById("location"+ext)));
		workray.onboarding.autocomplete.addListener("place_changed", workray.onboarding.addLocation);
		$("#geolocate"+ext+" .input").on("click", ".geoButton", function (){
			$(".geoButton i").removeClass("disabled");
			workray.onboarding.geolocate();
		});
	};
		workray.onboarding.addLocation = function () {
		var place = workray.onboarding.autocomplete.getPlace();
		if(typeof place ==="object") for (var i = place.address_components.length - 1; i >= 0; i--) {
			var addressType = place.address_components[i].types[0];
			if(addressType==="locality")
				var trimmedLocation = place.address_components[i]["short_name"].substring(0, place.address_components[i]["short_name"].lastIndexOf(', United Kingdom'));
				document.getElementById("user_location"+ext).value = trimmedLocation;
		}
	};

	workray.onboarding.locationLookup = function (userLocation) {
		var geocoder = new google.maps.Geocoder;
		geocoder.geocode({'location': userLocation}, function(results, status) {
			if(status === google.maps.GeocoderStatus.OK) {
				if(results) {
					for (var i = results.length - 1; i >= 0; i--) {
						if(results[i].types[0]=='postal_town'){
							var trimmedLocation = results[i].formatted_address.substring(0, results[i].formatted_address.lastIndexOf(', UK'));
							document.getElementById("user_location"+ext).value = trimmedLocation;
							document.getElementById("location"+ext).value = trimmedLocation;
							return;
						}
					}
				} else {
					workray.toast('Could not match a location', 4000, 'rounded');
				}
			} else {
				console.error('Geocoder failure: ' + status);
			}
		});
	};
	workray.onboarding.geolocate = function () {
		if ('geolocation' in navigator) navigator.geolocation.getCurrentPosition(function (position) {
			var geolocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			var circle = new google.maps.Circle({
				center: geolocation,
				radius: position.coords.accuracy
			});
			workray.onboarding.autocomplete.setBounds(circle.getBounds());
			workray.onboarding.locationLookup(geolocation);

		});
		else if (workray.localStorage && localStorage.getItem(workray.localStorageKey + '_user')!=null) {
			var user = JSON.parse(localStorage.getItem(workray.localStorageKey + '_user')),
				geolocation = {
				lat: user.latitude,
				lng: user.longitude
			};
			var circle = new google.maps.Circle({
				center: geolocation,
				radius: 30
			});
			workray.onboarding.autocomplete.setBounds(circle.getBounds());
			workray.onboarding.locationLookup(geolocation);
		}
		else if (workray.user.latitude && workray.user.longitude) {
			var geolocation = {
				lat: workray.user.latitude,
				lng: workray.user.longitude
			};
			var circle = new google.maps.Circle({
				center: geolocation,
				radius: 30
			});
			workray.onboarding.autocomplete.setBounds(circle.getBounds());
			workray.onboarding.locationLookup(geolocation);
		}
		else {
			$('#geolocate'+ext+' .geoButton i').toggleClass('disabled');
			workray.toast('Browser doesn&#39;t allow geolocation', 4000, 'rounded');
		}
	};

	workray.onboarding.titleSearch = new Bloodhound({
		datumTokenizer: function (datum) {
			return Bloodhound.tokenizers.whitespace(datum.value);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: '/typeahead?q=%QUERY',
			filter: function (res) {
				return $.map(res.Results, function (terms) {
					return { value: terms.DisplayString };
				});
			}
		}
	});
	workray.onboarding.titleSearch.initialize();
	$('#titleSearch'+ext).tokenfield({
		typeahead: [null, {
			highlight: true,
			name: 'skills',
			displayKey: 'value',
			valueKey: 'value',
			source: workray.onboarding.titleSearch.ttAdapter()
		}],
		createTokensOnBlur: true
	});
	$('#titleSearch'+ext).on('tokenfield:createtoken', function (event){
		var existingTokens = $(this).tokenfield('getTokens');
		$.each(existingTokens, function (index, token){
			if (token.value === event.attrs.value)
				event.preventDefault();
		});
	}).on('tokenfield:createdtoken', function (e){
		document.getElementById('jobtitle'+ext).value = $(this).tokenfield('getTokensList');
	});
	$('#location'+ext).on('change', function () {
		document.getElementById('user_location'+ext).value = this.value;
	});

	if($('#criteria').length){
		if($('.updateSearch').length)
			$('#criteria').modal('attach events', '.updateSearch', 'show');
		$('#submitCriteria').on('click', function (e) {
			e.preventDefault();
			$('#userTitle_criteria,#geolocate_criteria').removeClass('invalid');
			document.getElementById('jobtitle_criteria').value = $('#titleSearch_criteria').tokenfield('getTokensList');
			document.getElementById('user_location_criteria').value = document.getElementById('location_criteria').value;
			var user_title = $('#jobtitle_criteria').val(),
				user_location = $('#user_location_criteria').val(),
				user_salary = $('#user_salary_criteria').val();
			if(user_title=='') $('#userTitle_criteria').addClass('invalid');
			if(user_location=='') $('#geolocate_criteria').addClass('invalid');
			if( $('#userTitle_criteria').hasClass('invalid') && $('#geolocate_criteria').hasClass('invalid') )
				return false;
			var userUpdate = (user_title ? ('user_title=' + user_title) : '')
							+(user_title && user_location ? '&' : '')
							+(user_location ? ('user_location=' + user_location) : '')
							+(user_title || user_location ? '&' : '')
							+(user_salary ? ('user_salary=' + user_salary) : '');
			$.post('/user/criteria', encodeURI(userUpdate))
				.done(function(){
					$('.criteria.jobTitle div').addClass('basic').html(user_title);
					$('.criteria.location div').addClass('basic').html(user_location);
					$('.criteria.salary div').addClass('basic').html(user_salary);
					$('#criteria').modal('hide');
					workray.toast('Thanks, we have saved your changes', 4000, 'rounded');
				})
				.fail(function(err) {
					console.error(err.responseText);
					workray.toast('An error occurred, please try again', 4000, 'rounded');
				});
		});
	}
}

if($("#onboarding").length){
	workray.onboarding.fetchedJobs = {};

	workray.onboarding.renderFetchedJobs = function (elem){
		elem.html($(workray.onboarding.fetchedJobs).find(".vacRow"));
		$(".jobDesc,.vacRow p,.saveJob").remove();
		$(".vacRow").each(function(){
			var thisVac = $(this),
			//	datePosted = thisVac.find("dd.vacPosted").text(),
				salary = thisVac.find("dd.vacSalary").text(),
				location = thisVac.find("dd.vacLocation").text(),
				jobtype = thisVac.find("dd.vacType").text(),
				vacUrl = "http://www.jobsite.co.uk" + thisVac.find("h3 a").attr("href"),
				vacTitle = thisVac.find("h3 a").text();
			thisVac.wrap('<div class="item"></div');
			$('<div class="content"><div class="header">' + vacTitle + '</div></div>').appendTo(thisVac.parent());
			$('<div class="image chip interaction" data-interaction-name="Click Job Board Badge"><a class="ui right floated job-link" target="_blank" href="' + vacUrl + '"><img class="ui tiny circular image" src=' + workray.assetBase + '"/images/icons/jobsite.png" alt="Jobsite" /></a></div>').appendTo(thisVac.parent());
			thisVac.parent().children(".content").append('<div class="ui list"><div class="item"><i class="grey pound icon"></i><div class="content jobField job-salary">'+ salary + '</div></div><div class="item"><i class="grey marker icon"></i><div class="content jobField job-location">'+ location + '</div></div><div class="item"><i class="grey wait icon"></i><div class="content jobField job-type">'+ jobtype + '</div></div></div>');
			thisVac.remove();
		});
		elem.on("click", ".item", function(){
			var interactionValue = {
				jobTitle: $(this).children(".header").text(),
				jobBoard: "Jobsite",
				jobSalary: $(this).children(".meta").children(".job-salary").text(),
				jobLocation: $(this).children(".meta").children(".job-location").text(),
				jobType: $(this).children(".meta").children(".job-type").text()
			};
			if (window._gs) _gs('event', 'Jobsite Job Link', interactionValue);
			if(typeof ga!=='undefined') ga('send', 'event', 'Interaction', 'Jobsite Job Link');
			workray.dashboard.updateJobViews('Jobsite');
			window.open($(this).children(".chip").children(".job-link").attr("href"), '_blank');
		});
	};

	var isMobile = window.screen.width<601;
	if(isMobile){
		$("#noBoards,.tabs").hide();
		$("#onboarding").removeClass("modal").addClass("segment");
		$("#onboarding i.close").remove();
	}else{
		$("#onboarding").modal('setting', 'transition', 'scale').modal('show');
	}
	$(".daysback").remove();

	$('#signupTotaljobs').on("change", function () {
		if($("#signupTotaljobs:not(:checked)").length) document.getElementById("totaljobs_alerts").value = 0;
		else document.getElementById("totaljobs_alerts").value = 1;
	});
	$('#signupIndeed').on("change", function () {
		if($("#signupIndeed:not(:checked)").length) document.getElementById("indeed_alerts").value = 0;
		else document.getElementById("indeed_alerts").value = 1;
	});
	$('#signupJobsite').on("change", function () {
		if($("#signupJobsite:not(:checked)").length) document.getElementById("jobsite_alerts").value = 0;
		else document.getElementById("jobsite_alerts").value = 1;
	});
	$('#signupReed').on("change", function () {
		if($("#signupReed:not(:checked)").length) document.getElementById("reed_alerts").value = 0;
		else document.getElementById("reed_alerts").value = 1;
	});

	$('#submitSignup').on('click', function (e) {
		e.preventDefault();
		$('#userTitle,#geolocate').removeClass('invalid');
		document.getElementById('jobtitle').value = $('#titleSearch').tokenfield('getTokensList');
		document.getElementById('user_location').value = document.getElementById('location').value;
		if (document.getElementById('totaljobs_alerts').value == 0
			&& document.getElementById('indeed_alerts').value == 0
			&& document.getElementById('jobsite_alerts').value == 0
			&& document.getElementById('reed_alerts').value == 0)
			return workray.toast('Subscribe to at least one Job Board', 4000, 'rounded');
		var user_title = $('#jobtitle').val(),
			user_location = $('#user_location').val(),
			user_salary = $('#user_salary').val();
		if(user_title=='') $('#userTitle').addClass('invalid');
		if(user_location=='') $('#geolocate').addClass('invalid');
		if( $('#userTitle').hasClass('invalid') && $('#geolocate').hasClass('invalid') )
			return false;
		$('#onboarding .content .form').fadeOut('fast');
		$('#onboarding .content').append('<div class="ui basic very padded clearing segment"><div class="ui active inverted dimmer"><div class="ui large text loader">Processing your signups&hellip;</div></div><p></p><p></p><p></p></div>');
		if(isMobile) $('html,body').animate({ scrollTop: 0 }, 'fast');
		var userUpdate = (user_title ? ('user_title=' + user_title) : '')
						+(user_title && user_location ? '&' : '')
						+(user_location ? ('user_location=' + user_location) : '')
						+(user_title || user_location ? '&' : '')
						+(user_salary ? ('user_salary=' + user_salary) : '');
		$.post('/user/criteria', encodeURI(userUpdate))
			.fail(function(err) {
				console.error(err.responseText);
			});
		var searchTitle = user_title.replace(/\s/g, "+"),
			searchLocation = user_location.replace(/\s/g, "+"),
			rLocIdRegEx = /\s*"LocationId"\s*:\s*(.+?)\s*,/g;
		var matchedLocId = '';
		$.get('/rsearch/' + user_location.toLowerCase().replace(/\s/g, "-") + '?keywords=' + searchTitle, function (data){
			matchedLocId = rLocIdRegEx.exec(data);
			$.get('/vacancies?search_type=quick&engine=solr&query=' + searchTitle + '&location=' + searchLocation + '&radius=20').done(function (data){
				workray.onboarding.fetchedJobs = data;
			}).fail(function(){
				$('#getJobs').html('Sorry, we could not find any jobs for you at this time.');
			}).always(function() {
				$.get("/isearch?q=" + searchTitle + "&l=" + searchLocation, function (data){
					var isearch = $(data);
					var iFormFields = $(data).find("#tjobalertmessage form").serialize();
					var userSignup = $("#jobBoardSignup").serialize() + "&" + iFormFields.replace("&email=","") + "&rLocationId=" + matchedLocId[1];
					$.post("/signup", userSignup)
						.done(function (data) {
							if(isMobile){
								$('#onboarding').hide();
								$("#noBoards,.tabs").show();
							}else $('#onboarding').modal('hide');
							var activeBoards = [],
								failedBoards = [],
								boardLinks = "",
								activeLinks = "";
							for (var key in data.results) {
								if (data.results.hasOwnProperty(key)) {
									if(data.results[key]===1) activeBoards.push(key);
									else failedBoards.push(key);
								}
							}
							for (var i = activeBoards.length - 1; i >= 0; i--) {
								boardLinks +='<span class="boardIconWrapper"><img src="' + $('.logo img').attr('src').split('workray')[0] + 'icons/' + activeBoards[i] + '.png' + '" alt="'+activeBoards[i].capitalizeFirstLetter()+'"></span>';
								if(i===0)
									activeLinks +='.interaction[data-interaction-name="Subscribe '+activeBoards[i].capitalizeFirstLetter()+'"]';
								else activeLinks+='.interaction[data-interaction-name="Subscribe '+activeBoards[i].capitalizeFirstLetter()+'"],';
							};
							var activeLinksList = activeLinks.split(",");
							$(".topPicksAttached h2").text('Thanks for signing up');
							if(activeBoards.length>0){
								$('#moreJobSites .header').text((activeBoards.length==1 ? "Seriously, only 1 job site?" : (activeBoards.length + " job sites")));
								for (var i = activeLinksList.length - 1; i >= 0; i--) {
									$(activeLinksList[i]).parent().parent().remove();
								}
								$("#noBoards").html('<i class="alarm outline icon"></i><div class="content"><div class="successIcons">' + boardLinks + '</div>'
									+ '<div class="header">Success, you have set up your job alerts.</div>'
									+ '<p>You can subscribe to more <a href="/dashboard/services" title="Subscribe to more services">services</a> any time you want.</p><p>'
									+ '<div class="header">Alerts can take a while to come through. Check back daily.</div></div>');
							}
							else{
								$("#noBoards").html('<i class="alarm outline icon"></i><div class="content"><div class="header">Sorry, something went wrong.</div>'
									+ '<p>We cannot automatically add any services.</p><p>'
									+ '<div class="header">Try adding them yourself using the list of services.</div></div>');
							}
							$("#noBoards").after('<h2 class="ui dividing header">In the meantime here are some results from your search:'
								+ '<div class="sub header">' + $(workray.onboarding.fetchedJobs).find("h1").html() + '</div></h2>'
								+ '<div class="ui hidden divider"></div><div id="getJobs"><div id="jsJobs" class="ui divided items"></div></div>');
							$(".jobBoards li").each(function(){
								for (var i = activeBoards.length - 1; i >= 0; i--) {
									if($(this).data('jobBoard')==activeBoards[i])
										$(this).children('p').html('<span class="jobsCount">0</span>&nbsp;jobs <span class="separator">|</span> <span class="viewsCount grey-text">0</span><span class="grey-text">&nbsp;views</span> <span class="separator">|</span> <span class="emailsCount">0</span>&nbsp;emails');
								}
							});
							workray.onboarding.renderFetchedJobs($('#getJobs .items'));
							$('.topPicks').after('<a href="http://www.jobsite.co.uk/vacancies?search_type=quick&amp;engine=solr&amp;query=' + searchTitle + '&amp;location=' + searchLocation + '&amp;radius=20&amp;p=2" target="_blank" class="ui pink bottom attached button moreJobs interaction" data-interaction-name="Show More Jobs" title="Show More Jobs"><i class="chevron circle down left icon"></i> Show More</a>');
							if(typeof ga!=='undefined') ga(
								'send',
								'event',
								'Interaction',
								'Register with Job Boards',
								activeBoards.join(', ')
							);
							if(window._gs) _gs(
								'event',
								'Register with Job Boards',
								{ "successful": activeBoards.join(', '), "failed": failedBoards.join(', '), "searchTitle": searchTitle, "searchLocation": searchLocation }
							);
						})
						.fail(function(err) {
							console.error(err.responseText);
						});
				});
			});
		});
	});

	$(window).load(function() {
		$('#userTitle .tt-input').focus();
		document.getElementById('jobtitle').value = $('#titleSearch').tokenfield('getTokensList');
		document.getElementById('user_location').value = document.getElementById('location').value;
	});
}
