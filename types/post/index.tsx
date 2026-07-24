export type Post = {
  title: string;
  pagesite?: {
    url?: string;
  };
  slug: string;
  content: string;
  tags?: string[];
  summary?: string;

  hideOptions?: {
    hidePagesite?: boolean;
    hideAuthor?: boolean;
    hideCreated?: boolean;
    hideUpdated?: boolean;
    hideReadingTime?: boolean;
    hideTags?: boolean;
    hideSummary?: boolean;
  };

  author?: {
    name?: string;
    link?: string;
    handle?: string;
  };

  time: {
    created: string;
    updated: string;
  };

  media?: {
    image?: string;
    video?: string;
    audio?: string;
  };

  categorization?: {
    readingTime?: string;
  };

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  audience?: {
    likes?: number;
    views?: number;
    comments?: number;
  };

  related?: {
    media?: string[];
    links?: string[];
    posts?: string[];
  };

  social?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    pinterest?: string;
    others?: string[];
  };
};
