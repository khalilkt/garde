import { Link, redirect, useParams, useSearchParams } from "react-router-dom";
import {
  DisconnectButton,
  FilledButton,
  OutlinedButton,
  SelectButton,
  SelectButtonTile,
} from "../../components/buttons";
import {
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
import { Pagination, TableBodySquelette, Td, Tr } from "../../components/table";
import { useContext, useEffect, useId } from "react";
import React from "react";
import { MDialog } from "../../components/dialog";
import axios from "axios";
import { MATERIAL_NAME, PaginatedData, rootUrl } from "../../models/constants";
import { AuthContext } from "../../App";
import PirogueDetailPage, { CountryInterface } from "./pirogue_detail_page";
import * as RDialog from "@radix-ui/react-dialog";
import {
  PositionInput,
  PositionInterface,
} from "../../components/position_input";
import { useReactToPrint } from "react-to-print";

export interface PirogueInterface {
  id: number;
  number: string;
  created_by_name: string;
  immigrants_count: number;
  lat: string;
  long: string;
  departure: string;
  destination: string;
  description: string;
  created_at: string;
  created_by: number;
  motor_numbers: string[];
  puissance: number;
  port: string;

  material: string;
  brand: string;
  gps: string[];
  nationality: string;
  nationality_name: string;
  extra: string;
  fuel: number;
}

function AddEditPirogueDialog({
  onDone,
}: {
  onDone: (created: boolean) => void;
}) {
  const [formState, setFormState] = React.useState<{
    number: string;
    lat: PositionInterface;
    long: PositionInterface;
    numbers: string[];
    departure: string;
    destination: string;
    extra: string;
    description: string;
    port: string;
    etat: string;
    puissance: string;
    fuel: number;
    material: string;
    nationality: string;
    brand: string;
    gps: string[];
  }>({
    number: "",
    numbers: [""],
    lat: { x: "", y: "", z: "", orientation: "N" },
    long: { x: "", y: "", z: "", orientation: "N" },
    departure: "",
    destination: "",
    extra: "",
    description: "",
    port: "",
    etat: "saisie",
    puissance: "",
    fuel: 0,
    material: "",
    nationality: "",
    brand: "",
    gps: [""],
  });
  const token = useContext(AuthContext).authData?.token;
  const couttriesNameCache = React.useRef<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  async function create() {
    const lat =
      formState.lat.x +
      "-" +
      formState.lat.y +
      "-" +
      formState.lat.z +
      "-" +
      formState.lat.orientation;
    const long =
      formState.long.x +
      "-" +
      formState.long.y +
      "-" +
      formState.long.z +
      "-" +
      formState.long.orientation;
    try {
      if (
        formState.number.length === 0 ||
        formState.port.length === 0 ||
        formState.nationality === "" ||
        formState.departure.length === 0 ||
        formState.destination.length === 0
      ) {
        alert("Veuillez remplir les champs obligatoire");
        return;
      }
      setIsSubmitting(true);

      await axios.post(
        rootUrl + "me/pirogues/",
        {
          number: formState.number,
          lat: lat,
          long: long,
          motor_numbers: formState.numbers,
          puissance:
            formState.puissance.length === 0 ? null : formState.puissance,
          port: formState.port,
          etat: formState.etat,
          material: formState.material,
          brand: formState.brand,
          gps: formState.gps,
          departure: formState.departure,
          destination: formState.destination,
          extra: formState.extra,
          fuel: formState.fuel,
          description: formState.description,
          nationality: formState.nationality,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      onDone(true);
    } catch (e) {
      alert("Erreur lors de la création de la pirogue");
    }
    setIsSubmitting(false);
  }

  return (
    <div className="grid  grid-cols-2 gap-x-4 gap-y-6 ">
      <div className="col-span-2 flex flex-col gap-y-2">
        <Input
          disabled={isSubmitting}
          value={formState.number}
          onChange={(e) => {
            setFormState((state) => ({ ...state, number: e.target.value }));
          }}
          placeholder="Numéro de la pirogue*"
          type="text"
        />
        <hr className="my-2 w-20 self-center border-primary" />
        {formState.numbers.map((number, i) => (
          <Input
            disabled={isSubmitting}
            value={number}
            onChange={(e) => {
              const newNumbers = [...formState.numbers];
              newNumbers[i] = e.target.value;
              setFormState((state) => ({ ...state, numbers: newNumbers }));
            }}
            className="col-span-2"
            placeholder={`Numéro du moteur ${i + 1}`}
            type="text"
          />
        ))}
        <OutlinedButton
          disabled={isSubmitting}
          onClick={() => {
            setFormState((state) => ({
              ...state,
              numbers: [...state.numbers, ""],
            }));
          }}
          className="col-span-2"
        >
          Ajouter numéro du moteur
        </OutlinedButton>
      </div>
      <Select
        disabled={isSubmitting}
        value={formState.material}
        className={formState.material.length === 0 ? "text-gray" : ""}
        onChange={(e) => {
          setFormState((state) => ({ ...state, material: e.target.value }));
        }}
      >
        <option value="" className="text-gray " disabled>
          Matériel
        </option>
        <option value="wood">Bois</option>
        <option value="metal">Métal</option>
        <option value="plastic">Plastique</option>
        <option value="polyester">Polyester</option>
      </Select>
      <SearchSelect<CountryInterface>
        value={couttriesNameCache.current[formState.nationality] ?? null}
        onSelected={(value) => {
          couttriesNameCache.current[value.id.toString()] = value.name_fr;
          setFormState((formState) => ({
            ...formState,
            nationality: value.id.toString(),
          }));
        }}
        placeHolder={"Nationalité*"}
        search={true}
        url={"countries"}
        lookupColumn="name_fr"
      />
      <Input
        disabled={isSubmitting}
        value={formState.brand}
        onChange={(e) => {
          setFormState((state) => ({ ...state, brand: e.target.value }));
        }}
        placeholder="Marque"
        type="text"
      />
      <Input
        disabled={isSubmitting}
        value={formState.puissance}
        onChange={(e) => {
          setFormState((state) => ({ ...state, puissance: e.target.value }));
        }}
        placeholder="Puissance"
        type="number"
      />

      <PositionInput
        disabled={isSubmitting}
        onChange={function (value: PositionInterface): void {
          setFormState((state) => ({ ...state, lat: value }));
        }}
        value={formState.lat as PositionInterface}
        className={"w-52"}
      />
      <PositionInput
        disabled={isSubmitting}
        onChange={function (value: PositionInterface): void {
          setFormState((state) => ({ ...state, long: value }));
        }}
        value={formState.long as PositionInterface}
        className={"w-52"}
      />

      <Input
        disabled={isSubmitting}
        value={formState.departure}
        onChange={(e) => {
          setFormState((state) => ({ ...state, departure: e.target.value }));
        }}
        placeholder="Départ*"
      />
      <Input
        disabled={isSubmitting}
        value={formState.destination}
        onChange={(e) => {
          setFormState((state) => ({ ...state, destination: e.target.value }));
        }}
        placeholder="Déstination*"
      />
      <Input
        disabled={isSubmitting}
        value={formState.fuel == 0 ? "" : formState.fuel.toString()}
        onChange={(e) => {
          setFormState((state) => ({
            ...state,
            fuel: parseInt(e.target.value),
          }));
        }}
        placeholder="Essence"
      />
      <Select
        disabled={isSubmitting}
        value={formState.port}
        onChange={(e) => {
          setFormState((state) => ({
            ...state,
            port: e.target.value,
          }));
        }}
        className={formState.port === "" ? "text-gray" : ""}
      >
        <option value="" disabled>
          Port*
        </option>
        <option value="ndagou">Ndagou</option>
        <option value="nouadhibou">Nouadhibou</option>
        <option value="nouakchott">Nouakchott</option>
        <option value="tanit">Tanit</option>
      </Select>
      <Select
        disabled={isSubmitting}
        value={formState.etat}
        onChange={(e) => {
          setFormState((state) => ({
            ...state,
            etat: e.target.value,
          }));
        }}
        className={formState.etat === "" ? "text-gray" : ""}
      >
        <option value="" disabled>
          État
        </option>
        <option value="saisie">Saisie</option>
        <option value="casse">Cassé</option>
        <option value="abandonnee">Abandonnée</option>
      </Select>
      <div className="col-span-2 flex w-full items-center justify-center">
        <hr className=" w-1/2 place-content-center self-center border-gray" />
      </div>
      <div className="col-span-2 flex flex-col gap-y-2">
        {formState.gps.map((g, i) => (
          <Input
            disabled={isSubmitting}
            value={g}
            onChange={(e) => {
              const newGps = [...formState.gps];
              newGps[i] = e.target.value;
              setFormState((state) => ({ ...state, gps: newGps }));
            }}
            className="col-span-2"
            placeholder={` GPS ${i === 0 ? "" : i + 1}`}
            type="text"
          />
        ))}
        <OutlinedButton
          disabled={isSubmitting}
          onClick={() => {
            setFormState((state) => ({
              ...state,
              gps: [...state.gps, ""],
            }));
          }}
          className="col-span-2 "
        >
          Ajouter GPS
        </OutlinedButton>
      </div>
      <Textarea
        disabled={isSubmitting}
        value={formState.extra}
        onChange={(e) => {
          setFormState((state) => ({ ...state, extra: e.target.value }));
        }}
        className=" col-span-2"
        placeholder="Effets persnonels"
      />
      <Textarea
        disabled={isSubmitting}
        value={formState.description}
        onChange={(e) => {
          setFormState((state) => ({ ...state, description: e.target.value }));
        }}
        className=" col-span-2"
        placeholder="Description"
      />

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
        onClick={create}
        className="relative col-span-2 w-full lg:order-2 lg:col-span-1"
      >
        {isSubmitting ? (
          <LoadingIcon className="z-10" />
        ) : (
          <span>Créer Pirogue</span>
        )}
      </FilledButton>
    </div>
  );
}

export interface DialogState {
  state: "none" | "adding" | "editing";
  payload?: {
    [key: string]: any;
  };
}

function MobilePriogueView({ pirogue }: { pirogue: PirogueInterface }) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="flex flex-col rounded-xl border-2 border-primaryBorder p-4">
      <div className="flex items-center justify-between ">
        <div>
          <span className="text-sm text-gray"> Pirogue</span>
          <h5 className="text-lg">{pirogue.number}</h5>
        </div>
        <button
          onClick={() => {
            setSearchParams((params) => {
              params.set("selected_pirogue", pirogue.id.toString());
              return params;
            });
          }}
          className=" transition-all duration-100 active:scale-90"
        >
          <svg
            width="23"
            height="16"
            viewBox="0 0 23 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5 12.6666C12.8021 12.6666 13.9089 12.2109 14.8203 11.2994C15.7318 10.388 16.1875 9.28121 16.1875 7.97913C16.1875 6.67704 15.7318 5.57027 14.8203 4.65881C13.9089 3.74735 12.8021 3.29163 11.5 3.29163C10.1979 3.29163 9.09115 3.74735 8.17969 4.65881C7.26823 5.57027 6.8125 6.67704 6.8125 7.97913C6.8125 9.28121 7.26823 10.388 8.17969 11.2994C9.09115 12.2109 10.1979 12.6666 11.5 12.6666ZM11.5 10.7916C10.7188 10.7916 10.0547 10.5182 9.50781 9.97131C8.96094 9.42444 8.6875 8.76038 8.6875 7.97913C8.6875 7.19788 8.96094 6.53381 9.50781 5.98694C10.0547 5.44006 10.7188 5.16663 11.5 5.16663C12.2812 5.16663 12.9453 5.44006 13.4922 5.98694C14.0391 6.53381 14.3125 7.19788 14.3125 7.97913C14.3125 8.76038 14.0391 9.42444 13.4922 9.97131C12.9453 10.5182 12.2812 10.7916 11.5 10.7916ZM11.5 15.7916C9.17361 15.7916 7.05122 15.1666 5.13281 13.9166C3.21441 12.6666 1.69965 11.0173 0.588542 8.96871C0.501736 8.81246 0.436632 8.65187 0.393229 8.48694C0.349826 8.32201 0.328125 8.15274 0.328125 7.97913C0.328125 7.80551 0.349826 7.63624 0.393229 7.47131C0.436632 7.30638 0.501736 7.14579 0.588542 6.98954C1.69965 4.94093 3.21441 3.29163 5.13281 2.04163C7.05122 0.791626 9.17361 0.166626 11.5 0.166626C13.8264 0.166626 15.9488 0.791626 17.8672 2.04163C19.7856 3.29163 21.3003 4.94093 22.4115 6.98954C22.4983 7.14579 22.5634 7.30638 22.6068 7.47131C22.6502 7.63624 22.6719 7.80551 22.6719 7.97913C22.6719 8.15274 22.6502 8.32201 22.6068 8.48694C22.5634 8.65187 22.4983 8.81246 22.4115 8.96871C21.3003 11.0173 19.7856 12.6666 17.8672 13.9166C15.9488 15.1666 13.8264 15.7916 11.5 15.7916ZM11.5 13.7083C13.4618 13.7083 15.263 13.1918 16.9036 12.1588C18.5443 11.1258 19.7986 9.7326 20.6667 7.97913C19.7986 6.22565 18.5443 4.83242 16.9036 3.79944C15.263 2.76645 13.4618 2.24996 11.5 2.24996C9.53819 2.24996 7.73698 2.76645 6.09635 3.79944C4.45573 4.83242 3.20139 6.22565 2.33333 7.97913C3.20139 9.7326 4.45573 11.1258 6.09635 12.1588C7.73698 13.1918 9.53819 13.7083 11.5 13.7083Z"
              fill="#888888"
            />
          </svg>
        </button>
      </div>
      <hr className="w-full border-primaryBorder" />
      <div className="flex justify-between pt-4">
        <div className="flex flex-col gap-y-6 text-base text-gray">
          <span>Nationalité</span>
          <span>Nb d'immigrés</span>
          <span>Départ</span>
          <span>Destination</span>
        </div>
        <div className="flex flex-col gap-y-6 text-black">
          <span>{pirogue.nationality_name ?? "-"}</span>
          <span>{pirogue.immigrants_count}</span>
          <span>{pirogue.departure}</span>
          <span>{pirogue.destination}</span>
        </div>
      </div>
    </div>
  );
}
export default function AdminAgentPiroguesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTimer = React.useRef<NodeJS.Timeout>();
  const [dialogState, setDialogState] = React.useState<DialogState>({
    state: "none",
  });
  const [data, setData] = React.useState<
    PaginatedData<PirogueInterface> | PirogueInterface[] | null
  >(null);

  const token = useContext(AuthContext).authData?.token;
  const isAdmin = useContext(AuthContext).authData?.user.is_admin;
  const countriesNameCache = React.useRef<{ [key: string]: string }>({});

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const printRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    onBeforeGetContent() {},
    content: () => {
      return printRef.current;
    },
    onAfterPrint: () => {},
  });

  async function load() {
    let url = rootUrl + "pirogues";
    if (!isAdmin) {
      url = rootUrl + "me/pirogues";
    }
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
      if (key === "created_by") {
        axios
          .get(rootUrl + "users/" + value, {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
          .then((response) => {
            agentNamesCache.current[value] = response.data.name;
          });
      } else if (key === "nationality") {
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
    const searchBar = document.getElementById("pirogues_search_bar");

    const searchParam = searchParams.get("search");
    if (searchBar) {
      (searchBar as HTMLInputElement).value = searchParam ?? "";
    }
  }, []);

  const authContext = useContext(AuthContext);

  const agentNamesCache = React.useRef<{ [key: string]: string }>({});
  let tags: {
    id: string;
    title: string;
    value: string;
  }[] = [];
  searchParams.forEach((value, key) => {
    if (key === "created_by") {
      tags.push({
        id: key,
        title: "Agent",
        value: agentNamesCache.current[value] ?? "",
      });
    } else if (key === "nationality") {
      tags.push({
        id: key,
        title: "Nationalité",
        value: countriesNameCache.current[value] ?? "",
      });
    } else if (key === "port") {
      tags.push({
        id: key,
        title: "Port",
        value: value,
      });
    }
  });

  let list: PirogueInterface[] | null = null;
  if (data) {
    if ("total_pages" in data) {
      list = data.data;
    } else {
      list = data;
    }
  }
  return (
    <div className="flex">
      {/* pb is for the floting button */}
      <div className="flex flex-1 flex-col pb-10 lg:pb-0">
        <MDialog
          onClose={() => setDialogState({ state: "none" })}
          isOpen={dialogState.state !== "none"}
          title={
            dialogState.state === "editing"
              ? "Modifier Pirogue"
              : "Ajouter Pirogue"
          }
        >
          <AddEditPirogueDialog
            onDone={(added) => {
              setDialogState({ state: "none" });
              if (added) {
                load();
              }
            }}
          />
        </MDialog>
        {!isAdmin && (
          <div className="mb-10 flex w-full flex-row items-center justify-between">
            <Link
              to="/immigrants"
              className=" flex flex-row items-center gap-x-2 text-lg text-primary"
            >
              <LeftArrow className=" h-4 w-4 fill-primary" />
              <h3>Page d'émigrés </h3>
            </Link>
            {
              <DisconnectButton
                onClick={() => {
                  authContext.logOut();
                }}
              />
            }
          </div>
        )}
        <div className="mb-10 flex w-full flex-row items-center justify-between ">
          <Title className="">Pirogues</Title>
        </div>
        <div className=" flex w-full flex-row justify-between ">
          <div className="flex w-full items-start gap-x-6 lg:w-auto ">
            <SearchBar
              id="pirogues_search_bar"
              onChange={onSearchChange}
              placeholder="Chercher pirogues"
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
          <div className="hidden flex-row items-center gap-x-4 lg:flex">
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
            <FilledButton
              className="w-max"
              onClick={() => {
                setDialogState({ state: "adding" });
              }}
              isLight={true}
            >
              <span>Nouvelle pirogue</span> <PlusIcon />
            </FilledButton>
            {isAdmin && (
              <FilledButton
                onClick={() => {
                  setIsFilterOpen(true);
                }}
              >
                <span>Filtrer</span>
                <FilterIcon />
              </FilledButton>
            )}
          </div>
        </div>
        <div className="mt-10">
          <div className="flex flex-col gap-y-4 lg:hidden">
            {list?.map((pirogue, i) => <MobilePriogueView pirogue={pirogue} />)}
          </div>
          <FilledButton
            onClick={() => {
              setDialogState({ state: "adding" });
            }}
            className=" fixed inset-x-0 bottom-10 z-10 mx-8 lg:hidden"
          >
            Nouveu pirogue
            <PlusIcon className=" fill-white" />
          </FilledButton>
          <div className="flex flex-row items-center gap-x-2">
            <Input
              value={searchParams.get("date") ?? ""}
              onChange={(e) => {
                setSearchParams((params) => {
                  params.set("date", e.target.value);
                  return params;
                });
              }}
              className="mb-2 mt-4 hidden lg:block"
              type="date"
            />
            {searchParams.get("date") && (
              <button
                onClick={() => {
                  setSearchParams((params) => {
                    params.delete("date");
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
          <table className="hidden w-full text-center text-lg lg:table">
            <thead className="">
              <tr className="font-bold text-gray">
                <th className="text-medium  py-3 text-base">Numéro</th>
                <th className="text-medium py-3 text-base ">Agent</th>
                <th className="text-medium py-3 text-base">Equipage</th>
                <th className="text-medium py-3 text-base">Marque</th>
                <th className="text-medium py-3 text-base">Port</th>
                <th className="text-medium py-3 text-base">Nationalité</th>
                <th className="text-medium py-3 text-base">Lieu de départ</th>
                <th className="text-medium py-3 text-base">Destination</th>
                <th className="text-medium w-20  py-3 text-base"></th>
              </tr>
            </thead>
            {!data ? (
              <TableBodySquelette columnCount={8} />
            ) : (
              <tbody>
                {list?.map((pirogue, i) => (
                  <Tr>
                    {/* <Td>
                  <input type="checkbox" className="h-5 w-5" />
                </Td> */}
                    <Td className="flex items-center gap-x-2 gap-y-1 overflow-clip">
                      -
                    </Td>
                    <Td className="font-medium text-primary">
                      {pirogue.created_by_name ?? "-"}
                    </Td>
                    <Td>{pirogue.immigrants_count}</Td>
                    <Td>{pirogue.brand ?? "-"}</Td>
                    <Td>{pirogue.port ?? "-"}</Td>
                    <Td>{pirogue.nationality_name ?? "-"}</Td>
                    <Td>{pirogue.departure ?? "-"}</Td>
                    <Td>{pirogue.destination ?? "-"}</Td>
                    <Td>
                      <button
                        onClick={() => {
                          setSearchParams((params) => {
                            params.set(
                              "selected_pirogue",
                              pirogue.id.toString(),
                            );
                            return params;
                          });
                        }}
                        className=" transition-all duration-100 active:scale-90"
                      >
                        <svg
                          width="23"
                          height="16"
                          viewBox="0 0 23 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5 12.6666C12.8021 12.6666 13.9089 12.2109 14.8203 11.2994C15.7318 10.388 16.1875 9.28121 16.1875 7.97913C16.1875 6.67704 15.7318 5.57027 14.8203 4.65881C13.9089 3.74735 12.8021 3.29163 11.5 3.29163C10.1979 3.29163 9.09115 3.74735 8.17969 4.65881C7.26823 5.57027 6.8125 6.67704 6.8125 7.97913C6.8125 9.28121 7.26823 10.388 8.17969 11.2994C9.09115 12.2109 10.1979 12.6666 11.5 12.6666ZM11.5 10.7916C10.7188 10.7916 10.0547 10.5182 9.50781 9.97131C8.96094 9.42444 8.6875 8.76038 8.6875 7.97913C8.6875 7.19788 8.96094 6.53381 9.50781 5.98694C10.0547 5.44006 10.7188 5.16663 11.5 5.16663C12.2812 5.16663 12.9453 5.44006 13.4922 5.98694C14.0391 6.53381 14.3125 7.19788 14.3125 7.97913C14.3125 8.76038 14.0391 9.42444 13.4922 9.97131C12.9453 10.5182 12.2812 10.7916 11.5 10.7916ZM11.5 15.7916C9.17361 15.7916 7.05122 15.1666 5.13281 13.9166C3.21441 12.6666 1.69965 11.0173 0.588542 8.96871C0.501736 8.81246 0.436632 8.65187 0.393229 8.48694C0.349826 8.32201 0.328125 8.15274 0.328125 7.97913C0.328125 7.80551 0.349826 7.63624 0.393229 7.47131C0.436632 7.30638 0.501736 7.14579 0.588542 6.98954C1.69965 4.94093 3.21441 3.29163 5.13281 2.04163C7.05122 0.791626 9.17361 0.166626 11.5 0.166626C13.8264 0.166626 15.9488 0.791626 17.8672 2.04163C19.7856 3.29163 21.3003 4.94093 22.4115 6.98954C22.4983 7.14579 22.5634 7.30638 22.6068 7.47131C22.6502 7.63624 22.6719 7.80551 22.6719 7.97913C22.6719 8.15274 22.6502 8.32201 22.6068 8.48694C22.5634 8.65187 22.4983 8.81246 22.4115 8.96871C21.3003 11.0173 19.7856 12.6666 17.8672 13.9166C15.9488 15.1666 13.8264 15.7916 11.5 15.7916ZM11.5 13.7083C13.4618 13.7083 15.263 13.1918 16.9036 12.1588C18.5443 11.1258 19.7986 9.7326 20.6667 7.97913C19.7986 6.22565 18.5443 4.83242 16.9036 3.79944C15.263 2.76645 13.4618 2.24996 11.5 2.24996C9.53819 2.24996 7.73698 2.76645 6.09635 3.79944C4.45573 4.83242 3.20139 6.22565 2.33333 7.97913C3.20139 9.7326 4.45573 11.1258 6.09635 12.1588C7.73698 13.1918 9.53819 13.7083 11.5 13.7083Z"
                            fill="#888888"
                          />
                        </svg>
                      </button>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            )}
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
            <table className="w-full text-center">
              <thead className="">
                <tr className="font-bold text-gray">
                  <th className="border-gray-300 border text-base">
                    N° du pirogue
                  </th>
                  <th className="border-gray-300 border text-base ">
                    Nationalité
                  </th>
                  <th className="border-gray-300 border text-base">
                    NBRE D'IMMIGRES
                  </th>
                  <th className="border-gray-300 border text-base">DEPART</th>
                  <th className="border-gray-300 border text-base">
                    OBSERVATIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((pirogue, index) => {
                  return (
                    <tr>
                      {/* border */}
                      <td className="border-gray-300 border ">
                        {pirogue.number}
                      </td>
                      <td className="border-gray-300 border ">
                        {pirogue.nationality_name}
                      </td>
                      <td className="border-gray-300 border ">
                        {pirogue.immigrants_count}
                      </td>
                      <td className="border-gray-300 border ">
                        {pirogue.departure ?? "-"}
                      </td>
                      <td className="border-gray-300 border "></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!searchParams.get("date") && (
          <Pagination
            className="mt-6 lg:mt-10"
            onItemClick={(page) => {
              setSearchParams((params) => {
                params.set("page", page.toString());
                return params;
              });
              // if mobile scroll to the top
              window.scrollTo(0, 0);
            }}
            current={
              searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1
            }
            total={(data as PaginatedData<PirogueInterface>)?.total_pages ?? 1}
          />
        )}
      </div>
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
                  ] ?? null
                }
                onSelected={function (value): void {
                  countriesNameCache.current[value.id.toString()] =
                    value.name_fr;
                  setSearchParams((params) => {
                    if (value) {
                      params.set("nationality", value.id.toString());
                    } else {
                      params.delete("nationality");
                    }
                    params.set("page", "1");

                    return params;
                  });
                }}
                placeHolder={"Nationalité"}
                search={true}
                url={"countries"}
                lookupColumn="name_fr"
              />
              <Select
                // disabled={isSubmitting}
                value={searchParams.get("port") ?? ""}
                onChange={(e) => {
                  setSearchParams((params) => {
                    if (e.target.value === "") {
                      params.delete("port");
                    } else {
                      params.set("port", e.target.value);
                    }
                    params.set("page", "1");
                    return params;
                  });
                }}
                className={searchParams.get("port") ? "" : "text-gray"}
              >
                <option value="" disabled>
                  Port
                </option>
                <option value="ndagou">Ndagou</option>
                <option value="nouadhibou">Nouadhibou</option>
                <option value="nouakchott">Nouakchott</option>
                <option value="tanit">Tanit</option>
              </Select>
            </div>
            {/* <FilledButton
              onClick={() => {}}
              className="mt-32 w-full self-center"
            >
              Appliquer
            </FilledButton> */}
          </div>
        </div>
      )}
      {searchParams.get("selected_pirogue") && (
        <div className={searchParams.get("selected_pirogue") ? "" : "hidden"}>
          <div
            onClick={() => {
              setSearchParams((params) => {
                params.delete("selected_pirogue");
                return params;
              });
            }}
            className={`fixed inset-0 z-10 flex items-center justify-center bg-gray opacity-70 `}
          ></div>

          <RDialog.Root
            open={!!searchParams.get("selected_pirogue")}
            onOpenChange={(open) => {
              if (!open) {
                setSearchParams((params) => {
                  params.delete("selected_pirogue");
                  return params;
                });
              }
            }}
          >
            <RDialog.Portal>
              <RDialog.Overlay className="fixed inset-0 z-20 flex items-center justify-center bg-gray opacity-70" />
              <RDialog.Content className="fixed right-0 top-0 z-20 h-screen  w-screen overflow-y-auto bg-white shadow-lg lg:w-[60%]">
                <PirogueDetailPage
                  className=""
                  pirogueId={searchParams.get("selected_pirogue") ?? "0"}
                  onCloseClick={() => {
                    setSearchParams((params) => {
                      params.delete("selected_pirogue");
                      params.delete("selected_pirogue_imm_page");
                      return params;
                    });
                  }}
                />
              </RDialog.Content>
            </RDialog.Portal>
          </RDialog.Root>
        </div>
      )}
    </div>
  );
}
