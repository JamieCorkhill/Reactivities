export function memoizeAsync<T>(func: (...args: any) => Promise<T>) {
    const cache: any = {};

    return async (...args: any) => {
        if (cache[args]) {
            return cache[args];
        }

        const result = await func();
        cache[args] = result;

        return result;
    };
}