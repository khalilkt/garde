import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { SearchSelect, Select, Title } from "../../components/comps";
import React, { useContext } from "react";
import { CountryInterface } from "./pirogue_detail_page";
import { AuthContext } from "../../App";
import axios from "axios";
import { MATERIAL_NAME, rootUrl } from "../../models/constants";
import { useSearchParams } from "react-router-dom";

export default function AdminStatsPage() {
  const token = useContext(AuthContext).authData?.token;

  const countriesNameCache = React.useRef<{ [key: string]: string }>({});
  const [pieOptions, setPieOptions] = React.useState<ApexOptions>({
    series: [40, 60],
    tooltip: {
      enabled: false,
    },

    dataLabels: {
      enabled: false,
    },
    labels: ["Femme", "Homme"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    legend: {
      position: "bottom",
      offsetY: 0,
      height: 40,
    },
  });
  const [options, setOptions] = React.useState<ApexOptions>({
    tooltip: {
      enabled: false,
    },
    chart: {
      foreColor: "#333",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#0055FF"],
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },

    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Aout",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    series: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });
  const [pirogueOptions, setPirogueOptions] = React.useState<ApexOptions>({
    tooltip: {
      enabled: false,
    },
    chart: {
      foreColor: "#333",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#0055FF"],
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },

    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Aout",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    series: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });

  const [searchParams, setSearchParams] = useSearchParams();

  async function init() {}
  async function loadPiroguesStats() {
    // is_male=1&etat=alive&age=major&nationality=2&birth_country=201
    const pirogueParamsName = ["pirogue_nationality", "port", "material"];

    let params = new URLSearchParams();
    for (let param_name of pirogueParamsName) {
      if (searchParams.get(param_name)) {
        let name = param_name;
        if (name === "pirogue_nationality") {
          name = "nationality";
        }
        params.set(name, searchParams.get(param_name)!);
      }
    }
    try {
      const response = await axios.get(rootUrl + "stats/pirogues", {
        params: params,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data: {
        total: number;
        top_nationalities: {
          [key: string]: number;
        };
        total_by_month: {
          [key: string]: number;
        };
      } = response.data;

      setPirogueOptions({
        ...options,
        series: [
          {
            data: Object.values(data.total_by_month),
          },
        ],
      });

      // setPieOptions({
      //   ...pieOptions,
      //   series: [data.total_males, data.total_females],
      // });

      document.getElementById("asssss2")!.innerText = data.total.toString();
    } catch (e) {
      console.log(e);
    }
  }
  async function loadImmigrantsStats() {
    // is_male=1&etat=alive&age=major&nationality=2&birth_country=201
    const immigrantsParamsName = [
      "is_male",
      "age",
      "etat",
      "nationality",
      "birth_country",
    ];

    let params = new URLSearchParams();
    for (let param_name of immigrantsParamsName) {
      if (searchParams.get(param_name)) {
        params.set(param_name, searchParams.get(param_name)!);
      }
    }
    try {
      const response = await axios.get(rootUrl + "stats/immigrants", {
        params: params,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data: {
        total: number;
        total_males: number;
        total_females: number;
        total_by_month: {
          [key: string]: number;
        };
      } = response.data;

      setOptions({
        ...options,
        series: [
          {
            data: Object.values(data.total_by_month),
          },
        ],
      });

      setPieOptions({
        ...pieOptions,
        series: [data.total_males, data.total_females],
      });

      document.getElementById("asssss")!.innerText = data.total.toString();
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    loadImmigrantsStats();
    loadPiroguesStats();
  }, [searchParams]);
  const genre =
    searchParams.get("is_male") === null
      ? "none"
      : searchParams.get("is_male") === "1"
        ? "male"
        : "female";
  const selectedMaterial: string = searchParams.get("material")
    ? searchParams.get("material") ?? ""
    : "";

  return (
    <div className="flex flex-col">
      <Title className="mb-9">Statistiques</Title>
      <div className="flex items-center gap-x-4">
        <Select
          value={genre}
          onChange={(e) => {
            const value = e.target.value;
            setSearchParams((params) => {
              if (value === "none") {
                params.delete("is_male");
              } else if (value === "male") {
                params.set("is_male", "1");
              } else {
                params.set("is_male", "0");
              }
              return params;
            });
          }}
          className={`${genre === "none" ? "text-gray" : "text-black"}`}
        >
          <option value={"none"}>Genre</option>
          <option value={"male"}>Homme</option>
          <option value={"female"}>Femme</option>
        </Select>
        <Select
          value={searchParams.get("etat") ?? "none"}
          onChange={(e) => {
            const value = e.target.value;
            setSearchParams((params) => {
              if (value === "none") {
                params.delete("etat");
              } else {
                params.set("etat", value);
              }
              return params;
            });
          }}
          className={`${!searchParams.get("etat") ? "text-gray" : "text-black"}`}
        >
          <option value={"none"}>Etat</option>
          <option value={"alive"}>Vivant</option>
          <option value={"dead"}>Mort</option>
          <option value={"sick_evacuation"}>Evacuation Sanitaire</option>
          <option value={"pregnant"}>Enceinte</option>
        </Select>
        <Select
          value={searchParams.get("age") ?? "none"}
          onChange={(e) => {
            const value = e.target.value;
            setSearchParams((params) => {
              if (value === "none") {
                params.delete("age");
              } else {
                params.set("age", value);
              }
              return params;
            });
          }}
          className={`${!searchParams.get("age") ? "text-gray" : "text-black"}`}
        >
          <option value={"none"}>Age</option>
          <option value={"minor"}>Mineur</option>
          <option value={"major"}>Majeur</option>
        </Select>
        <div className="flex items-center gap-x-1">
          <SearchSelect<CountryInterface>
            className={"w-36"}
            value={
              searchParams.get("nationality")
                ? countriesNameCache.current[searchParams.get("nationality")!]
                : null
            }
            onSelected={function (value): void {
              countriesNameCache.current[value.id] = value.name_fr;
              setSearchParams((params) => {
                params.set("nationality", value.id.toString());
                return params;
              });
            }}
            placeHolder={"Nationalité"}
            search={true}
            url={"countries"}
            lookupColumn="name_fr"
          />
          {searchParams.get("nationality") && (
            <button
              onClick={() => {
                setSearchParams((params) => {
                  params.delete("nationality");
                  return params;
                });
              }}
            >
              <svg
                className="text-gray-500 h-5 w-5 cursor-pointer stroke-primary"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-x-1">
          <SearchSelect<CountryInterface>
            className={"w-48"}
            value={
              searchParams.get("birth_country")
                ? countriesNameCache.current[searchParams.get("birth_country")!]
                : null
            }
            onSelected={function (value): void {
              countriesNameCache.current[value.id] = value.name_fr;
              setSearchParams((params) => {
                params.set("birth_country", value.id.toString());
                return params;
              });
            }}
            placeHolder={"Lieu de naissance"}
            search={true}
            url={"countries"}
            lookupColumn="name_fr"
          />
          {/* close icon */}
          {searchParams.get("birth_country") && (
            <button
              onClick={() => {
                setSearchParams((params) => {
                  params.delete("birth_country");
                  return params;
                });
              }}
            >
              <svg
                className="text-gray-500 h-5 w-5 cursor-pointer stroke-primary"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flow-row mt-8 flex w-full gap-x-6">
        <div className="w-[60%] rounded-xl border-2 border-primaryBorder p-7">
          <div className="flex flex-col gap-y-4">
            <h1 className=" text-2xl font-semibold">
              Total Immigrants en {new Date().getFullYear()}
            </h1>
            <span className="mb-10" id="asssss">
              {}
            </span>
            <ReactApexChart
              options={options}
              series={options.series}
              type="bar"
              height={200}
            />
          </div>
        </div>

        <div className="w-[40%] rounded-xl border-2 border-primaryBorder p-7">
          <div className="flex flex-col">
            <h1 className="mb-10 text-2xl font-semibold">
              Répartition par genre
            </h1>
            <ReactApexChart
              options={pieOptions}
              series={pieOptions.series}
              type="donut"
              height={300}
            />
          </div>
        </div>
      </div>
      <div className="mt-10 flex w-1/2 items-center gap-x-4 gap-y-4">
        <Select
          value={selectedMaterial}
          className={selectedMaterial === "" ? "text-gray" : ""}
          onChange={(e) => {
            const value = e.target.value;

            setSearchParams((params) => {
              if (value === "") {
                params.delete("material");
              } else {
                params.set("material", value);
              }
              return params;
            });
          }}
        >
          <option value="" className="text-gray ">
            Matériel
          </option>
          <option value="wood">Bois</option>
          <option value="metal">Métal</option>
          <option value="plastic">Plastique</option>
          <option value="polyester">Polyester</option>
        </Select>

        <Select
          className={searchParams.get("port") ? "" : "text-gray"}
          value={searchParams.get("port") ?? ""}
          onChange={(e) => {
            setSearchParams((params) => {
              if (e.target.value === "") {
                params.delete("port");
              } else {
                params.set("port", e.target.value);
              }
              return params;
            });
          }}
        >
          <option value="">Port</option>
          <option value="ndagou">Ndagou</option>
          <option value="nouadhibou">Nouadhibou</option>
          <option value="nouakchott">Nouakchott</option>
          <option value="tanit">Tanit</option>
        </Select>
        <div className="flex items-center gap-x-1">
          <SearchSelect<CountryInterface>
            className={"w-44"}
            value={
              searchParams.get("pirogue_nationality")
                ? countriesNameCache.current[
                    searchParams.get("pirogue_nationality")!
                  ]
                : null
            }
            onSelected={function (value): void {
              countriesNameCache.current[value.id] = value.name_fr;
              setSearchParams((params) => {
                params.set("pirogue_nationality", value.id.toString());
                return params;
              });
            }}
            placeHolder={"Nationalité"}
            search={true}
            url={"countries"}
            lookupColumn="name_fr"
          />
          {searchParams.get("pirogue_nationality") && (
            <button
              onClick={() => {
                setSearchParams((params) => {
                  params.delete("pirogue_nationality");
                  return params;
                });
              }}
            >
              <svg
                className="text-gray-500 h-5 w-5 cursor-pointer stroke-primary"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flow-row mt-8 flex w-full gap-x-6">
        <div className="w-[60%] rounded-xl border-2 border-primaryBorder p-7">
          <div className="flex flex-col gap-y-4">
            <h1 className=" text-2xl font-semibold">
              Total Pirogues en {new Date().getFullYear()}
            </h1>
            <span className="mb-10" id="asssss2">
              {}
            </span>
            <ReactApexChart
              options={pirogueOptions}
              series={pirogueOptions.series}
              type="bar"
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
