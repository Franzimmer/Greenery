export interface PlantCard {
  cardId: string | null;
  ownerId: string;
  plantName: string;
  species: string;
  plantPhoto?: string;
  waterPref?: string;
  lightPref?: string;
  toxicity?: string;
  tags?: string[];
  birthday?: number;
  parents?: string[];
  followers: number;
}
