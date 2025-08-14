export interface PayloadVoiceover {
  id: string;
  name: string;
  description?: string;
  profilePhoto?:
    | {
        id: string;
        url: string;
        filename: string;
        mimeType?: string;
        alt?: string;
      }
    | string;
  additionalPhotos?: Array<{
    photo:
      | {
          id: string;
          url: string;
          filename: string;
          mimeType?: string;
        }
      | string;
    caption?: string;
  }>;
  styleTags: Array<{
    tag: string;
    customTag?: string;
  }>;
  fullDemoReel?:
    | {
        id: string;
        url: string;
        filename: string;
        mimeType?: string;
      }
    | string;
  commercialsDemo?:
    | {
        id: string;
        url: string;
        filename: string;
        mimeType?: string;
      }
    | string;
  narrativeDemo?:
    | {
        id: string;
        url: string;
        filename: string;
        mimeType?: string;
      }
    | string;
  status: 'active' | 'draft' | 'more-voices' | 'archived';
  cohort?:
    | {
        id: string;
        name: string;
        slug: string;
        color: string;
        description?: string;
        isActive?: boolean;
      }
    | string;
  availability?: {
    isAvailable?: boolean;
    unavailableFrom?: string;
    unavailableUntil?: string;
  };
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransformedVoiceover {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  profilePhoto?: {
    url: string;
    alt?: string;
  };
  demos: VoiceoverDemo[];
  status: string;
  cohort?: {
    id: string;
    name: string;
    slug: string;
    color: string;
    description?: string;
    isActive?: boolean;
  };
  styleTags?: Array<{
    tag: string;
    customTag?: string;
  }>;
  tags: string[];
  beschikbaar: boolean;
  color?: string;
  availabilityText?: string;
}

export interface VoiceoverDemo {
  id: string;
  title: string;
  demoType: 'reel' | 'commercials' | 'narrations';
  audioFile: {
    url: string;
    filename: string;
  };
  duration?: string;
  language?: string;
  accent?: string;
  tags?: string[];
  isPrimary?: boolean;
  description?: string;
  voiceover: {
    id: string;
    name: string;
    slug: string;
  };
}
