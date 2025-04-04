import React, { ChangeEvent, useContext, useEffect } from "react";
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
import { MATERIAL_NAME, PaginatedData, rootUrl } from "../../models/constants";
import { useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../App";
import { ImmigrantInterface } from "./agent&admin_immigrants_page";
import { Pagination, TableBodySquelette, Td, Tr } from "../../components/table";
import { FilledButton, OutlinedButton } from "../../components/buttons";
import { MDialog } from "../../components/dialog";
import Webcam, { WebcamProps } from "react-webcam";
import { EditIcon, LoadingIcon, PlusIcon } from "../../components/icons";
import { useReactToPrint } from "react-to-print";
import { getImmigrantGenre, getImmigrantSejour } from "../../models/utils";
import {
  ExcelExportButton,
  exportToExcel,
} from "../../components/excel_button";

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
  state: "none" | "image_view" | "printing";
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

function ImmigrantEditDialog({
  initialImmigrant,
  onSubmit,
}: {
  initialImmigrant: ImmigrantInterface;
  onSubmit: () => void;
}) {
  const [name, setName] = React.useState("");
  const [nationality, setNationality] = React.useState<number>(0);
  const [birthDay, setBirthDay] = React.useState<DateInterface>({
    day: null,
    month: null,
    year: null,
  });

  const token = useContext(AuthContext).authData?.token;

  const [countries, setCountries] = React.useState<CountryInterface[] | null>(
    null,
  );

  useEffect(() => {
    axios
      .get(rootUrl + "countries/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setCountries(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    setName(initialImmigrant.name);
    setNationality(initialImmigrant.nationality);
    if (initialImmigrant.date_of_birth) {
      setBirthDay({
        day: parseInt(initialImmigrant.date_of_birth.split("-")[2]),
        month: parseInt(initialImmigrant.date_of_birth.split("-")[1]),
        year: parseInt(initialImmigrant.date_of_birth.split("-")[0]),
      });
    }
  }, [initialImmigrant]);

  function updateImmigrant() {
    axios
      .patch(
        rootUrl + "immigrants/" + initialImmigrant.id + "/",
        {
          name: name,
          nationality: nationality,
          date_of_birth:
            birthDay.year + "-" + birthDay.month + "-" + birthDay.day,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      )
      .then((response) => {
        onSubmit();
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div className="flex w-[400px] flex-col gap-y-4">
      <Input
        placeholder="Nom et Prénom"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <div className="flex gap-x-2">
        <Input
          className="w-[100px]"
          placeholder="0000"
          value={birthDay.year ?? ""}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (isNaN(value)) {
              setBirthDay({ ...birthDay, year: null });
              return;
            }

            setBirthDay({ ...birthDay, year: value });
          }}
        />
        <Input
          className="w-[50px]"
          placeholder="00"
          value={birthDay.month ?? ""}
          onChange={(e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value)) {
              setBirthDay({ ...birthDay, month: null });
              return;
            }
            setBirthDay({ ...birthDay, month: value });
          }}
        />
        <Input
          className="w-[50px]"
          placeholder="00"
          value={birthDay.day ?? ""}
          onChange={(e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value)) {
              setBirthDay({ ...birthDay, day: null });
              return;
            }
            setBirthDay({ ...birthDay, day: value });
          }}
        />
      </div>
      <SearchSelect<CountryInterface>
        value={nationality.toString()}
        onSelected={function (value): void {
          setNationality(value.id);
        }}
        placeHolder={"Nationalité"}
        search={true}
        url={"countries"}
        lookupColumn="name_fr"
      />

      <FilledButton className="self-end" onClick={updateImmigrant}>
        Enregistrer
      </FilledButton>
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
  const [printState, setPrintState] = React.useState<{
    situation: string;
    printAllImmigrants: boolean;
  }>({
    situation: "",
    printAllImmigrants: true,
  });
  const [immigrantsData, setImmigrantsData] =
    React.useState<PaginatedData<ImmigrantInterface> | null>(null);

  const [immigrant_nationalityFitler, setImmigrantNationalityFilter] =
    React.useState<{ name: string; id: number } | null>(null);

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

  const [editingImmigrant, setEditingImmigrant] =
    React.useState<ImmigrantInterface | null>(null);

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
  }, [searchParams, immigrant_nationalityFitler]);

  async function load() {
    try {
      const response = await axios.get(rootUrl + "pirogues/" + pirogueId, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setData(response.data);
      setPrintState({
        ...printState,
        situation: response.data.situation ?? "",
      });
    } catch (e) {
      console.log(e);
    }
  }
  async function loadImmigrants() {
    let params = new URLSearchParams();
    params.set("page", searchParams.get("selected_pirogue_imm_page") ?? "1");
    if (immigrant_nationalityFitler !== null) {
      params.set("nationality", immigrant_nationalityFitler.id.toString());
    }

    try {
      const response = await axios.get(
        rootUrl + "pirogues/" + pirogueId + "/immigrants",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: params,
        },
      );
      setImmigrantsData(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  function dialogStateTitle(dialogState: DialogState) {
    switch (dialogState.state) {
      case "image_view":
        return dialogState.payload?.immigrant_name ?? "";
      case "printing":
        return "Impression";

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
      "Point de débarquement": data.landing_point,
    };
  }

  async function updateAllMigrants() {
    setIsFetchingAllMigrants(true);
    try {
      const url = rootUrl + "pirogues/" + pirogueId + "/immigrants/";
      const data = (
        await axios.get(url, {
          params: {
            all: "true",
            nationality:
              immigrant_nationalityFitler?.id.toString() ?? undefined,
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        })
      ).data;

      setAllImmigrantsData(data as ImmigrantInterface[]);
      setIsFetchingAllMigrants(false);
      return data;
    } catch (e) {
      console.log(e);
      alert("Erreur lors de l'impression");
    }
    setIsFetchingAllMigrants(false);
  }

  const superAdmin = false;

  let nats: { [key: string]: number } = {};
  if (allImmigrantsData) {
    allImmigrantsData.forEach((imm) => {
      const nat_name = imm.nationality_name;

      if (!nats[nat_name]) {
        nats[nat_name] = 1;
      } else {
        nats[nat_name]++;
      }
    });
  }

  async function updatePirogueSituation() {
    await axios.patch(
      rootUrl + "pirogues/" + pirogueId + "/",
      {
        situation: printState.situation,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
  }

  async function uploadNewVideo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    var videoName = "video";
    if (data?.video) {
      videoName = "video2";
    }
    if (data?.video2) {
      videoName = "video3";
    }
    alert(videoName);
    formData.append(videoName, file);

    await axios
      .patch(rootUrl + "pirogues/" + pirogueId + "/", formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        load();
      })
      .catch((e) => {
        console.log(e);
      });

    alert("video uploaded");
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
          <div className="flex w-[500px] flex-col gap-y-3">
            <Textarea
              value={printState.situation}
              onChange={(e) => {
                setPrintState({ ...printState, situation: e.target.value });
              }}
              placeholder="Situation"
            />
            <div className="flex items-center gap-x-3">
              <input
                type="checkbox"
                id="piorgue_print_all_immigrants_checkbox"
                className="h-4 w-4"
                checked={printState.printAllImmigrants}
                onChange={(e) => {
                  setPrintState({
                    ...printState,
                    printAllImmigrants: e.target.checked,
                  });
                }}
              />
              <label>Liste des immigrants</label>
            </div>

            <FilledButton
              onClick={() => {
                updateAllMigrants().then(() => {
                  setTimeout(() => {
                    handlePrint();
                  }, 100);
                });
                updatePirogueSituation();
              }}
              className=" self-end"
            >
              <span
                className={`text-white ${isFetchingAllMigrants ? "opacity-0" : ""}`}
              >
                Imprimer
              </span>
              {isFetchingAllMigrants && (
                <LoadingIcon className={`absolute h-6 w-6`} />
              )}
            </FilledButton>
          </div>
        )}
      </MDialog>
      <MDialog
        onClose={() => setEditingImmigrant(null)}
        isOpen={editingImmigrant !== null}
        title="Modification"
      >
        {editingImmigrant ? (
          <ImmigrantEditDialog
            onSubmit={() => {
              setEditingImmigrant(null);
              loadImmigrants();
            }}
            initialImmigrant={editingImmigrant}
          />
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
      <div className="flex gap-x-4">
        {data && data!.video && (
          <video className="mt-4" width="320" height="240" controls>
            <source
              src={data!.video?.replace("http://", "https://")}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
        {data && data!.video2 && (
          <video className="mt-4" width="320" height="240" controls>
            <source
              src={data!.video2?.replace("http://", "https://")}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
        {data && data!.video3 && (
          <video className="mt-4" width="320" height="240" controls>
            <source
              src={data!.video3?.replace("http://", "https://")}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {/* new video upload button */}
      {isAdmin && !data?.video3 && (
        <div className="mt-4 flex gap-x-4">
          <label
            htmlFor="video"
            className="cursor-pointer rounded bg-primary px-4 py-2 text-white"
          >
            Nouvelle vidéo
          </label>
          <input
            type="file"
            id="video"
            className="hidden"
            onChange={uploadNewVideo}
          />
        </div>
      )}
      {data && data.video && <hr className="mt-6 border-[#888888]" />}
      {/* <Title className="mb-4 mt-6">Description</Title>
      {data ? (
        <p className="text-lg text-gray">{data?.description}</p>
      ) : (
        <div className="h-12 w-full animate-pulse rounded bg-[#D9D9D9]"></div>
      )} */}
      {/* <hr className="mt-6 border-[#888888]" /> */}
      <div className="flex items-center justify-between">
        <Title className="mb-4 mt-6">Migrant</Title>
        <div className="flex gap-x-4">
          <div className="w-[180px]">
            <SearchSelect<CountryInterface>
              value={immigrant_nationalityFitler?.name ?? null}
              onSelected={function (value): void {
                setImmigrantNationalityFilter({
                  name: value.name_fr,
                  id: value.id,
                });
              }}
              placeHolder={"Nationalité"}
              search={true}
              url={"countries"}
              lookupColumn="name_fr"
            />
          </div>
          {
            <>
              <OutlinedButton
                onClick={async () => {
                  const ret = await updateAllMigrants();
                  if (ret) {
                    let fileName =
                      "Migrants de la pirogue " + (data?.number ?? "");
                    if (immigrant_nationalityFitler) {
                      fileName += "(";
                      fileName += immigrant_nationalityFitler.name;
                      fileName += ")";
                    }

                    exportToExcel({
                      data:
                        ret.map((imm: ImmigrantInterface) => {
                          return {
                            Nom: imm.name,
                            Genre: getImmigrantGenre(imm),
                            Nationalité: imm.nationality_name,
                            "Pays de naissance": imm.birth_country_name,
                            "Date de naissance": imm.date_of_birth,
                            Date: imm.created_at.split("T")[0],
                            Séjour: getImmigrantSejour(imm),
                          };
                        }) ?? [],
                      fileName: fileName,
                    });
                  }
                }}
              >
                <span>Excel</span>
              </OutlinedButton>

              <FilledButton
                disabled={isFetchingAllMigrants}
                onClick={() => {
                  setDialogState({ state: "printing" });
                }}
              >
                <span
                  className={`text-white ${isFetchingAllMigrants ? "opacity-0" : ""}`}
                >
                  Imprimer
                </span>
                {isFetchingAllMigrants && (
                  <LoadingIcon className={`absolute h-6 w-6`} />
                )}
              </FilledButton>
            </>
          }
        </div>
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
      {/* <FilledButton
        onClick={() => {
          setDialogState({ state: "adding" });
        }}
        className=" fixed inset-x-0 bottom-10 z-10 mx-8 lg:hidden"
      >
        Nouveau Migrant
        <PlusIcon className=" fill-white" />
      </FilledButton> */}
      <table className="text-md hidden w-full text-center font-medium lg:table">
        <thead className="w-full">
          <tr className="font-bold text-gray">
            <th className="text-medium  py-3 text-base"></th>
            <th className="text-medium  py-3 text-base">Nom</th>
            <th className="text-medium  py-3 text-base">Genre</th>
            <th className="text-medium py-3 text-base">Nationalité</th>
            <th className="text-medium py-3 text-base">Pays de naissance</th>
            <th className="text-medium py-3 text-base">Date de naissance</th>
            {superAdmin && <th className="text-medium py-3 text-base"></th>}
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
                {superAdmin && (
                  <Td isSmall={true}>
                    {" "}
                    <button
                      onClick={() => {
                        setEditingImmigrant(immigrant);
                      }}
                    >
                      <EditIcon />
                    </button>{" "}
                  </Td>
                )}
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
        {data && allImmigrantsData && (
          <>
            {/* <table className="hidden">
              <thead>
                <tr>
                  <th className="border px-2 py-1">N°PA</th>
                  <th className="border px-2 py-1">Nature</th>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Essence</th>
                  <th className="border px-2 py-1">N°Moteurs</th>
                  <th className="border px-2 py-1">GPS</th>
                  <th className="border px-2 py-1">Equipage</th>
                  <th className="border px-2 py-1">Effets personnels</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="border px-2 py-1">{data.number}</td>
                  <td className="border px-2 py-1">
                    {data.material ? MATERIAL_NAME[data.material] : "-"}
                  </td>
                  <td className="border px-2 py-1">
                    {new Date(data.created_at).toISOString().split("T")[0]}
                  </td>
                  <td className="border px-2 py-1">{data.fuel}</td>
                  <td className="   border px-2 py-1">
                    <ul className="list-disc gap-y-1">
                      {Object.keys(data.motor_numbers).join().length === 0
                        ? "-"
                        : Object.keys(data.motor_numbers)
                            .filter((e) => e.length > 0)
                            .map((number) => (
                              <li className="max-w-52 overflow-x-hidden whitespace-pre-wrap break-words">
                                {number.length > 0 ? number : "-"}
                              </li>
                            ))}
                    </ul>
                  </td>
                  <td className="   border px-2 py-1">
                    <ul className="list-disc gap-y-1">
                      {data.gps.join().length === 0
                        ? "-"
                        : data.gps
                            .filter((e) => e.length > 0)
                            .map((gps) => (
                              <li className="max-w-52 overflow-x-hidden whitespace-pre-wrap break-words">
                                {gps.length > 0 ? gps : "-"}
                              </li>
                            ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-1">{data.immigrants_count}</td>
                  <td className="border px-2 py-1">{data.extra}</td>
                </tr>
              </tbody>
            </table> */}
            <br
              className={`${printState.printAllImmigrants ? "" : "hidden"}`}
            />
            <table
              className={`${printState.printAllImmigrants ? "" : "hidden"}`}
            >
              <tbody>
                <tr className="border px-2 py-1">
                  <th className="border px-2 py-1">Total Hommes Majeur</th>
                  <td className="border px-2 py-1">
                    {
                      allImmigrantsData.filter(
                        (imm) => imm.is_male && (!imm.age || imm.age >= 18),
                      ).length
                    }
                  </td>
                </tr>
                <tr className="border px-2 py-1">
                  <th className="border px-2 py-1">Total Femmes Majeur</th>
                  <td className="border px-2 py-1">
                    {
                      allImmigrantsData.filter(
                        (imm) => !imm.is_male && (!imm.age || imm.age >= 18),
                      ).length
                    }
                  </td>
                </tr>
                <tr className="border px-2 py-1">
                  <th className="border px-2 py-1">Total Hommes Mineur</th>
                  <td className="border px-2 py-1">
                    {
                      allImmigrantsData.filter(
                        (imm) => imm.is_male && imm.age && imm.age < 18,
                      ).length
                    }
                  </td>
                </tr>
                <tr className="border px-2 py-1">
                  <th className="border px-2 py-1">Total Femmes Mineur</th>
                  <td className="border px-2 py-1">
                    {
                      allImmigrantsData.filter(
                        (imm) => !imm.is_male && imm.age && imm.age < 18,
                      ).length
                    }
                  </td>
                </tr>
                {(immigrantsData?.data.filter((imm) => {
                  return imm.etat === "dead";
                })?.length ?? 0) > 0 && (
                  <tr className="border px-2 py-1">
                    <th className="border px-2 py-1">Total Morts</th>
                    <td className="border px-2 py-1">
                      {
                        allImmigrantsData.filter((imm) => imm.etat === "dead")
                          .length
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <br
              className={`${printState.printAllImmigrants ? "" : "hidden"}`}
            />
            <br
              className={`${printState.printAllImmigrants ? "" : "hidden"}`}
            />
          </>
        )}

        <table
          className={`w-full text-center text-xs ${!printState.printAllImmigrants ? "hidden" : ""}`}
        >
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
          )}
        </table>
        {data && (
          <div
            className={`${printState.printAllImmigrants ? "mt-10" : "mt-4"} flex flex-col`}
          >
            <h2 className="mb-2 text-xl font-bold">
              Situation PA {data.number}
            </h2>
            {immigrant_nationalityFitler === null && (
              <>
                <span className="font-semibold">
                  {Object.entries(nats).length + " nationalités"}
                </span>
                {Object.entries(nats).length > 0 && (
                  <div className="ml-4 flex flex-col">
                    {Object.entries(nats).map(([key, value]) => (
                      <span>
                        {key} - {value}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
            <span className="font-semibold">
              {Object.entries(data.motor_numbers).length} moteurs
            </span>
            {Object.entries(data.motor_numbers).map((name, cv) => {
              return (
                <div className="ml-4">
                  <span>
                    {name} - {cv + " CV"}
                  </span>
                </div>
              );
            })}
            <span className="font-semibold">{data.gps.length} GPS</span>
            {Object.entries(data.gps).map((name) => {
              return <span className="ml-4">{name}</span>;
            })}
            {data.fuel > 0 && <span>{data.fuel} Bidons d'essence</span>}
            {data.extra && data.extra}
            <span className="mt-4">{printState.situation}</span>
          </div>
        )}
      </div>
    </div>
  );
}
