const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load env variables manually from .env.local in root
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const NEXTROWS_API_KEY = 'sk-nr-tTc6MjZLZAQrYON0zdzu1ty5n4a6yZWd6jw4KWA0C9PXwEQj';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function fetchBusinessData() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            "appId": "815rvx91ro",
            "inputs": [
                {
                    "key": "max-items",
                    "value": 20 // Fetching 20 items to start
                }
            ]
        });

        const options = {
            hostname: 'api.nextrows.com',
            path: '/v1/apps/run/json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${NEXTROWS_API_KEY}`,
                'Content-Length': data.length
            }
        };

        console.log('🔄 Calling NextRows API...');

        const req = https.request(options, (res) => {
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsed = JSON.parse(responseBody);
                        console.log('🔍 Response Type:', typeof parsed);
                        console.log('🔍 Response Keys:', Object.keys(parsed));
                        console.log('🔍 First 200 chars:', JSON.stringify(parsed).substring(0, 200));
                        resolve(parsed);
                    } catch (e) {
                        reject(new Error('Failed to parse API response'));
                    }
                } else {
                    reject(new Error(`API Request Failed: ${res.statusCode} ${responseBody}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function migrate() {
    try {
        const response = await fetchBusinessData();
        const externalData = response.data || []; // Access the 'data' property

        console.log(`✅ Fetched ${externalData.length} companies from API.`);

        const companiesToUpsert = externalData.map(item => {
            // Transform API data to our DB schema
            const proposal = {
                title: "AI Analysis: Strategic Insight",
                content: item.businessStrategy,
                type: "future" // Defaulting to 'future' type strategy
            };

            return {
                name: item.companyName, // Upsert key
                employees: item.companySize,
                // If url is missing or simple string, ensure it has protocol if needed, 
                // but for now just saving as is or fallback
                url: item.companyWebsite || '',
                product_overview: item.product,
                // Our schema uses text[] for products, let's wrap the single product string
                products: [item.product],
                // Formatting proposals as a JSON array for the jsonb column
                proposals: [proposal]
            };
        });

        console.log('🚀 Uploading to Supabase...');

        const { data, error } = await supabase
            .from('companies')
            .upsert(companiesToUpsert, { onConflict: 'name' });
        // Note: This matches by name. If the name differs slightly from S&P500 list, 
        // it might create a new row instead of updating.

        if (error) {
            console.error('❌ Supabase Error:', error);
        } else {
            console.log('🎉 Successfully saved business strategies to database!');
        }

    } catch (err) {
        console.error('❌ Script failed:', err);
    }
}

migrate();
