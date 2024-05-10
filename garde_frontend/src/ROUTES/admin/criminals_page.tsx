import { useSearchParams } from "react-router-dom";
import { FilledButton, OutlinedButton } from "../../components/buttons";
import {
  Border,
  Input,
  SearchBar,
  Select,
  Tag,
  Textarea,
  Title,
} from "../../components/comps";
import { Pagination, Td, Tr } from "../../components/table";
import { useContext, useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { PaginatedData, rootUrl } from "../../models/constants";
import { AuthContext } from "../../App";
import { useReactToPrint } from "react-to-print";
import { ImmigrantInterface } from "./agent&admin_immigrants_page";
import { ImmigrantIcon } from "../../components/icons";
import { MDialog } from "../../components/dialog";
import { PrintPage } from "../../components/print_page";

const CRIMINAL_RECORD_NAMES = {
  theft: "Vol",
  homocide: "Homicide",
  torture: "Torture",
  human_trafficking: "Traite des êtres humains",
  other: "Autre",

  killer: "Assassinat",
  thief: "Voleur",
  danger: "Dangereux",
};

function CriminalLiberationDialog({
  selectedNames: selectedNames,
  onSubmit,
}: {
  selectedNames: string[];
  onSubmit: (printData: { names: string[]; text: string }) => void;
}) {
  return (
    <div className="flex w-[500px] flex-col gap-y-2">
      <div className="flex flex-col gap-y-2 text-gray">
        <span className="font-medium">{selectedNames.join(", ")}</span>
      </div>
      <Textarea id="liberation_text_textarea" placeholder="text" />
      <Textarea id="liberation_names_textarea" placeholder="Noms" />
      <FilledButton
        onClick={() => {
          const text = (
            document.getElementById(
              "liberation_text_textarea",
            ) as HTMLTextAreaElement | null
          )?.value;

          let names =
            (
              document.getElementById(
                "liberation_names_textarea",
              ) as HTMLTextAreaElement | null
            )?.value
              ?.split("\n")
              .filter((name) => name.length > 0) ?? [];

          if (text != null) onSubmit({ names: names, text: text });
        }}
      >
        Déferer et imprimer
      </FilledButton>
    </div>
  );
}

export default function CriminalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTimer = React.useRef<NodeJS.Timeout>();
  const [data, setData] = React.useState<
    PaginatedData<ImmigrantInterface> | ImmigrantInterface[] | null
  >(null);
  const [selected, setSelected] = React.useState<number[]>([]);

  const authContext = useContext(AuthContext);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const token = useContext(AuthContext).authData?.token;
  const printRef = React.useRef<HTMLTableElement>(null);

  const [printData, setPrintData] = React.useState<{
    text: string;
    names: string[];
  }>({ text: "", names: [] });

  const handlePrint = useReactToPrint({
    onBeforeGetContent() {},
    content: () => {
      return printRef.current;
    },
    onAfterPrint: () => {},
  });

  async function load() {
    let url = rootUrl;
    url += "immigrants";

    let params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });
    params.set("is_criminal", "true");
    try {
      const response = await axios.get(url, {
        params: params,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setSelected([]);
      setData(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function init() {
    // searchParams.forEach((value, key) => {
    //   if (key === "nationality" || key === "birth_country") {
    //     axios
    //       .get(rootUrl + "countries/" + value, {
    //         headers: {
    //           Authorization: `Token ${token}`,
    //         },
    //       })
    //       .then((response) => {
    //         countriesNameCache.current[value] = response.data.name_fr;
    //       });
    //   }
    // });
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
  async function free() {
    try {
      await axios.post(
        `${rootUrl}immigrants/liberation/bulk/`,
        {
          ids: selected.map((i) => list![i].id),
          free_at: new Date().toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      load();
      handlePrint();
      setPrintData({
        text: "",
        names: [],
      });
    } catch (e) {
      console.log(e);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  }

  return (
    <div className="mb-10 flex flex-col">
      <MDialog
        isOpen={isPrintDialogOpen}
        title={"Déferation"}
        onClose={function (): void {
          setIsPrintDialogOpen(false);
        }}
      >
        <CriminalLiberationDialog
          onSubmit={(printData) => {
            setPrintData(printData);
            setTimeout(() => {
              free();
            }, 500);
            setIsPrintDialogOpen(false);
          }}
          selectedNames={selected.map((i) => list![i].name)}
        />
      </MDialog>
      <Title className="mb-10">Infractions</Title>
      <div className="flex w-full flex-row justify-between ">
        <div className=" flex w-full flex-row justify-between ">
          <div className="flex w-full items-start gap-x-6 lg:w-auto ">
            <SearchBar
              id="pirogues_search_bar"
              onChange={onSearchChange}
              placeholder="Chercher"
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
          <OutlinedButton
            disabled={selected.length === 0}
            className="disabled:cursor-not-allowed disabled:border-gray disabled:opacity-50"
            onClick={() => {
              setIsPrintDialogOpen(true);
            }}
          >
            Déferer
            <ImmigrantIcon className="ml-2 fill-primary" />
          </OutlinedButton>

          {/* { (
            <FilledButton
              onClick={() => {
                setIsFilterOpen(true);
              }}
            >
              <span>Filtrer</span> <FilterIcon />
            </FilledButton>
          )} */}
        </div>
      </div>
      <div className="mt-10 w-full">
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
              <span className="font-semibold">{list!.length}</span>
            </span>
          )}
        </div>
        <div className="my-4 flex gap-x-2 font-medium">
          <input
            type="checkbox"
            className="h-5 w-5"
            onChange={(e) => {
              const checked = e.target.checked;
              setSearchParams((params) => {
                if (!checked) {
                  params.delete("is_free");
                } else {
                  params.set("is_free", "false");
                }
                return params;
              });
            }}
            checked={searchParams.get("is_free") === "false"}
          />
          <span>Afficher Seulement les non diférés</span>
        </div>
        <table className="hidden w-full text-center text-lg lg:table">
          <thead className="w-full">
            <tr className="font-bold text-gray">
              <th className="text-medium text-base">
                <input
                  checked={
                    list !== null &&
                    list.length > 0 &&
                    selected.length === list.length
                  }
                  onChange={(e) => {
                    if (!data) return;
                    if (e.target.checked) {
                      setSelected((list ?? []).map((_, i) => i));
                    } else {
                      setSelected([]);
                    }
                  }}
                  type="checkbox"
                  className="h-5 w-5"
                />
              </th>
              <th className="text-medium  py-3 text-base">Nom</th>
              <th className="text-medium  py-3 text-base">Genre</th>
              <th className="text-medium py-3 text-base">Nationalité</th>
              <th className="text-medium py-3 text-base">Type</th>
              <th className="text-medium py-3 text-base">Date de naissance</th>
              <th className="text-medium py-3 text-base">Date</th>
              {<th className="text-medium py-3 text-base">Agent</th>}
            </tr>
          </thead>
          <tbody>
            {list?.map((immigrant, i) => (
              <Tr>
                <Td>
                  <input
                    checked={selected.includes(i)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected([...selected, i]);
                      } else {
                        setSelected(selected.filter((val) => val !== i));
                      }
                    }}
                    type="checkbox"
                    className="h-5 w-5"
                  />
                </Td>
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
                  {immigrant.criminal_record
                    ? CRIMINAL_RECORD_NAMES[immigrant.criminal_record]
                    : "-"}
                </Td>
                <Td>{immigrant.date_of_birth}</Td>
                {<Td>{immigrant.created_at.split("T")[0]}</Td>}
                {<Td className="text-primary">{immigrant.created_by_name}</Td>}
              </Tr>
            ))}
          </tbody>
        </table>
      </div>
      <div ref={printRef} className="hidden print:block">
        <PrintPage text="" objectText={null} isArabic={true}>
          <div className="flex flex-col  items-start">
            <span>
              {/* حسب شهادات مهاجرين غير شرعين من السنغال و نواكشوط و التي تؤكد
              جرائم القتل و التعذيب على متن زورقين ، اتشرف بإحالت اربع متهمين
              حسب تصريحات متوترة من رجال و نساء كانو مشتركين في الرحلتين
              المعنيتين ، */}
              {printData.text}
            </span>
            <span className="mt-12">والمعنيون هم</span>
            <span className="mt-1 flex flex-col">
              {printData.names.map((name) => (
                <span>{name}</span>
              ))}
            </span>
          </div>
        </PrintPage>
      </div>
      {data && "total_pages" in data && data.count > 1 && (
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
    </div>
  );
}
