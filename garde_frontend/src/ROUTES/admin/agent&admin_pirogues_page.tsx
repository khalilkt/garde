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

export interface PirogueInterface {
  id: number;
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
  const [formState, setFormState] = React.useState({
    numbers: [""],
    lat: "",
    long: "",
    departure: "",
    destination: "",
    extra: "",
    description: "",
    port: "",
    //
    puissance: "",
    fuel: 0,
    material: "",
    nationality: "",
    brand: "",
    gps: [""],
  });
  const token = useContext(AuthContext).authData?.token;
  const couttriesNameCache = React.useRef<{ [key: string]: string }>({});

  async function create() {
    try {
      if (
        formState.lat.length === 0 ||
        formState.long.length === 0 ||
        formState.departure.length === 0 ||
        formState.destination.length === 0 ||
        formState.port.length === 0
      ) {
        alert("Veuillez remplir tous les champs");
        return;
      }
      await axios.post(
        rootUrl + "me/pirogues/",
        {
          lat: formState.lat,
          long: formState.long,
          motor_numbers: formState.numbers,
          puissance:
            formState.puissance.length === 0 ? null : formState.puissance,
          port: formState.port,
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
  }

  return (
    <div className="grid  grid-cols-2 gap-x-4 gap-y-6 ">
      <div className="col-span-2 flex flex-col gap-y-2">
        {formState.numbers.map((number, i) => (
          <Input
            value={number}
            onChange={(e) => {
              const newNumbers = [...formState.numbers];
              newNumbers[i] = e.target.value;
              setFormState((state) => ({ ...state, numbers: newNumbers }));
            }}
            className="col-span-2"
            placeholder={`Numéro du moteur ${i === 0 ? "" : i + 1}`}
            type="text"
          />
        ))}
        <OutlinedButton
          onClick={() => {
            setFormState((state) => ({
              ...state,
              numbers: [...state.numbers, ""],
            }));
          }}
          className="col-span-2"
        >
          Ajouter numéro
        </OutlinedButton>
      </div>
      <Select
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
        placeHolder={"Nationalité"}
        search={true}
        url={"countries"}
        lookupColumn="name_fr"
      />
      <Input
        value={formState.brand}
        onChange={(e) => {
          setFormState((state) => ({ ...state, brand: e.target.value }));
        }}
        placeholder="Marque"
        type="text"
      />
      <Input
        value={formState.puissance}
        onChange={(e) => {
          setFormState((state) => ({ ...state, puissance: e.target.value }));
        }}
        placeholder="Puissance"
        type="number"
      />
      <Input
        value={formState.lat}
        onChange={(e) => {
          setFormState((state) => ({ ...state, lat: e.target.value }));
        }}
        placeholder="Latitude"
        type="number"
      />
      <Input
        value={formState.long}
        onChange={(e) => {
          setFormState((state) => ({ ...state, long: e.target.value }));
        }}
        placeholder="Longitude"
        type="number"
      />

      <Input
        value={formState.departure}
        onChange={(e) => {
          setFormState((state) => ({ ...state, departure: e.target.value }));
        }}
        placeholder="Départ"
      />
      <Input
        value={formState.destination}
        onChange={(e) => {
          setFormState((state) => ({ ...state, destination: e.target.value }));
        }}
        placeholder="Déstination"
      />
      <Input
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
          Port
        </option>
        <option value="ndagou">Ndagou</option>
        <option value="nouadhibou">Nouadhibou</option>
        <option value="nouakchott">Nouakchott</option>
        <option value="tanit">Tanit</option>
      </Select>
      <div className="col-span-2 flex w-full items-center justify-center">
        <hr className=" w-1/2 place-content-center self-center border-gray" />
      </div>
      <div className="col-span-2 flex flex-col gap-y-2">
        {formState.gps.map((g, i) => (
          <Input
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
        value={formState.extra}
        onChange={(e) => {
          setFormState((state) => ({ ...state, extra: e.target.value }));
        }}
        className=" col-span-2"
        placeholder="Effets persnonels"
      />
      <Textarea
        value={formState.description}
        onChange={(e) => {
          setFormState((state) => ({ ...state, description: e.target.value }));
        }}
        className=" col-span-2"
        placeholder="Description"
      />

      <FilledButton
        className="w-full"
        onClick={() => {
          onDone(false);
        }}
        isLight={true}
      >
        Annuler
      </FilledButton>
      <FilledButton onClick={create} className="col-span-1 w-full">
        Créer Pirogue
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
          <h5 className="text-lg">
            {pirogue.motor_numbers.length > 0 ? pirogue.motor_numbers[0] : "-"}
          </h5>
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
  const [data, setData] =
    React.useState<PaginatedData<PirogueInterface> | null>(null);

  const token = useContext(AuthContext).authData?.token;
  const isAdmin = useContext(AuthContext).authData?.user.is_admin;

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

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
    }
  });
  return (
    <div className="flex">
      {/* pb is for the floting button */}
      <div className="flex flex-1 flex-col pb-10 md:pb-0">
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
        <div className="mb-10 flex w-full flex-row items-center justify-between ">
          <Title className="">Pirogues</Title>
          {!isAdmin && (
            <DisconnectButton
              onClick={() => {
                authContext.logOut();
              }}
            />
          )}
        </div>
        <div className=" flex w-full flex-row justify-between ">
          <div className="flex w-full items-center gap-x-6">
            <SearchBar
              id="pirogues_search_bar"
              onChange={onSearchChange}
              placeholder="Chercher pirogues"
              className="w-full md:w-[300px]"
            />
            {Array.from(tags).map(({ id, title, value }) => (
              <Tag
                className="hidden md:block"
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
          <div className="hidden flex-row items-center gap-x-4 md:flex">
            <OutlinedButton className="border-[#009C22] text-[#009C22]">
              <span>Exporter</span>
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.33325 17.25C5.82909 17.25 5.39749 17.0705 5.03846 16.7115C4.67943 16.3524 4.49992 15.9208 4.49992 15.4167V13.5833H2.66659C2.16242 13.5833 1.73082 13.4038 1.37179 13.0448C1.01277 12.6858 0.833252 12.2542 0.833252 11.75V8.08333C0.833252 7.30417 1.10061 6.65104 1.63534 6.12396C2.17006 5.59688 2.81936 5.33333 3.58325 5.33333H16.4166C17.1958 5.33333 17.8489 5.59688 18.376 6.12396C18.903 6.65104 19.1666 7.30417 19.1666 8.08333V11.75C19.1666 12.2542 18.9871 12.6858 18.628 13.0448C18.269 13.4038 17.8374 13.5833 17.3333 13.5833H15.4999V15.4167C15.4999 15.9208 15.3204 16.3524 14.9614 16.7115C14.6023 17.0705 14.1708 17.25 13.6666 17.25H6.33325ZM2.66659 11.75H4.49992C4.49992 11.2458 4.67943 10.8142 5.03846 10.4552C5.39749 10.0962 5.82909 9.91667 6.33325 9.91667H13.6666C14.1708 9.91667 14.6023 10.0962 14.9614 10.4552C15.3204 10.8142 15.4999 11.2458 15.4999 11.75H17.3333V8.08333C17.3333 7.82361 17.2454 7.6059 17.0697 7.43021C16.894 7.25451 16.6763 7.16667 16.4166 7.16667H3.58325C3.32353 7.16667 3.10582 7.25451 2.93013 7.43021C2.75443 7.6059 2.66659 7.82361 2.66659 8.08333V11.75ZM13.6666 5.33333V2.58333H6.33325V5.33333H4.49992V2.58333C4.49992 2.07917 4.67943 1.64757 5.03846 1.28854C5.39749 0.929514 5.82909 0.75 6.33325 0.75H13.6666C14.1708 0.75 14.6023 0.929514 14.9614 1.28854C15.3204 1.64757 15.4999 2.07917 15.4999 2.58333V5.33333H13.6666ZM15.4999 9.45833C15.7596 9.45833 15.9773 9.37049 16.153 9.19479C16.3287 9.0191 16.4166 8.80139 16.4166 8.54167C16.4166 8.28194 16.3287 8.06424 16.153 7.88854C15.9773 7.71285 15.7596 7.625 15.4999 7.625C15.2402 7.625 15.0225 7.71285 14.8468 7.88854C14.6711 8.06424 14.5833 8.28194 14.5833 8.54167C14.5833 8.80139 14.6711 9.0191 14.8468 9.19479C15.0225 9.37049 15.2402 9.45833 15.4999 9.45833ZM13.6666 15.4167V11.75H6.33325V15.4167H13.6666Z"
                  fill="#009C22"
                />
              </svg>
            </OutlinedButton>
            <FilledButton
              onClick={() => {
                setDialogState({ state: "adding" });
              }}
              isLight={true}
            >
              <span>Nouvelle pirogue</span> <PlusIcon />
            </FilledButton>
            <FilledButton
              onClick={() => {
                setIsFilterOpen(true);
              }}
            >
              <span>Filtrer</span>
              <FilterIcon />
            </FilledButton>
          </div>
        </div>
        <div className="mt-10">
          <div className="flex flex-col gap-y-4 md:hidden">
            {data?.data.map((pirogue, i) => (
              <MobilePriogueView pirogue={pirogue} />
            ))}
          </div>
          <FilledButton
            onClick={() => {
              setDialogState({ state: "adding" });
            }}
            className=" fixed inset-x-0 bottom-10 z-10 mx-8 md:hidden"
          >
            Nouveu pirogue
            <PlusIcon className=" fill-white" />
          </FilledButton>
          <table className="hidden w-full text-center text-lg md:table">
            <thead className="">
              <tr className="font-bold text-gray">
                <th className="text-medium  py-3 text-base">Numéro</th>
                <th className="text-medium  py-3 text-base">Agent</th>
                <th className="text-medium py-3 text-base">Nb d'immigrés</th>
                <th className="text-medium py-3 text-base">Marque</th>
                <th className="text-medium py-3 text-base">Matière</th>
                <th className="text-medium py-3 text-base">Nationalité</th>
                <th className="text-medium py-3 text-base">Lieu de départ</th>
                <th className="text-medium py-3 text-base">Destination</th>
                <th className="text-medium w-20  py-3 text-base"></th>
              </tr>
            </thead>
            {!data ? (
              <TableBodySquelette columnCount={6} />
            ) : (
              <tbody>
                {data?.data.map((pirogue, i) => (
                  <Tr>
                    {/* <Td>
                  <input type="checkbox" className="h-5 w-5" />
                </Td> */}
                    <Td className="flex flex-col items-center gap-y-1">
                      {pirogue.motor_numbers && pirogue.motor_numbers.length > 0
                        ? pirogue.motor_numbers.map((number) => (
                            <span className="w-min rounded-xl bg-primaryLight px-2 py-1 text-xs font-semibold">
                              {number.length > 0 ? number : "-"}
                            </span>
                          ))
                        : "-"}
                    </Td>
                    <Td>{pirogue.created_by_name ?? "-"}</Td>
                    <Td>{pirogue.immigrants_count}</Td>
                    <Td>{pirogue.brand ?? "-"}</Td>
                    <Td>
                      {pirogue.material ? MATERIAL_NAME[pirogue.material] : "-"}
                    </Td>
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
        <Pagination
          className="mt-6 md:mt-10"
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
          total={data?.total_pages ?? 1}
        />
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
              <RDialog.Content className="fixed right-0 top-0 z-20 h-screen  w-screen overflow-y-auto bg-white shadow-lg md:w-[60%]">
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
