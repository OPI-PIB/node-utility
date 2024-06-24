// @ts-check
const tseslint = require('typescript-eslint');
const opiBase = require('@opi_pib/eslint-config-base');

module.exports = tseslint.config({
	files: ['**/*.ts'],
	extends: [...opiBase.configs.ts],
});
