module.exports = {
	globDirectory: 'src/',
	globPatterns: [
		'**/*.{css,js,png}'
	],
	swDest: 'src/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};