import { Link, redirect, useParams, useSearchParams } from "react-router-dom";
import {
  FilledButton,
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
import { CountryInterface } from "./pirogue_detail_page";

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
  pirogue: number;
  created_by: number;
}

export default function AdminImmigrantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTimer = React.useRef<NodeJS.Timeout>();
  const [data, setData] =
    React.useState<PaginatedData<ImmigrantInterface> | null>(null);

  const countriesNameCache = React.useRef<{ [key: string]: string }>({});

  const token = useContext(AuthContext).authData?.token;
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  async function load() {
    let url = rootUrl + "immigrants";
    if (searchParams.size > 0) {
      url += "?" + searchParams.toString();
    }

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

  function init() {
    searchParams.forEach((value, key) => {
      if (key === "nationality" || key === "birth_country") {
        axios
          .get(rootUrl + "countries/" + value, {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
          .then((response) => {
            countriesNameCache.current[value] = response.data.name;
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
    }
  });

  return (
    <div className="flex flex-col">
      <Title className="mb-10">Immigrants</Title>
      <div className="flex w-full flex-row justify-between ">
        <div className="flex items-center gap-x-6">
          <SearchBar
            id="immigrants_search_bar"
            onChange={onSearchChange}
            placeholder="Chercher Immigrant"
            className="w-[300px]"
          />
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
        <div className="flex flex-row gap-x-4">
          <FilledButton
            onClick={() => {
              setIsFilterOpen(true);
            }}
          >
            <span>Filtrer</span> <FilterIcon />
          </FilledButton>
        </div>
      </div>
      <div className="mt-10 w-full">
        <table className="w-full text-center text-lg">
          <thead className="w-full">
            <tr className="font-bold text-gray">
              <th className="text-medium  py-3 text-base">Nom</th>
              <th className="text-medium  py-3 text-base">Genre</th>
              <th className="text-medium py-3 text-base">Nationalité</th>
              <th className="text-medium py-3 text-base">Pays de naissance</th>
              <th className="text-medium py-3 text-base">Date de naissance</th>
              <th className="text-medium py-3 text-base">Pirogue</th>
              <th className="text-medium py-3 text-base">Agent</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((immigrant, i) => (
              <Tr>
                {/* <Td>
                  <input type="checkbox" className="h-5 w-5" />
                </Td> */}
                <Td>{immigrant.name}</Td>
                <Td>{immigrant.is_male ? "Homme" : "Femme"}</Td>
                <Td>
                  <Border>{immigrant.nationality_name}</Border>
                </Td>
                <Td>
                  <Border>{immigrant.birth_country_name}</Border>
                </Td>
                <Td>{immigrant.date_of_birth}</Td>
                <Td>{immigrant.pirogue_number}</Td>
                <Td className="text-primary">{immigrant.created_by_name}</Td>
              </Tr>
            ))}
          </tbody>
        </table>
      </div>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
