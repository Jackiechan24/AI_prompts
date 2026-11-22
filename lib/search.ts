import type {Solution} from '@/types/solution';
import {taskVocabulary} from '@/data/task-vocabulary';
const normalize=(value:string)=>value.normalize('NFKC').toLowerCase().replace(/[\s\p{P}]/gu,'');
function relevance(s:Solution,query:string):number{
 if(!query.trim())return 0;
 const title=normalize(s.title),base=normalize([s.title,s.problem,s.domain,...(s.relatedDomains??[]),s.taskType??'',...(s.secondaryTypes??[]),s.category,...s.tags,...s.outcome].join(' '));
 const vocabulary=taskVocabulary[s.slug];
 const aliases=(vocabulary?.aliases??[]).map(normalize),questions=(vocabulary?.questions??[]).map(normalize);
 const whole=normalize(query);
 if(questions.includes(whole))return 130;
 if(aliases.includes(whole))return 120;
 const tokens=query.trim().split(/\s+/).map(normalize).filter(Boolean);
 if(tokens.every(token=>base.includes(token)||aliases.some(alias=>alias.includes(token))||questions.some(question=>question.includes(token))))return tokens.reduce((n,t)=>n+(title.includes(t)?100:aliases.some(a=>a.includes(t))?30:10),0);
 // Natural questions can contain polite/context words around a meaningful task phrase.
 if([...aliases,...questions].some(term=>term.length>=3&&whole.includes(term)))return 20;
 return -1;
}
export function search(items:Solution[],params:URLSearchParams){const q=params.get('q')??'';return items.map(s=>({s,score:relevance(s,q)})).filter(({s,score})=>score>=0&&[['category',s.category],['difficulty',s.difficulty]].every(([k,v])=>!params.get(k)||params.get(k)===v)&&(!params.get('domain')||s.domain===params.get('domain')||!!s.relatedDomains?.includes(params.get('domain')!))&&(!params.get('taskType')||s.taskType===params.get('taskType'))&&(!params.get('deliveryType')||s.deliveryTypes.includes(params.get('deliveryType')!))&&(!params.get('tool')||s.toolSuggestions?.includes(params.get('tool')!))).sort((a,b)=>b.score-a.score||a.s.slug.localeCompare(b.s.slug)).map(({s})=>s);}
