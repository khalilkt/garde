import React, { useContext, useEffect } from "react";
import { PirogueInterface } from "./agent&admin_pirogues_page";
import {
  Border,
  Input,
  SearchSelect,
  Select,
  Textarea,
  Title,
} from "../../components/comps";
import axios from "axios";
import { PaginatedData, rootUrl } from "../../models/constants";
import { useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../App";
import { ImmigrantInterface } from "./agent&admin_immigrants_page";
import { Pagination, TableBodySquelette, Td, Tr } from "../../components/table";
import { FilledButton } from "../../components/buttons";
import { MDialog } from "../../components/dialog";
import Webcam, { WebcamProps } from "react-webcam";
import { LoadingIcon, PlusIcon } from "../../components/icons";

function Squelette({ width }: { width: string }) {
  return (
    <div className={`h-6  animate-pulse rounded bg-[#D9D9D9] ${width}`}></div>
  );
}

interface DateInterface {
  day: number | null;
  month: number | null;
  year: number | null;
}

function DateOfBirthInput({
  value,
  onChange,
}: {
  value: DateInterface;
  onChange: (value: DateInterface) => void;
}) {
  return (
    <div className="flex gap-x-1">
      <Input
        value={value.day ?? ""}
        onChange={(e) => {
          let v: number | null = parseInt(e.target.value);
          if (v > 31) return;
          if (isNaN(v)) v = null;
          onChange({ ...value, day: v });
        }}
        maxLength={2}
        placeholder="03"
        className="w-[30%] px-1 py-1 text-center"
      />
      <Input
        value={value.month ?? ""}
        onChange={(e) => {
          let v: number | null = parseInt(e.target.value);
          if (v > 12) return;
          if (isNaN(v)) v = null;

          onChange({ ...value, month: v });
        }}
        maxLength={2}
        placeholder="12"
        className="w-[30%] px-1 py-1 text-center"
      />
      <Input
        value={value.year ?? ""}
        onChange={(e) => {
          let v: number | null = parseInt(e.target.value);
          const maxYear = new Date().getFullYear();
          if (v > maxYear) return;
          if (isNaN(v)) v = null;
          onChange({ ...value, year: v });
        }}
        maxLength={4}
        placeholder="1990"
        className="w-[40%] px-1 py-1 text-center"
      />
    </div>
  );
}

export function AddEditImmigrantDialog({
  pirogueId,
  onDone,
}: {
  pirogueId: string | null;
  onDone: () => void;
}) {
  const webcamRef = React.useRef<Webcam>(null);
  const [ss, setSs] = React.useState<string>("");
  const [formData, setFormData] = React.useState<{
    name: string;
    etat: string;
    date_of_birth: DateInterface;
    is_male: boolean | null;
    image: string | null;
    birth_country: number | null;
    nationality: number | null;
  }>({
    etat: "alive",
    name: "",
    date_of_birth: {
      day: null,
      month: null,
      year: null,
    },
    is_male: null,
    image: null,
    birth_country: null,
    nationality: null,
  });
  const countriesNameCache = React.useRef<{ [key: number]: string }>({});
  const token = useContext(AuthContext).authData?.token;
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const base64ToBlob = (base64String: string) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "image/jpeg" });
  };

  async function createImmigrant() {
    try {
      // check if all fields are filled
      let date_of_birth_str = null;
      if (
        formData.date_of_birth.day &&
        formData.date_of_birth.month &&
        formData.date_of_birth.year
      ) {
        date_of_birth_str =
          formData.date_of_birth!.year +
          `-` +
          formData.date_of_birth!.month +
          `-` +
          formData.date_of_birth!.day;
      }

      if (!formData.name || formData.is_male === null) {
        alert("Veuillez remplir tous les champs");
        return;
      }

      const imageSrc = webcamRef.current?.getScreenshot()!;
      let image = null;
      if (imageSrc) {
        image = base64ToBlob(imageSrc.split(",")[1]);
      }
      let sendFormData = new FormData();
      if (date_of_birth_str) {
        sendFormData.append("date_of_birth", date_of_birth_str);
      }
      sendFormData.append("name", formData.name);
      sendFormData.append("is_male", formData.is_male?.toString() ?? "");
      sendFormData.append("etat", formData.etat);
      if (image) {
        sendFormData.append("image", image, "image.jpeg");
      }
      sendFormData.append(
        "birth_country",
        formData.birth_country?.toString() ?? "",
      );
      sendFormData.append(
        "nationality",
        formData.nationality?.toString() ?? "",
      );
      if (pirogueId) {
        sendFormData.append("pirogue", pirogueId);
      }

      setIsSubmitting(true);
      let url = rootUrl;
      if (pirogueId) {
        url += "pirogues/" + pirogueId + "/immigrants/";
      } else {
        url += "me/immigrants/";
      }
      const response = await axios.post(url, sendFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      console.log(response);
      onDone();
    } catch (e) {
      console.log(e);
      alert("Une erreur s'est produite");
      console.error(e);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6 lg:w-[550px]">
      <div className="col-span-2 flex items-center justify-center rounded">
        <Webcam
          ref={webcamRef}
          id="webcam_id"
          className="h-40 rounded-xl"
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "environment",
          }}
        />
      </div>
      <Input
        className=" "
        value={formData.name}
        onChange={(e) => {
          setFormData({ ...formData, name: (e as any).target.value });
        }}
        placeholder="Nom"
        type="text"
      />
      <DateOfBirthInput
        value={formData.date_of_birth}
        onChange={(value) => {
          setFormData({
            ...formData,
            date_of_birth: value,
          });
        }}
      />
      <Select
        value={
          formData.is_male === null
            ? "none"
            : formData.is_male
              ? "true"
              : "false"
        }
        onChange={(e) => {
          setFormData({
            ...formData,
            is_male: (e as any).target.value === "true",
          });
        }}
      >
        <option className="text-gray" value={"none"} disabled>
          Genre
        </option>
        <option value={"true"}>Homme</option>
        <option value={"false"}>Femme</option>
      </Select>
      <Select
        value={formData.etat}
        onChange={(e) => {
          setFormData({
            ...formData,
            etat: (e as any).target.value,
          });
        }}
      >
        <option value="alive">Vivant</option>
        <option value="dead">Mort</option>
        <option value="sick_evacuation">Evacuation Sanitaire</option>
        <option
          value="pregnant"
          disabled={formData.is_male === null || formData.is_male}
        >
          Enceinte
        </option>
      </Select>

      <SearchSelect<CountryInterface>
        value={
          formData.nationality
            ? countriesNameCache.current[formData.nationality]
            : null
        }
        onSelected={function (value): void {
          countriesNameCache.current[value.id] = value.name_fr;
          setFormData({ ...formData, nationality: value.id });
        }}
        placeHolder={"Nationalité"}
        search={true}
        url={"countries"}
        lookupColumn="name_fr"
      />
      <SearchSelect<CountryInterface>
        value={
          formData.birth_country
            ? countriesNameCache.current[formData.birth_country]
            : null
        }
        onSelected={function (value): void {
          countriesNameCache.current[value.id] = value.name_fr;
          setFormData({ ...formData, birth_country: value.id });
        }}
        placeHolder={"Pays de naissance"}
        search={true}
        url={"countries"}
        lookupColumn="name_fr"
      />

      {/* <Input
        className=""
        value={formData.date_of_birth}
        onChange={(e) => {
          setFormData({ ...formData, date_of_birth: (e as any).target.value });
        }}
        placeholder="Date de naissance"
        type="date"
      /> */}

      <Textarea
        id={DESCRIPTION_TEXTAREA_ID}
        className=" col-span-2"
        placeholder="Description"
      />
      <FilledButton
        onClick={() => {
          onDone();
        }}
        isLight={true}
        className="col-span-1"
      >
        Annuler
      </FilledButton>
      <FilledButton onClick={createImmigrant} className="col-span-1">
        {isSubmitting ? <LoadingIcon /> : <span>Créer Immigrant</span>}
      </FilledButton>
    </div>
  );
}

interface DialogState {
  state: "none" | "adding" | "editing" | "image_view";
  payload?: {
    [key: string]: any;
  };
}
export interface CountryInterface {
  id: number;
  name_fr: string;
  code: string;
}

const FIRSTNAME_INPUT_ID = "firstname_dialog";
const LASTNAME_INPUT_ID = "lastname_dialog";
const NATIONALITY_INPUT_ID = "nationality_dialog";
const BIRTH_COUNTRY_INPUT_ID = "birth_country_dialog";
const DATE_OF_BIRTH_INPUT_ID = "date_of_birth_dialog";
const DESCRIPTION_TEXTAREA_ID = "description_dialog";

export function MobileImmigrantView({
  immigrant,
  onImageClick,
}: {
  immigrant: ImmigrantInterface;
  onImageClick: (payload: { image: string; immigrant_name: string }) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="flex flex-col rounded-xl border-2 border-primaryBorder p-4">
      <div className="my-1 flex gap-x-4">
        {immigrant.image && (
          <img
            onClick={() => {
              onImageClick({
                image: immigrant.image,
                immigrant_name: immigrant.name,
              });
            }}
            className="h-8 w-8 rounded-full"
            src={immigrant.image}
          />
        )}
        <h5 className="text-lg">{immigrant.name}</h5>
      </div>
      <hr className="w-full border-primaryBorder" />
      <div className="flex justify-between pt-4">
        <div className="flex flex-col gap-y-6 text-base text-gray">
          <span>Genre</span>
          <span>Nationalité</span>
          <span>Lieu de naissance</span>
          <span>Date de naissance</span>
        </div>
        <div className="flex flex-col gap-y-6 text-black">
          <span>{immigrant.is_male ? "Homme" : "Femme"}</span>
          <span>{immigrant.nationality_name ?? "-"}</span>
          <span>{immigrant.birth_country_name}</span>
          <span>{immigrant.date_of_birth}</span>
        </div>
      </div>
    </div>
  );
}

export default function PirogueDetailPage({
  pirogueId,
  onCloseClick,
  ...divProps
}: {
  pirogueId: string;
  onCloseClick: () => void;
} & React.HTMLProps<HTMLDivElement>) {
  const [data, setData] = React.useState<PirogueInterface | null>(null);
  const [immigrantsData, setImmigrantsData] =
    React.useState<PaginatedData<ImmigrantInterface> | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const token = useContext(AuthContext).authData?.token;
  const [dialogState, setDialogState] = React.useState<DialogState>({
    state: "none",
  });
  const isAdmin = useContext(AuthContext).authData?.user.is_admin;

  async function createImmigrant() {
    const elem = document.getElementById("ajdajdasdad");
    try {
    } catch (e) {
      console.log(e);
      alert("Error");
    }
  }

  useEffect(() => {
    load();
    loadImmigrants();
  }, [pirogueId]);

  useEffect(() => {
    loadImmigrants();
  }, [searchParams]);

  async function load() {
    try {
      const response = await axios.get(rootUrl + "pirogues/" + pirogueId, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setData(response.data);
    } catch (e) {
      console.log(e);
    }
  }
  async function loadImmigrants() {
    try {
      const response = await axios.get(
        rootUrl +
          "pirogues/" +
          pirogueId +
          "/immigrants" +
          "?page=" +
          (searchParams.get("selected_pirogue_imm_page") ?? "1"),
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      setImmigrantsData(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  function dialogStateTitle(dialogState: DialogState) {
    switch (dialogState.state) {
      case "editing":
        return "Modifier Immigrant";
      case "adding":
        return "Ajouter Immigrant";
      case "image_view":
        return dialogState.payload?.immigrant_name ?? "";
      default:
        return "";
    }
  }

  function positionToString(pos: string) {
    const splited = pos.split("-");
    if (splited.length !== 4) return null;
    if (splited.includes("")) return null;

    return splited[0] + "°" + splited[1] + "'" + splited[2] + "''" + splited[3];
  }

  let infos: { [key: string]: string | null | undefined } | null = null;

  if (data) {
    infos = {
      Agent: data.created_by_name,
      "Nbre d'immigrants": data.immigrants_count?.toString(),
      latitude: data.lat ? positionToString(data.lat) : null,
      longitude: data.long ? positionToString(data.long) : null,
      Départ: data.departure,
      Destination: data.destination,
      "date de création": new Date(data.created_at).toISOString().split("T")[0],
      Marque: data.brand,
      Puissance: data.puissance?.toString(),
      Port: data.port,
      Matériel: data.material,
      Nationalité: data.nationality_name,
      Carburant: data.fuel?.toString(),
    };
  }

  return (
    <div
      {...divProps}
      className={`flex h-full flex-col px-8 pt-12 lg:px-9 lg:pb-0 ${divProps.className ?? ""}`}
    >
      <MDialog
        onClose={() => setDialogState({ state: "none" })}
        isOpen={dialogState.state !== "none"}
        title={dialogStateTitle(dialogState)}
      >
        {dialogState.state === "image_view" ? (
          <img
            className="h-fit w-[400px] rounded"
            src={dialogState.payload?.image ?? ""}
          ></img>
        ) : (
          <AddEditImmigrantDialog
            onDone={() => {
              setDialogState({ state: "none" });
              loadImmigrants();
            }}
            pirogueId={pirogueId}
          />
        )}
      </MDialog>
      <div className="mb-7 flex justify-between ">
        {data ? (
          <Title className="">
            {data?.motor_numbers.join(" ").length > 0
              ? data?.motor_numbers.join(" ")
              : "-"}
          </Title>
        ) : (
          <Squelette width="w-10 " />
        )}
        {/* close icon */}
        <button onClick={onCloseClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 cursor-pointer stroke-gray"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="mb-6 flex flex-row flex-wrap gap-x-[10px] gap-y-2 text-sm">
        {infos ? (
          Object.entries(infos)
            .filter((entry) => entry[1])
            .map((value) => (
              <div className="flex rounded-md bg-primaryLight2 px-3 py-2">
                <span className="text-black">{value[0] + ": "} </span>
                <span className="text-primary">{value[1]}</span>
              </div>
            ))
        ) : (
          <div className="h-12 w-full animate-pulse rounded bg-[#D9D9D9]"></div>
        )}
      </div>
      <hr className="border-[#888888]" />
      <Title className="mb-4 mt-6">Description</Title>
      {data ? (
        <p className="text-lg text-gray">{data?.description}</p>
      ) : (
        <div className="h-12 w-full animate-pulse rounded bg-[#D9D9D9]"></div>
      )}
      <hr className="mt-6 border-[#888888]" />
      <div className="flex items-center justify-between">
        <Title className="mb-4 mt-6">Immigrants</Title>
        {true && (
          <FilledButton
            className="hidden h-max rounded-md bg-primaryLight2 px-4 py-1 text-base font-semibold text-primary lg:block"
            onClick={() => {
              setDialogState({ state: "adding" });
            }}
          >
            <span className="text-primary">Ajouter</span>
          </FilledButton>
        )}
      </div>
      <div className="flex flex-col gap-y-4 lg:hidden">
        {immigrantsData?.data.map((immigrant, i) => (
          <MobileImmigrantView
            onImageClick={(payload) => {
              setDialogState({
                state: "image_view",
                payload: payload,
              });
            }}
            immigrant={immigrant}
          />
        ))}
      </div>
      <FilledButton
        onClick={() => {
          setDialogState({ state: "adding" });
        }}
        className=" fixed inset-x-0 bottom-10 z-10 mx-8 lg:hidden"
      >
        Nouveau immigrant
        <PlusIcon className=" fill-white" />
      </FilledButton>
      <table className="text-md hidden w-full text-center font-medium lg:table">
        <thead className="w-full">
          <tr className="font-bold text-gray">
            <th className="text-medium  py-3 text-base"></th>
            <th className="text-medium  py-3 text-base">Nom</th>
            <th className="text-medium  py-3 text-base">Genre</th>
            <th className="text-medium py-3 text-base">Nationalité</th>
            <th className="text-medium py-3 text-base">Pays de naissance</th>
            <th className="text-medium py-3 text-base">Date de naissance</th>
          </tr>
        </thead>
        {!immigrantsData ? (
          <TableBodySquelette columnCount={5} />
        ) : (
          <tbody>
            {immigrantsData?.data.map((immigrant, i) => (
              <Tr>
                <Td
                  onClick={() => {
                    setDialogState({
                      state: "image_view",
                      payload: {
                        image: immigrant.image,
                        immigrant_name: immigrant.name,
                      },
                    });
                  }}
                  className=""
                >
                  {immigrant.image && (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={immigrant.image}
                    />
                  )}
                </Td>
                <Td isSmall={true}>{immigrant.name}</Td>
                <Td isSmall={true}>{immigrant.is_male ? "Homme" : "Femme"}</Td>
                <Td isSmall={true}>
                  <Border className="text-xs">
                    {immigrant.nationality_name}
                  </Border>
                </Td>
                <Td isSmall={true}>
                  <Border>{immigrant.birth_country_name}</Border>
                </Td>
                <Td isSmall={true}>{immigrant.date_of_birth}</Td>
              </Tr>
            ))}
          </tbody>
        )}
      </table>

      <Pagination
        className="mt-10"
        onItemClick={(page) => {
          setSearchParams((params) => {
            params.set("selected_pirogue_imm_page", page.toString());
            return params;
          });
        }}
        current={
          searchParams.get("selected_pirogue_imm_page")
            ? parseInt(searchParams.get("selected_pirogue_imm_page")!)
            : 1
        }
        total={immigrantsData?.total_pages ?? 1}
      />
    </div>
  );
}
