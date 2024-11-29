export type Ok<T> = {
	type: 'ok';
	value: T;
};

type FailError = { message: string; cause?: unknown };

export type Fail = {
	type: 'fail';
	fail: FailError;
};

export type Result<T = void> = Ok<T> | Fail;

export function ok<T>(value: T): Ok<T> {
	return { type: 'ok', value };
}

export function fail(e: 'default' | (string & {}) | Error): Fail {
	const error = typeof e === 'string' ? new Error(e) : e;

	return {
		type: 'fail',
		fail: {
			message: error.message,
			cause: error.cause,
		},
	};
}

export function isFail<T>(result: Result<T>): result is { type: 'fail'; fail: FailError } {
	return result.type === 'fail';
}

export function isOk<T>(result: Result<T>): result is { type: 'ok'; value: T } {
	return result.type === 'ok';
}

export function unwrap<T>(result: Result<T>): T {
	if (isFail(result)) {
		throw result.fail;
	}

	return result.value;
}

export function unwrapOr<T>(result: Result<T>, defaultValue: T): T {
	if (isFail(result)) {
		return defaultValue;
	}

	return result.value;
}

export async function wrapAsync<T>(promise: Promise<T>): Promise<Result<T>> {
	try {
		const value = await promise;
		return ok(value);
	} catch (e) {
		return fail(e instanceof Error ? e : new Error('Erro desconhecido'));
	}
}

export function wrap<T>(fn: () => T): Result<T> {
	try {
		return ok(fn());
	} catch (e) {
		return fail(e instanceof Error ? e : new Error('Erro desconhecido'));
	}
}
