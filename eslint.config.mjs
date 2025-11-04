import { js, ts } from '@opi_pib/eslint-config-base';

const ignores = ['dist/**', '.stryker-tmp/**', 'reports/**', 'src/**/*.spec.ts'];

/** @type {import("eslint").Linter.Config[]} */
export default [
	{
		...js,
		ignores
	},
	{
		...ts,
		ignores
	}
];
