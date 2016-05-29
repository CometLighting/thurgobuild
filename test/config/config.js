'use strict';

var expect = require('chai').expect;

var config = require('../../config/config');

describe('Config', function configTest() {
	it('Should have the correct properties', function configProperties(done) {

		expect(config).to.have.a.property('cloudFrontS3').that.is.an('object');
		expect(config.cloudFrontS3).to.have.a.property('key').that.is.a('string');
		expect(config.cloudFrontS3).to.have.a.property('secret').that.is.a('string');
		expect(config.cloudFrontS3).to.have.a.property('bucket').that.is.a('string');
		expect(config.cloudFrontS3).to.have.a.property('region').that.is.a('string');
		expect(config.cloudFrontS3).to.have.a.property('distributionId').that.is.a('string');

		expect(config).to.have.a.property('gulpBuildMaps').that.is.a('boolean');

		done();
	});
});
