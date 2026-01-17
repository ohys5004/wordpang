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

export const generateBusinessStrategies = async (
    company1: string,
    company2: string,
    industry1: string,
    industry2: string,
    products1: string[],
    products2: string[]
): Promise<Array<{ type: string; title: string; content: string }>> => {
    console.log('📊 Generating business strategies for:', company1, '+', company2);

    if (!openai) {
        console.warn('⚠️ OpenAI client not initialized, using fallback strategies');
        return [];
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "당신은 비즈니스 전략 컨설턴트입니다. 두 회사를 합쳤을 때 가능한 구체적이고 실현 가능한 비즈니스 전략을 제안해주세요. 각 전략에는 구체적인 수치(매출, 시장 규모, 비용 절감 등)를 포함해야 합니다."
                },
                {
                    role: "user",
                    content: `${company1} (${industry1} 산업, 제품: ${products1.join(', ') || '없음'})과 ${company2} (${industry2} 산업, 제품: ${products2.join(', ') || '없음'})를 합친 새로운 회사의 비즈니스 전략 7개를 제안해주세요.

각 전략은 다음 타입 중 하나여야 합니다: stable, disruptive, niche, b2b, future

JSON 배열 형식으로 답변해주세요:
[
  {
    "type": "stable",
    "title": "전략 제목",
    "content": "구체적인 전략 내용 (수치 포함, 200자 이내)"
  }
]`
                }
            ],
            temperature: 0.8,
            max_tokens: 2000
        });

        let content = response.choices[0]?.message?.content || '[]';
        console.log('✅ AI response for strategies:', content.substring(0, 200) + '...');

        // Remove markdown code blocks if present
        content = content.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

        const strategies = JSON.parse(content);
        return Array.isArray(strategies) && strategies.length > 0 ? strategies : [];
    } catch (error) {
        console.error('❌ OpenAI API Error (strategies):', error);
        return [];
    }
};
