'use strict';

var gulp = require('gulp'),
	bundle = require('gulp-bundle-assets'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	awspublish = require('gulp-awspublish'),
	fs = require('fs');

var config = {
	frontend: {
		useCDN: false
	}
};
if(fs.existsSync('./config/config.js')) config = require('./config/config');

gulp.task('clean', function(){
	del.sync(['public/**']);
});

gulp.task('compile', function (cb){
	gulp.src('./bundle.config.js')
		.pipe(bundle())
		.pipe(bundle.results({
			dest:'./',
			pathPrefix: '//d1l3trj65naevw.cloudfront.net/public/the_project/'
		}))
		.pipe(gulp.dest('./public/the_project'))
		.on('end', cb);
});

gulp.task('optimise', function (cb) {
	gulp.src('./src/images/**/*.*')
		.pipe(imagemin({
			optimizationLevel: 7,
			progressive: true,
			multipass: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('./public/the_project/images'))
		.on('end', cb);
});


gulp.task('publish', function() {
	// create a new publisher using S3 options
	// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
	var publisher = awspublish.create({
		accessKeyId: config.cloudFrontS3.key,
		secretAccessKey: config.cloudFrontS3.secret,
		params: {
			Bucket: config.cloudFrontS3.bucket,
			DistributionId: config.cloudFrontS3.distributionId
		},
		region: config.cloudFrontS3.region,
		maxRetries: 3
	});
	// define custom headers
	var headers = {
		"Cache-Control": "max-age=315360000, no-transform, public"
		// ...
	};
	return gulp.src('./public/**')
		// gzip, Set Content-Encoding headers and add .gz extension
		.pipe(awspublish.gzip()) // { ext: '.gz' }
		// publisher will add Content-Length, Content-Type and headers specified above
		// If not specified it will set x-amz-acl to public-read by default
		.pipe(publisher.publish(headers))
		// create a cache file to speed up consecutive uploads
		.pipe(publisher.cache())
	//	.pipe(publisher.sync('public/the_project'))
		// print upload updates to console
		.pipe(awspublish.reporter());
});

gulp.task('build', ['clean'], function(){
	gulp.start('compile');
	gulp.start('optimise');
});

gulp.task('report', function (cb) {
	var bundleResult = require('./bundle.result.json');
	return cb(null, console.log('\n\n\nCSS:\n\n' + bundleResult.main.styles + '\n\nJS:\n\n' + bundleResult.main.scripts));
});

gulp.task('default', ['build'], function(){
	gulp.start('report');
});

