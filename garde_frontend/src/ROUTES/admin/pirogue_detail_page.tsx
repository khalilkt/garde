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
import { useReactToPrint } from "react-to-print";
import { getImmigrantGenre } from "../../models/utils";

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
                image: immigrant.image.replace("http://", "https://"),
                immigrant_name: immigrant.name,
              });
            }}
            className="h-8 w-8 rounded-full"
            src={immigrant.image.replace("http://", "https://")}
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

  const printRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    onBeforeGetContent() {},
    content: () => {
      return printRef.current;
    },
    onAfterPrint: () => {},
  });

  const [isFetchingAllMigrants, setIsFetchingAllMigrants] =
    React.useState(false);
  const [allImmigrantsData, setAllImmigrantsData] = React.useState<
    ImmigrantInterface[] | null
  >(null);

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
      "Nbre de migrants": data.immigrants_count?.toString(),
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

  async function printAllMigrants() {
    setIsFetchingAllMigrants(true);
    try {
      if (!allImmigrantsData) {
        const url = rootUrl + "pirogues/" + pirogueId + "/immigrants/";
        const data = (
          await axios.get(url, {
            params: {
              all: "true",
            },
            headers: {
              Authorization: `Token ${token}`,
            },
          })
        ).data;

        setAllImmigrantsData(data as ImmigrantInterface[]);
      }
      setTimeout(() => {
        handlePrint();
      }, 100);
    } catch (e) {
      console.log(e);
      alert("Erreur lors de l'impression");
    }
    setIsFetchingAllMigrants(false);
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
            src={
              dialogState.payload?.image?.replace("http://", "https://") ?? ""
            }
          ></img>
        ) : (
          <div></div>
        )}
      </MDialog>
      <div className="mb-7 flex justify-between ">
        {data ? (
          <Title className="">{data.number ?? "-"}</Title>
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
      {data && data!.video && (
        <video className="mt-4" width="320" height="240" controls>
          <source
            src={data!.video?.replace("http://", "https://")}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      )}
      {data && data.video && <hr className="mt-6 border-[#888888]" />}
      <Title className="mb-4 mt-6">Description</Title>
      {data ? (
        <p className="text-lg text-gray">{data?.description}</p>
      ) : (
        <div className="h-12 w-full animate-pulse rounded bg-[#D9D9D9]"></div>
      )}
      <hr className="mt-6 border-[#888888]" />
      <div className="flex items-center justify-between">
        <Title className="mb-4 mt-6">Migrant</Title>
        {
          <FilledButton
            disabled={isFetchingAllMigrants}
            onClick={printAllMigrants}
          >
            <span
              className={`text-white ${isFetchingAllMigrants ? "opacity-0" : ""}`}
            >
              Imprimer tous les migrants
            </span>
            {isFetchingAllMigrants && (
              <LoadingIcon className={`absolute h-6 w-6`} />
            )}
          </FilledButton>
        }
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
        Nouveau Migrant
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
                        image: immigrant.image.replace("http://", "https://"),
                        immigrant_name: immigrant.name,
                      },
                    });
                  }}
                  className=""
                >
                  {immigrant.image && (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={immigrant.image.replace("http://", "https://")}
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
      <div ref={printRef} className="hidden px-10 pt-10 print:block">
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
              <th className="border-gray-300 border text-base">NATIONALITE</th>
              <th className="border-gray-300 border text-base">GENRE</th>
              <th className="border-gray-300 border text-base">DATE</th>
              <th className="border-gray-300 border text-base">SEJOUR</th>
              <th className="border-gray-300 border text-base">OBSERVATIONS</th>
            </tr>
          </thead>
          {allImmigrantsData && (
            <tbody>
              {allImmigrantsData!.map((immigrant, index) => {
                return (
                  <tr>
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
                      {immigrant.pirogue_sejour
                        ? immigrant.pirogue_sejour + " jour(s)"
                        : "-"}
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
          )}
        </table>
      </div>
    </div>
  );
}
