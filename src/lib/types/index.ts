export interface Portofolio {
  project_name: string;
  slug: string;
  client: string;
  short_description: string;
  long_description_p1?: string;
  long_description_p2?: string;
  location: string;
  category: string;
  status: string;
  images: string[];
}

export interface Team {
  name: string;
  title: string;
  image: string;
}

export interface Expertise {
  title: string;
  slug: string;
  image: string;
  description: string;
  how: string;
  why: string;
  portofolio: string[];
}