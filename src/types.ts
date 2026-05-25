export interface AnimeAnalysis {
  characterName: string;
  estimatedAge: string;
  estimatedAgeGroup: "兒童" | "青少年" | "青年" | "成年" | "長者" | "不詳/長生不老";
  visualEvidence: string[];
  features: {
    hairColor: string;
    hairStyle: string;
    eyeStyle: string;
    clothing: string;
    accessory: string;
  };
  personalityVibe: {
    primaryVibe: string;
    description: string;
  };
  confidenceScore: number;
  animeArchetype: string;
  customCardQuote: string;
}

export interface SampleCharacter {
  id: string;
  name: string;
  imageUrl: string;
  source: string;
}
