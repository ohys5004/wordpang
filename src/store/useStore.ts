import { create } from 'zustand';
import { Company, CanvasItem, IdeaProposal } from '@/types';
import { SP500_COMPANIES } from '@/data/companies';
import { generateCompanyNames, generateBusinessStrategies } from '@/lib/openai';

interface WordPangState {
    companies: Company[];
    canvasItems: CanvasItem[];
    selectedItemId: string | null;
    usageCount: number;

    // Actions
    addCompany: (company: Company) => void;
    addCompanyByUrl: (url: string) => void;
    addToCanvas: (companyId: string, x: number, y: number) => void;
    updateCanvasItem: (itemId: string, x: number, y: number) => void;
    removeCanvasItem: (itemId: string) => void;
    selectItem: (itemId: string | null) => void;
    combineItems: (item1Id: string, item2Id: string) => Promise<void>;
    updateCompanyName: (companyId: string, newName: string) => void;
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

        // Detect industries
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

        console.log('📊 Industries:', industry1, '+', industry2);

        // Generate AI-powered names
        let suggestions: string[] = [];
        try {
            console.log('🎨 Calling AI for names...');
            suggestions = await generateCompanyNames(comp1.name, comp2.name, products1, products2);
            if (!suggestions || suggestions.length === 0) {
                console.warn('⚠️ AI returned no names, using fallback');
                suggestions = generateIntuitiveNames(comp1.name, comp2.name);
            }
            console.log('✅ Got names:', suggestions);
        } catch (error) {
            console.error('❌ Name generation failed:', error);
            suggestions = generateIntuitiveNames(comp1.name, comp2.name);
        }

        const idealName = suggestions[0] || `${comp1.name} × ${comp2.name}`;

        // Generate AI-powered business strategies
        let mockProposals: IdeaProposal[] = [];
        try {
            console.log('📊 Calling AI for strategies...');
            const aiStrategies = await generateBusinessStrategies(
                comp1.name,
                comp2.name,
                industry1,
                industry2,
                products1,
                products2
            );

            if (aiStrategies && aiStrategies.length > 0) {
                mockProposals = aiStrategies as IdeaProposal[];
                console.log('✅ Got', mockProposals.length, 'AI strategies');
            } else {
                console.warn('⚠️ AI returned no strategies, using fallback');
            }
        } catch (error) {
            console.error('❌ Strategy generation failed:', error);
        }

        // Fallback only if AI completely failed
        if (mockProposals.length === 0) {
            console.log('📝 Using fallback strategies');
            const product1Sample = products1[0] || `${comp1.name} 서비스`;
            const product2Sample = products2[0] || `${comp2.name} 서비스`;

            mockProposals = [
                {
                    type: 'stable',
                    title: `${comp1.name} × ${comp2.name} 통합 생태계`,
                    content: `${product1Sample}와 ${product2Sample}를 하나의 플랫폼으로 통합. 크로스 셀링으로 고객당 평균 매출 250% 증가. 월 구독료 $49~$199, 예상 첫해 ARR $50M+`
                },
                {
                    type: 'disruptive',
                    title: 'AI 기반 자동화 혁신',
                    content: `${comp1.name}의 데이터와 ${comp2.name}의 기술을 결합한 완전 자율 운영 시스템. 인건비 60% 절감, 처리 속도 10배 향상.`
                },
                {
                    type: 'b2b',
                    title: 'Fortune 500 전용 솔루션',
                    content: `${comp1.name}의 ${products1[0] || '기술'}과 ${comp2.name}의 ${products2[0] || '인프라'}를 결합한 맞춤형 패키지. 계약당 $500K~$2M`
                },
                {
                    type: 'niche',
                    title: '프리미엄 틈새 시장 공략',
                    content: `${comp1.name}과 ${comp2.name}의 강점을 살린 하이엔드 시장 집중. 상위 1% 고객 타겟, 객단가 $10K+`
                },
                {
                    type: 'future',
                    title: '메타버스 경제 플랫폼',
                    content: `가상-현실 융합 커머스. ${comp1.name}의 기술로 3D 쇼핑 경험 구현. 2030년 메타버스 시장 $800B 중 5% 점유 목표`
                }
            ];
        }

        const newCompany: Company = {
            id: `hybrid-${Date.now()}`,
            name: idealName,
            isHybrid: true,
            parents: [comp1.id, comp2.id],
            lastUsed: Date.now(),
            suggestedNames: suggestions,
            proposals: mockProposals,
            description: `${comp1.name}의 ${industry1} 역량과 ${comp2.name}의 ${industry2} 기술을 결합한 차세대 비즈니스 모델.`,
            isEstimated: true,
            products: [
                ...products1.slice(0, 2),
                ...products2.slice(0, 2),
                `${idealName} 통합 플랫폼`
            ].filter((v, i, a) => a.indexOf(v) === i),
            productOverview: `${comp1.name}의 ${products1[0] || '핵심 기술'}과 ${comp2.name}의 ${products2[0] || '시장 지배력'}을 융합하여 ${industry1}-${industry2} 시장에 새로운 가치를 창출합니다.`,
            employees: "추정치",
            founded: new Date().getFullYear(),
            headquarter: `${comp1.headquarter || 'Global'} / ${comp2.headquarter || 'Global'}`
        };

        const newCanvasItem: CanvasItem = {
            id: Math.random().toString(36).substr(2, 9),
            companyId: newCompany.id,
            x: (item1.x + item2.x) / 2,
            y: (item1.y + item2.y) / 2
        };

        console.log('🎉 Creating:', newCompany.name);

        set({
            usageCount: state.usageCount + 1,
            companies: [newCompany, ...state.companies],
            canvasItems: [
                ...state.canvasItems.filter(i => i.id !== item1Id && i.id !== item2Id),
                newCanvasItem
            ],
            selectedItemId: newCanvasItem.id
        });

        console.log('✅ Complete!');
    },
}));
