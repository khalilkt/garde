// export const rootUrl = "http://localhost/api/";
// export const rootUrl = "http://127.0.0.1:8000/";
export const rootUrl = "http://162.0.239.121:8001/api/";

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
