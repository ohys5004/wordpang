const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env variables manually from .env in root
// Since this script is in scripts/, we look in ../.env
const envPath = path.resolve(__dirname, '../.env');
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.error('Could not find .env at', envPath);
    process.exit(1);
}

const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const bizCrush = {
    name: "BizCrush",
    url: "https://bizcrush.io", // Placeholder based on common naming, can be updated later
    headquarter: "Seoul, South Korea",
    description: "대면 미팅(In-Person Meeting) 전용 AI 에이전트. 오프라인 미팅의 디지털화를 통해 현장 영업의 효율을 극대화합니다.",
    product_overview: `BizCrush는 "대면 미팅(In-Person Meeting) 전용 AI 에이전트"입니다.
    
[핵심 기능]
1. 대화 녹음 및 텍스트 변환: 대면 미팅 시 녹음 및 Transcript 변환
2. AI 기반 개인화 이메일 생성: 미팅 내용 분석 및 개인화된 Follow-up Email 자동 작성
3. CRM 및 툴 연동: HubSpot, Notion 등과 연동하여 리드 관리 ("Your HubSpot for the real world")
4. 연락처 관리: 통합 연락처 관리 및 AI 프로필 생성

[비즈니스 전략]
- 차별화: 온라인이 아닌 "오프라인/현장" 영업에 특화
- 가치 제안: "타이핑이 아닌 판매에 집중하라". 미팅 후 망각 및 후속 조치 누락 방지.
- 통합 전략: 독자적 CRM보다는 HubSpot, Notion 생태계와 연동 전략.`,
    products: ["AI Meeting Agent", "Transcript", "Auto Follow-up Email", "CRM Integration"],
    employees: "Unknown",
    founded: 2024,
    linkedin_url: ""
};

async function migrate() {
    console.log('🚀 Adding BizCrush to Supabase...');

    const { data, error } = await supabase
        .from('companies')
        .upsert([bizCrush], { onConflict: 'name' });

    if (error) {
        console.error('❌ Error during insertion:', error);
    } else {
        console.log('✅ Successfully added BizCrush to Supabase!');
    }
}

migrate();
