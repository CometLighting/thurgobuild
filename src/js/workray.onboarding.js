/* Onboarding.js - utilises typeahead.js, jQuery Color and jQuery Materialize Tags */
jQuery.fn.centre = function () {
	var top = ( $(window).height()<640 ?
				$(window).height() - this.outerHeight() - $("footer").outerHeight() - 10 :
				( $(window).height() - this.outerHeight() ) / 2+$(window).scrollTop() )
				+ "px",
		left = ( $(window).width() - this.outerWidth() ) / (2+$(window).scrollLeft()) + "px";
	this.css({top: top, left: left});
	return this;
};

jQuery.fn.centreAnim = function () {
	var top = ( $(window).height() - this.outerHeight() + 50 ) / 2+$(window).scrollTop() + "px",
		left = ( $(window).width() * 0.8 ) / 2+$(window).scrollLeft() + "px";
	this.removeClass("inactive").addClass("active");
	this.children("i").removeClass("mdi-action-done-all").addClass("mdi-action-done");
	this.children("p,button,div").fadeIn();
	this.children("h2").animate({"font-size":"1em"});
	this.css("cursor","default");
	this.animate({
		top: top,
		left: left,
		"width": "80%",
		"padding": "2em",
		"border-width":"1px",
		"border-color":"#ccc"
	}, 1000, "easeInOutBack");
	return this;
};

workray.onboarding = {};
workray.onboarding.fromTop = $("header").height();
workray.onboarding.titlesPosition = workray.onboarding.fromTop + $(window).height()<640 ? 10 : 20;
workray.onboarding.locationPosition = workray.onboarding.fromTop + $(window).height()<640 ? 90 : 100;
workray.onboarding.salaryPosition = workray.onboarding.fromTop + $(window).height()<640 ? 170 : 180;
workray.onboarding.centeringHeight = $(window).height()<640 ?
									$(window).height() - $(".question").height() - $("footer").height() - 20 :
									( $(window).height() - $(".question").height() ) / 2+$(window).scrollTop();

window.initAutocomplete = function() {
	workray.onboarding.autocomplete = new google.maps.places.Autocomplete((document.getElementById("placeSearch")));
	workray.onboarding.autocomplete.addListener("place_changed", workray.onboarding.addLocation);
	$("#location .input-field i").on("click", function(e){
		$(this).removeClass("mdi-communication-location-off").addClass("mdi-communication-location-on");
		e.preventDefault();
		workray.onboarding.geolocate();
	});
}

workray.onboarding.addLocation = function() {
	var place = workray.onboarding.autocomplete.getPlace();
	if(typeof place ==="object") for (var i = place.address_components.length - 1; i >= 0; i--) {
		var addressType = place.address_components[i].types[0];
		if(addressType==="locality")
			document.getElementById("user_location").value = place.address_components[i]["short_name"];
	};
}

workray.onboarding.geolocate = function() {
	if ("geolocation" in navigator) navigator.geolocation.getCurrentPosition(function(position) {
		var geolocation = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		var circle = new google.maps.Circle({
			center: geolocation,
			radius: position.coords.accuracy
		});
		workray.onboarding.autocomplete.setBounds(circle.getBounds());

		var userLocation = $.param(geolocation);
		$.get("/location-lookup", userLocation)
			.done(function(data) {
				if(data.error)
					if(typeof console!=="undefined")console.error(data.error);
				if(data.location){
					document.getElementById("user_location").value = data.location;
					document.getElementById("placeSearch").value = data.location;
				}
			})
			.fail(function(err) {
				if(typeof console!=="undefined")console.error(err.responseText);
			});
	});
	else {
		$("#location .input-field i").toggleClass("mdi-communication-location-off mdi-communication-location-on");
		Materialize.toast("Your browser doesn&#39;t support geolocation", 4000, "rounded");
	}
}

workray.onboarding.translateBox = function (element, position) {
	$("#" + element + " p,#" + element + " button,#" + element + " div").fadeOut();
	$("#" + element + " h2").animate({"font-size":"1em"});
	$("#" + element).removeClass("active").addClass("inactive");
	$("#" + element).animate({
		"top": position + "px",
		"left": "20px",
		"padding": "0em 0.5em",
		"border-width":"2px",
		"border-color":"#8bc34a",
		"width": ($("#" + element).parent().width() - 40) + "px"
	});
	$("#" + element + " i").fadeIn();
	$("#" + element).css("cursor","pointer");
};

workray.onboarding.translateBoxBack = function (element) {
	if($("#complete").hasClass("active"))
		$("#complete").fadeOut({duration: 1000, easing: "easeInOutBack"}).removeClass("active");
	if($("#titles").hasClass("active"))
		workray.onboarding.translateBox("titles", workray.onboarding.titlesPosition);
	else if($("#location").hasClass("active"))
		workray.onboarding.translateBox("location", workray.onboarding.locationPosition);
	else if($("#salary").hasClass("active"))
		workray.onboarding.translateBox("salary", workray.onboarding.salaryPosition);
	$("#" + element).centreAnim();
	if(element==="titles"){
		$("#location").animate({top: workray.onboarding.titlesPosition + "px"});
		$("#salary").animate({top: workray.onboarding.locationPosition + "px"});
	}
	else if(element==="location"){
		$("#titles").animate({top: workray.onboarding.titlesPosition + "px"});
		$("#salary").animate({top: workray.onboarding.locationPosition + "px"});
	}
	else if(element==="salary"){
		$("#titles").animate({top: workray.onboarding.titlesPosition + "px"});
		$("#location").animate({top: workray.onboarding.locationPosition + "px"});
	}
}

// Create a Job Titles Bloodhound
workray.onboarding.titlesSearch = new Bloodhound({
	datumTokenizer: function (datum) {
		return Bloodhound.tokenizers.whitespace(datum.value);
	},
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	remote: {
		url: '/typeahead?fq=type:GBTERMR&q=%QUERY',
		filter: function (titles) {
			// Map the remote source JSON array to a JavaScript object array
			return $.map(titles.response.docs, function (terms) {
				return { term: terms.term };
			});
		}
	}
});
workray.onboarding.titlesSearch.initialize();

// Use Twitter Typeahead.js with Bloodhound fetched data to initialise Material Tags
$("#titleSearch").materialtags({
	value: 'term',
	typeaheadjs : {
		highlight  : true,
		name       : 'skills',
		displayKey : 'term',
		valueKey   : 'term',
		source     : workray.onboarding.titlesSearch.ttAdapter()
	}
});

$("#main .section").css({ height: ( $(window).height() - workray.onboarding.fromTop - $("footer").height() - 20) + "px" });

$(".question").css({
	position: "absolute",
	left: "-500px",
	top: workray.onboarding.centeringHeight + "px"
});

$('#titles').fadeIn({easing: "easeInOutBack"}).addClass("active").centre();

$('#button1').click( function (e) {
	e.stopPropagation();
	if($("#location").hasClass("inactive"))$("#location").centreAnim();
	else if($("#salary").hasClass("inactive"))$("#salary").centreAnim();
	workray.onboarding.translateBox("titles", workray.onboarding.titlesPosition);
	if(!$("#location").hasClass("inactive") && !$("#location").hasClass("active")){
		$("#location").fadeIn({duration: 1000, easing: "easeInOutBack"}).addClass("active").centre();
		document.getElementById("placeSearch").focus();
	}
});

$('#button2').click( function (e) {
	e.stopPropagation();
	if($("#salary").hasClass("inactive"))$("#salary").centreAnim();
	workray.onboarding.translateBox("location", workray.onboarding.locationPosition);
	if(!$("#salary").hasClass("inactive") && !$("#salary").hasClass("active")){
		$("#salary").fadeIn({duration: 1000, easing: "easeInOutBack"}).addClass("active").centre();
		document.getElementById("salarySlider").focus();
	}
});

$('#button3').click( function (e) {
	e.stopPropagation();
	workray.onboarding.translateBox("salary", workray.onboarding.salaryPosition);
	$(".question i").removeClass("mdi-action-done").addClass("mdi-action-done-all");
	$("#complete").fadeIn({duration: 1000, easing: "easeInOutBack"}).addClass("active").centre();
	document.getElementById("updateSave").focus();
});

$("#questions").on( "click.onboarding", ".inactive", function(e) {
	e.stopPropagation();
	workray.onboarding.translateBoxBack($(this).prop('id'));
});

$(".tt-input").on("typeahead:selected", function (e, datum) {
	document.getElementById("user_title").value = datum.term ? datum.term : this.value;
});

$('#salarySlider').on("change", function () {
	document.getElementById("user_salary").value = this.value;
});

$("#updateSave").on( "click", function (e) {
	e.preventDefault();
	var userUpdate = $("#userUpdate").serialize();
	$.post("/onboarding", userUpdate)
		.done(function() {
			window.location = window.location.protocol
			+ "//" + window.location.hostname
			+ (window.location.port ? ":" + window.location.port: "")
			+ "/dashboard";
		})
		.fail(function(err) {
			if(typeof console!=="undefined")console.error(err.responseText);
		});
});

$(window).load(function() {
	if (document.getElementById("salarySlider").value === "53000"
		&& document.getElementById("user_title").value === ""
		&& document.getElementById("user_location").value === "")
	{
		document.getElementById("salarySlider").value = "5000";
		document.getElementById("salarySlider").defaultValue = "5000";
	}
	$(".tt-input").focus();
	document.getElementById("user_title").value = $(".materialize-tags .tag").text();
	document.getElementById("user_location").value = document.getElementById("placeSearch").value;
	document.getElementById("user_salary").value = document.getElementById("salarySlider").value;
});

$(window).resize(function () {
	$(".question.active,#complete.active").centre();
	$(".question.inactive").css("width", ($("#questions").width() - 40) + "px");
});
