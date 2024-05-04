import { Link, redirect, useParams, useSearchParams } from "react-router-dom";
import {
  DisconnectButton,
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
import {
  AddEditImmigrantDialog,
  CountryInterface,
  MobileImmigrantView,
} from "./pirogue_detail_page";

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

export default function AdminAgentImmigrantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTimer = React.useRef<NodeJS.Timeout>();
  const [data, setData] =
    React.useState<PaginatedData<ImmigrantInterface> | null>(null);
  const isAdmin = useContext(AuthContext).authData?.user.is_admin;

  const authContext = useContext(AuthContext);
  const countriesNameCache = React.useRef<{ [key: string]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const token = useContext(AuthContext).authData?.token;
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  async function load() {
    let url = rootUrl;
    if (!isAdmin) {
      url += "me/";
    }
    url += "immigrants";

    if (searchParams.size > 0) {
      url += "?" + searchParams.toString();
    }
    alert(url);
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
    <div className="mb-10 flex flex-col">
      <MDialog
        onClose={() => setIsDialogOpen(false)}
        isOpen={isDialogOpen}
        title="Ajouter Immigrant sans pirogue"
      >
        <AddEditImmigrantDialog
          onDone={() => {
            setIsDialogOpen(false);
            load();
          }}
          pirogueId={null}
        />
      </MDialog>
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
      <Title className="mb-10">Immigrants</Title>
      <div className="flex w-full flex-row justify-between ">
        <div className=" flex w-full flex-row justify-between ">
          <div className="flex w-full items-start gap-x-6 lg:w-auto ">
            <SearchBar
              id="pirogues_search_bar"
              onChange={onSearchChange}
              placeholder="Chercher Immigrants"
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
            <FilledButton
              onClick={() => {
                setIsFilterOpen(true);
              }}
            >
              <span>Filtrer</span> <FilterIcon />
            </FilledButton>
          )}
          {!isAdmin && (
            <FilledButton
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              <span>Ajouter</span>
              <PlusIcon className=" fill-white " />
            </FilledButton>
          )}
        </div>
      </div>
      <div className="mt-10 w-full">
        <div className="flex flex-col gap-y-4 lg:hidden">
          {data?.data.map((immigrant, i) => (
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
          Nouveau immigrant
          <PlusIcon className=" fill-white" />
        </FilledButton>
        <table className="hidden w-full text-center text-lg lg:table">
          <thead className="w-full">
            <tr className="font-bold text-gray">
              <th className="text-medium  py-3 text-base">Nom</th>
              <th className="text-medium  py-3 text-base">Genre</th>
              <th className="text-medium py-3 text-base">Nationalité</th>
              <th className="text-medium py-3 text-base">Pays de naissance</th>
              <th className="text-medium py-3 text-base">Date de naissance</th>
              {isAdmin && (
                <th className="text-medium py-3 text-base">Pirogue</th>
              )}
              {isAdmin && <th className="text-medium py-3 text-base">Agent</th>}
            </tr>
          </thead>
          <tbody>
            {data?.data.map((immigrant, i) => (
              <Tr>
                {/* <Td>
                  <input type="checkbox" className="h-5 w-5" />
                </Td> */}
                <Td className="flex items-center justify-start gap-x-2">
                  {immigrant.image && (
                    <img
                      onClick={() => {}}
                      className="h-8 w-8 rounded-full"
                      src={immigrant.image}
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
                {isAdmin && <Td>{immigrant.pirogue_number}</Td>}
                {isAdmin && (
                  <Td className="text-primary">{immigrant.created_by_name}</Td>
                )}
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
