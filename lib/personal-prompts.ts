export type PersonalPrompt={id:string;title:string;content:string;category:string;createdAt:string;updatedAt:string;source?:{slug:string;template:string;values:Record<string,string|number|string[]>}};
export function validPersonalPrompts(value:unknown):value is PersonalPrompt[]{
 if(!Array.isArray(value)||value.length>2000)return false;
 const ids=new Set<string>();
 return value.every(item=>{if(!item||typeof item!=='object')return false;const v=item as PersonalPrompt;if(typeof v.id!=='string'||!v.id||ids.has(v.id))return false;ids.add(v.id);if(!['title','content','category','createdAt','updatedAt'].every(key=>typeof (v as unknown as Record<string,unknown>)[key]==='string'))return false;if(!v.title.trim()||!v.content.trim()||Number.isNaN(Date.parse(v.createdAt))||Number.isNaN(Date.parse(v.updatedAt)))return false;if(v.source){if(typeof v.source.slug!=='string'||typeof v.source.template!=='string'||!v.source.values||typeof v.source.values!=='object'||Array.isArray(v.source.values))return false;if(!Object.values(v.source.values).every(x=>typeof x==='string'||typeof x==='number'||(Array.isArray(x)&&x.every(y=>typeof y==='string'))))return false;}return true;});
}
export function mergePersonalPrompts(current:PersonalPrompt[],incoming:PersonalPrompt[]):PersonalPrompt[]{
 // Imported snapshots become independent copies; never overwrite an existing saved prompt.
 const ids=new Set(current.map(p=>p.id));
 return [...incoming.map(p=>{let id=p.id;while(ids.has(id))id=crypto.randomUUID();ids.add(id);return {...p,id};}),...current];
}
