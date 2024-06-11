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
  LoadingIcon,
  MdpIcon,
  MoreIcon,
  PlusIcon,
} from "../../components/icons";
import { Pagination, Td, Tr } from "../../components/table";
import { useContext, useEffect, useId } from "react";
import React from "react";
import axios from "axios";
import { PaginatedData, rootUrl } from "../../models/constants";
import { AuthContext } from "../../App";
import { CountryInterface, MobileImmigrantView } from "./pirogue_detail_page";
import { useReactToPrint } from "react-to-print";
import * as Dialog from "@radix-ui/react-dialog";
import { getImmigrantGenre, getImmigrantSejour } from "../../models/utils";
import { MDialog } from "../../components/dialog";

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
  pirogue_sejour: number | null;
  sejour: number | null;
  etat: string;
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
  criminal_note: string;
}

function EditImmigrantDialog({
  initialImmigrant,
  onDone,
}: {
  initialImmigrant: ImmigrantInterface;
  onDone: (updated: boolean) => void;
}) {
  const [formState, setFormState] = React.useState<{
    name: string;
    etat: string;
    date_of_birth: string | null;
    is_male: boolean;
    criminal_record: string | null;
    criminal_note: string;
    birth_country: { name: string; id: number } | null;
    nationality: { name: string; id: number } | null;
  }>({
    name: initialImmigrant.name,
    etat: initialImmigrant.etat,
    date_of_birth: initialImmigrant.date_of_birth ?? null,
    is_male: initialImmigrant.is_male,
    criminal_record: initialImmigrant.criminal_record,
    criminal_note: initialImmigrant.criminal_note,
    birth_country: initialImmigrant.birth_country
      ? {
          name: initialImmigrant.birth_country_name,
          id: initialImmigrant.birth_country,
        }
      : null,
    nationality: initialImmigrant.nationality
      ? {
          name: initialImmigrant.nationality_name,
          id: initialImmigrant.nationality,
        }
      : null,
  });
  const token = useContext(AuthContext).authData?.token;
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function update() {
    try {
      if (formState.name.length === 0) {
        alert("Veuillez remplir le nom");
        return;
      }
      setIsSubmitting(true);

      await axios.patch(
        rootUrl + "immigrants/" + initialImmigrant.id + "/",
        {
          name: formState.name,
          etat: formState.etat,
          date_of_birth: formState.date_of_birth ?? null,
          is_male: formState.is_male,
          criminal_record: formState.criminal_record,
          criminal_note: formState.criminal_note,
          birth_country: formState.birth_country?.id ?? null,
          nationality: formState.nationality?.id ?? null,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      onDone(true);
    } catch (e) {
      alert("Erreur lors de la modification");
    }
    setIsSubmitting(false);
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 ">
      <Input
        disabled={isSubmitting}
        value={formState.name}
        onChange={(e) => {
          setFormState((state) => ({ ...state, name: e.target.value }));
        }}
        className="col-span-2"
        placeholder="Nom*"
        type="text"
      />
      <Select
        value={formState.etat}
        onChange={(e) => {
          const value = e.target.value;
          setFormState((state) => ({
            ...state,
            etat: value,
          }));
        }}
        className={`${formState.etat.length === 0}) ? "text-gray" : "text-black"}`}
      >
        <option value={""} disabled>
          {" "}
          Etat
        </option>
        <option value={"alive"}>Vivant</option>
        <option value={"dead"}>Décédé</option>
        <option value={"sick_evacuation"}>Evacuation Sanitaire</option>
        <option value={"pregnant"}>Enceinte</option>
      </Select>
      <Input
        disabled={isSubmitting}
        value={formState.date_of_birth ?? ""}
        onChange={(e) => {
          setFormState((state) => ({
            ...state,
            date_of_birth: e.target.value,
          }));
        }}
        placeholder="Date de naissance"
        type="date"
      />

      <Select
        value={formState.is_male ? "1" : "0"}
        onChange={(e) => {
          const value = e.target.value;
          setFormState((state) => ({
            ...state,
            is_male: value === "1" ? true : false,
          }));
        }}
      >
        <option value={""} disabled>
          {" "}
          Genre
        </option>
        <option value={"1"}>Homme</option>
        <option value={"0"}>Femme</option>
      </Select>
      <Select
        value={formState.criminal_record ?? ""}
        onChange={(e) => {
          const value = e.target.value;

          setFormState((state) => ({
            ...state,
            criminal_record: value.length === 0 ? null : value,
          }));
        }}
      >
        <option value="">Aucun Record criminel</option>
        <option value="theft">Vol</option>
        <option value="homocide">Homicide</option>
        <option value="torture">Torture</option>
        <option value="human_trafficking">Traite des êtres humains</option>
        <option value="other">Autre</option>
      </Select>
      {formState.criminal_record && (
        <Textarea
          value={formState.criminal_note}
          onChange={(e) => {
            setFormState((state) => ({
              ...state,
              criminal_note: e.target.value,
            }));
          }}
          className="col-span-2"
          placeholder="Note sur le record criminel"
        />
      )}
      <SearchSelect<CountryInterface>
        value={formState.nationality?.name ?? null}
        onSelected={(value) => {
          setFormState((state) => ({
            ...state,
            nationality: { name: value.name_fr, id: value.id },
          }));
        }}
        placeHolder={"Nationalité*"}
        search={true}
        url={"countries"}
        lookupColumn="name_fr"
      />
      <SearchSelect<CountryInterface>
        value={formState.birth_country?.name ?? null}
        onSelected={(value) => {
          setFormState((state) => ({
            ...state,
            birth_country: { name: value.name_fr, id: value.id },
          }));
        }}
        placeHolder={"Pays de naissance*"}
        search={true}
        url={"countries"}
        lookupColumn="name_fr"
      />

      <div className="col-span-2 flex gap-x-4">
        <FilledButton
          disabled={isSubmitting}
          className="order-2 col-span-2 w-full lg:order-1 lg:col-span-1 "
          onClick={() => {
            onDone(false);
          }}
          isLight={true}
        >
          Annuler
        </FilledButton>
        <FilledButton
          disabled={isSubmitting}
          onClick={update}
          className="relative col-span-2 w-full lg:order-2 lg:col-span-1"
        >
          {isSubmitting ? (
            <LoadingIcon className="z-10" />
          ) : (
            <span>Modifier</span>
          )}
        </FilledButton>
      </div>
    </div>
  );
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

  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const token = useContext(AuthContext).authData?.token;
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const printRef = React.useRef<HTMLTableElement>(null);

  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const [editingSejourImmigrantIds, setEditingSejourImmigrantIds] =
    React.useState<number[]>([]);

  const [editingImmigrant, setEditingImmigrant] =
    React.useState<ImmigrantInterface | null>(null);

  const [isSubmitingSejour, setIsSubmitingSejour] = React.useState(false);

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
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setSelectedIds([]);
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

  async function onSejourEdit(immigrant_id: number, sejour: number) {
    await axios
      .patch(
        rootUrl + "immigrants/" + immigrant_id + "/",
        { sejour: sejour },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      )
      .then((res) => {});
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
    } else if (key === "is_mrt") {
      tags.push({
        id: key,
        title: "",
        value: value === "true" ? "Tentatif" : "Passeur",
      });
    } else if (key === "created_by") {
      tags.push({
        id: key,
        title: "Agent",
        value: agentNamesCache.current[value] ?? "",
      });
    } else if (key === "has_pirogue") {
      tags.push({
        id: key,
        title: "Avec pirogue",
        value: value === "true" ? "Oui" : "Non",
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

  let showChangeSelectedSejour = selectedIds.length > 0;

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

    if (selectedIds.includes(imm.id) && imm.pirogue !== null) {
      showChangeSelectedSejour = false;
      break;
    }
  }

  return (
    <div className="mb-10 flex flex-col">
      <MDialog
        onClose={() => {
          setEditingImmigrant(null);
        }}
        isOpen={editingImmigrant !== null}
        title={"Modifier migrant"}
      >
        <EditImmigrantDialog
          initialImmigrant={editingImmigrant!}
          onDone={(updated) => {
            if (updated) {
              load();
            }
            setEditingImmigrant(null);
          }}
        />
      </MDialog>
      <MDialog
        onClose={() => {
          setEditingSejourImmigrantIds([]);
        }}
        isOpen={editingSejourImmigrantIds.length !== 0}
        title={
          "Modifier le séjour " +
          (editingSejourImmigrantIds.length > 1
            ? `de ${editingSejourImmigrantIds.length} migrants`
            : "du migrant")
        }
      >
        <>
          {editingSejourImmigrantIds.length > 0 &&
            !editingSejourImmigrantIds
              .map((e) => {
                const imm = list?.find((imm) => imm.id === e);
                return imm?.pirogue === null;
              })
              .includes(true) && (
              <div className="flex flex-col gap-y-3">
                <Input
                  id="pirogue_sejour_input"
                  placeholder="Nouveau séjour (jours)"
                  type="number"
                  className="w-[300px]"
                />
                <FilledButton
                  onClick={async () => {
                    if (editingSejourImmigrantIds.length === 0) {
                      return;
                    }

                    const sejour = parseInt(
                      (
                        document.getElementById(
                          "pirogue_sejour_input",
                        ) as HTMLInputElement
                      ).value,
                    );

                    const promises = editingSejourImmigrantIds.map((id) =>
                      onSejourEdit(id, sejour),
                    );
                    setIsSubmitingSejour(true);
                    try {
                      await Promise.all(promises);
                    } catch (e) {
                      console.log(e);
                    }
                    setIsSubmitingSejour(false);
                    load();
                    setEditingSejourImmigrantIds([]);
                  }}
                >
                  {isSubmitingSejour ? <LoadingIcon /> : "Enregistrer"}
                </FilledButton>
              </div>
            )}
        </>
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
          {showChangeSelectedSejour && (
            <OutlinedButton
              className="ml-auto"
              onClick={() => {
                setEditingSejourImmigrantIds(selectedIds);
              }}
            >
              <span>Modifier les séjour</span>
            </OutlinedButton>
          )}
        </div>
        <table className="hidden w-full text-center text-lg lg:table">
          <thead className="w-full">
            <tr className="font-bold text-gray">
              <th className="text-medium py-3 text-base">
                <input
                  checked={
                    selectedIds.length !== 0 &&
                    selectedIds.length === list?.length
                  }
                  type="checkbox"
                  className="h-5 w-5"
                  onChange={() => {
                    if (selectedIds.length === list?.length) {
                      setSelectedIds([]);
                    } else {
                      setSelectedIds(list?.map((imm) => imm.id) ?? []);
                    }
                  }}
                />
              </th>
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
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {list?.map((immigrant, i) => (
              <Tr>
                <Td>
                  <input
                    checked={selectedIds.includes(immigrant.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        setSelectedIds((ids) => [...ids, immigrant.id]);
                      } else {
                        setSelectedIds((ids) =>
                          ids.filter((id) => id !== immigrant.id),
                        );
                      }
                    }}
                    type="checkbox"
                    className="h-5 w-5"
                  />
                </Td>
                <Td>
                  <div className="flex items-center justify-start gap-x-2">
                    {immigrant.image && (
                      <img
                        onClick={() => {}}
                        className="h-8 w-8 rounded-full"
                        src={immigrant.image.replace("http://", "https://")}
                      />
                    )}
                    <span>{immigrant.name}</span>
                  </div>
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
                  {
                    // (
                    //   (new Date().valueOf() -
                    //     new Date(immigrant.created_at).valueOf()) /
                    //   8.64e7
                    // ).toFixed(0)

                    getImmigrantSejour(immigrant)
                  }
                </Td>
                {isAdmin && (
                  <Td className="text-primary">{immigrant.created_by_name}</Td>
                )}
                <Td>
                  <div className="flex gap-x-4">
                    {immigrant.pirogue === null && (
                      <button
                        onClick={() => {
                          setEditingSejourImmigrantIds([immigrant.id]);
                        }}
                        className=" transition-all duration-100 active:scale-90"
                      >
                        <EditIcon />
                      </button>
                    )}
                    {isAdmin && (
                      <>
                        <Dialog.Root
                          open={deletingId !== null}
                          onOpenChange={
                            deletingId === null
                              ? () => {}
                              : (open) => {
                                  if (!open) {
                                    setDeletingId(null);
                                  }
                                }
                          }
                        >
                          <button
                            onClick={() => {
                              setEditingImmigrant(
                                list!.find((imm) => imm.id === immigrant.id)!,
                              );
                            }}
                            className=" transition-all duration-100 active:scale-90"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(immigrant.id);
                            }}
                            className=" transition-all duration-100 active:scale-90"
                          >
                            <DeleteIcon />
                          </button>

                          <Dialog.Overlay className="fixed inset-0 z-20 bg-black opacity-10" />
                          <Dialog.Content className="fixed left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded bg-white px-4 py-4">
                            <Dialog.Title>
                              <h2 className="pb-8 text-xl font-semibold">
                                Supprimer un migrant
                              </h2>
                            </Dialog.Title>
                            <Dialog.Description>
                              <p>
                                Vous êtes sur le point de supprimer un migrant
                                de la base de données.
                                <br /> Veuillez confirmer cette action.
                              </p>
                            </Dialog.Description>
                            <div className="mt-10 flex flex-row gap-x-4">
                              <OutlinedButton
                                onClick={() => {
                                  setDeletingId(null);
                                }}
                                className=""
                              >
                                Annuler
                              </OutlinedButton>
                              <FilledButton
                                onClick={() => {
                                  setDeletingId(null);

                                  axios
                                    .delete(
                                      rootUrl +
                                        "immigrants/" +
                                        deletingId +
                                        "/",
                                      {
                                        headers: {
                                          Authorization: `Token ${token}`,
                                        },
                                      },
                                    )
                                    .then((response) => {
                                      load();
                                    });
                                }}
                                className=" bg-red-500 text-white "
                              >
                                Supprimer
                              </FilledButton>
                            </div>
                          </Dialog.Content>
                        </Dialog.Root>
                      </>
                    )}
                  </div>
                </Td>
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
                      {getImmigrantGenre(immigrant)}
                    </td>
                    <td className="border-gray-300 border ">
                      {immigrant.created_at.split("T")[0]}
                    </td>
                    <td className="border-gray-300 border ">
                      {getImmigrantSejour(immigrant)}
                      {/* {(
                        (new Date().valueOf() -
                          new Date(immigrant.created_at).valueOf()) /
                        8.64e7
                      ).toFixed(0) + " jour(s)"} */}
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

              {/* <Select
                value={
                  searchParams.get("is_mrt") === null
                    ? "none"
                    : searchParams.get("is_mrt") === "true"
                      ? "true"
                      : "false"
                }
                onChange={(e) => {
                  setSearchParams((params) => {
                    const value = (e.target as any).value;
                    if (value === "none") {
                      params.delete("is_mrt");
                    }
                    params.set("is_mrt", value);
                    return params;
                  });
                }}
              >
                <option value="none" className="text-gray" disabled>
                  Tentatif/Passeur
                </option>
                <option className="" value={"true"}>
                  Tentatif
                </option>
                <option className="" value={"false"}>
                  Passeur
                </option>
              </Select> */}

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

              <Select
                value={searchParams.get("has_pirogue") ?? "none"}
                onChange={(e) => {
                  setSearchParams((params) => {
                    const value = (e.target as any).value;
                    if (value === "none") {
                      params.delete("has_pirogue");
                    } else {
                      params.set("has_pirogue", value);
                    }
                    return params;
                  });
                }}
              >
                <option value="none" className="text-gray">
                  Avec et sans pirogue
                </option>
                <option value={"true"}>Avec Pirogue</option>
                <option value={"false"}>Sans Pirogue</option>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
