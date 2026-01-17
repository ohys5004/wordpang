import { Company } from "@/types";

export const SP500_COMPANIES: Partial<Company>[] = [
    {
        name: "Apple",
        url: "apple.com",
        headquarter: "Cupertino, CA",
        description: "Apple designs, manufactures and markets smartphones, personal computers, tablets, wearables and accessories.",
        productOverview: "iPhone, Mac, iPad, Apple Watch, Apple TV, and a suite of services including App Store, iCloud, and Apple Music.",
        products: ["iPhone", "MacBook", "iOS", "iCloud", "Apple Watch"],
        employees: "161,000+",
        founded: 1976,
        linkedinUrl: "https://www.linkedin.com/company/apple/"
    },
    {
        name: "Tesla",
        url: "tesla.com",
        headquarter: "Austin, TX",
        description: "Tesla designs, develops, manufactures, sells and leases fully electric vehicles and energy generation and storage systems.",
        productOverview: "Model S, Model 3, Model X, Model Y, Cybertruck, Solar Roof, and Powerwall energy storage solutions.",
        products: ["Model 3/Y", "Cybertruck", "Full Self-Driving", "Supercharger", "Powerwall"],
        employees: "140,000+",
        founded: 2003,
        linkedinUrl: "https://www.linkedin.com/company/tesla/"
    },
    {
        name: "NVIDIA",
        url: "nvidia.com",
        headquarter: "Santa Clara, CA",
        description: "NVIDIA is the pioneer of GPU-accelerated computing. It focuses on products and platforms for the large, growing markets of gaming, professional visualization, data center, and automotive.",
        productOverview: "GeForce GPUs for gaming, NVIDIA RTX for designers, and AI platforms for data centers and self-driving cars.",
        products: ["RTX GPUs", "H100 Tensor Core", "CUDA", "Drive Thor", "Omniverse"],
        employees: "29,000+",
        founded: 1993,
        linkedinUrl: "https://www.linkedin.com/company/nvidia/"
    },
    {
        name: "Microsoft",
        url: "microsoft.com",
        headquarter: "Redmond, WA",
        description: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.",
        productOverview: "Windows, Office 365, Azure Cloud, Xbox, Surface devices, and LinkedIn.",
        products: ["Windows 11", "Azure", "Microsoft 365", "Xbox", "Dynamics 365"],
        employees: "221,000+",
        founded: 1975,
        linkedinUrl: "https://www.linkedin.com/company/microsoft/"
    },
    {
        name: "Amazon",
        url: "amazon.com",
        headquarter: "Seattle, WA",
        description: "Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.",
        productOverview: "E-commerce, Amazon Web Services (AWS), Prime Video, Kindle, and Alexa-enabled devices.",
        products: ["AWS", "Amazon Prime", "Kindle", "Alexa", "Fire TV"],
        employees: "1,500,000+",
        founded: 1994,
        linkedinUrl: "https://www.linkedin.com/company/amazon/"
    },
    {
        name: "Google",
        url: "google.com",
        headquarter: "Mountain View, CA",
        description: "Google's mission is to organize the world's information and make it universally accessible and useful.",
        productOverview: "Google Search, Android, Chrome, YouTube, Google Cloud, and Pixel hardware.",
        products: ["Search", "Android", "YouTube", "Google Cloud", "Pixel"],
        employees: "182,000+",
        founded: 1998,
        linkedinUrl: "https://www.linkedin.com/company/google/"
    },
    {
        name: "Meta",
        url: "meta.com",
        headquarter: "Menlo Park, CA",
        description: "Meta builds technologies that help people connect, find communities, and grow businesses.",
        productOverview: "Facebook, Instagram, WhatsApp, Messenger, and Reality Labs (Quest/Metaverse).",
        products: ["Facebook", "Instagram", "WhatsApp", "Meta Quest", "Llama AI"],
        employees: "67,000+",
        founded: 2004,
        linkedinUrl: "https://www.linkedin.com/company/meta/"
    }
];
