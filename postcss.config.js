/*
 *	Inlined replacement for `postcss-remove-root`, which was abandoned at
 *	0.0.2 and never ported to the PostCSS 8 plugin API.
 *
 *	Runs in OnceExit so that postcss-custom-properties has already read the
 *	custom properties out of `:root` before the rules are dropped.
 */
const removeRoot = {
	postcssPlugin: 'remove-root',
	OnceExit (root) {
		root.walkRules(rule => {
			if (rule.selector === ':root') rule.remove();
		});
	}
};

module.exports = {
	plugins: [
		require('postcss-import'),
		require('postcss-custom-media'),
		require('postcss-custom-properties')({ preserve: false }),
		removeRoot,
		require('autoprefixer'),
		require('cssnano')
	]
};
