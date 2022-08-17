import chalk from 'chalk';

interface NotifyProps {
	message?: string;
	error?: Error;
}

export class Notify {
	private constructor() { }

	/**
	 * Display info message
	 */
	static info(props: NotifyProps): void {
		const { message } = props;

		if (message) {
			// eslint-disable-next-line no-console
			console.log(`${chalk.black.bgBlueBright(' Info ')} ${message}`);
		}
	}

	/**
	 * Display success message
	 */
	static success(props: NotifyProps): void {
		const { message } = props;

		if (message) {
			// eslint-disable-next-line no-console
			console.log(`${chalk.black.bgGreenBright(' Success ')} ${message}`);
		}
	}

	/**
	 * Display warning message
	 */
	static warning(props: NotifyProps): void {
		const { message } = props;

		if (message) {
			// eslint-disable-next-line no-console
			console.log(`${chalk.black.bgYellowBright(' Warning ')} ${message}`);
		}
	}

	/**
	 * Display error
	 */
	static error(props: NotifyProps): void {
		const { message } = props;

		if (message) {
			// eslint-disable-next-line no-console
			console.log(`${chalk.black.bgRedBright(' Error ')} ${message}`);
		}

		const { error } = props;

		if (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	}
}
