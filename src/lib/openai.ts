import OpenAI from 'openai';

// Check if API key is available
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
console.log('OpenAI API Key loaded:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');

// Initialize OpenAI client
const openai = apiKey ? new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Allow client-side usage
}) : null;

export const generateCompanyNames = async (company1: string, company2: string, products1: string[], products2: string[]): Promise<string[]> => {
    console.log('🎨 Generating company names for:', company1, '+', company2);

    if (!openai) {
        console.warn('⚠️ OpenAI client not initialized, using fallback names');
        return [
            `${company1} × ${company2}`,
            `Neo ${company1}`,
            `${company1} Fusion`,
            `${company2} Connect`,
            `${company1} Horizon`
        ];
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "당신은 창의적인 브랜드 네이밍 전문가입니다. 두 회사를 합친 새로운 회사의 이름을 5개 제안해주세요. 이름은 짧고, 기억하기 쉽고, 두 회사의 특성을 잘 반영해야 합니다."
                },
                {
                    role: "user",
                    content: `${company1} (제품: ${products1.join(', ') || '없음'})과 ${company2} (제품: ${products2.join(', ') || '없음'})를 합친 새로운 회사의 이름을 5개 제안해주세요. JSON 배열 형식으로만 답변해주세요. 예: ["이름1", "이름2", "이름3", "이름4", "이름5"]`
                }
            ],
            temperature: 0.9,
            max_tokens: 200
        });

        let content = response.choices[0]?.message?.content || '[]';
        console.log('✅ AI response for names:', content);

        // Remove markdown code blocks if present
        content = content.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

        const names = JSON.parse(content);
        return Array.isArray(names) && names.length > 0 ? names : [
            `${company1} × ${company2}`,
            `Neo ${company1}`,
            `${company1} Fusion`
        ];
    } catch (error) {
        console.error('❌ OpenAI API Error (names):', error);
        return [
            `${company1} × ${company2}`,
            `Neo ${company1}`,
            `${company1} Fusion`,
            `${company2} Connect`,
            `${company1} Horizon`
        ];
    }
};

export const generateCompanyProfile = async (
    company1: string,
    company2: string,
    generatedName: string,
    industry1: string,
    industry2: string,
    products1: string[],
    products2: string[]
): Promise<{
    productName: string;
    description: string;
    productOverview: string;
    strategies: Array<{ type: string; title: string; content: string }>;
}> => {
    console.log('📊 Generating company profile for:', company1, '+', company2, 'Name:', generatedName);

    if (!openai) {
        return {
            productName: generatedName,
            description: `${company1}와 ${company2}의 장점을 흡수한 새로운 벤처, ${generatedName}입니다.`,
            productOverview: '혁신적인 차세대 솔루션을 제공합니다.',
            strategies: []
        };
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `당신은 실리콘밸리의 천재적인 창업가이자 비전가입니다. 
두 회사의 DNA를 섞어 태어난 '완전히 새로운 스타트업'을 소개해야 합니다.

중요한 규칙:
1. 이 회사의 이름은 "${generatedName}"입니다. 반드시 이 이름을 사용하세요.
2. 이 회사는 오직 '단 하나의 혁신적인 제품'에 모든 사활을 걸고 있습니다.
3. 제품의 이름은 회사 이름인 "${generatedName}"과 동일하게 사용하거나, 그것을 핵심으로 하는 브랜드명을 사용하세요.
4. 단순히 "A와 B를 합쳤습니다"라고 설명하지 마세요. 마치 처음부터 존재했던 혁신적인 기업인 것처럼, 유머러스하고 대담하며 창의적인 톤으로 회사를 정의하세요.`
                },
                {
                    role: "user",
                    content: `${company1} (${industry1} 산업)와 ${company2} (${industry2} 산업)의 유전자를 결합한 새로운 회사의 프로필을 작성해주세요. 회사의 이름은 "${generatedName}"입니다.

반환 형식은 반드시 다음 JSON 포맷을 따라주세요:
{
  "productName": "${generatedName}",
  "description": "이 제품을 통해 이 회사가 이루고자 하는 비전 (대담하고 재밌는 한 문장)",
  "productOverview": "이 단 하나의 제품이 무엇인지, 어떤 문제를 해결하는지 매력적으로 설명 (기존 제품 나열 절대 금지)",
  "strategies": [
     { "type": "stable", "title": "전략 제목", "content": "이 제품을 안정적으로 시장에 안착시키기 위한 전략" },
     { "type": "disruptive", "title": "전략 제목", "content": "이 제품으로 시장의 판도를 뒤집을 전략" },
     ... (총 5~7개)
  ]
}

전략 타입: stable, disruptive, niche, b2b, future`
                }
            ],
            temperature: 0.9,
            max_tokens: 2000
        });

        let content = response.choices[0]?.message?.content || '{}';
        console.log('✅ AI response for profile:', content.substring(0, 200) + '...');

        // Remove markdown code blocks if present
        content = content.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

        const parsed = JSON.parse(content);
        return {
            productName: parsed.productName || generatedName,
            description: parsed.description || '',
            productOverview: parsed.productOverview || '',
            strategies: Array.isArray(parsed.strategies) ? parsed.strategies : []
        };
    } catch (error) {
        console.error('❌ OpenAI API Error (profile):', error);
        return {
            productName: generatedName,
            description: 'AI 응답을 불러오는 중 오류가 발생했습니다.',
            productOverview: '잠시 후 다시 시도해주세요.',
            strategies: []
        };
    }
};
