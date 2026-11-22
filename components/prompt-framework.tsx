import {promptFrameworks} from '@/data/prompt-frameworks';
import {formGuidance} from '@/data/form-guidance';
import {frameworkMeanings,frameworkTerms} from '@/data/framework-explanations';
import type {Solution} from '@/types/solution';
export function PromptFramework({solution:s}:{solution:Solution}){
 const framework=promptFrameworks[s.slug],guide=formGuidance[s.slug];
 if(!framework||!guide)return null;
 return <div className="prompt-framework framework-guide">
 <div className="framework-guide-heading"><span>方法</span><strong>{framework.name}</strong></div>
 <div className="framework-feature"><p>{guide.feature}</p></div>
 <ul className="framework-definitions">{framework.groups.map(g=><li key={g.code}><div className="framework-term"><strong>{frameworkTerms[framework.name]?.[g.code]}</strong><span lang="en">{g.english}</span></div><p>{frameworkMeanings[framework.name]?.[g.code]}</p></li>)}</ul>
 
 </div>;
}
