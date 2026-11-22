/** Display-only shortening. Never modifies saved prompt content. */
export function shortPromptTitle(title:string,limit=72):string{const plain=title.replace(/<[^>]*>/g,' ').replace(/[#*_`>]/g,'').replace(/\s+/g,' ').trim();const chars=Array.from(plain||'未命名提示词');return chars.length>limit?chars.slice(0,limit).join('')+'…':chars.join('');}
