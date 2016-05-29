var fs = require('fs');

var config = {
	frontend: {
		useCDN: false
	}
};

if(fs.existsSync('./config/config.js')) config = require('./config/config');

module.exports = {
	bundle: {
		main: {
			scripts: [
				'./src/the_project/plugins/modernizr.js',
				'./src/the_project/plugins/rs-plugin/js/jquery.themepunch.tools.min.js',
				'./src/the_project/plugins/rs-plugin/js/jquery.themepunch.revolution.min.js',
				'./src/the_project/plugins/isotope/isotope.pkgd.js',
				'./src/the_project/plugins/magnific-popup/jquery.magnific-popup.js',
				'./src/the_project/plugins/waypoints/jquery.waypoints.js',
				'./src/the_project/plugins/jquery.countTo.js',
				'./src/the_project/plugins/jquery.parallax-1.1.3.js',
				'./src/the_project/plugins/jquery.validate.js',
				'./src/the_project/plugins/vide/jquery.vide.min.js',
				'./src/the_project/plugins/owl-carousel/owl.carousel.js',
				'./src/the_project/plugins/jquery.browser.js',
				'./src/the_project/plugins/SmoothScroll.js',
				'./src/the_project/js/template.js',
				'./src/the_project/js/custom.js'
			],
			styles: [
				'./src/the_project/plugins/magnific-popup/magnific-popup.css',
				'./src/the_project/plugins/rs-plugin/css/settings.css',
				'./src/the_project/css/animations.css',
				'./src/the_project/plugins/owl-carousel/owl.carousel.css',
				'./src/the_project/plugins/owl-carousel/owl.transitions.css',
				'./src/the_project/plugins/hover/hover.css',
				'./src/the_project/css/style.css',
				'./src/the_project/css/skins/light_blue.css',
				'./src/the_project/css/custom.css'
			],
			options: {
				useMin: true,
				uglify: true,
				minCSS: true,
				rev: true,
				maps: config.gulpBuildMaps,
				pluginOptions: {
					'gulp-clean-css': { processImport: false }
				}
			}
		}
	}//,
//	copy: [
//		{
//			src: './semantic/dist/themes/**/*.*',
//			base: './semantic/dist'
//		}
//	]
};
