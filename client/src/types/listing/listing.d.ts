export interface IListing {
  _id?: string;
  name: string;
  description: string;
  address: string;
  listingType: string;
  bedrooms: number;
  bathrooms: number;
  regularPrice: number;
  discountedPrice: number;
  offer: boolean;
  parking: boolean;
  furnished: boolean;
  imageUrls: string[];
}
