export type Variable = {
    promptLabel?: string;
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'date';
    required: boolean;
    requiredWhen?: {key:string;equals:string};
    placeholder?: string;
    help?: string;
    outputDefault?: string;
    defaultValue?: string | number | string[];
    options?: string[];
    emptyBehavior?: 'omitLine' | 'omitParagraph';
    min?: number;
    max?: number;
    step?: number;
};
export type Status = 'draft' | 'testing' | 'verified' | 'published' | 'deprecated';
export type Solution = {
    id: string;
    slug: string;
    title: string;
    domain: string;
    relatedDomains?: string[];
    taskType?: string;
    secondaryTypes?: string[];
    category: string;
    tags: string[];
    problem: string;
    audience: string;
    difficulty: string;
    outcome: string[];
    promptKeyPoints?: string;
    cardSummary?: string;
    capabilityTags?: string[];
    resultExample: {
        label: string;
        description: string;
        sampleOutput?: string;
        image?: string;
        caseStudy?: PptCaseStudy;
        workedExample?: WorkedExample;
    };
    requiredInputs: string[];
    variables: Variable[];
    deliveryTypes: string[];
    solutionContent: string;
    promptVariants?: {key:string;equals:string;content:string;omitKeys?:string[]}[];
    stages?: {
        id: string;
        title: string;
        instructions: string;
        content: string;
    }[];
    instructions: string[];
    acceptanceCriteria: string[];
    boundaries: string[];
    toolSuggestions?: string[];
    qualityStatus: Status;
    testedAt: string | null;
    testNotes: string[];
    isDemo: boolean;
    validationRecords: {
        date: string;
        tool: string;
        inputSummary: string;
        caseType: string;
        result: string;
        notes: string;
        scores: Record<string, number>;
    }[];
};
export type Values = Record<string, string | number | string[] | undefined>;

export type PptCaseStudy = {background:string;inputs:{label:string;value:string}[];sourceRows:{source:string;channel:string;target:number;actual:number}[];materialNotes:string[];review:{facts:string[];gaps:string[];confirmation:string};slides:{page:number;title:string;purpose:string;evidence:string;visual:string;notes:string;seconds:number}[];checks:string[]};

export type WorkedExample={title:string;background:string;metrics:string[][];inputHeaders:string[];inputs:string[][];headers:string[];rows:string[][];findings:string[];checks:string[];values:Record<string,string>;logic:string;sections?:{title:string;headers:string[];rows:string[][]}[]};
