export interface Company {
    id: string;
    name: string;
    logo?: string;
    url?: string;
    linkedinUrl?: string;
    headquarter?: string;
    description?: string;
    productOverview?: string;
    products?: string[];
    employees?: number | string;
    founded?: number | string;
    isHybrid?: boolean;
    isEstimated?: boolean;
    parents?: string[]; // IDs of parent companies if hybrid
    lastUsed?: number;
    suggestedNames?: string[];
    proposals?: IdeaProposal[];
    isGenerating?: boolean;
}

export interface CanvasItem {
    id: string;
    companyId: string;
    x: number;
    y: number;
}

export interface IdeaProposal {
    type: 'stable' | 'disruptive' | 'niche' | 'b2b' | 'future';
    title: string;
    content: string;
}

export interface HybridDetail {
    id: string;
    names: string[];
    proposals: IdeaProposal[];
}
