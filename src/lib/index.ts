import type { Portofolio, Team } from "./types";

export const route: Record<string, string> = {
  root: '/',
  about: '/about',
  portofolio: '/portofolio',
  expertise: '/expertise',
  contact: '/contact'
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