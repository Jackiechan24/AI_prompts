import type {Values} from '@/types/solution';
// 仅检查结构必填，不要求固定标签或判断内容语义。
export function pptRequirements(values:Values):Record<string,string>{const errors:Record<string,string>={};for(const key of ['task','objective','audience','materials','mode'])if(!String(values[key]??'').trim())errors[key]='请填写此项';return errors;}
