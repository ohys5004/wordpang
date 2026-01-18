const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');

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
const NEXTROWS_API_KEY = 'sk-nr-tTc6MjZLZAQrYON0zdzu1ty5n4a6yZWd6jw4KWA0C9PXwEQj';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function fetchNewCompanies() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            "appId": "iatod1xm93",
            "inputs": [
                {
                    "key": "max-items",
                    "value": 10
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

        console.log('🔄 Calling NextRows API (AppID: iatod1xm93)...');

        const req = https.request(options, (res) => {
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsed = JSON.parse(responseBody);
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

async function run() {
    try {
        const response = await fetchNewCompanies();

        let companies = [];
        if (Array.isArray(response)) {
            companies = response;
        } else if (response.data && Array.isArray(response.data)) {
            companies = response.data;
        } else {
            // If the API returns the array directly inside a property I missed, I log it.
            console.log('Response structure:', Object.keys(response));
            // Fallback attempt
            companies = response.items || [];
        }

        if (companies.length === 0) {
            console.log('⚠️ No companies found in response.');
            return;
        }

        console.log(`✅ Fetched ${companies.length} companies from API.`);

        const companiesToUpsert = companies.map(item => {
            return {
                name: item.companyName,
                description: item.aboutCompany,
                // Defaults for required fields
                product_overview: item.aboutCompany,
                products: [],
                url: '',
                employees: 'Unknown',
                founded: null,
                linkedin_url: ''
            };
        });

        console.log('🚀 Uploading to Supabase...');

        const { data, error } = await supabase
            .from('companies')
            .upsert(companiesToUpsert, { onConflict: 'name' });

        if (error) {
            console.error('❌ Supabase Error:', error);
        } else {
            console.log('🎉 Successfully added new companies to database!');
        }

    } catch (err) {
        console.error('❌ Script failed:', err);
    }
}

run();
