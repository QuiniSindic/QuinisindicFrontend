export interface SportLite {
  id: number;
  name: string;
}

export interface SportOption extends SportLite {
  slug: string;
  displayName: string;
}
