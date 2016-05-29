# Thurgo build tool

> Create static asset bundles from a config file: a common interface to combining, minifying, revisioning and more. Stack agnostic. Production ready.

By default uses the following Gulp task runner modules under the covers when creating bundles:

1. [gulp-concat](https://github.com/wearefractal/gulp-concat)
2. [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps)
3. [gulp-uglify](https://github.com/terinjokes/gulp-uglify)
4. [gulp-clean-css](https://github.com/scniro/gulp-clean-css)
6. [gulp-rev](https://github.com/sindresorhus/gulp-rev)
7. [gulp-order](https://github.com/sirlantis/gulp-order)

## Prerequisites

Install [Node.js](https://nodejs.org/en/) - Current v6+ is recommended.

## Installation and Configuration

Install dependencies from Command Prompt / Terminal:

```bash
npm install -g gulp
npm install
```

Copy `config/config.example.js` to `config/config.js` then edit this file and fill in the blanks.

```js
var config = {
	cloudFrontS3: {
		key: '<youraccesskeyhere>',
		secret: '<yoursecretaccesskeyhere>',
```

To check that the tool has a valid configuration file, type:

```bash
npm run test
```

To launch a new build and push the files to S3/CloudFront, type:

```bash
npm run gulp
```

That's it! It will bundle 

## Integrating bundles into the site

After bundling all your assets and deploying them to S3/CloudFront the tool will display the bundled `.css` and `.js` HTML links
to use in your code, and also save the resulting `bundle.result.json` file for reference in case you close the terminal. An example
of the output is here:

```html
<link href="main-8e6d79da08.css" media="screen" rel="stylesheet" type="text/css">
<script src="main-5f17cd21a6.js" type="text/javascript"></script>
```

All you have to do is copy the CSS `link` into your `<head>` section of the theme and the JS `script` tag into the footer before the `</body>` tag.

## License

[MIT](LICENSE)
