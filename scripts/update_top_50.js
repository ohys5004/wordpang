const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env variables
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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const top50 = [
    {
        name: "Apple",
        url: "apple.com",
        headquarter: "Cupertino, CA",
        description: "Technology company specializing in consumer electronics, software, and services.",
        product_overview: "Apple's ecosystem revolves around the iPhone, with seamless integration across Mac, iPad, Apple Watch, and AirPods. Services like iCloud, Apple Pay, Apple Music, and the App Store drive recurring revenue. Recent focus includes Apple Silicon (M-series chips) and spatial computing with Apple Vision Pro.",
        products: ["iPhone", "Mac", "iPad", "Wearables", "Services", "Vision Pro"],
        employees: "161,000",
        founded: 1976
    },
    {
        name: "Microsoft",
        url: "microsoft.com",
        headquarter: "Redmond, WA",
        description: "Global tech leader in software, cloud computing, and AI.",
        product_overview: "Dominates productivity with Microsoft 365 (Office, Teams) and Windows. Azure is a top-tier cloud platform powering global enterprises. Significant AI investment via partnership with OpenAI (Copilot). Also strong in gaming (Xbox, Activision Blizzard) and professional networking (LinkedIn).",
        products: ["Azure", "Microsoft 365", "Windows", "Xbox", "LinkedIn", "Copilot"],
        employees: "221,000",
        founded: 1975
    },
    {
        name: "NVIDIA",
        url: "nvidia.com",
        headquarter: "Santa Clara, CA",
        description: "Pioneer in GPU-accelerated computing and AI hardware.",
        product_overview: "The absolute leader in AI chips (H100, Blackwell), powering the generative AI revolution. Origins in gaming GPUs (GeForce) remain strong. Also provides software platforms (CUDA, Omniverse) and solutions for automotive and data centers.",
        products: ["Data Center GPUs", "GeForce Gaming GPUs", "CUDA", "Omniverse", "Automotive"],
        employees: "29,600",
        founded: 1993
    },
    {
        name: "Alphabet (Google)",
        url: "abc.xyz",
        headquarter: "Mountain View, CA",
        description: "Parent company of Google, dominating search and digital advertising.",
        product_overview: "Google Search and YouTube command the majority of digital ad spend. Google Cloud is a growing enterprise player. Android is the world's most popular mobile OS. Creates hardware (Pixel) and invests in 'Other Bets' like Waymo (autonomous driving).",
        products: ["Google Search", "YouTube", "Google Cloud", "Android", "Pixel", "Waymo"],
        employees: "182,000",
        founded: 1998
    },
    {
        name: "Amazon",
        url: "amazon.com",
        headquarter: "Seattle, WA",
        description: "E-commerce giant and cloud computing leader.",
        product_overview: "Amazon.com is the world's largest online retailer. Amazon Web Services (AWS) is the leading cloud infrastructure provider. Prime subscription offers fast shipping and video streaming. Also produces hardware like Echo (Alexa) and Kindle.",
        products: ["E-commerce", "AWS", "Amazon Prime", "Alexa/Echo", "Prime Video", "Logistics"],
        employees: "1,525,000",
        founded: 1994
    },
    {
        name: "Meta",
        url: "meta.com",
        headquarter: "Menlo Park, CA",
        description: "Social technology company connecting billions of people.",
        product_overview: "Operates the world's largest social network family: Facebook, Instagram, WhatsApp, and Messenger. Heavily investing in the Metaverse through Reality Labs (Quest headsets) and AI (Llama models). Advertising is the primary revenue engine.",
        products: ["Facebook", "Instagram", "WhatsApp", "Meta Quest", "Reality Labs", "Llama AI"],
        employees: "67,300",
        founded: 2004
    },
    {
        name: "Berkshire Hathaway",
        url: "berkshirehathaway.com",
        headquarter: "Omaha, NE",
        description: "Multinational conglomerate holding company led by Warren Buffett.",
        product_overview: "A diverse conglomerate owning businesses in insurance (GEICO, Gen Re), rail transportation (BNSF), energy (Berkshire Hathaway Energy), manufacturing, and retail. Holds massive equity investments in companies like Apple and Bank of America.",
        products: ["Insurance (GEICO)", "BNSF Railway", "Energy", "Manufacturing", "Retail", "Investments"],
        employees: "396,000",
        founded: 1839
    },
    {
        name: "Eli Lilly",
        url: "lilly.com",
        headquarter: "Indianapolis, IN",
        description: "Pharmaceutical company leader in diabetes and obesity treatments.",
        product_overview: "Focuses on discovering and marketing medicines for diabetes (Mounjaro, Trulicity), obesity (Zepbound), oncology (Verzenio), and immunology. A leader in the new wave of GLP-1 receptor agonists.",
        products: ["Mounjaro", "Zepbound", "Trulicity", "Verzenio", "Jardiance", "Taltz"],
        employees: "43,000",
        founded: 1876
    },
    {
        name: "Broadcom",
        url: "broadcom.com",
        headquarter: "Palo Alto, CA",
        description: "Global infrastructure technology leader in semiconductors and software.",
        product_overview: "Designs semiconductor solutions for networking, broadband, and wireless connectivity. Through acquisitions (VMware, CA Technologies, Symantec), it has a massive enterprise software portfolio covering virtualization, security, and mainframe software.",
        products: ["Networking Chips", "VMware", "Broadband", "Wireless", "Symantec Security", "Mainframe Software"],
        employees: "20,000",
        founded: 1961
    },
    {
        name: "Tesla",
        url: "tesla.com",
        headquarter: "Austin, TX",
        description: "Electric vehicle and clean energy company.",
        product_overview: "Produces electric vehicles (Model S/3/X/Y, Cybertruck). Develops Full Self-Driving (FSD) technology. Energy division sells Solar Roof and Powerwall/Megapack storage. Developing Optimums humanoid robot.",
        products: ["Electric Vehicles", "Energy Storage", "Solar", "Full Self-Driving", "Supercharger Network"],
        employees: "140,000",
        founded: 2003
    },
    {
        name: "JPMorgan Chase",
        url: "jpmorganchase.com",
        headquarter: "New York, NY",
        description: "Largest bank in the United States and a major global financial services firm.",
        product_overview: "Offers comprehensive financial solutions: Consumer & Community Banking (Chase), Corporate & Investment Banking (J.P. Morgan), Commercial Banking, and Asset & Wealth Management. Leader in digital banking apps.",
        products: ["Consumer Banking", "Investment Banking", "Credit Cards", "Asset Management", "Commercial Banking"],
        employees: "293,000",
        founded: 1799
    },
    {
        name: "Walmart",
        url: "corporate.walmart.com",
        headquarter: "Bentonville, AR",
        description: "Multinational retail corporation operating hypermarkets and grocery stores.",
        product_overview: "Ideally 'Every Day Low Prices'. Operates massive chain of supercenters, discount department stores, and grocery stores. Growing e-commerce presence (Walmart+) and advertising business (Walmart Connect).",
        products: ["Retail Stores", "Grocery", "Walmart+", "E-commerce", "Health & Wellness", "Pharmacy"],
        employees: "2,100,000",
        founded: 1962
    },
    {
        name: "Visa",
        url: "visa.com",
        headquarter: "San Francisco, CA",
        description: "Global payments technology company.",
        product_overview: "Operates an open payment network (VisaNet) facilitating electronic funds transfers globally. Provides credit, debit, and prepaid card services. Offers value-added services like fraud protection, consulting, and analytics.",
        products: ["Credit Cards", "Debit Cards", "VisaNet", "Payment Processing", "Cybersecurity Services"],
        employees: "28,800",
        founded: 1958
    },
    {
        name: "ExxonMobil",
        url: "exxonmobil.com",
        headquarter: "Spring, TX",
        description: "One of the world's largest publicly traded international oil and gas companies.",
        product_overview: "Engaged in the exploration and production of crude oil and natural gas (Upstream), and manufacturing of petroleum products and chemicals (Downstream/Chemical). Investing in low-carbon solutions like carbon capture.",
        products: ["Crude Oil", "Natural Gas", "Petroleum Products", "Chemicals", "Mobil 1", "Carbon Capture"],
        employees: "62,000",
        founded: 1999
    },
    {
        name: "Mastercard",
        url: "mastercard.com",
        headquarter: "Purchase, NY",
        description: "Global payments industry technology leader.",
        product_overview: "Connects consumers, financial institutions, merchants, and governments via its payments processing network. Similar to Visa, it focuses on credit/debit transaction processing and offers cybersecurity and data analytics services.",
        products: ["Payment Processing", "Credit/Debit Cards", "Cyber & Intelligence", "Data & Services"],
        employees: "33,400",
        founded: 1966
    },
    {
        name: "UnitedHealth Group",
        url: "unitedhealthgroup.com",
        headquarter: "Minnetonka, MN",
        description: "Diversified health care company.",
        product_overview: "Two distinct platforms: UnitedHealthcare (health benefits/insurance coverage) and Optum (information and technology-enabled health services, pharmacy care services, and direct healthcare delivery).",
        products: ["Health Insurance", "Pharmacy Benefit Management", "Data Analytics (Optum)", "Care Delivery"],
        employees: "440,000",
        founded: 1977
    },
    {
        name: "Oracle",
        url: "oracle.com",
        headquarter: "Austin, TX",
        description: "Integrated cloud application and platform service provider.",
        product_overview: "Known for database software. Now aggressively expanding Oracle Cloud Infrastructure (OCI). Offers comprehensive ERP solutions (NetSuite, Fusion). Recently acquired Cerner to enter healthcare IT.",
        products: ["Oracle Database", "Oracle Cloud (OCI)", "NetSuite", "Fusion ERP", "Java", "Cerner"],
        employees: "164,000",
        founded: 1977
    },
    {
        name: "Procter & Gamble",
        url: "pg.com",
        headquarter: "Cincinnati, OH",
        description: "Multinational consumer goods corporation.",
        product_overview: "Houses dozens of iconic brands in Fabric & Home Care (Tide, Ariel), Baby/Fem/Family Care (Pampers, Bounty), Beauty (Olay, Head & Shoulders), Health (Vicks), and Grooming (Gillette).",
        products: ["Tide", "Pampers", "Gillette", "Old Spice", "Crest", "Olay", "Bounty"],
        employees: "107,000",
        founded: 1837
    },
    {
        name: "Johnson & Johnson",
        url: "jnj.com",
        headquarter: "New Brunswick, NJ",
        description: "Global healthcare company focusing on Pharmaceuticals and MedTech.",
        product_overview: "Innovative Medicine division develops drugs for immunology, oncology, neuroscience, etc. MedTech division creates surgical, orthopedic, and vision technology products. (Spun off consumer health as Kenvue).",
        products: ["Darzalex (Oncology)", "Stelara (Immunology)", "Surgical Systems", "Orthopedics", "Contact Lenses"],
        employees: "131,900",
        founded: 1886
    },
    {
        name: "Home Depot",
        url: "homedepot.com",
        headquarter: "Atlanta, GA",
        description: "The world's largest home improvement retailer.",
        product_overview: "Sells tools, construction products, appliances, and services for fuel and garden. Serves both DIY customers and Professional Contractors (Pros) with a vast supply chain and interconnected retail strategy.",
        products: ["Building Materials", "Home Improvement Tools", "Appliances", "Garden Supplies", "Pro Services"],
        employees: "471,000",
        founded: 1978
    },
    {
        name: "Costco",
        url: "costco.com",
        headquarter: "Issaquah, WA",
        description: "Membership-only big-box retail stores.",
        product_overview: "Operates warehouse clubs offering low prices on bulk merchandise. Key product is the 'Membership' itself. distinctive for high-quality private label 'Kirkland Signature'. Sells gas, travel, and pharmacy services as well.",
        products: ["Membership", "Bulk Groceries", "Kirkland Signature", "Gasoline", "Pharmacy", "Travel"],
        employees: "316,000",
        founded: 1983
    },
    {
        name: "AbbVie",
        url: "abbvie.com",
        headquarter: "North Chicago, IL",
        description: "Biopharmaceutical company focusing on immunology and oncology.",
        product_overview: "Owns Humira (one of the world's best-selling drugs). Expanding with Skyrizi and Rinvoq for immunology. Acquired Allergan to add Botox and aesthetics to its portfolio.",
        products: ["Humira", "Skyrizi", "Rinvoq", "Botox", "Imbruvica", "Vraylar"],
        employees: "50,000",
        founded: 2013
    },
    {
        name: "Merck",
        url: "merck.com",
        headquarter: "Rahway, NJ",
        description: "Research-intensive biopharmaceutical company.",
        product_overview: "Best known for Keytruda, a blockbuster cancer immunotherapy. Also strong in vaccines (Gardasil) and animal health. Focuses on oncology, infectious diseases, and cardiovascular conditions.",
        products: ["Keytruda (Oncology)", "Gardasil (Vaccine)", "Animal Health", "Januvia", "Propecia"],
        employees: "72,000",
        founded: 1891
    },
    {
        name: "Chevron",
        url: "chevron.com",
        headquarter: "San Ramon, CA",
        description: "One of the world's leading integrated energy companies.",
        product_overview: "Engaged in oil/gas exploration and production. Manufacturers transportation fuels, lubricants, petrochemicals, and additives. Investing in renewable fuels and hydrogen.",
        products: ["Oil & Gas Production", "Diesel/Gasoline", "Lubricants", "Petrochemicals", "Renewable Energy"],
        employees: "45,000",
        founded: 1879
    },
    {
        name: "AMD",
        url: "amd.com",
        headquarter: "Santa Clara, CA",
        description: "Semiconductor company developing computer processors and technologies.",
        product_overview: "Major competitor to Intel in CPUs (Ryzen, EPYC) and NVIDIA in GPUs (Radeon, Instinct). Powers major gaming consoles (PS5, Xbox). Growing presence in AI data centers with MI300 series.",
        products: ["Ryzen CPUs", "EPYC Server CPUs", "Radeon GPUs", "Instinct AI Accelerators", "Semi-Custom Chips"],
        employees: "26,000",
        founded: 1969
    },
    {
        name: "Netflix",
        url: "netflix.com",
        headquarter: "Los Gatos, CA",
        description: "Subscription streaming service and production company.",
        product_overview: "Pioneer of streaming video on demand. Produces original films and television series (Netflix Originals). Monetizes via subscriptions and a growing ad-supported tier. Also expanding into mobile games.",
        products: ["Streaming Subscription", "Netflix Originals", "Mobile Games", "Ad-supported Plan"],
        employees: "13,000",
        founded: 1997
    },
    {
        name: "Salesforce",
        url: "salesforce.com",
        headquarter: "San Francisco, CA",
        description: "Cloud-based software company providing CRM services.",
        product_overview: "Global CRM leader. Offers Customer 360 platform including Sales Cloud, Service Cloud, Marketing Cloud, and Commerce Cloud. Owns Slack for collaboration and Tableau for data visualization. Pushing 'Agentforce' for AI agents.",
        products: ["CRM", "Sales Cloud", "Service Cloud", "Slack", "Tableau", "MuleSoft", "Agentforce"],
        employees: "72,000",
        founded: 1999
    },
    {
        name: "Bank of America",
        url: "bankofamerica.com",
        headquarter: "Charlotte, NC",
        description: "Multinational investment bank and financial services holding company.",
        product_overview: "Serves individual consumers, SMEs, and large corporations. Key segments: Consumer Banking, Global Wealth & Investment Management (Merrill), Global Banking, and Global Markets.",
        products: ["Consumer Banking", "Merrill Lynch Wealth Management", "Corporate Banking", "Investment Banking", "Erica (Virtual Assistant)"],
        employees: "213,000",
        founded: 1998
    },
    {
        name: "Coca-Cola",
        url: "coca-colacompany.com",
        headquarter: "Atlanta, GA",
        description: "Total beverage company.",
        product_overview: "Owns and markets top non-alcoholic beverage brands like Coca-Cola, Sprite, Fanta, Dasani, and Smartwater. Business model focuses on selling concentrates to bottlers. Expanding in coffee (Costa) and sports drinks (BodyArmor).",
        products: ["Coca-Cola", "Sprite", "Fanta", "Dasani", "Costa Coffee", "BodyArmor", "Minute Maid"],
        employees: "79,000",
        founded: 1892
    },
    {
        name: "PepsiCo",
        url: "pepsico.com",
        headquarter: "Purchase, NY",
        description: "Multinational food, snack, and beverage corporation.",
        product_overview: "Diversified portfolio of beverages (Pepsi, Gatorade, Mountain Dew) and snacks (Frito-Lay brands like Lay's, Doritos, Cheetos). Also owns Quaker Oats. Often considered more diversified than Coke due to food business.",
        products: ["Pepsi", "Lay's", "Gatorade", "Doritos", "Quaker Oats", "Cheetos", "Mountain Dew"],
        employees: "318,000",
        founded: 1965
    },
    {
        name: "Adobe",
        url: "adobe.com",
        headquarter: "San Jose, CA",
        description: "Computer software company focused on creativity and digital marketing.",
        product_overview: "Dominates creative software with Creative Cloud (Photoshop, Illustrator, Premiere). Leads digital documents with Acrobat/PDF. Experience Cloud serves enterprise marketing/analytics. Firefly is its generative AI model.",
        products: ["Creative Cloud", "Photoshop", "Illustrator", "Acrobat", "Experience Cloud", "Adobe Firefly"],
        employees: "29,000",
        founded: 1982
    },
    {
        name: "Thermo Fisher Scientific",
        url: "thermofisher.com",
        headquarter: "Waltham, MA",
        description: "Supplier of scientific instrumentation, reagents and consumables.",
        product_overview: "The 'Amazon of Science'. Provides lab equipment, chemicals, diagnostics, and contract manufacturing (CDMO) for pharma companies. Essential partner for drug discovery and clinical labs.",
        products: ["Lab Equipment", "Chemicals/Reagents", "PCR Testing", "Pharma Services (CDMO)", "Analytical Instruments"],
        employees: "122,000",
        founded: 1956
    },
    {
        name: "Linde",
        url: "linde.com",
        headquarter: "Woking, UK",
        description: "Largest industrial gas company by market share and revenue.",
        product_overview: "Supplies industrial gases (oxygen, nitrogen, hydrogen) to hospitals, manufacturing, and refineries. Engineering division builds gas plants. Key player in the emerging hydrogen economy.",
        products: ["Industrial Gases", "Medical Gases", "Hydrogen Energy", "Gas Processing Plants"],
        employees: "66,000",
        founded: 1879
    },
    {
        name: "Accenture",
        url: "accenture.com",
        headquarter: "Dublin, Ireland",
        description: "Global professional services company specializing in IT services and consulting.",
        product_overview: "Provides Strategy & Consulting, Technology, and Operations services. Helps Global 2000 companies undergo digital transformation, move to cloud, and implement AI. Huge workforce of consultants.",
        products: ["IT Consulting", "Cloud Migration", "Digital Transformation", "Managed Services", "Security Services"],
        employees: "733,000",
        founded: 1989
    },
    {
        name: "McDonald's",
        url: "mcdonalds.com",
        headquarter: "Chicago, IL",
        description: "World's leading global food service retailer.",
        product_overview: "Operates and franchises fast-food restaurants globally. Famous for Big Mac, Fries, and Happy Meals. Business model heavily relies on franchising and real estate holdings. Digital focusing on app and delivery.",
        products: ["Big Mac", "French Fries", "Quarter Pounder", "Happy Meal", "McFlurry"],
        employees: "150,000",
        founded: 1940
    },
    {
        name: "Walt Disney",
        url: "thewaltdisneycompany.com",
        headquarter: "Burbank, CA",
        description: "Diversified multinational mass media and entertainment conglomerate.",
        product_overview: "Entertainment powerhouse. Entertainment division (Movies, ABC, Disney+), ESPN (Sports), and Experiences (Disney Parks, Cruise Line). Owning massive IP (Marvel, Star Wars, Pixar).",
        products: ["Disney+ / Hulu / ESPN", "Theme Parks", "Movies (Marvel/Star Wars)", "Merchandise", "Cruise Line"],
        employees: "225,000",
        founded: 1923
    },
    {
        name: "Cisco",
        url: "cisco.com",
        headquarter: "San Jose, CA",
        description: "Digital communications technology conglomerate corporation.",
        product_overview: "Networking hardware leader (Routers, Switches). Transitioning to software/subscription model with security (Splunk acquisition), collaboration (Webex), and observability solutions.",
        products: ["Networking (Catalyst)", "Cybersecurity", "Webex", "Splunk", "Data Center Infrastructure"],
        employees: "84,900",
        founded: 1984
    },
    {
        name: "Abbott Laboratories",
        url: "abbott.com",
        headquarter: "Chicago, IL",
        description: "American multinational medical devices and health care company.",
        product_overview: "Leader in Medical Devices (FreeStyle Libre for diabetes), Diagnostics (COVID tests), Nutrition (Ensure, Similac), and Established Pharmaceuticals in emerging markets.",
        products: ["FreeStyle Libre", "Diagnostics", "Similac", "Ensure", "Pedialyte", "Heart Valves"],
        employees: "114,000",
        founded: 1888
    },
    {
        name: "Intel",
        url: "intel.com",
        headquarter: "Santa Clara, CA",
        description: "Semiconductor industry leader designing and manufacturing chips.",
        product_overview: "Key player in PC and Server CPUs (Core, Xeon). Creating a foundry business (Intel Foundry) to manufacture chips for others. Pushing into AI PC market with new Ultra chips.",
        products: ["Core Processors", "Xeon Server Chips", "Intel Foundry", "Gaudi AI Chips", "Arc GPUs"],
        employees: "124,000",
        founded: 1968
    },
    {
        name: "Qualcomm",
        url: "qualcomm.com",
        headquarter: "San Diego, CA",
        description: "Semiconductor and telecommunications equipment company.",
        product_overview: "Leader in mobile chipsets (Snapdragon) powering Android phones. Owns critical 5G patents/licensing. Diversifying into automotive (Snapdragon Digital Chassis) and PCs.",
        products: ["Snapdragon Processors", "5G Modems", "Automotive Digital Chassis", "IoT Chips", "Licensing"],
        employees: "50,000",
        founded: 1985
    },
    {
        name: "Verizon",
        url: "verizon.com",
        headquarter: "New York, NY",
        description: "Telecommunications conglomerate.",
        product_overview: "Largest wireless carrier in the US. Provides 5G mobile network, Fios (fiber internet), and enterprise business solutions. Known for network reliability.",
        products: ["Wireless Plans", "5G Home Internet", "Fios", "Business Solutions"],
        employees: "105,400",
        founded: 2000
    },
    {
        name: "Danaher",
        url: "danaher.com",
        headquarter: "Washington, D.C.",
        description: "Science and technology innovator in life sciences and diagnostics.",
        product_overview: "Operates through Biotechnology, Life Sciences, and Diagnostics segments. Owns Cepheid (GeneXpert) and acquired Cytiva, making it a backend giant for biotech research and manufacturing.",
        products: ["Bioprocessing Equipment", "GeneXpert System", "Microscopes (Leica)", "Filtration"],
        employees: "63,000",
        founded: 1969
    },
    {
        name: "Intuit",
        url: "intuit.com",
        headquarter: "Mountain View, CA",
        description: "Business software company specializing in financial software.",
        product_overview: "Domineers tax and small business finance. TurboTax (tax prep), QuickBooks (accounting), Credit Karma (personal finance), and Mailchimp (marketing). Leveraging AI for financial advice.",
        products: ["TurboTax", "QuickBooks", "Credit Karma", "Mailchimp"],
        employees: "18,200",
        founded: 1983
    },
    {
        name: "GE Aerospace",
        url: "geaerospace.com",
        headquarter: "Evendale, OH",
        description: "World-leading provider of jet engines, components, and systems.",
        product_overview: "The core remaining business of the historic General Electric. Manufactures commercial and military jet engines (LEAP, GE9X). Services engines globally.",
        products: ["Commercial Jet Engines", "Military Jet Engines", "Avionics", "Engine Services"],
        employees: "52,000",
        founded: 1892
    },
    {
        name: "IBM",
        url: "ibm.com",
        headquarter: "Armonk, NY",
        description: "Multinational technology corporation focusing on hybrid cloud and AI.",
        product_overview: "Shifted from hardware to Software and Consulting. Red Hat acquisition drives Hybrid Cloud strategy. Watsonx platform is the flagship for enterprise AI. Still maintains Mainframe business.",
        products: ["Hybrid Cloud", "Red Hat OpenShift", "Watsonx", "IT Consulting", "Mainframes (zSystems)"],
        employees: "282,200",
        founded: 1911
    },
    {
        name: "Nike",
        url: "nike.com",
        headquarter: "Beaverton, OR",
        description: "World's largest supplier of athletic shoes and apparel.",
        product_overview: "Designs and sells footwear, apparel, equipment, and accessories. Iconic brands include Jordan and Converse. Direct-to-Consumer (DTC) strategy through apps and web is a key focus.",
        products: ["Footwear (Air Max, Jordan)", "Apparel", "Sports Equipment", "Converse"],
        employees: "83,700",
        founded: 1964
    },
    {
        name: "Pfizer",
        url: "pfizer.com",
        headquarter: "New York, NY",
        description: "Multinational pharmaceutical and biotechnology corporation.",
        product_overview: "Developed the first COVID-19 vaccine (Comirnaty) and treatment (Paxlovid). Strong portfolio in oncology, vaccines (Prevnar), and internal medicine (Eliquis).",
        products: ["Comirnaty", "Paxlovid", "Prevnar 20", "Eliquis", "Ibrance"],
        employees: "88,000",
        founded: 1849
    },
    {
        name: "Caterpillar",
        url: "caterpillar.com",
        headquarter: "Irving, TX",
        description: "World's leading manufacturer of construction and mining equipment.",
        product_overview: "Yellow 'Cat' machines are ubiquitous in construction. Makes excavators, bulldozers, mining trucks, and diesel-electric locomotives. Also sells engines and financial services.",
        products: ["Excavators", "Bulldozers", "Mining Trucks", "Diesel Engines", "Generators"],
        employees: "113,200",
        founded: 1925
    },
    {
        name: "ServiceNow",
        url: "servicenow.com",
        headquarter: "Santa Clara, CA",
        description: "Cloud computing platform helping companies manage digital workflows.",
        product_overview: "Provides the 'Now Platform' for IT Service Management (ITSM), HR, and Customer Service. Automates enterprise operations. Heavy investment in Generative AI for workflow automation.",
        products: ["IT Service Management", "HR Service Delivery", "Now Platform", "Creator Workflows"],
        employees: "22,500",
        founded: 2004
    }
];

async function updateTop50() {
    console.log('🚀 Updating Top 50 companies with detailed product overviews...');

    // Process in chunks to avoid any request size limits, though 50 is likely fine.
    // We update based on 'name'. The 'upsert' with 'onConflict: name' will update existing or insert new.
    // If IDs are used in the app, this relies on names matching.

    // First, verify if we have matches.
    // We will just execute the upsert.

    const { data, error } = await supabase
        .from('companies')
        .upsert(top50, { onConflict: 'name' });

    if (error) {
        console.error('❌ Error during update:', error);
    } else {
        console.log(`✅ Successfully updated ${top50.length} companies!`);
    }
}

updateTop50();
