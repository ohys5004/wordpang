const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env variables manually from .env in root
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

const nextRows = {
    name: "NextRows",
    url: "https://nextrows.com",
    headquarter: "Unknown",
    description: "웹 데이터 추출 및 테이블 변환 도구 (Web-to-Table Converter). 복잡한 웹페이지의 비정형 데이터를 정제된 스프레드시트로 변환합니다.",
    product_overview: `NextRows는 "데이터 수집의 대중화"를 목표로 하는 Web-to-Table Converter입니다.

[핵심 기능]
1. 웹 데이터 추출 (Web Scraping): YouTube, Finance, 뉴스 등 다양한 소스에서 텍스트, 이미지, 링크 등 추출
2. 테이블 변환: 비정형 데이터를 Clean Table(CSV) 형태로 즉시 변환
3. 커뮤니티 앱 (Community Apps): 사용자가 공유하는 전용 추출 도구 (App Store 모델)
4. AI/Agentic 접근: 자연어 목표 설정을 통한 에이전트 기반 작업 수행

[비즈니스 전략]
- 시장 접근: No-Code/Low-Code 툴로 일반 사용자 타겟팅, 진입장벽 제거
- 템플릿화: '앱' 공유를 통한 플랫폼 효과 창출
- 가치 제안: "Make life easier: convert anything to a table!". 데이터 정제 시간 단축.
- UX: 웹 및 데스크탑 앱 지원으로 안정성 확보`,
    products: ["Web Scraper", "Table Converter", "Community Apps", "Desktop App"],
    employees: "Unknown",
    founded: 2024,
    linkedin_url: ""
};

async function migrate() {
    console.log('🚀 Adding NextRows to Supabase...');

    const { data, error } = await supabase
        .from('companies')
        .upsert([nextRows], { onConflict: 'name' });

    if (error) {
        console.error('❌ Error during insertion:', error);
    } else {
        console.log('✅ Successfully added NextRows to Supabase!');
    }
}

migrate();
