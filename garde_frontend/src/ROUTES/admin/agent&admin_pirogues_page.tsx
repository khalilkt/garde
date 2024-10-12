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
import { AnimatePresence, motion } from "framer-motion";
import { ExcelExportButton } from "../../components/excel_button";

export interface PirogueInterface {
  id: number;
  number: string;
  created_by_name: string;
  immigrants_count: number;
  sejour: number | null;
  lat: string;
  long: string;
  departure: string;
  destination: string;
  description: string;
  created_at: string;
  created_by: number;
  motor_numbers: { [key: string]: number | null };
  puissance: number;
  port: string;
  landing_point: string;

  material: string;
  brand: string;
  gps: string[];
  nationality: string;
  nationality_name: string;
  extra: string;
  fuel: number;
  etat: string;
  situation: string;
  video: string | null;
}

export interface DialogState {
  state: "none" | "editing" | "sejour_edit";
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

function SuperAdminEditPirogue({
  pirogueId,
  pirogue,
  onSubmit,
}: {
  pirogueId: number;
  pirogue: PirogueInterface;
  onSubmit: () => void;
}) {
  const [motorsText, setMotorsText] = React.useState("");
  const [gpsText, setGpsText] = React.useState("");
  const [fuel, setFuel] = React.useState(0);
  const [situation, setSituation] = React.useState("");
  const [lat, setLat] = React.useState("");
  const [long, setLong] = React.useState("");
  const [number, setNumber] = React.useState("");

  const token = useContext(AuthContext).authData?.token;

  const [selectedNationality, setSelectedNationality] = React.useState<{
    name: string;
    id: string;
  } | null>(null);

  const [submiting, setSubmiting] = React.useState(false);

  useEffect(() => {
    setMotorsText(
      Object.entries(pirogue.motor_numbers)
        .map(([key, value]) => key + " " + value)
        .join("\n"),
    );
    setGpsText(pirogue.gps.join("\n"));
    setFuel(pirogue.fuel);
    setSituation(pirogue.situation);
    setLat(pirogue.lat);
    setLong(pirogue.long);
    setNumber(pirogue.number);
  }, [pirogue]);

  async function change() {
    async function changePirogue() {
      await axios.patch(
        rootUrl + "pirogues/" + pirogueId + "/",
        {
          nationality: selectedNationality?.id ?? null,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
    }
    await changePirogue();
    submit();
    return;
    const immigrantsData = (
      await axios.get(rootUrl + "pirogues/" + pirogueId + "/immigrants/", {
        headers: {
          Authorization: `Token ${token}`,
        },
        params: {
          all: true,
        },
      })
    ).data;
    const immigrantsIds = (immigrantsData as any[]).map((i) => i.id);

    async function changeImmigrant(id: number) {
      return;
      await axios.patch(
        rootUrl + "immigrants/" + id + "/",
        {
          pirogue: null,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
    }

    setSubmiting(true);

    let promises = immigrantsIds.map((id) => changeImmigrant(id));
    promises.push(changePirogue());
    try {
      await Promise.all(promises);
    } catch (e) {
      alert("Erreur lors de la modification des immigrants");
      console.log(e);
    }
    setSubmiting(false);
  }

  function submit() {
    axios
      .patch(
        rootUrl + "pirogues/" + pirogueId + "/",
        {
          motor_numbers: data.motor_numbers,
          gps: data.gps,
          fuel: data.fuel,
          situation: data.situation,
          lat: data.lat,
          long: data.long,
          number: data.number,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      )
      .then((res) => {
        onSubmit();
      });
  }
  function onDelete() {
    axios
      .delete(rootUrl + "pirogues/" + pirogueId + "/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        onSubmit();
      });
  }

  let data: {
    motor_numbers: { [key: string]: number };
    gps: string[];
    fuel: number;
    situation: string;
    lat: string;
    long: string;
    number: string;
  } = {
    motor_numbers: {},
    gps: [],
    fuel: 0,
    situation: "",
    lat: "",
    long: "",
    number: "",
  };

  for (const line of motorsText.split("\n")) {
    let splited = line.split(" ");
    if (splited.length > 1) {
      const cv = parseInt(splited.pop()!);
      const name = splited.join(" ");

      if (!isNaN(cv)) {
        data.motor_numbers[name] = cv;
      }
    }
  }

  data.gps = gpsText.split("\n").filter((g) => g.length > 0);
  data.fuel = fuel;
  data.situation = situation;
  data.lat = lat;
  data.long = long;
  data.number = number;

  return (
    <div className="flex w-[600px] flex-col gap-y-4">
      <Input
        placeholder="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <Textarea
        placeholder="N 123123213 15"
        value={motorsText}
        onChange={(e) => {
          setMotorsText(e.target.value);
        }}
      />
      <Textarea
        placeholder={`GPS 1 \nGPS 2`}
        value={gpsText}
        onChange={(e) => {
          setGpsText(e.target.value);
        }}
      />
      <Input
        type="number"
        placeholder="bidons d'essence"
        className="w-min"
        value={fuel}
        onChange={(e) => {
          setFuel(parseInt(e.target.value));
        }}
      />
      <div className="flex gap-x-4">
        <Input
          placeholder="lat"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <Input
          placeholder="long"
          value={long}
          onChange={(e) => setLong(e.target.value)}
        />
      </div>
      <Textarea
        placeholder="situation"
        value={situation}
        onChange={(e) => {
          setSituation(e.target.value);
        }}
      />
      <div className="bg-red-50">
        {data.motor_numbers !== undefined &&
          Object.entries(data.motor_numbers as { [key: string]: number }).map(
            ([key, value]) => (
              <div>
                {key} : {value}
              </div>
            ),
          )}
      </div>
      <div className="bg-green-50">
        {data.gps.map((g: string) => (
          <div>{g}</div>
        ))}
      </div>
      <SearchSelect<CountryInterface>
        value={selectedNationality?.name ?? null}
        onSelected={function (value): void {
          setSelectedNationality({
            name: value.name_fr,
            id: value.id.toString(),
          });
        }}
        placeHolder={"Nationalité"}
        search={true}
        url={"countries"}
        lookupColumn="name_fr"
      />
      <div className="flex justify-between">
        <OutlinedButton
          className="border-red-500 text-red-500"
          onClick={onDelete}
        >
          Supprimer
        </OutlinedButton>
        <OutlinedButton
          onClick={change}
          className="border-green-500 text-green-500"
        >
          {submiting ? "Loading..." : "Change"}
        </OutlinedButton>
        {/* <FilledButton onClick={submit}>Enregistrer</FilledButton> */}
      </div>
    </div>
  );
}

function EditPirogueDialog({
  initialPirogue,
  onDone,
}: {
  initialPirogue: PirogueInterface;
  onDone: (updated: boolean) => void;
}) {
  const [formState, setFormState] = React.useState<{
    number: string;
    motor_numbers: {
      name: string;
      cv: number;
    }[];
    departure: string;
    destination: string;
    extra: string;
    port: string;
    etat: string;
    fuel: number;
    material: string;
    nationality: {
      name: string;
      id: string;
    } | null;
    brand: string;
    gps: string[];
    situation: string;
    landing_point: string;
  }>({
    number: "",
    motor_numbers: [
      {
        name: "",
        cv: 0,
      },
    ],
    departure: "",
    destination: "",
    extra: "",
    port: "",
    etat: "saisie",
    fuel: 0,
    material: "",
    nationality: null,
    brand: "",
    gps: [""],
    situation: "",
    landing_point: "",
  });
  const token = useContext(AuthContext).authData?.token;
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function init() {
    let motors: { name: string; cv: number }[] = [];
    for (const [key, value] of Object.entries(initialPirogue.motor_numbers)) {
      motors.push({ name: key, cv: value ?? 0 });
    }

    setFormState({
      number: initialPirogue.number,
      motor_numbers: motors,
      departure: initialPirogue.departure,
      landing_point: initialPirogue.landing_point,

      destination: initialPirogue.destination,
      extra: initialPirogue.extra,
      port: initialPirogue.port,
      etat: initialPirogue.etat,
      fuel: initialPirogue.fuel,
      material: initialPirogue.material ? initialPirogue.material : "",
      nationality: initialPirogue.nationality
        ? {
            name: initialPirogue.nationality_name,
            id: initialPirogue.nationality,
          }
        : null,
      brand: initialPirogue.brand,
      gps: initialPirogue.gps,
      situation: initialPirogue.situation,
    });
  }

  useEffect(() => {
    init();
  }, [initialPirogue.id]);

  async function update() {
    try {
      if (
        formState.number.length === 0 ||
        formState.departure.length === 0 ||
        formState.destination.length === 0 ||
        formState.port.length === 0 ||
        formState.etat.length === 0 ||
        formState.nationality === null
      ) {
        alert("Veuillez remplir les champs obligatoire");
        return;
      }
      setIsSubmitting(true);

      let motor_numbers: { [key: string]: number | null } = {};
      for (const motor of formState.motor_numbers) {
        motor_numbers[motor.name] = motor.cv;
      }

      await axios.patch(
        rootUrl + "pirogues/" + initialPirogue.id + "/",
        {
          number: formState.number,
          motor_numbers: motor_numbers,
          departure: formState.departure,
          destination: formState.destination,
          landing_point: formState.landing_point,
          extra: formState.extra,
          port: formState.port,
          etat: formState.etat,
          fuel: formState.fuel,
          material: formState.material,
          nationality: formState.nationality?.id ?? null,
          brand: formState.brand,
          gps: formState.gps,
          situation: formState.situation,
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
        {formState.motor_numbers.map((motor_number, i) => (
          <div className="flex gap-x-4">
            <Input
              disabled={isSubmitting}
              value={motor_number.name}
              onChange={(e) => {
                const newMotors = [...formState.motor_numbers];
                newMotors[i].name = e.target.value;
                setFormState((state) => ({
                  ...state,
                  motor_numbers: newMotors,
                }));
              }}
              className="col-span-2"
              placeholder={`Numéro du moteur ${i + 1}`}
              type="text"
            />
            <Input
              disabled={isSubmitting}
              value={motor_number.cv.toString()}
              onChange={(e) => {
                const newMotors = [...formState.motor_numbers];
                let value = parseInt(e.target.value);
                if (isNaN(value)) {
                  value = 0;
                }
                newMotors[i].cv = value;
                setFormState((state) => ({
                  ...state,
                  motor_numbers: newMotors,
                }));
              }}
              className="col-span-2"
              placeholder={`Numéro du moteur ${i + 1}`}
              type="text"
            />
            <button
              onClick={() => {
                const newMotors = [...formState.motor_numbers];
                newMotors.splice(i, 1);
                setFormState((state) => ({
                  ...state,
                  motor_numbers: newMotors,
                }));
              }}
            >
              <DeleteIcon />
            </button>
          </div>
        ))}
        <OutlinedButton
          disabled={isSubmitting}
          onClick={() => {
            setFormState((state) => ({
              ...state,
              motor_numbers: [
                ...state.motor_numbers,
                {
                  name: "",
                  cv: 0,
                },
              ],
            }));
          }}
          className="col-span-2"
        >
          Ajouter un Moteur
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
        value={formState.nationality?.name ?? null}
        onSelected={(value) => {
          setFormState((state) => ({
            ...state,
            nationality: { name: value.name_fr, id: value.id.toString() },
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

      <Input
        disabled={isSubmitting}
        className="col-span-2"
        value={formState.landing_point}
        onChange={(e) => {
          setFormState((state) => ({
            ...state,
            landing_point: e.target.value,
          }));
        }}
        placeholder="Point de débarquement"
      />
      <div className="col-span-2 flex w-full items-center justify-center">
        <hr className=" w-1/2 place-content-center self-center border-gray" />
      </div>
      <div className="col-span-2 flex flex-col gap-y-2">
        {formState.gps.map((g, i) => (
          <div className="flex gap-x-4">
            <Input
              disabled={isSubmitting}
              value={g}
              onChange={(e) => {
                const newGps = [...formState.gps];
                newGps[i] = e.target.value;
                setFormState((state) => ({ ...state, gps: newGps }));
              }}
              className="col-span-2 flex-1"
              placeholder={` GPS ${i === 0 ? "" : i + 1}`}
              type="text"
            />
            <button
              onClick={() => {
                const newGps = [...formState.gps];
                newGps.splice(i, 1);
                setFormState((state) => ({ ...state, gps: newGps }));
              }}
            >
              <DeleteIcon />
            </button>
          </div>
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
        value={formState.situation}
        onChange={(e) => {
          setFormState((state) => ({ ...state, situation: e.target.value }));
        }}
        className="col-span-2"
        placeholder="situation"
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
    } else if (key === "is_mrt") {
      tags.push({
        id: key,
        title: "",
        value: value === "true" ? "Tentatif" : "Passeur",
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
    } else if (key === "material") {
      tags.push({
        id: key,
        title: "Matériel",
        value: MATERIAL_NAME[value],
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

  const totalGps =
    list?.reduce((acc, pirogue) => {
      return acc + pirogue.gps.filter((f) => f.length > 0).length;
    }, 0) ?? 0;

  let totalMotorByPower: { [key: string]: number } = {};
  list?.forEach((pirogue) => {
    const motorNumbers = pirogue.motor_numbers;
    Object.entries(motorNumbers).forEach(([key, value]) => {
      if (value) {
        totalMotorByPower[value] = (totalMotorByPower[value] ?? 0) + 1;
      }
    });
  });
  const totalMotor =
    list?.reduce((acc, p) => acc + Object.keys(p.motor_numbers).length, 0) ?? 0;

  const totalFuel =
    list?.reduce((acc, pirogue) => {
      return acc + pirogue.fuel;
    }, 0) ?? 0;

  let totalPirogueSaisie = 0;
  let totalPirogueCassee = 0;
  let totalPirogueAbandonnee = 0;

  for (const pirogue of list ?? []) {
    if (pirogue !== null) {
      if (pirogue.etat === "saisie") {
        totalPirogueSaisie++;
      } else if (pirogue.etat === "casse") {
        totalPirogueCassee++;
      } else if (pirogue.etat === "abandonnee") {
        totalPirogueAbandonnee++;
      }
    }
  }

  function getDialogTitle() {
    switch (dialogState.state) {
      case "editing":
        return "Modifier Pirogue";
      case "sejour_edit":
        return "Modifier Séjour";
      default:
        return "";
    }
  }

  async function onSejourEdit(pirogue_id: number, sejour: number) {
    await axios
      .patch(
        rootUrl + "pirogues/" + pirogue_id + "/",
        { sejour: sejour },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      )
      .then((res) => {});
  }
  function formatDateTime(date: string) {
    const d = new Date(date);

    // do  not forget to pad the month and day and hours and minutes
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }
  return (
    <div className="flex">
      {/* pb is for the floting button */}
      <div className="flex flex-1 flex-col pb-10 lg:pb-0">
        <MDialog
          onClose={() => setDialogState({ state: "none" })}
          isOpen={dialogState.state !== "none"}
          title={getDialogTitle()}
        >
          <>
            {dialogState.state === "editing" && (
              <EditPirogueDialog
                initialPirogue={dialogState.payload!.pirogue}
                onDone={(updated) => {
                  setDialogState({ state: "none" });
                  if (updated) {
                    load();
                  }
                }}
              />
            )}
            {dialogState.state === "sejour_edit" &&
              (false ? (
                <SuperAdminEditPirogue
                  onSubmit={() => {
                    load();
                    setDialogState({ state: "none" });
                  }}
                  pirogueId={dialogState.payload!.pirogue_id}
                  pirogue={dialogState.payload!.pirogue}
                />
              ) : (
                <div className="flex flex-col gap-y-3">
                  <Input
                    id="pirogue_sejour_input"
                    placeholder="Nouveau séjour (jours)"
                    type="number"
                    className="w-[300px]"
                  />
                  <FilledButton
                    onClick={() => {
                      onSejourEdit(
                        dialogState.payload!.pirogue_id,
                        parseInt(
                          (
                            document.getElementById(
                              "pirogue_sejour_input",
                            ) as HTMLInputElement
                          ).value,
                        ),
                      ).then((_) => {
                        load();
                      });
                      setDialogState({ state: "none" });
                    }}
                  >
                    Enregistrer
                  </FilledButton>
                </div>
              ))}
          </>
        </MDialog>
        {!isAdmin && (
          <div className="mb-10 flex w-full flex-row items-center justify-between">
            <Link
              to="/immigrants"
              className=" flex flex-row items-center gap-x-2 text-lg text-primary"
            >
              <LeftArrow className=" h-4 w-4 fill-primary" />
              <h3>Page des Migrants </h3>
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
              <>
                <ExcelExportButton
                  data={
                    list?.map((pirogue) => {
                      return {
                        Numéro: pirogue.number,
                        "Numéro des moteurs": Object.entries(
                          pirogue.motor_numbers,
                        )
                          .map(([key, value]) => `${key} : ${value}`)
                          .join(", "),
                        Equipage: pirogue.immigrants_count,
                        Port: pirogue.port,
                        Nationalité: pirogue.nationality_name,
                        Marque: pirogue.brand,
                        GPS: pirogue.gps.join(", "),
                        Situation: pirogue.situation,
                        "Point de débarquement": pirogue.landing_point,
                        Matériel: MATERIAL_NAME[pirogue.material],
                        Etat: pirogue.etat,
                        Essence: pirogue.fuel,
                        Date: formatDateTime(pirogue.created_at),
                      };
                    }) ?? []
                  }
                  fileName={
                    "Pirogues " +
                    (searchParams.get("date")?.replaceAll("-", "/") ?? "")
                  }
                />
                <OutlinedButton
                  className="border-green-600 text-green-600"
                  onClick={() => {
                    handlePrint();
                  }}
                >
                  <span>Imprimer</span>
                </OutlinedButton>
                <FilledButton
                  onClick={() => {
                    setIsFilterOpen(true);
                  }}
                >
                  <span>Filtrer</span>
                  <FilterIcon />
                </FilledButton>
              </>
            )}
          </div>
        </div>
        <div className="mt-10">
          <div className="hidden flex-col gap-y-4 lg:hidden">
            {list?.map((pirogue, i) => <MobilePriogueView pirogue={pirogue} />)}
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
              <span className="">
                <span>Total </span>
                <span className="font-semibold">
                  {list!.length}({totalPirogueSaisie}, {totalPirogueAbandonnee},
                  {totalPirogueCassee})
                </span>
                <span> - {totalGps} GPS</span>
                <span> - {totalMotor} Moteurs</span>
                <span className="text-sm">
                  ({" "}
                  {Object.entries(totalMotorByPower)
                    .map(([key, value]) => `${value} ${key}CV`)
                    .join(", ")}
                  )
                </span>
                <span> - {totalFuel} Bidons d'essence</span>
              </span>
            )}
          </div>
          <table className="hidden w-full text-center text-lg lg:table">
            <thead className="">
              <tr className="font-bold text-gray">
                <th className="text-medium  py-3 text-base">Numéro</th>
                <th className="text-medium py-3 text-base">Num des moteurs</th>
                <th className="text-medium py-3 text-base">Equipage</th>
                <th className="text-medium py-3 text-base">Port</th>
                <th className="text-medium py-3 text-base">Nationalité</th>
                <th className="text-medium py-3 text-base">Lieu de départ</th>
                <th className="text-medium py-3 text-base">Date</th>
                <th className="text-medium py-3 text-base ">Utilisateur</th>
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
                    <Td className="">
                      {/* {pirogue.number.toString() + ` (${pirogue.id})`} */}
                      {pirogue.number}
                    </Td>
                    <Td>
                      {Object.keys(pirogue.motor_numbers).join(", ") ?? "-"}
                    </Td>

                    <Td>{pirogue.immigrants_count}</Td>
                    <Td>{pirogue.port ?? "-"}</Td>
                    <Td>{pirogue.nationality_name ?? "-"}</Td>
                    <Td>{pirogue.departure ?? "-"}</Td>
                    <Td className="font-medium">
                      {formatDateTime(pirogue.created_at)}
                    </Td>
                    <Td className="font-medium text-primary">
                      {pirogue.created_by_name ?? "-"}
                    </Td>
                    <Td
                    // className={
                    //   viewedPirogue.includes(pirogue.id)
                    //     ? viewedPirogue[viewedPirogue.length - 1] ===
                    //       pirogue.id
                    //       ? "bg-red-200"
                    //       : "bg-blue-200"
                    //     : ""
                    // }
                    >
                      <div className="flex flex-row gap-x-4">
                        <button
                          onClick={() => {
                            setDialogState({
                              state: "sejour_edit",
                              payload: {
                                pirogue_id: pirogue.id,
                                pirogue: pirogue,
                              },
                            });
                          }}
                          className=" transition-all duration-100 active:scale-90"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              {" "}
                              <path
                                d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"
                                fill="#888888"
                              ></path>{" "}
                              <path
                                d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z"
                                fill="#888888"
                              ></path>{" "}
                            </g>
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setDialogState({
                              state: "editing",
                              payload: {
                                pirogue: pirogue,
                              },
                            });
                          }}
                          className=" transition-all duration-100 active:scale-90"
                        >
                          <EditIcon />
                        </button>
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
                      </div>
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
                    NBRE DE MIGRANTS
                  </th>
                  <th className="border-gray-300 border text-base">DEPART</th>
                  <th className="border-gray-300 border text-base">DATE</th>
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
                      <td className="border-gray-300 border">
                        {formatDateTime(pirogue.created_at)}
                      </td>

                      <td className="border-gray-300 border "></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {selectedDateRange !== null && list !== null && (
              <>
                <br />
                <br />
                <table className="w-max">
                  <tr>
                    <td className="border-gray-300 border px-4">Sasie</td>
                    <td className="border-gray-300 border px-4">Cassée</td>
                    <td className="border-gray-300 border px-4">Abandonnée</td>
                    <td className="border-gray-300 border px-4">Total</td>
                  </tr>
                  <tr className="text-center font-bold">
                    <td className="border-gray-300 border">
                      {totalPirogueSaisie}
                    </td>
                    <td className="border-gray-300 border">
                      {totalPirogueCassee}
                    </td>
                    <td className="border-gray-300 border">
                      {totalPirogueAbandonnee}
                    </td>
                    <td className="border-gray-300 border">{list.length}</td>
                  </tr>
                </table>
              </>
            )}
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
        <div key={1}>
          <div
            key={2}
            onClick={() => {
              setIsFilterOpen(false);
            }}
            className={`fixed inset-0 z-10 flex items-center justify-center bg-gray opacity-70 `}
          />
          <AnimatePresence>
            <motion.div
              key={3}
              // initial={{
              //   x: "100%",
              // }}
              // animate={{
              //   x: "0%",
              // }}
              // exit={{
              //   x: "100%",
              // }}
              // transition={{
              //   duration: 0.1,
              // }}
              className="absolute right-0 top-0 z-30 h-screen w-1/4 bg-white px-9 pt-12 shadow-xl"
            >
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
                <Select
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
                </Select>
                <Select
                  // disabled={isSubmitting}
                  value={searchParams.get("material") ?? ""}
                  onChange={(e) => {
                    setSearchParams((params) => {
                      if (e.target.value === "") {
                        params.delete("material");
                      } else {
                        params.set("material", e.target.value);
                      }
                      params.set("page", "1");
                      return params;
                    });
                  }}
                  className={searchParams.get("material") ? "" : "text-gray"}
                >
                  <option value="" className="text-gray " disabled>
                    Matériel
                  </option>
                  <option value="wood">Bois</option>
                  <option value="metal">Métal</option>
                  <option value="plastic">Plastique</option>
                  <option value="polyester">Polyester</option>
                </Select>
              </div>
            </motion.div>
          </AnimatePresence>
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
                  params.delete("selected_pirogue_imm_page");

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
