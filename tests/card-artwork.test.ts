import {it,expect} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {SceneArtwork} from '@/components/scene-artwork';
import {builtin} from '@/lib/solutions';
import presentations from '@/data/scenario-presentations.json';
it('新增封面按场景有独立构图标识和真实结果锚点',()=>{const html=Object.keys(presentations).map(slug=>{const text=renderToStaticMarkup(createElement(SceneArtwork,{slug}));expect(text).toContain('data-artwork-kind="'+slug+'"');expect(text).toContain(presentations[slug as keyof typeof presentations].scene);return text;});expect(new Set(html).size).toBe(23);});
it('封面以图形为主，仅保留必要数字及短标签',()=>{for(const solution of builtin){const html=renderToStaticMarkup(createElement(SceneArtwork,{slug:solution.slug}));const labels=[...html.matchAll(/<text[^>]*>(.*?)<\/text>/g)].map(match=>match[1]);expect(labels.length,solution.slug).toBeLessThanOrEqual(6);expect(labels.every(label=>label.length<=12),solution.slug).toBe(true);expect(html).toContain('<desc>');expect(html).toMatch(/<(?:path|rect|circle)/);expect(html).not.toMatch(/华东-报告|优先保 A 还是 B|万元实际销售|按期完成一项/);}});
it('全部卡片有具体困难描述而非生成式功能标语',()=>{for(const s of builtin){expect(s.problem.length).toBeGreaterThan(25);expect(s.problem).not.toMatch(/^需要.*但不清楚如何组织输入/);}});

it('全部场景采用统一实体面板和受控结果标签',()=>{for(const s of builtin){const html=renderToStaticMarkup(createElement(SceneArtwork,{slug:s.slug}));expect(html).toContain('data-artwork-kind="'+s.slug+'"');expect(html).toContain(s.category);expect(html).toContain('fill="#fff"');}});

it('每个场景保留1到3处重点信息并完整使用统一面板',()=>{
 for(const solution of builtin){
  const html=renderToStaticMarkup(createElement(SceneArtwork,{slug:solution.slug}));
  const labels=[...html.matchAll(/<text[^>]*>(.*?)<\/text>/g)];
  expect(labels.length,solution.slug).toBeGreaterThanOrEqual(1);
  expect(labels.length,solution.slug).toBeLessThanOrEqual(3);
  expect(html,solution.slug).toContain('scene-ui-panel');
 }
});
