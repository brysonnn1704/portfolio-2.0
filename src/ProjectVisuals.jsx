export function ProjectVisual({ id }) {
  switch (id) {
    case "raksha-zone":
      return (
        <svg viewBox="0 0 320 180" className="pcard-svg-preview" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title-raksha">
          <title id="title-raksha">RAKSHA ZONE Disaster Management GIS Interface Preview</title>
          <rect width="320" height="180" fill="#0B0F16" />
          {/* Radar background grid */}
          <circle cx="160" cy="90" r="70" stroke="#EF4444" strokeOpacity="0.18" strokeDasharray="3 3" />
          <circle cx="160" cy="90" r="45" stroke="#EF4444" strokeOpacity="0.28" />
          <circle cx="160" cy="90" r="20" stroke="#EF4444" strokeOpacity="0.4" />
          <line x1="90" y1="90" x2="230" y2="90" stroke="#EF4444" strokeOpacity="0.2" />
          <line x1="160" y1="20" x2="160" y2="160" stroke="#EF4444" strokeOpacity="0.2" />
          {/* Radar sweep */}
          <path d="M160 90 L215 50 A 70 70 0 0 0 160 20 Z" fill="url(#radar-grad)" opacity="0.65" />
          {/* Alert beacons */}
          <circle cx="195" cy="65" r="4.5" fill="#EF4444" />
          <circle cx="195" cy="65" r="10" stroke="#EF4444" strokeOpacity="0.6" />
          <circle cx="128" cy="115" r="4" fill="#F59E0B" />
          <circle cx="178" cy="126" r="3.5" fill="#EF4444" />
          {/* SIH GIS badges */}
          <rect x="18" y="16" width="112" height="20" rx="4" fill="#18131B" stroke="#EF4444" strokeOpacity="0.4" />
          <text x="26" y="30" fill="#EF4444" fontFamily="monospace" fontSize="8.5" fontWeight="bold">SIH GIS • HAZARD RADAR</text>
          <rect x="204" y="146" width="98" height="18" rx="4" fill="#111822" stroke="rgba(255,255,255,0.12)" />
          <text x="212" y="158" fill="#94A3B8" fontFamily="monospace" fontSize="8">SHELTER CAPACITY: 94%</text>
          <defs>
            <linearGradient id="radar-grad" x1="160" y1="90" x2="215" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EF4444" stopOpacity="0.45" />
              <stop offset="1" stopColor="#EF4444" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "crave-food":
      return (
        <svg viewBox="0 0 320 180" className="pcard-svg-preview" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title-crave">
          <title id="title-crave">Crave Food Delivery Platform Interface Preview</title>
          <rect width="320" height="180" fill="#0C1017" />
          <path d="M0 45 Q 80 40 160 55 T 320 40" stroke="#1E293B" strokeWidth="2.5" fill="none" />
          <path d="M0 120 Q 120 135 200 115 T 320 130" stroke="#1E293B" strokeWidth="2.5" fill="none" />
          <line x1="85" y1="0" x2="110" y2="180" stroke="#1E293B" strokeWidth="2" />
          <line x1="220" y1="0" x2="200" y2="180" stroke="#1E293B" strokeWidth="2" />

          <rect x="55" y="35" width="210" height="110" rx="10" fill="#161F2C" stroke="#E11D48" strokeOpacity="0.4" strokeWidth="1.2" />
          <rect x="70" y="50" width="60" height="50" rx="6" fill="#222F42" stroke="rgba(255,255,255,0.08)" />
          <circle cx="100" cy="75" r="14" fill="#F43F5E" fillOpacity="0.25" stroke="#F43F5E" />
          <text x="100" y="79" textAnchor="middle" fill="#F43F5E" fontFamily="sans-serif" fontSize="14">🍲</text>

          <text x="140" y="66" fill="#F8FAFC" fontFamily="sans-serif" fontSize="11" fontWeight="bold">Punjab Grill & Biryani</text>
          <text x="140" y="80" fill="#94A3B8" fontFamily="monospace" fontSize="8">North Indian • Biryani • Mughlai</text>
          <rect x="140" y="90" width="46" height="16" rx="4" fill="#15803D" />
          <text x="148" y="102" fill="#FFFFFF" fontFamily="sans-serif" fontSize="8.5" fontWeight="bold">4.8 ★</text>
          <text x="195" y="102" fill="#38BDF8" fontFamily="monospace" fontSize="8">24 MIN</text>

          <rect x="20" y="14" width="135" height="18" rx="3" fill="#141B24" stroke="rgba(255,255,255,0.1)" />
          <text x="27" y="26" fill="#FB7185" fontFamily="monospace" fontSize="8" fontWeight="bold">75 OSM RESTAURANTS • 444 DISHES</text>
        </svg>
      );

    case "trainwise-mumbai":
      return (
        <svg viewBox="0 0 320 180" className="pcard-svg-preview" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title-trainwise">
          <title id="title-trainwise">TrainWise Mumbai Transit Schematic Interface Preview</title>
          <rect width="320" height="180" fill="#0A0F16" />
          <line x1="60" y1="20" x2="60" y2="160" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="160" y1="20" x2="160" y2="160" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <path d="M160 80 Q 210 100 240 160" stroke="#0284C7" strokeWidth="4" fill="none" strokeLinecap="round" />

          <circle cx="160" cy="80" r="7" fill="#FFFFFF" stroke="#07090D" strokeWidth="2.5" />
          <circle cx="60" cy="80" r="7" fill="#FFFFFF" stroke="#07090D" strokeWidth="2.5" />
          <line x1="67" y1="80" x2="153" y2="80" stroke="#94A3B8" strokeWidth="2" strokeDasharray="2 2" />

          <circle cx="60" cy="40" r="5" fill="#FFFFFF" />
          <text x="74" y="44" fill="#E2E8F0" fontFamily="sans-serif" fontSize="9" fontWeight="600">Andheri</text>
          <text x="74" y="84" fill="#F8FAFC" fontFamily="sans-serif" fontSize="9.5" fontWeight="bold">Dadar (Junction)</text>
          <circle cx="60" cy="120" r="5" fill="#FFFFFF" />
          <text x="74" y="124" fill="#E2E8F0" fontFamily="sans-serif" fontSize="9" fontWeight="600">Churchgate</text>

          <circle cx="160" cy="40" r="5" fill="#FFFFFF" />
          <text x="174" y="44" fill="#E2E8F0" fontFamily="sans-serif" fontSize="9" fontWeight="600">Thane</text>
          <circle cx="160" cy="120" r="5" fill="#FFFFFF" />
          <text x="174" y="124" fill="#E2E8F0" fontFamily="sans-serif" fontSize="9" fontWeight="600">CSMT</text>

          <rect x="180" y="115" width="124" height="48" rx="6" fill="#131B26" stroke="#38BDF8" strokeOpacity="0.4" />
          <text x="190" y="132" fill="#38BDF8" fontFamily="monospace" fontSize="8" fontWeight="bold">FAST LOCAL • 12:42 PM</text>
          <text x="190" y="146" fill="#34D399" fontFamily="monospace" fontSize="8">● ON TIME • PF 3</text>

          <rect x="20" y="14" width="115" height="18" rx="3" fill="#141B24" stroke="rgba(255,255,255,0.1)" />
          <text x="27" y="26" fill="#38BDF8" fontFamily="monospace" fontSize="8" fontWeight="bold">MUMBAI TRANSIT MAP</text>
        </svg>
      );

    case "bankmancrce":
      return (
        <svg viewBox="0 0 320 180" className="pcard-svg-preview" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title-bankman">
          <title id="title-bankman">BankMAN CRCE JavaFX Banking Interface Preview</title>
          <rect width="320" height="180" fill="#0A1110" />
          <rect x="40" y="24" width="240" height="132" rx="12" fill="#0E1E1C" stroke="#10B981" strokeOpacity="0.35" strokeWidth="1.2" />
          <rect x="62" y="44" width="28" height="22" rx="4" fill="#F59E0B" fillOpacity="0.8" stroke="#D97706" />
          <line x1="62" y1="55" x2="90" y2="55" stroke="#78350F" />
          <line x1="76" y1="44" x2="76" y2="66" stroke="#78350F" />
          <text x="105" y="54" fill="#10B981" fontFamily="monospace" fontSize="9" fontWeight="bold">BANKMAN CRCE • CORE</text>
          <text x="105" y="66" fill="#94A3B8" fontFamily="monospace" fontSize="8">GOOGLE OAUTH + ADMIN DASH</text>
          <text x="62" y="100" fill="#6EE7B7" fontFamily="monospace" fontSize="16" fontWeight="bold">₹ 148,250.00</text>
          <path d="M62 135 L95 125 L125 130 L160 115 L190 120 L220 105 L255 110" stroke="#10B981" strokeWidth="2" fill="none" />
          <circle cx="255" cy="110" r="3" fill="#10B981" />
          <text x="210" y="146" fill="#64748B" fontFamily="monospace" fontSize="7.5">MYSQL LEDGER</text>
        </svg>
      );

    case "royal-enfield":
      return (
        <svg viewBox="0 0 320 180" className="pcard-svg-preview" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title-royal">
          <title id="title-royal">Royal Enfield Digital Experience Showcase Preview</title>
          <rect width="320" height="180" fill="#0C0E12" />
          <circle cx="160" cy="95" r="64" stroke="#1F2633" strokeWidth="10" />
          <circle cx="160" cy="95" r="64" stroke="#F59E0B" strokeWidth="10" strokeDasharray="300" strokeDashoffset="120" strokeLinecap="round" />
          <circle cx="160" cy="95" r="48" fill="#141820" stroke="rgba(255,255,255,0.08)" />
          <line x1="160" y1="95" x2="190" y2="60" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="160" cy="95" r="5" fill="#F8FAFC" />
          <text x="160" y="125" textAnchor="middle" fill="#F8FAFC" fontFamily="sans-serif" fontSize="16" fontWeight="bold">110</text>
          <text x="160" y="137" textAnchor="middle" fill="#94A3B8" fontFamily="monospace" fontSize="8">KM/H • GEAR 4</text>
          <rect x="20" y="18" width="112" height="18" rx="3" fill="#1B1C20" stroke="#F59E0B" strokeOpacity="0.4" />
          <text x="27" y="30" fill="#F59E0B" fontFamily="monospace" fontSize="8.5" fontWeight="bold">ROYAL ENFIELD 350</text>
          <text x="235" y="30" fill="#64748B" fontFamily="monospace" fontSize="9">DIGITAL SHOWROOM</text>
        </svg>
      );

    case "digital-literacy":
      return (
        <svg viewBox="0 0 320 180" className="pcard-svg-preview" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title-digitallit">
          <title id="title-digitallit">Digital Literacy Elderly-Friendly Interface Preview</title>
          <rect width="320" height="180" fill="#0B111A" />
          <rect x="80" y="14" width="160" height="152" rx="14" fill="#131C28" stroke="#3B82F6" strokeOpacity="0.35" strokeWidth="1.5" />
          <rect x="135" y="22" width="50" height="4" rx="2" fill="#3B82F6" opacity="0.4" />
          <rect x="94" y="36" width="62" height="52" rx="8" fill="#1E293B" stroke="rgba(255,255,255,0.1)" />
          <circle cx="125" cy="56" r="10" fill="#3B82F6" fillOpacity="0.2" stroke="#3B82F6" strokeWidth="1.5" />
          <text x="125" y="78" textAnchor="middle" fill="#F8FAFC" fontFamily="sans-serif" fontSize="8.5" fontWeight="600">Call</text>

          <rect x="164" y="36" width="62" height="52" rx="8" fill="#1E293B" stroke="rgba(255,255,255,0.1)" />
          <circle cx="195" cy="56" r="10" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1.5" />
          <text x="195" y="78" textAnchor="middle" fill="#F8FAFC" fontFamily="sans-serif" fontSize="8.5" fontWeight="600">Messages</text>

          <rect x="94" y="96" width="132" height="38" rx="8" fill="#1E293B" stroke="#3B82F6" strokeOpacity="0.2" />
          <text x="110" y="114" fill="#93C5FD" fontFamily="monospace" fontSize="8" fontWeight="bold">VOICE GUIDE</text>
          <text x="110" y="125" fill="#E2E8F0" fontFamily="sans-serif" fontSize="8">"Scam awareness & easy touch"</text>
          <circle cx="210" cy="115" r="7" fill="#3B82F6" />
        </svg>
      );

    case "restaurant-billing":
      return (
        <svg viewBox="0 0 320 180" className="pcard-svg-preview" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title-billing">
          <title id="title-billing">Restaurant POS and Billing Terminal Interface Preview</title>
          <rect width="320" height="180" fill="#0E0D16" />
          <rect x="36" y="20" width="130" height="140" rx="8" fill="#161424" stroke="#8B5CF6" strokeOpacity="0.3" />
          <text x="48" y="38" fill="#A78BFA" fontFamily="monospace" fontSize="8.5" fontWeight="bold">TABLE MATRIX</text>
          <rect x="48" y="48" width="22" height="22" rx="4" fill="#8B5CF6" fillOpacity="0.25" stroke="#8B5CF6" />
          <text x="55" y="62" fill="#E2E8F0" fontFamily="monospace" fontSize="8">T1</text>
          <rect x="76" y="48" width="22" height="22" rx="4" fill="rgba(255,255,255,0.05)" />
          <text x="83" y="62" fill="#64748B" fontFamily="monospace" fontSize="8">T2</text>
          <rect x="104" y="48" width="22" height="22" rx="4" fill="#8B5CF6" fillOpacity="0.25" stroke="#8B5CF6" />
          <text x="111" y="62" fill="#E2E8F0" fontFamily="monospace" fontSize="8">T3</text>
          <rect x="132" y="48" width="22" height="22" rx="4" fill="rgba(255,255,255,0.05)" />
          <text x="139" y="62" fill="#64748B" fontFamily="monospace" fontSize="8">T4</text>
          <rect x="48" y="80" width="106" height="6" rx="2" fill="rgba(255,255,255,0.1)" />
          <rect x="48" y="92" width="85" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="48" y="104" width="95" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="48" y="122" width="106" height="22" rx="4" fill="#2E1065" stroke="#8B5CF6" />
          <text x="56" y="136" fill="#DDD6FE" fontFamily="monospace" fontSize="8.5" fontWeight="bold">TOTAL: ₹ 1,420</text>

          <rect x="180" y="24" width="104" height="132" rx="4" fill="#F8FAFC" stroke="rgba(255,255,255,0.2)" />
          <text x="190" y="42" fill="#0F172A" fontFamily="monospace" fontSize="8" fontWeight="bold">TAX INVOICE</text>
          <line x1="190" y1="48" x2="274" y2="48" stroke="#CBD5E1" strokeDasharray="2 2" />
          <rect x="190" y="56" width="60" height="4" fill="#64748B" />
          <rect x="190" y="66" width="70" height="4" fill="#94A3B8" />
          <rect x="190" y="76" width="50" height="4" fill="#94A3B8" />
          <line x1="190" y1="90" x2="274" y2="90" stroke="#CBD5E1" />
          <text x="190" y="106" fill="#0F172A" fontFamily="monospace" fontSize="9" fontWeight="bold">PAID • CASH/CARD</text>
          <text x="190" y="138" fill="#64748B" fontFamily="monospace" fontSize="7">PYTHON BACKEND</text>
        </svg>
      );

    case "calorie-tracker":
      return (
        <svg viewBox="0 0 320 180" className="pcard-svg-preview" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title-calorie">
          <title id="title-calorie">Calorie Tracker Health Interface Preview</title>
          <rect width="320" height="180" fill="#120A14" />
          <circle cx="110" cy="90" r="54" stroke="#26142A" strokeWidth="9" />
          <circle cx="110" cy="90" r="54" stroke="#EC4899" strokeWidth="9" strokeDasharray="339" strokeDashoffset="90" strokeLinecap="round" />
          <text x="110" y="86" textAnchor="middle" fill="#F8FAFC" fontFamily="sans-serif" fontSize="16" fontWeight="bold">1,840</text>
          <text x="110" y="100" textAnchor="middle" fill="#94A3B8" fontFamily="monospace" fontSize="8">/ 2,200 KCAL</text>

          <rect x="185" y="42" width="105" height="24" rx="6" fill="#201124" stroke="rgba(255,255,255,0.06)" />
          <text x="194" y="54" fill="#F472B6" fontFamily="monospace" fontSize="7.5" fontWeight="bold">PROTEIN • 142g</text>
          <rect x="194" y="58" width="75" height="3" rx="1.5" fill="#EC4899" />

          <rect x="185" y="74" width="105" height="24" rx="6" fill="#201124" stroke="rgba(255,255,255,0.06)" />
          <text x="194" y="86" fill="#38BDF8" fontFamily="monospace" fontSize="7.5" fontWeight="bold">CARBS • 190g</text>
          <rect x="194" y="90" width="60" height="3" rx="1.5" fill="#38BDF8" />

          <rect x="185" y="106" width="105" height="24" rx="6" fill="#201124" stroke="rgba(255,255,255,0.06)" />
          <text x="194" y="118" fill="#FBBF24" fontFamily="monospace" fontSize="7.5" fontWeight="bold">FATS • 54g</text>
          <rect x="194" y="122" width="45" height="3" rx="1.5" fill="#FBBF24" />
        </svg>
      );

    case "lab5-rds":
      return (
        <svg viewBox="0 0 320 180" className="pcard-svg-preview" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title-rds">
          <title id="title-rds">AWS EC2 and RDS PostgreSQL Topology Preview</title>
          <rect width="320" height="180" fill="#081017" />
          <rect x="25" y="20" width="270" height="140" rx="10" stroke="#06B6D4" strokeDasharray="4 4" strokeOpacity="0.4" fill="#0C1722" />
          <text x="38" y="36" fill="#06B6D4" fontFamily="monospace" fontSize="8.5" fontWeight="bold">AWS VPC: 10.0.0.0/16</text>

          <rect x="45" y="52" width="95" height="85" rx="8" fill="#132435" stroke="#06B6D4" strokeOpacity="0.5" />
          <circle cx="65" cy="72" r="10" fill="#F97316" fillOpacity="0.2" stroke="#F97316" />
          <text x="65" y="75" textAnchor="middle" fill="#F97316" fontFamily="monospace" fontSize="9" fontWeight="bold">EC2</text>
          <text x="82" y="74" fill="#E2E8F0" fontFamily="monospace" fontSize="8" fontWeight="bold">Listmonk</text>
          <text x="55" y="94" fill="#94A3B8" fontFamily="monospace" fontSize="7.5">Public Subnet</text>
          <rect x="55" y="102" width="75" height="16" rx="3" fill="#0C1722" />
          <text x="62" y="113" fill="#34D399" fontFamily="monospace" fontSize="7">● systemd: active</text>

          <line x1="140" y1="94" x2="175" y2="94" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3 3" />
          <polygon points="175,91 182,94 175,97" fill="#06B6D4" />

          <rect x="180" y="52" width="95" height="85" rx="8" fill="#132435" stroke="#3B82F6" strokeOpacity="0.5" />
          <circle cx="200" cy="72" r="10" fill="#3B82F6" fillOpacity="0.2" stroke="#3B82F6" />
          <text x="200" y="75" textAnchor="middle" fill="#3B82F6" fontFamily="monospace" fontSize="9" fontWeight="bold">RDS</text>
          <text x="216" y="74" fill="#E2E8F0" fontFamily="monospace" fontSize="8" fontWeight="bold">Postgres</text>
          <text x="190" y="94" fill="#94A3B8" fontFamily="monospace" fontSize="7.5">Private Subnet</text>
          <rect x="190" y="102" width="75" height="16" rx="3" fill="#0C1722" />
          <text x="196" y="113" fill="#38BDF8" fontFamily="monospace" fontSize="7">SG Port: 5432</text>
        </svg>
      );

    case "assignment-dynamodb":
      return (
        <svg viewBox="0 0 320 180" className="pcard-svg-preview" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title-dynamodb">
          <title id="title-dynamodb">AWS DynamoDB Single-Table Key Modeling Preview</title>
          <rect width="320" height="180" fill="#131108" />
          <rect x="25" y="20" width="270" height="140" rx="8" fill="#1C180C" stroke="#EAB308" strokeOpacity="0.35" />
          <text x="40" y="38" fill="#FACC15" fontFamily="monospace" fontSize="8.5" fontWeight="bold">DYNAMODB TABLE: BOTO3_CRUD</text>
          <rect x="38" y="48" width="244" height="20" rx="4" fill="#2A2413" />
          <text x="50" y="61" fill="#FDE047" fontFamily="monospace" fontSize="8" fontWeight="bold">PartitionKey (PK)</text>
          <text x="140" y="61" fill="#FDE047" fontFamily="monospace" fontSize="8" fontWeight="bold">SortKey (SK)</text>
          <text x="220" y="61" fill="#FDE047" fontFamily="monospace" fontSize="8" fontWeight="bold">Payload</text>

          <rect x="38" y="72" width="244" height="18" fill="rgba(255,255,255,0.03)" />
          <text x="50" y="84" fill="#E2E8F0" fontFamily="monospace" fontSize="7.5">USER#10914</text>
          <text x="140" y="84" fill="#94A3B8" fontFamily="monospace" fontSize="7.5">PROFILE#META</text>
          <text x="220" y="84" fill="#34D399" fontFamily="monospace" fontSize="7.5">&#123; verified: true &#125;</text>

          <rect x="38" y="94" width="244" height="18" fill="rgba(255,255,255,0.05)" />
          <text x="50" y="106" fill="#E2E8F0" fontFamily="monospace" fontSize="7.5">USER#10914</text>
          <text x="140" y="106" fill="#94A3B8" fontFamily="monospace" fontSize="7.5">METRIC#2026</text>
          <text x="220" y="106" fill="#38BDF8" fontFamily="monospace" fontSize="7.5">&#123; points: 89 &#125;</text>

          <rect x="38" y="122" width="244" height="24" rx="4" fill="#131006" stroke="rgba(255,255,255,0.08)" />
          <text x="48" y="137" fill="#EAB308" fontFamily="monospace" fontSize="8">Single-Table Design • RCU: 1.0 • WCU: 1.0</text>
        </svg>
      );

    default:
      return (
        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#64748B", fontFamily: "monospace", fontSize: 11 }}>
          PROJECT PREVIEW
        </div>
      );
  }
}
