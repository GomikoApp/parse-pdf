export enum Category {
  Recyclable = 'Recyclable',
  NonBurnable = 'Non-burnable',
  Burnable = 'Burnable',
  OversizedBurnable = 'Oversized Burnable',
  OversizedNonBurnable = 'Oversized Non-burnable',
  WeDontCollect = 'We Don\'t Collect',
  Plastic = 'Plastic',
  HazardousWaste = 'Hazardous waste',
}

export interface Item {
  name: string,
  category: Category,
  notes?: string,
}

export interface Entry {
  x: number,
  y: number,
  w: number,
  text: string,
}