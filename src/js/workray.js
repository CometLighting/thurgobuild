ko.options.deferUpdates = true;

workray.assetBase = $("html").data("base");
workray.dashboard = {};
workray.newUser = $("html").data("registered");
workray.user = {};
workray.userAgent = navigator.userAgent || navigator.vendor || window.opera;
workray.localStorageKey = $("body").data("ref");

workray.testLocalStorage = function() {
	var test = 'ls';
	try {
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch(e) {
		return false;
	}
};
if (workray.testLocalStorage()) workray.localStorage = 1;

workray.geolocate = function() {
	$.ajax({
		url: $("body").data("lookup"),
		cache: true,
		crossDomain: true,
		dataType: "jsonp",
		jsonpCallback: "f"
	}).done(function (res){
		if(workray.localStorage)
			localStorage.setItem(workray.localStorageKey + '_user', JSON.stringify(res));
		else workray.user = res;
		return res.country_code;
	});
};
