import type { UseMutationOptions } from '@tanstack/react-query';

function chain<TArgs extends Array<unknown>, TExtra extends unknown>(
    ...fns: Array<((...args: TArgs) => TExtra | Promise<TExtra>) | undefined>
) {
    return async (...args: TArgs) => {
        for (const fn of fns) if (fn) await fn(...args);
    };
}

export function mergeMutationOptions<TData, TError, TVars>(
    base: UseMutationOptions<TData, TError, TVars>,
    extra?: Omit<UseMutationOptions<TData, TError, TVars>, "mutationFn">
): UseMutationOptions<TData, TError, TVars> {
    if (!extra) return base;

    return {
        ...base,
        ...extra,
        onSuccess: chain(base.onSuccess, extra.onSuccess),
        onSettled: chain(base.onSettled, extra.onSettled),
        onMutate: chain(base.onMutate, extra.onMutate),
        onError: chain(base.onError, extra.onError),
    };
}
