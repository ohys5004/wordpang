import { create } from 'zustand';
import { Company, CanvasItem, IdeaProposal } from '@/types';
import { SP500_COMPANIES } from '@/data/companies';
import { generateCompanyNames, generateBusinessStrategies } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

interface WordPangState {
    companies: Company[];
    canvasItems: CanvasItem[];
    selectedItemId: string | null;
    usageCount: number;
    user: any | null; // Adding user state

    // Actions
    setUser: (user: any | null) => void;
    loadCompanies: () => Promise<void>;
    addCompany: (company: Company) => void;
    addCompanyByUrl: (url: string) => void;
    addToCanvas: (companyId: string, x: number, y: number) => void;
    updateCanvasItem: (itemId: string, x: number, y: number) => void;
    removeCanvasItem: (itemId: string) => void;
    selectItem: (itemId: string | null) => void;
    combineItems: (item1Id: string, item2Id: string) => Promise<void>;
    updateCompanyName: (companyId: string, newName: string) => void;
    signOut: () => Promise<void>;
}

// Initial mock data
const INITIAL_COMPANIES: Company[] = [
    {
        id: '1',
        name: 'Apple',
        url: 'apple.com',
        ...SP500_COMPANIES.find(c => c.name === 'Apple'),
        lastUsed: Date.now(),
        proposals: [
            { type: 'stable', title: 'Services Ecosystem Expansion', content: 'Deepening integration between iCloud, Apple Music, and hardware.' },
            { type: 'disruptive', title: 'Spatial Computing Revolution', content: 'Leading the transition from mobile to AR with Vision Pro.' }
        ]
    } as Company,
    {
        id: '2',
        name: 'Tesla',
        url: 'tesla.com',
        ...SP500_COMPANIES.find(c => c.name === 'Tesla'),
        lastUsed: Date.now() - 1000,
        proposals: [
            { type: 'stable', title: 'Next-Gen Platform Efficiency', content: 'Reducing vehicle costs while maintaining premium performance.' },
            { type: 'future', title: 'Autonomous Robotaxi Network', content: 'Leveraging FSD to create a decentralized autonomous ride-hailing service.' }
        ]
    } as Company,
    {
        id: '3',
        name: 'OpenAI',
        url: 'openai.com',
        description: 'OpenAI is an AI research and deployment company.',
        productOverview: 'Creators of ChatGPT, DALL-E, and Sora. Developing safe and beneficial AGI.',
        products: ['ChatGPT', 'GPT-4o', 'DALL-E 3', 'Sora', 'OpenAI API'],
        employees: '1,000+',
        founded: 2015,
        headquarter: 'San Francisco, CA',
        linkedinUrl: 'https://www.linkedin.com/company/openai/',
        lastUsed: Date.now() - 2000,
        proposals: [
            { type: 'disruptive', title: 'Multimodal Intelligence OS', content: 'Transforming AI from a tool into a proactive personal assistant.' },
            { type: 'b2b', title: 'Enterprise Logic Engine', content: 'Standardizing AI-driven reasoning across every corporate workflow.' }
        ]
    },
    {
        id: '4',
        name: 'SpaceX',
        url: 'spacex.com',
        description: 'SpaceX designs, manufactures and launches advanced rockets and spacecraft.',
        productOverview: 'Starship, Falcon 9, Dragon spacecraft, and Starlink satellite internet services.',
        products: ['Falcon 9', 'Starlink', 'Starship', 'Dragon', 'Heavy Falcon'],
        employees: '13,000+',
        founded: 2002,
        headquarter: 'Hawthorne, CA',
        linkedinUrl: 'https://www.linkedin.com/company/spacex/',
        lastUsed: Date.now() - 3000,
        proposals: [
            { type: 'stable', title: 'Starlink Global Sat-com', content: 'Achieving worldwide high-speed internet penetration.' },
            { type: 'future', title: 'Interplanetary Logistic Network', content: 'Building the foundation for Martian civilization and moon bases.' }
        ]
    },
];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const generateIntuitiveNames = (c1: string, c2: string): string[] => {
    const n1 = c1.toLowerCase();
    const n2 = c2.toLowerCase();

    if ((n1 === 'apple' && n2 === 'tesla') || (n2 === 'apple' && n1 === 'tesla'))
        return ['iCar', 'Apple Mobility', 'Tesla OS', 'AppleDrive', 'iMotion'];

    if ((n1 === 'openai' && n2 === 'apple') || (n2 === 'openai' && n1 === 'apple'))
        return ['Siri IQ', 'Apple Intelligence', 'GPT-OS', 'ThinkPad', 'Neural Apple'];

    if ((n1 === 'tesla' && n2 === 'spacex') || (n2 === 'tesla' && n1 === 'spacex'))
        return ['StarDrive', 'Tesla Space', 'Cosmic Motors', 'Orbital Transit', 'SpaceMobility'];

    return [
        `${c1} x ${c2}`,
        `${c1.substring(0, 3)}${c2.substring(c2.length - 3)}`,
        `Neo ${c1}`,
        `${c1} Fusion`,
        `${c2} Connect`,
        `${c1} Horizon`
    ];
};

export const useStore = create<WordPangState>((set, get) => ({
    companies: INITIAL_COMPANIES,
    canvasItems: [],
    selectedItemId: null,
    usageCount: 0,
    user: null,

    setUser: (user) => set({ user }),
    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null });
    },

    loadCompanies: async () => {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('name');

            if (error) throw error;
            if (data) {
                const fetchedCompanies: Company[] = data.map(c => ({
                    id: c.id,
                    name: c.name,
                    url: c.url,
                    headquarter: c.headquarter,
                    description: c.description,
                    productOverview: c.product_overview,
                    products: c.products,
                    employees: c.employees,
                    founded: c.founded,
                    linkedinUrl: c.linkedin_url,
                    isHybrid: c.is_hybrid,
                    isEstimated: c.is_estimated,
                    lastUsed: Date.now() // or from DB if needed
                }));

                set((state) => {
                    // Merge fetched companies with initial mock companies to avoid duplicates
                    const merged = [...state.companies];
                    fetchedCompanies.forEach(f => {
                        const idx = merged.findIndex(m => m.name === f.name);
                        if (idx >= 0) {
                            merged[idx] = { ...merged[idx], ...f };
                        } else {
                            merged.push(f);
                        }
                    });
                    return { companies: merged };
                });
            }
        } catch (error) {
            console.error('❌ Error loading companies from Supabase:', error);
        }
    },

    addCompany: (company) => set((state) => ({
        companies: [company, ...state.companies]
    })),

    addCompanyByUrl: (url) => set((state) => {
        let name = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0];
        name = capitalize(name);

        const dbMatch = SP500_COMPANIES.find(c =>
            c.name?.toLowerCase() === name.toLowerCase() ||
            c.url?.toLowerCase().includes(name.toLowerCase())
        );

        if (dbMatch) {
            const newCompany: Company = {
                id: Math.random().toString(36).substr(2, 9),
                ...dbMatch,
                url: dbMatch.url || url,
                lastUsed: Date.now(),
            } as Company;
            return { companies: [newCompany, ...state.companies] };
        }

        if (name.toLowerCase() === 'bizcrush' || url.includes('bizcrush.ai')) {
            const bizCrush: Company = {
                id: Math.random().toString(36).substr(2, 9),
                name: 'BizCrush',
                url: 'bizcrush.ai',
                description: 'BizCrush.ai is an AI-powered in-person meeting agent.',
                productOverview: 'Captures and structures offline business data into CRMs in 15 seconds.',
                employees: 3,
                founded: 2025,
                headquarter: 'Dover, DE',
                linkedinUrl: 'https://www.linkedin.com/company/bizcrush/',
                lastUsed: Date.now(),
            };
            return { companies: [bizCrush, ...state.companies] };
        }

        const newCompany: Company = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            url,
            description: `Automated Website Analysis: Scraped and parsed domain info from ${url}.`,
            productOverview: `Analyzing product market fit and core value proposition for ${name}...`,
            isEstimated: true,
            lastUsed: Date.now(),
        };

        return {
            companies: [newCompany, ...state.companies]
        };
    }),

    addToCanvas: (companyId, x, y) => set((state) => ({
        canvasItems: [...state.canvasItems, { id: Math.random().toString(36).substr(2, 9), companyId, x, y }]
    })),

    updateCanvasItem: (itemId, x, y) => set((state) => ({
        canvasItems: state.canvasItems.map(item => item.id === itemId ? { ...item, x, y } : item)
    })),

    removeCanvasItem: (itemId) => set((state) => ({
        canvasItems: state.canvasItems.filter(item => item.id !== itemId)
    })),

    selectItem: (itemId) => set({ selectedItemId: itemId }),

    updateCompanyName: (companyId, newName) => set((state) => ({
        companies: state.companies.map(c => c.id === companyId ? { ...c, name: newName } : c)
    })),

    combineItems: async (item1Id, item2Id) => {
        console.log('🔄 combineItems called');
        const state = get();
        const item1 = state.canvasItems.find(i => i.id === item1Id);
        const item2 = state.canvasItems.find(i => i.id === item2Id);

        if (!item1 || !item2) {
            console.error('❌ Items not found');
            return;
        }

        const comp1 = state.companies.find(c => c.id === item1.companyId);
        const comp2 = state.companies.find(c => c.id === item2.companyId);

        if (!comp1 || !comp2) {
            console.error('❌ Companies not found');
            return;
        }

        console.log('✅ Combining:', comp1.name, '+', comp2.name);

        const products1 = comp1.products || [];
        const products2 = comp2.products || [];

        // 1. Quick industry detection
        const getIndustry = (company: Company): string => {
            const desc = (company.description || '').toLowerCase();
            const products = (company.products || []).join(' ').toLowerCase();
            const combined = desc + ' ' + products;

            if (combined.includes('ai') || combined.includes('artificial intelligence') || combined.includes('gpt') || combined.includes('chatgpt')) return 'AI';
            if (combined.includes('electric') || combined.includes('vehicle') || combined.includes('automotive') || combined.includes('car')) return 'Automotive';
            if (combined.includes('space') || combined.includes('rocket') || combined.includes('satellite') || combined.includes('starship')) return 'Space';
            if (combined.includes('cloud') || combined.includes('software') || combined.includes('platform') || combined.includes('saas')) return 'Software';
            if (combined.includes('hardware') || combined.includes('device') || combined.includes('phone') || combined.includes('iphone') || combined.includes('mac')) return 'Hardware';
            if (combined.includes('e-commerce') || combined.includes('retail') || combined.includes('marketplace') || combined.includes('amazon')) return 'E-commerce';
            if (combined.includes('social') || combined.includes('media') || combined.includes('content') || combined.includes('meta')) return 'Social Media';
            return 'Technology';
        };

        const industry1 = getIndustry(comp1);
        const industry2 = getIndustry(comp2);
        const hybridId = `hybrid-${Date.now()}`;

        // 2. Step 1: Generate Name Immediately
        let suggestions: string[] = [];
        try {
            console.log('🎨 Requesting names...');
            suggestions = await generateCompanyNames(comp1.name, comp2.name, products1, products2);
        } catch (error) {
            console.error('❌ Name generation failed:', error);
        }

        if (!suggestions || suggestions.length === 0) {
            suggestions = generateIntuitiveNames(comp1.name, comp2.name);
        }

        const idealName = suggestions[0] || `${comp1.name} × ${comp2.name}`;

        // 3. Add to canvas and state with 'isGenerating: true'
        const interimCompany: Company = {
            id: hybridId,
            name: idealName,
            isHybrid: true,
            isGenerating: true,
            parents: [comp1.id, comp2.id],
            lastUsed: Date.now(),
            suggestedNames: suggestions,
            proposals: [],
            description: `${comp1.name}의 ${industry1} 역량과 ${comp2.name}의 ${industry2} 기술을 결합한 차세대 비즈니스 모델.`,
            isEstimated: true,
            products: [...products1.slice(0, 2), ...products2.slice(0, 2), `${idealName} Platform`].filter((v, i, a) => a.indexOf(v) === i),
            productOverview: `${comp1.name}와 ${comp2.name}의 강점을 융합하여 혁신적인 가치를 창출하고 있습니다...`,
            employees: "추정치",
            founded: new Date().getFullYear(),
            headquarter: `${comp1.headquarter || 'Global'} / ${comp2.headquarter || 'Global'}`
        };

        const newCanvasItem: CanvasItem = {
            id: Math.random().toString(36).substr(2, 9),
            companyId: hybridId,
            x: (item1.x + item2.x) / 2,
            y: (item1.y + item2.y) / 2
        };

        set({
            usageCount: state.usageCount + 1,
            companies: [interimCompany, ...state.companies],
            canvasItems: [
                ...state.canvasItems.filter(i => i.id !== item1Id && i.id !== item2Id),
                newCanvasItem
            ],
            selectedItemId: newCanvasItem.id
        });

        console.log('🎉 Brand added. Generating strategies in background...');

        // 4. Step 2: Generate Strategies in Background
        (async () => {
            try {
                const aiStrategies = await generateBusinessStrategies(
                    comp1.name,
                    comp2.name,
                    industry1,
                    industry2,
                    products1,
                    products2
                );

                let finalProposals: IdeaProposal[] = (aiStrategies && aiStrategies.length > 0)
                    ? (aiStrategies as IdeaProposal[])
                    : [
                        { type: 'stable', title: '점진적 시스템 통합', content: '양사의 기술적 부채를 해결하고 핵심 서비스를 점진적으로 통합합니다.' },
                        { type: 'disruptive', title: '시장 파괴적 신규 모델', content: '양 사의 강점을 결합하여 기존 시장 질서를 재정의하는 솔루션을 출시합니다.' }
                    ];

                set((curr) => ({
                    companies: curr.companies.map(c =>
                        c.id === hybridId ? { ...c, proposals: finalProposals, isGenerating: false } : c
                    )
                }));
                console.log('✅ Background generation complete!');
            } catch (error) {
                console.error('❌ Background generation failed:', error);
                set((curr) => ({
                    companies: curr.companies.map(c => c.id === hybridId ? { ...c, isGenerating: false } : c)
                }));
            }
        })();
    },
}));
