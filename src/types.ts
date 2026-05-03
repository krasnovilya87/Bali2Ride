export interface Bike {
  id: string;
  name: string;
  type: 'scooter' | 'sport' | 'adventure' | 'cruiser';
  engineSize: string;
  pricePerDay: number;
  image: string;
  imagesByYear?: Record<number, string>;
  colors?: { name: string; hex: string; image?: string }[];
  description: string;
  features: string[];
}

export type BikeType = Bike['type'] | 'all';
