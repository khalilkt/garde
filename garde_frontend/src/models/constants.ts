export const rootUrl = "https://localhost:81/";
// export const rootUrl = "https://162.0.239.121:81/";

export interface PaginatedData<T> {
  count: number;
  page: number;
  total_pages: number;
  data: T[];
}

export const MATERIAL_NAME: { [key: string]: string } = {
  wood: "Bois",
  plastic: "Plastique",
  metal: "Métal",
  polyester: "Polyester",
};
