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

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function fetchCSV(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Simple CSV parser that handles quoted fields
function parseCSV(csv) {
    const lines = csv.split('\n');
    const result = [];
    // Skip header: Symbol,Security,GICS Sector,GICS Sub-Industry,Headquarters Location,Date added,CIK,Founded
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const row = [];
        let current = '';
        let inQuotes = false;

        for (let char of lines[i]) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        row.push(current.trim());
        result.push(row);
    }
    return result;
}

async function migrate() {
    console.log('🚀 Fetching full S&P 500 list from GitHub...');
    try {
        const csvData = await fetchCSV('https://raw.githubusercontent.com/datasets/s-and-p-500-companies/main/data/constituents.csv');
        const rows = parseCSV(csvData);

        console.log(`📊 Parsed ${rows.length} companies. Starting migration...`);

        const companies = rows.map(row => {
            // Symbol,Security,GICS Sector,GICS Sub-Industry,Headquarters Location,Date added,CIK,Founded
            const [symbol, name, sector, subIndustry, hq, dateAdded, cik, founded] = row;

            // Clean founded year (often has " (year)" or "1923/1924")
            let foundedYear = parseInt(founded);
            if (isNaN(foundedYear)) foundedYear = null;

            return {
                name: name || symbol,
                url: `${symbol.toLowerCase()}.com`, // Guessing URL
                headquarter: hq,
                description: `${sector} - ${subIndustry}`,
                product_overview: `A leading company in the ${sector} industry.`,
                products: [sector, subIndustry],
                employees: "N/A",
                founded: foundedYear,
                linkedin_url: `https://www.linkedin.com/company/${symbol.toLowerCase()}/`
            };
        });

        // Batch upload (Supabase upsert limit is usually high, but 500 is fine in one go)
        // Divide into batches of 100 just in case
        const batchSize = 100;
        for (let i = 0; i < companies.length; i += batchSize) {
            const batch = companies.slice(i, i + batchSize);
            const { error } = await supabase
                .from('companies')
                .upsert(batch, { onConflict: 'name' });

            if (error) {
                console.error(`❌ Error in batch ${i / batchSize + 1}:`, error);
            } else {
                console.log(`✅ Batch ${i / batchSize + 1} uploaded (${batch.length} companies)`);
            }
        }

        console.log('🎉 Migration of 500+ companies completed!');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    }
}

migrate();
