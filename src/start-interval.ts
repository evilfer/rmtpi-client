
export function startInteval(func: () => void, ms: number) {
    func();
    return setInterval(func, ms);
}
