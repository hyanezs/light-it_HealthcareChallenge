module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: 'xo',
	overrides: [
		{
			extends: ['xo-typescript', 'prettier'],
			files: ['*.ts', '*.tsx'],
		},
		{
			files: ['./src/dataAccess/models/*.ts'],
			rules: {
				'@typescript-eslint/naming-convention': 'off',
			},
		},
		{
			files: ['./src/external/**'],
			rules: {
				'@typescript-eslint/naming-convention': 'off',
			},
		},
		{
			files: ['./src/dataAccess/repositories/*.ts'],
			rules: {
				'@typescript-eslint/ban-types': 'off',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: 'tsconfig.json',
		tsconfigRootDir: './backend/',
	},
	rules: {
		'new-cap': ['error', {capIsNewExceptions: ['Router']}],
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/consistent-type-definitions': 0,
		'@typescript-eslint/ban-types': 0,
	},
	ignorePatterns: ['src/tests/*'],
};
