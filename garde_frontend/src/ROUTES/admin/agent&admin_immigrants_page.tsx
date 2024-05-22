import { Link, redirect, useParams, useSearchParams } from "react-router-dom";
import {
  DisconnectButton,
  FilledButton,
  OutlinedButton,
  SelectButton,
  SelectButtonTile,
} from "../../components/buttons";
import {
  Border,
  Input,
  SearchBar,
  SearchSelect,
  Select,
  Tag,
  Textarea,
  Title,
} from "../../components/comps";
import {
  DeleteIcon,
  EditIcon,
  FilterIcon,
  LeftArrow,
  MdpIcon,
  MoreIcon,
  PlusIcon,
} from "../../components/icons";
import { Pagination, Td, Tr } from "../../components/table";
import { useContext, useEffect, useId } from "react";
import React from "react";
import { MDialog } from "../../components/dialog";
import axios from "axios";
import { PaginatedData, rootUrl } from "../../models/constants";
import { AuthContext } from "../../App";
import { CountryInterface, MobileImmigrantView } from "./pirogue_detail_page";
import { useReactToPrint } from "react-to-print";

export interface ImmigrantInterface {
  id: number;
  created_by_name: string;
  pirogue_number: string;
  name: string;
  date_of_birth: string;
  is_male: boolean;
  image: string;
  created_at: string;
  birth_country: number;
  nationality: number;
  nationality_name: string;
  birth_country_name: string;
  age: number | null;
  pirogue: number;
  created_by: number;
  criminal_record:
    | "killer"
    | "thief"
    | "danger"
    //
    | "theft"
    | "homocide"
    | "torture"
    | "human_trafficking"
    | "other"
    | null;
}

export default function AdminAgentImmigrantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTimer = React.useRef<NodeJS.Timeout>();
  const [data, setData] = React.useState<
    PaginatedData<ImmigrantInterface> | ImmigrantInterface[] | null
  >(null);
  const isAdmin = useContext(AuthContext).authData?.user.is_admin;

  const authContext = useContext(AuthContext);
  const countriesNameCache = React.useRef<{ [key: string]: string }>({});
  const agentNamesCache = React.useRef<{ [key: string]: string }>({});

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const token = useContext(AuthContext).authData?.token;
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const printRef = React.useRef<HTMLTableElement>(null);

  const handlePrint = useReactToPrint({
    onBeforeGetContent() {},
    content: () => {
      return printRef.current;
    },
    onAfterPrint: () => {},
  });

  async function load() {
    let url = rootUrl;
    if (!isAdmin) {
      url += "me/";
    }
    url += "immigrants";

    if (searchParams.size > 0) {
      url += "?" + searchParams.toString();
    }
    // alert(url);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setData(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function init() {
    searchParams.forEach((value, key) => {
      if (key === "nationality" || key === "birth_country") {
        axios
          .get(rootUrl + "countries/" + value, {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
          .then((response) => {
            countriesNameCache.current[value] = response.data.name_fr;
          });
      } else if (key === "created_by") {
        axios
          .get(rootUrl + "users/" + value, {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
          .then((response) => {
            agentNamesCache.current[value] = response.data.name;
          });
      }
    });
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    load();
  }, [searchParams]);

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const search = e.target.value;
    clearTimeout(searchTimer.current!);
    searchTimer.current = setTimeout(() => {
      setSearchParams((params) => {
        params.set("page", "1");
        if (search.length === 0) {
          params.delete("search");
        } else {
          params.set("search", search);
        }
        return params;
      });
    }, 500);
  }

  useEffect(() => {
    const searchBar = document.getElementById("immigrants_search_bar");
    const searchParam = searchParams.get("search");
    if (searchBar) {
      (searchBar as HTMLInputElement).value = searchParam ?? "";
    }
  }, []);

  let tags: {
    id: string;
    title: string;
    value: string;
  }[] = [];
  searchParams.forEach((value, key) => {
    if (key === "nationality") {
      tags.push({
        id: key,
        title: "Nationalité",
        value: countriesNameCache.current[value] ?? "",
      });
    } else if (key === "birth_country") {
      tags.push({
        id: key,
        title: "Pays de naissance",
        value: countriesNameCache.current[value] ?? "",
      });
    } else if (key === "is_male") {
      tags.push({
        id: key,
        title: "Genre",
        value: value === "1" ? "Homme" : "Femme",
      });
    } else if (key === "created_by") {
      tags.push({
        id: key,
        title: "Agent",
        value: agentNamesCache.current[value] ?? "",
      });
    }
  });

  let list: ImmigrantInterface[] | null = null;
  if (data) {
    if ("total_pages" in data) {
      list = data.data;
    } else {
      list = data;
    }
  }

  let selectedDateRange: "days" | "months" | "years" | null = null;
  if (searchParams.has("date")) {
    const selectedDate = searchParams.get("date");
    if (selectedDate?.split("-").length === 3) {
      selectedDateRange = "days";
    } else if (selectedDate?.split("-").length === 2) {
      selectedDateRange = "months";
    } else if (selectedDate?.split("-").length === 1) {
      selectedDateRange = "years";
    }
  }

  let totalMales = 0;
  let totalFemales = 0;
  let totalMinors = 0;

  for (const imm of list ?? []) {
    if (imm.age && imm.age < 18) {
      totalMinors++;
    }
    if (imm.is_male) {
      totalMales++;
    }
    if (!imm.is_male) {
      totalFemales++;
    }
  }

  return (
    <div className="mb-10 flex flex-col">
      {/* <MDialog
        onClose={() => setIsDialogOpen(false)}
        isOpen={isDialogOpen}
        title="Ajouter un Migrant sans pirogue"
      >
        <AddEditImmigrantDialog
          onDone={() => {
            setIsDialogOpen(false);
            load();
          }}
          pirogueId={null}
        />
      </MDialog> */}
      {!isAdmin && (
        <div className="mb-10 flex w-full flex-row items-center justify-between">
          <Link
            to="/"
            className=" flex flex-row items-center gap-x-2 text-lg text-primary"
          >
            <LeftArrow className=" h-4 w-4 fill-primary" />
            <h3>Page des pirogues </h3>
          </Link>
          (
          <DisconnectButton
            onClick={() => {
              authContext.logOut();
            }}
          />
          )
        </div>
      )}
      <Title className="mb-10">Migrant</Title>
      <div className="flex w-full flex-row justify-between ">
        <div className=" flex w-full flex-row justify-between ">
          <div className="flex w-full items-start gap-x-6 lg:w-auto ">
            <SearchBar
              id="pirogues_search_bar"
              onChange={onSearchChange}
              placeholder="Chercher Migrants"
              className="w-full flex-1 lg:w-[300px]"
            />
            <div className="hidden gap-x-2 lg:flex">
              {Array.from(tags).map(({ id, title, value }) => (
                <Tag
                  onClick={() => {
                    setSearchParams((params) => {
                      params.delete(id);
                      params.delete("page");
                      return params;
                    });
                  }}
                  key={id}
                  title={title}
                  tag={value}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="hidden flex-row gap-x-4 lg:flex ">
          {isAdmin && (
            <OutlinedButton
              className="border-green-600 text-green-600"
              onClick={() => {
                handlePrint();
              }}
            >
              <span>Imprimer</span>
            </OutlinedButton>
          )}
          {isAdmin && (
            <FilledButton
              onClick={() => {
                setIsFilterOpen(true);
              }}
            >
              <span>Filtrer</span> <FilterIcon />
            </FilledButton>
          )}
          {/* 
          {!isAdmin && (
            <FilledButton
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              <span>Ajouter</span>
              <PlusIcon className=" fill-white " />
            </FilledButton>
          )} */}
        </div>
      </div>
      <div className="mt-10 w-full">
        <div className="hidden flex-col gap-y-4 lg:hidden">
          {list?.map((immigrant, i) => (
            <MobileImmigrantView
              onImageClick={(payload) => {}}
              immigrant={immigrant}
            />
          ))}
        </div>
        <FilledButton
          onClick={() => {
            setIsDialogOpen(true);
          }}
          className=" fixed inset-x-0 bottom-10 z-10 mx-8 lg:hidden"
        >
          Nouveau Migrant
          <PlusIcon className=" fill-white" />
        </FilledButton>
        <div className="mb-2 mt-4 flex flex-row items-center gap-x-2">
          <Select
            onChange={(e) => {
              const value = e.target.value;
              setSearchParams((params) => {
                if (value === "days") {
                  params.set("date", new Date().toISOString().split("T")[0]);
                } else if (value === "months") {
                  params.set(
                    "date",
                    new Date().toISOString().split("-").slice(0, 2).join("-"),
                  );
                } else if (value === "years") {
                  params.set("date", new Date().toISOString().split("-")[0]);
                } else {
                  params.delete("date");
                }
                return params;
              });
            }}
            value={selectedDateRange ?? ""}
            className="w-max py-3"
          >
            <option value={""}>Tous</option>
            <option value={"days"}>Par Jour</option>
            <option value={"months"}>Par Mois</option>
            <option value={"years"}>Par Année</option>
          </Select>
          {selectedDateRange === "days" && (
            <Input
              value={searchParams.get("date") ?? ""}
              onChange={(e) => {
                setSearchParams((params) => {
                  params.set("date", e.target.value);
                  return params;
                });
              }}
              className=" hidden lg:block"
              type="date"
            />
          )}
          {selectedDateRange === "months" && (
            <Select
              value={
                searchParams.get("date")?.split("-")[1].padStart(2, "0") ?? ""
              }
              onChange={(e) => {
                const v = e.target.value;
                setSearchParams((params) => {
                  const date = params.get("date")?.split("-");
                  params.set("date", date?.[0] + "-" + v);
                  return params;
                });
              }}
              className="hidden w-max py-3 lg:block"
            >
              <option value="" disabled>
                Mois
              </option>
              {Array.from({ length: 12 }).map((_, i) => (
                <option value={(i + 1).toString().padStart(2, "0")}>
                  {i + 1}
                </option>
              ))}
            </Select>
          )}
          {(selectedDateRange === "months" ||
            selectedDateRange === "years") && (
            <Select
              value={searchParams.get("date")?.split("-")[0] ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setSearchParams((params) => {
                  if (selectedDateRange === "months") {
                    const date = params.get("date")?.split("-");
                    params.set("date", v + "-" + date?.[1]);
                  } else {
                    params.set("date", v);
                  }
                  return params;
                });
              }}
              className="hidden w-max py-3 lg:block"
            >
              <option value="" disabled>
                Annee
              </option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </Select>
          )}
          {selectedDateRange !== null && list !== null && (
            <span>
              <span>Total </span>
              <span className="font-semibold">
                {list!.length} ({totalMales}, {totalFemales}, {totalMinors})
              </span>
            </span>
          )}
        </div>
        <table className="hidden w-full text-center text-lg lg:table">
          <thead className="w-full">
            <tr className="font-bold text-gray">
              <th className="text-medium  py-3 text-base">Nom</th>
              <th className="text-medium  py-3 text-base">Genre</th>
              <th className="text-medium py-3 text-base">Nationalité</th>
              <th className="text-medium py-3 text-base">Pays de naissance</th>
              <th className="text-medium py-3 text-base">Date de naissance</th>
              <th className="text-medium py-3 text-base">Date</th>
              <th className="text-medium py-3 text-base">Séjour</th>

              {isAdmin && (
                <th className="text-medium py-3 text-base">Utilisateur</th>
              )}
            </tr>
          </thead>
          <tbody>
            {list?.map((immigrant, i) => (
              <Tr>
                {/* <Td>
                  <input type="checkbox" className="h-5 w-5" />
                </Td> */}
                <Td className="flex items-center justify-start gap-x-2">
                  {immigrant.image && (
                    <img
                      onClick={() => {}}
                      className="h-8 w-8 rounded-full"
                      src={immigrant.image.replace("http://", "https://")}
                    />
                  )}
                  <span>{immigrant.name}</span>
                </Td>
                <Td>{immigrant.is_male ? "Homme" : "Femme"}</Td>
                <Td>
                  <Border>{immigrant.nationality_name}</Border>
                </Td>
                <Td>
                  <Border>{immigrant.birth_country_name}</Border>
                </Td>
                <Td>{immigrant.date_of_birth}</Td>
                {<Td>{immigrant.created_at.split("T")[0]}</Td>}
                <Td>
                  {(
                    (new Date().valueOf() -
                      new Date(immigrant.created_at).valueOf()) /
                    8.64e7
                  ).toFixed(0) + " jour(s)"}
                </Td>
                {isAdmin && (
                  <Td className="text-primary">{immigrant.created_by_name}</Td>
                )}
              </Tr>
            ))}
          </tbody>
        </table>
      </div>
      {list && (
        <div ref={printRef} className="hidden flex-col px-10 print:flex">
          <div className="my-12 flex flex-col items-end self-center">
            <h1 className="text-2xl font-bold">
              LA MIGRATION ILLEGALE PAR VOIE MARITIME
            </h1>
            <div className="flex flex-row">
              <span>Nouadhibou</span>
              {searchParams.get("date") && (
                <span>
                  , le {searchParams.get("date")?.replaceAll("-", "/")}
                </span>
              )}
            </div>
          </div>
          <table className="w-full text-center text-xs">
            <thead className="">
              <tr className="font-bold text-gray">
                <th className="border-gray-300 border text-base">N°</th>
                <th className="border-gray-300 border text-base ">
                  NOM ET PRENOM
                </th>
                <th className="border-gray-300 border text-base">
                  DATE DE NAISS
                </th>
                <th className="border-gray-300 border text-base">
                  LIEU DE NAISS
                </th>
                <th className="border-gray-300 border text-base">
                  NATIONALITE
                </th>
                <th className="border-gray-300 border text-base">GENRE</th>
                <th className="border-gray-300 border text-base">DATE</th>
                <th className="border-gray-300 border text-base">SEJOUR</th>
                <th className="border-gray-300 border text-base">
                  OBSERVATIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((immigrant, index) => {
                return (
                  <tr>
                    {/* border */}
                    <td className="border-gray-300 border ">{index + 1}</td>
                    <td className="border-gray-300 border ">
                      {immigrant.name}
                    </td>
                    <td className="border-gray-300 border ">
                      {immigrant.date_of_birth?.split("-")[0] ?? "-"}
                    </td>
                    <td className="border-gray-300 border ">
                      {immigrant.birth_country_name}
                    </td>
                    <td className="border-gray-300 border ">
                      {immigrant.nationality_name}
                    </td>
                    <td className="border-gray-300 border ">
                      {immigrant.is_male ? "M" : "F"}
                    </td>
                    <td className="border-gray-300 border ">
                      {immigrant.created_at.split("T")[0]}
                    </td>
                    <td className="border-gray-300 border ">
                      {(
                        (new Date().valueOf() -
                          new Date(immigrant.created_at).valueOf()) /
                        8.64e7
                      ).toFixed(0) + " jour(s)"}
                    </td>
                    <td className="border-gray-300 border "></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <br />
          <br />
          {selectedDateRange !== null && list !== null && (
            <table className="w-max">
              <tr>
                <td className="border-gray-300 border">Hommes </td>
                <td className="border-gray-300 border">Femmes </td>
                <td className="border-gray-300 border">Mineur </td>
                <td className="border-gray-300 border">Total </td>
              </tr>
              <tr>
                <td className="border-gray-300 border">{totalMales}</td>
                <td className="border-gray-300 border">{totalFemales}</td>
                <td className="border-gray-300 border">{totalMinors}</td>
                <td className="border-gray-300 border">{list!.length}</td>
              </tr>
            </table>
          )}
        </div>
      )}
      {data && "total_pages" in data && (
        <Pagination
          className="mt-10"
          onItemClick={(page) => {
            setSearchParams((params) => {
              params.set("page", page.toString());
              return params;
            });
          }}
          current={
            searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1
          }
          total={data?.total_pages ?? 1}
        />
      )}
      {isFilterOpen && (
        <div className={""}>
          <div
            onClick={() => {
              setIsFilterOpen(false);
            }}
            className={`fixed inset-0 z-10 flex items-center justify-center bg-gray opacity-70 `}
          />
          <div className="absolute right-0 top-0 z-30 h-screen w-1/4 bg-white px-9 pt-12 shadow-xl">
            <div className="mb-9 flex justify-between">
              <Title>Filtrer</Title>

              <button
                onClick={() => {
                  setIsFilterOpen(false);
                }}
                className="rounded-full border border-gray p-2"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L11 11M11 1L1 11"
                    stroke="#888888"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-y-9">
              <SearchSelect<any>
                value={
                  agentNamesCache.current[
                    searchParams.get("created_by") ?? ""
                  ] ?? null
                }
                onSelected={function (value): void {
                  agentNamesCache.current[value.id.toString()] = value.name;
                  setSearchParams((params) => {
                    if (value) {
                      params.set("created_by", value.id.toString());
                    } else {
                      params.delete("created_by");
                    }
                    params.set("page", "1");

                    return params;
                  });
                }}
                placeHolder={"Agent"}
                search={true}
                url={"users"}
                lookupColumn="name"
              />

              <SearchSelect<CountryInterface>
                value={
                  countriesNameCache.current[
                    searchParams.get("nationality") ?? ""
                  ]
                }
                onSelected={function (value): void {
                  countriesNameCache.current[value.id] = value.name_fr;
                  setSearchParams((params) => {
                    params.set("nationality", value.id.toString());
                    params.delete("page");
                    return params;
                  });
                }}
                placeHolder={"Nationalité"}
                search={true}
                url={"countries"}
                lookupColumn="name_fr"
              />
              <SearchSelect<CountryInterface>
                value={
                  countriesNameCache.current[
                    searchParams.get("birth_country") ?? ""
                  ]
                }
                onSelected={function (value): void {
                  countriesNameCache.current[value.id] = value.name_fr;
                  setSearchParams((params) => {
                    params.set("birth_country", value.id.toString());
                    params.delete("page");
                    return params;
                  });
                }}
                placeHolder={"Pays de naissance"}
                search={true}
                url={"countries"}
                lookupColumn="name_fr"
              />
              <Select
                value={
                  searchParams.get("is_male") === null
                    ? "none"
                    : searchParams.get("is_male") === "1"
                      ? "male"
                      : "female"
                }
                onChange={(e) => {
                  setSearchParams((params) => {
                    const value = (e.target as any).value;
                    if (value === "none") {
                      params.delete("is_male");
                    } else if (value === "male") {
                      params.set("is_male", "1");
                    } else if (value === "female") {
                      params.set("is_male", "0");
                    }
                    return params;
                  });
                }}
              >
                <option value="none" className="text-gray" disabled>
                  Genre
                </option>
                <option className="" value={"male"}>
                  Homme
                </option>
                <option className="" value={"female"}>
                  Femme
                </option>
              </Select>

              <Select
                value={searchParams.get("age") ?? "none"}
                onChange={(e) => {
                  setSearchParams((params) => {
                    const value = (e.target as any).value;
                    if (value === "none") {
                      params.delete("age");
                    } else {
                      params.set("age", value);
                    }
                    return params;
                  });
                }}
              >
                <option value="none" className="text-gray" disabled>
                  Age
                </option>
                <option value={"major"}>Majeur</option>
                <option value={"minor"}>Mineur</option>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
