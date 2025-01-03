export const START_YEAR = 2023;

export const rootUrl = "https://gcm-ci.org:81/";
// export const rootUrl = "http://localhost:8000/";

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

export const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
