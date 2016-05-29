(function() {
	// Ask other tabs for session storage
	if (workray.localStorage && !sessionStorage.length)
		localStorage.setItem('getSessionStorage', Date.now());

	window.addEventListener('storage', function(event) {
		if (event.key == 'getSessionStorage' && workray.localStorage) {
			// Some tab asked for the sessionStorage -> send it
			localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
			localStorage.removeItem('sessionStorage');
		} else if (event.key == 'sessionStorage' && workray.localStorage && !sessionStorage.length) {
			// sessionStorage is empty -> fill it
			try {
				var data = JSON.parse(event.newValue);
			}
			catch (e) {
				var data = {};
			}
			for (key in data) {
				sessionStorage.setItem(key, data[key]);
			}
		}
	});

})();
