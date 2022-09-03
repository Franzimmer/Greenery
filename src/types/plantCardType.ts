export interface PlantCard {
  cardId: string;
  ownerId: string;
  plantName: string;
  plantPhoto?: string;
  species: string;
  waterPref?: string;
  lightPref?: string;
  tags?: string[];
  birthday?: number;
  parents?: string;
}
