export interface PlantCard {
  cardId: string;
  ownerId: string;
  plantName: string;
  species: string;
  plantPhoto?: string;
  waterPref?: string;
  lightPref?: string;
  tags?: string[];
  birthday?: number;
  parents?: string;
}
