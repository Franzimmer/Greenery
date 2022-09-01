export interface PlantCard {
  cardId: string;
  ownerId: string;
  plantName: string;
  species: string;
  tags: string[];
  birthday?: number;
  parents?: string[];
}
