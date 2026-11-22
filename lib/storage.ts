export const storageKey = (name: string) => 'ai-solutions:v1:' + name;
export function readStored<T>(name: string, fallback: T, valid: (x: unknown) => boolean): {
    data: T;
    blocked: boolean;
    message: string;
} { try {
    const raw = localStorage.getItem(storageKey(name));
    if (!raw)
        return { data: fallback, blocked: false, message: '' };
    const value = JSON.parse(raw);
    if (value.version !== 1 || !valid(value.data))
        return { data: fallback, blocked: true, message: name + ' 数据损坏或版本不支持，原始数据已保留' };
    return { data: value.data, blocked: false, message: '' };
}
catch {
    return { data: fallback, blocked: true, message: name + ' 无法读取，当前仅临时保存' };
} }
export function download(name: string, text: string) { const url = URL.createObjectURL(new Blob([text], { type: 'application/json;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
