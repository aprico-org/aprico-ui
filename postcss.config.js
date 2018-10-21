module.exports = {
  plugins: {
	'postcss-import': {},
	'postcss-custom-media': {},
	'postcss-custom-properties': { preserve: false },
	'postcss-remove-root': {},
	'postcss-color-function': {},
	'autoprefixer': { browsers: ['last 2 Chrome versions', 'last 2 Firefox versions', 'iOS >= 10.3'] },
	'cssnano': {}
  }
}
