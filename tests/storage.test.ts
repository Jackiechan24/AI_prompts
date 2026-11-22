import { describe, it, expect, vi, afterEach } from 'vitest';
import { readStored, storageKey } from '../lib/storage';
afterEach(() => vi.unstubAllGlobals());
describe('存储保护', () => { it('缺省返回空数据', () => { vi.stubGlobal('localStorage', { getItem: () => null }); expect(readStored('favorites', [], Array.isArray)).toEqual({ data: [], blocked: false, message: '' }); }); it('损坏及未来版本不会被覆盖', () => { for (const value of ['bad-json', JSON.stringify({ version: 2, data: [] })]) {
    const setItem = vi.fn();
    vi.stubGlobal('localStorage', { getItem: () => value, setItem });
    expect(readStored('favorites', [], Array.isArray).blocked).toBe(true);
    expect(setItem).not.toHaveBeenCalled();
} }); it('禁用存储可降级', () => { vi.stubGlobal('localStorage', { getItem: () => { throw Error('blocked'); } }); expect(readStored('recent', [], Array.isArray).blocked).toBe(true); }); it('键有命名空间', () => expect(storageKey('favorites')).toBe('ai-solutions:v1:favorites')); });
