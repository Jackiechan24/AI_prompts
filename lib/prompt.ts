import type {Solution,Values} from '@/types/solution';
export function selectPrompt(s:Pick<Solution,'solutionContent'|'promptVariants'>,values:Values){
 const variant=s.promptVariants?.find(v=>values[v.key]===v.equals);
 return {content:variant?.content??s.solutionContent,omitKeys:variant?.omitKeys??[]};
}
