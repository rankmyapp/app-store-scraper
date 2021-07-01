export interface ITunesCategoryItem {
  id: string;
  appId: string;
  title: string;
  icon: string;
  url: any;
  price: number;
  currency: string;
  free: boolean;
  description?: string;
  developer: string;
  developerUrl?: string;
  developerId?: string;
  genre: string;
  genreId: string;
  released: string;
}