import type { Portofolio, Team, Expertise } from "./types";

export const route: Record<string, string> = {
  root: '/',
  about: '/about',
  portofolio: '/portofolio',
  expertise: '/expertise',
  contact: '/contact',
  cookies_policy: '/cookies-policy',
  legal_terms: '/legal-terms',
  privacy_policy: '/privacy-policy',
};

export const portofolio: Portofolio[] = [
  {
    project_name: "Mandarin Oriental Hotel",
    slug: "mandarin-oriental-hotel",
    client: "Mandarin oriental",
    short_description: "Structural reinforcement and MEP works for a hotel project in Jakarta, focused on improving safety, functionality, and long-term performance of the building.",
    long_description_p1: "This project involved comprehensive structural strengthening and MEP (Mechanical, Electrical, and Plumbing) works at Mandarin Hotel in Jakarta. The objective was to enhance the building’s structural integrity while upgrading essential systems to meet modern standards. Our team conducted detailed assessments to identify key areas requiring reinforcement. Based on these insights, we implemented targeted solutions to strengthen the existing structure, ensuring long-term safety and durability.",
    long_description_p2: "At the same time, the MEP systems were upgraded and optimized to improve efficiency, reliability, and overall building performance. This included enhancing electrical, plumbing, and mechanical systems to meet current operational demands. Through careful planning and precise execution, Precious Contractor delivered a high-quality result with minimal disruption to ongoing hotel operations, ensuring the building is well-prepared for long-term use.",
    location: "Jakarta, Bundaran HI",
    category: "MEP & Structural Works",
    status: "Ongoing",
    images: [
      "/portofolio/mandarin/1.webp",
      "/portofolio/mandarin/2.webp",
      "/portofolio/mandarin/3.webp",
      "/portofolio/mandarin/4.webp"
    ]
  },
  {
    project_name: "Eka hospital PIK",
    slug: "eka-hospital-pik",
    client: "Eka Hospital",
    short_description: "Interior renovation project at Eka Hospital PIK, focused on enhancing functionality, comfort, and a modern healthcare environment.",
    long_description_p1: "This project involved the renovation of interior spaces at Eka Hospital PIK in Jakarta. The goal was to upgrade the hospital environment to meet modern healthcare design standards, improving both patient comfort and operational efficiency. Our team focused on the refurbishment of key interior areas, carefully selecting high-quality materials and optimizing layouts to create a clean, functional, and professional medical environment.",
    long_description_p2: "The design and execution were planned in detail to ensure minimal disruption to ongoing hospital activities, allowing operations to continue smoothly throughout the renovation process. Precious Contractor delivered a refined and efficient interior that enhances the patient experience while maintaining strict standards of safety, hygiene, and functionality.",
    location: "Jakarta, PIK",
    category: "Interior Renovation",
    status: "Ongoing",
    images: [
      "/portofolio/eka-pik/1.webp",
      "/portofolio/eka-pik/2.webp",
      "/portofolio/eka-pik/3.webp",
      "/portofolio/eka-pik/4.webp"
    ]
  },
  {
    project_name: "Villa Kemang",
    slug: "villa-kemang",
    client: "Private client",
    short_description: "Construction of a private villa in Kemang, Jakarta, focused on modern living, quality finishes, and long-term durability.",
    long_description_p1: "This project involves the construction of a private villa located in Kemang, one of Jakarta’s most dynamic residential areas. The villa spans approximately 1,000 square meters and includes a basement, ground floor, two upper floors, and a private swimming pool, designed to offer a complete and modern living experience. The goal is to create a comfortable and high-end home that combines functional design with quality construction.",
    long_description_p2: "Precious Contractor is currently managing the execution with a strong focus on structural integrity, material selection, and detailed finishing, ensuring both durability and a refined aesthetic throughout the property. The project is still in progress, with ongoing coordination and planning to maintain a smooth construction process and ensure the final result meets high-quality standards.",
    location: "Jakarta, Kemang",
    category: "Villa Construction",
    status: "Ongoing",
    images: [
      "/portofolio/villa-kemang/1.webp",
      "/portofolio/villa-kemang/2.webp",
      "/portofolio/villa-kemang/3.webp",
      "/portofolio/villa-kemang/4.webp"
    ]
  },
  {
    project_name: "Kitchen Nike Factory",
    slug: "kitchen-nike-factory",
    client: "Nike (Factory Facility)",
    short_description: "Kitchen renovation project at a Nike factory in Sukabumi, focused on functionality, hygiene standards, and efficient workspace design.",
    long_description_p1: "This project involved the renovation of a kitchen facility within a Nike factory located in Sukabumi. The objective was to upgrade the space to meet high standards of functionality, hygiene, and operational efficiency required in an industrial environment. The renovation focused on improving layout efficiency, material durability, and overall workflow.",
    long_description_p2: "Precious Contractor executed the project with attention to detail, selecting high-quality materials and implementing solutions that enhance long-term reliability and performance. All work was carried out with close coordination to minimize disruption to factory activities, ensuring a smooth renovation process while maintaining high standards of quality and compliance.",
    location: "Sukabumi",
    category: "Kitchen Renovation",
    status: "Completed in December 2025",
    images: [
      "/portofolio/nike/1.webp",
      "/portofolio/nike/2.webp",
      "/portofolio/nike/3.webp",
      "/portofolio/nike/4.webp"
    ]
  },
  {
    project_name: "TMG Hotel",
    slug: "tmg-hotel",
    client: "TMG Hotel",
    short_description: "Installation of a glass rooftop at the hotel entrance, enhancing both functionality and visual appeal.",
    long_description_p1: "This project involved the installation of a glass rooftop at the main entrance of TMG Hotel. The objective was to create a modern and welcoming entry experience while providing effective protection from weather conditions. The design was carefully developed to complement the hotel’s architecture, allowing natural light to enhance the entrance.",
    long_description_p2: "Precious Contractor executed the installation with a strong focus on structural stability, precision, and the use of high-quality materials to ensure durability and safety. The result is a refined entrance feature that improves both the visual appeal of the hotel and the comfort of guests and visitors.",
    location: "Jakarta, Tebet",
    category: "Glass & Structural Installation",
    status: "Completed in June 2025",
    images: [
      "/portofolio/tmg/1.webp",
      "/portofolio/tmg/2.webp",
      "/portofolio/tmg/3.webp",
      "/portofolio/tmg/4.webp"
    ]
  },
  {
    project_name: "Chopstix",
    slug: "chopstix",
    client: "Chopstix Restaurant",
    short_description: "Interior and kitchen renovation for Chopstix Restaurant, focused on functionality, efficiency, and an improved dining experience.",
    long_description_p1: "This project involved the renovation of both the dining area and kitchen at Chopstix Restaurant, located in Pondok Indah Mall, Jakarta. The objective was to enhance the overall customer experience while improving the efficiency and functionality of kitchen operations. The dining area was upgraded with a clean and modern interior, creating a more comfortable and visually appealing environment for guests.",
    long_description_p2: "At the same time, the kitchen layout was optimized to improve workflow, organization, and compliance with professional hygiene standards. Precious Contractor executed the renovation with attention to detail, delivering a functional and well-balanced result that supports both service quality and operational efficiency.",
    location: "Jakarta, Pondok Indah Mall",
    category: "Interior & Kitchen Renovation",
    status: "Completed in March 2025",
    images: [
      "/portofolio/chopstix/1.webp",
      "/portofolio/chopstix/2.webp",
      "/portofolio/chopstix/3.webp",
      "/portofolio/chopstix/4.webp"
    ]
  },
  {
    project_name: "Trihamas Building",
    slug: "trihamas-building",
    client: "Trihamas Building",
    short_description: "Structural strengthening works at Trihamas Building, including injection, FRP installation, and grouting to improve structural integrity and durability.",
    long_description_p1: "This project focused on strengthening the existing structure of the Trihamas Building to ensure long-term safety, stability, and performance. The scope included structural injection, Fiber Reinforced Polymer (FRP) application, and precision grouting works. Concrete injection was carried out to repair cracks and restore structural continuity.",
    long_description_p2: "In addition, FRP systems were applied to enhance load-bearing capacity and precision grouting was executed to fill voids. All works were performed with high accuracy and in accordance with engineering standards, with minimal disruption to building operations, resulting in a safer and more durable structure.",
    location: "Jakarta",
    category: "Structural Strengthening (Injection, FRP, Grouting)",
    status: "Completed in September 2023",
    images: [
      "/portofolio/trihamas/1.webp",
      "/portofolio/trihamas/2.webp",
      "/portofolio/trihamas/3.webp",
      "/portofolio/trihamas/4.webp"
    ]
  },
  {
    project_name: "Resort Bintang Laut",
    slug: "resort-bintang-laut",
    client: "Resort Bintang Laut",
    short_description: "Design and build project for a coastal resort, focused on creating a modern, functional, and high-quality hospitality environment.",
    long_description_p1: "This project involved the complete design and construction of Resort Bintang Laut, located in a coastal area. The objective was to develop a modern resort that combines functionality, comfort, and aesthetic appeal, while maximizing the unique seaside location. Precious Contractor was responsible for both the design and build process.",
    long_description_p2: "The design focused on clean architectural lines and efficient layouts. Throughout the construction phase, high-quality materials and precise workmanship were applied to ensure durability and long-term performance, resulting in a well-executed resort that meets modern hospitality standards.",
    location: "Banten",
    category: "Design & Build",
    status: "Completed in December 2022",
    images: [
      "/portofolio/bintang-laut/1.webp",
      "/portofolio/bintang-laut/2.webp",
      "/portofolio/bintang-laut/3.webp",
      "/portofolio/bintang-laut/4.webp"
    ]
  },
  {
    project_name: "Rusun Tambora LPSE",
    slug: "rusun-tambora-lpse",
    client: "Dinas Perumahan Rakyat dan Kawasan Permukiman DKI Jakarta",
    short_description: "Revitalization of panel fence assets at Rusun Tambora, focused on improving safety, durability, and overall site condition.",
    long_description_p1: "This project involved the revitalization of panel fence assets at Rusun Tambora, aimed at restoring and improving both security and structural condition within the area. The scope included the repair, replacement, and strengthening of existing concrete panel fencing systems, ensuring the upgraded fencing meets functional and structural requirements.",
    long_description_p2: "The project was carried out in an active residential environment, with careful planning to minimize disruption to residents. Precious Contractor executed the work with a strong focus on quality and efficiency, resulting in improved security, a cleaner appearance, and enhanced functionality for the housing complex.",
    location: "Jakarta, Tambora",
    category: "Fence Revitalization / Panel Fence Works",
    status: "Completed in 2024",
    images: [
      "/portofolio/rusun-tambora/1.webp",
      "/portofolio/rusun-tambora/2.webp",
      "/portofolio/rusun-tambora/3.webp",
      "/portofolio/rusun-tambora/4.webp"
    ]
  },
  {
    project_name: "Project Gerai Bakso Malang",
    slug: "project-gerai-bakso-malang",
    client: "PT Champ Resto Indonesia Tbk",
    short_description: "Construction and interior fit-out of a food court area at Bandung, focused on modern design, functionality, and customer experience.",
    long_description_p1: "This project involved the construction and interior fit-out of a food court area located at Cryomart Bandung. The objective was to create a modern, efficient, and visually appealing dining environment. Precious Contractor executed the civil and interior works, including counter construction, seating areas, and integration of mechanical systems.",
    long_description_p2: "The design features a combination of clean lines and bold accents. Special attention was given to layout efficiency and durability of materials to ensure long-term performance in a high-traffic environment. The result is an attractive space that supports both tenant operations and customer comfort.",
    location: "Bandung",
    category: "Food Court Construction / Interior Fit-Out",
    status: "Completed in June 2025",
    images: [
      "/portofolio/bakso-malang/1.webp",
      "/portofolio/bakso-malang/2.webp",
      "/portofolio/bakso-malang/3.webp",
      "/portofolio/bakso-malang/4.webp"
    ]
  }
];

export const teams: Team[] = [
  {
    name: "Nugroho Kristiano (Kris)",
    title: "Director",
    image: "/teams/nugroho-kristiano-kris.webp"
  },
  {
    name: "R. Bagus Himawan Pradipta (Diptasinyo)",
    title: "Manager Operational",
    image: "/teams/r-bagus-himawan-pradipta-diptasinyo.webp"
  },
  {
    name: "Pontianus Pratondo",
    title: "Legal Manager",
    image: "/teams/pontianus-pratondo.webp"
  },
  {
    name: "Neo",
    title: "Architect",
    image: "/teams/neo.webp"
  },
  {
    name: "Yustam Efendi",
    title: "SPV Engineering",
    image: "/teams/yustam-efendi.webp"
  },
  {
    name: "Warsito (Sadam)",
    title: "SPV Engineering",
    image: "/teams/warsito-sadam.webp"
  },
  {
    name: "Mukhlis (Muklay)",
    title: "SPV Engineering",
    image: "/teams/mukhlis-muklay.webp"
  },
  {
    name: "Teun Wagt",
    title: "Digital Marketing Specialist",
    image: "/teams/teun-wagt.webp"
  },
  {
    name: "Sheila Diva Cornelia",
    title: "Drafter",
    image: "/teams/sheila-diva-cornelia.webp"
  },
  {
    name: "Khopipah Pratiwi (Ovi)",
    title: "Administrative Admin",
    image: "/teams/khopipah-pratiwi-ovi.webp"
  },
  {
    name: "Dwi Ariana",
    title: "Sales Marketing",
    image: "/teams/dwi-ariana.webp"
  }
]

export const preciousemail: string = 'kris@preciouscontractor.co.id';
export const preciousPhone: string = '+62811100047';

export const expertises: Expertise[] = [
  {
    image: "/expertise-1.webp",
    title: "Construction",
    slug: "construction",
    description: "Professional construction services for residential and commercial projects, delivered with strong technical expertise, precise coordination, and efficient execution. From planning to completion, every project is handled with a focus on quality, safety, reliability, and long-lasting results.",
    how: "We begin with detailed project planning and preparation, working closely with clients, consultants, and engineers to define requirements, timelines, and technical specifications. During execution, we manage new construction, renovation, and structural works while maintaining safety, using high-quality materials, applying skilled workmanship, and ensuring strong coordination, monitoring, and on-site supervision.",
    why: "Precious Contractor is a trusted construction company known for reliable service and high-quality outcomes. Our ability to manage residential and commercial projects with efficiency and precision ensures that every project is completed on time, meets technical requirements, and delivers long-term value.",
    portofolio: ["villa-kemang", "resort-bintang-laut", "project-gerai-bakso-malang"]
  },
  {
    image: "/expertise-5.webp",
    title: "Interior",
    slug: "interior",
    description: "Professional interior design and fit-out services for residential and commercial projects, creating spaces that are modern, functional, and visually refined. Each interior is designed to improve comfort, efficiency, user experience, and property value.",
    how: "Our process starts with concept development and space planning, where we define the client’s needs, preferences, and the purpose of the space. We then create functional interior designs and execute full fit-out works, including interior construction, custom-built elements, furniture, flooring, walls, ceilings, and detailed finishing, supported by efficient coordination and on-site supervision.",
    why: "Precious Contractor is a trusted partner for interior design and fit-out, known for delivering high-quality interiors with strong attention to detail, functionality, and execution. Our full-service approach allows clients to rely on one company from design to completion, ensuring timely delivery, high standards, and long-term value.",
    portofolio: ["eka-hospital-pik", "kitchen-nike-factory", "chopstix"]
  },
  {
    image: "/expertise-6.webp",
    title: "MEP & Structural Works",
    slug: "mep-structural-works",
    description: "Professional MEP and structural engineering services for residential and commercial projects, ensuring that buildings operate safely, efficiently, and reliably. By combining expertise in building systems and structural integrity, we deliver durable, high-performance solutions with long-term value.",
    how: "We handle each project with a combination of engineering expertise and practical execution, covering electrical installations, plumbing systems, HVAC, climate control, structural construction, reinforcement, and foundation works. We also provide specialized services such as FRP strengthening, concrete repair, grouting, and structural rehabilitation, all supported by strict quality control, project management, and on-site supervision.",
    why: "Precious Contractor is a trusted partner for MEP and structural works, offering integrated technical solutions within one company to improve efficiency and reduce risk. With experience in complex and high-end projects, including specialized structural repair solutions, we deliver safe, reliable, and long-lasting results.",
    portofolio: ["mandarin-oriental-hotel", "trihamas-building", "tmg-hotel"]
  },
  {
    image: "/expertise-4.webp",
    title: "Bore Piling",
    slug: "bore-piling",
    description: "Professional foundation and piling services, including bored piling solutions for residential and commercial construction projects. Our foundation systems are designed to provide strong structural support, durability, and long-term performance, even in challenging soil conditions.",
    how: "We begin with site assessment and soil analysis to determine the most suitable piling and foundation system for each project. Our services include bored piling, driven piling, mini piling, pile caps, ground beams, and reinforced concrete foundations, all executed with precise alignment, strict safety standards, and strong coordination and on-site supervision.",
    why: "Precious Contractor is a trusted partner for foundation and piling works, known for reliable and high-quality structural solutions. Our expertise across different piling systems and site conditions ensures every project is built on a solid, dependable foundation with reduced risk and strong long-term performance.",
    portofolio: ["villa-kemang", "resort-bintang-laut", "trihamas-building"]
  },
  {
    image: "/expertise-7.webp",
    title: "Home Design",
    slug: "home-design",
    description: "Professional home design services that create modern, functional, and personalized living spaces tailored to each client’s lifestyle and vision. Our designs combine architecture, space planning, and interior integration to deliver homes that are refined, comfortable, and practical for everyday living.",
    how: "Our process starts with concept development, where we understand the client’s needs, preferences, and lifestyle. We then translate these into detailed architectural designs with clean lines, efficient layouts, natural light, ventilation, and strong indoor-outdoor connection, supported by interior planning, 2D drawings, layout plans, and 3D visualizations before construction begins.",
    why: "Precious Contractor is a trusted partner for residential and villa design, known for combining functionality with modern aesthetics. Our personalized and integrated approach ensures that each project is tailored to the client while delivering a cohesive design and long-term living comfort.",
    portofolio: ["villa-kemang", "resort-bintang-laut", "eka-hospital-pik"]
  },
  {
    image: "/expertise-8.webp",
    title: "Development",
    slug: "development",
    description: "Professional real estate development services focused on residential and investment projects that combine market insight, strategic planning, and reliable execution. Our integrated approach creates properties that meet user needs while delivering strong market positioning and long-term value.",
    how: "We start with site and market analysis to evaluate location potential, target groups, and market demand. From there, we move into concept development and planning, balancing design, functionality, and return on investment, while integrating architecture, construction, and technical services through full project coordination, timeline management, and quality control.",
    why: "Precious Contractor is a reliable partner for real estate development, known for delivering well-structured and high-quality residential and investment projects. Our integrated process gives clients better efficiency, consistency, and reduced risk, while ensuring each development is both attractive and financially viable.",
    portofolio: ["resort-bintang-laut", "villa-kemang", "tmg-hotel"]
  }
];