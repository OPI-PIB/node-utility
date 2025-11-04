interface NotifyProps {
	message?: string;
	error?: Error;
}

export class Notify {
	private constructor() {}

	/**
	 * Display info message
	 */
	static info(props: NotifyProps): void {
		const { message } = props;

		if (message) {
			console.log(`ℹ️  ${message}`);
		}
	}

	/**
	 * Display success message
	 */
	static success(props: NotifyProps): void {
		const { message } = props;

		if (message) {
			console.log(`✅ ${message}`);
		}
	}

	/**
	 * Display warning message
	 */
	static warning(props: NotifyProps): void {
		const { message } = props;

		if (message) {
			console.log(`⚠️  ${message}`);
		}
	}

	/**
	 * Display error
	 */
	static error(props: NotifyProps): void {
		const { message } = props;

		if (message) {
			console.log(`❌ ${message}`);
		}

		const { error } = props;

		if (error) {
			console.error(error);
		}
	}
}
