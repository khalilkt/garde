import { useEffect, useRef, useState } from "react";
import { Input, SearchSelect, Title } from "../../components/comps";
import { ImmigrantIcon, LeftArrow } from "../../components/icons";
import { MATERIAL_NAME, PaginatedData, rootUrl } from "../../models/constants";
import { PirogueInterface } from "./agent&admin_pirogues_page";
import { TableBodySquelette, Td, Tr } from "../../components/table";
import axios from "axios";
import { PrintPage } from "../../components/print_page";
import { FilledButton, OutlinedButton } from "../../components/buttons";
import { useReactToPrint } from "react-to-print";
import { MDialog } from "../../components/dialog";
import { CountryInterface } from "./pirogue_detail_page";
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
function MigrationIrreguliereImmigrantDialog({
  selectedDate,
}: {
  selectedDate: Date;
}) {
  const immPrintRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    onBeforeGetContent() {},
    content: () => {
      return immPrintRef.current;
    },
    onAfterPrint: () => {},
  });
  const [formState, setFormState] = useState<
    {
      country: CountryInterface | null;
      value: number;
      nbr_female: number;
    }[]
  >([
    {
      country: null,
      value: 0,
      nbr_female: 0,
    },
  ]);

  return (
    <div className="flex w-[500px] flex-col gap-y-6">
      {formState.map((state, i) => (
        <div className="flex flex-row gap-x-2">
          <SearchSelect<CountryInterface>
            value={state.country?.name_fr ?? null}
            className="w-[40%]"
            onSelected={function (value: CountryInterface): void {
              setFormState((state) => {
                const newState = [...state];
                newState[i].country = value;
                return newState;
              });
            }}
            placeHolder={"Pays"}
            url={"countries"}
            lookupColumn="name_fr"
          />
          <Input
            value={state.value}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value < 0) return;
              setFormState((state) => {
                const newState = [...state];
                newState[i].value = value;
                return newState;
              });
            }}
            placeholder="Immigrés"
            type="number"
            className="w-[30%]"
          />
          <Input
            placeholder="Femmes"
            value={state.nbr_female}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value < 0) return;
              if (value > state.value) return;

              setFormState((state) => {
                const newState = [...state];
                newState[i].nbr_female = value;
                return newState;
              });
            }}
            type="number"
            className="w-[30%]"
          />
        </div>
      ))}
      <OutlinedButton
        onClick={() => {
          setFormState((state) => [
            ...state,
            {
              country: null,
              value: 0,
              nbr_female: 0,
            },
          ]);
        }}
        className="col-span-2"
      >
        Ajouter Pays
      </OutlinedButton>

      <FilledButton onClick={handlePrint} className="col-span-2 mt-10">
        Imprimer
      </FilledButton>
      <div ref={immPrintRef} className="hidden print:block">
        <PrintPage
          text={`J'ai l'honneur de vous faire parvenir en annexe la liste de ${
            formState.filter((e) => e.country && e.value > 0).length
          } personnes remis par la
810 de la 1** Région à la GCM dans le cadre de la lutte contre la migration irrégulière par voie maritime le ${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}  .`}
        >
          {formState
            .filter((e) => e.country && e.value > 0)
            .map((state, i) => (
              <div className="flex gap-x-2">
                <span className="">{state.country?.name_fr}</span>
                <span>{" = " + state.value}</span>
                {state.nbr_female > 0 && (
                  <span>
                    (
                    {state.nbr_female +
                      " femme" +
                      (state.nbr_female > 1 ? "s" : "")}
                    )
                  </span>
                )}
              </div>
            ))}
        </PrintPage>
      </div>
    </div>
  );
}

export default function MigrationIrregulierePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selected, setSelected] = useState<number[]>([]);
  const [data, setData] = useState<PirogueInterface[] | null>(null);
  const token = localStorage.getItem("token");
  const printRef = useRef<HTMLDivElement>(null);
  const [isImmigrantDialogOpen, setIsImmigrantDialogOpen] = useState(false);

  const handlePrint = useReactToPrint({
    onBeforeGetContent() {},

    content: () => {
      return printRef.current;
    },
    onAfterPrint: () => {},
  });
  async function load() {
    setSelected([]);
    let url = rootUrl + "migration_irregular";
    url += `?created_at=${selectedDate.toISOString().split("T")[0]}`;
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

  useEffect(() => {
    load();
  }, [selectedDate]);

  function dateToString(date: Date) {
    let ret = "";
    ret += date.getDate() + " ";
    ret += [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ][date.getMonth()];
    ret += " " + date.getFullYear();
    return ret;
  }
  const countriesNameCache = useRef<{ [key: string]: string }>({});

  return (
    <div className="flex flex-col ">
      <MDialog
        isOpen={isImmigrantDialogOpen}
        title={"Migration Irregulière Immigrants"}
        onClose={function (): void {
          setIsImmigrantDialogOpen(false);
        }}
      >
        <MigrationIrreguliereImmigrantDialog selectedDate={selectedDate} />
      </MDialog>
      <Title>Migration Irrégulière</Title>
      <div className="mt-10 flex items-center self-center">
        <button
          onClick={() => {
            setSelectedDate(
              new Date(selectedDate.getTime() - 1000 * 60 * 60 * 24),
            );
          }}
        >
          <LeftArrow className="h-5 w-5 fill-primary" />
        </button>
        <span className="w-52 text-center text-xl font-semibold">
          {dateToString(selectedDate)}
        </span>
        <button
          onClick={() => {
            setSelectedDate(
              new Date(selectedDate.getTime() + 1000 * 60 * 60 * 24),
            );
          }}
        >
          <LeftArrow className=" h-5 w-5 rotate-180 fill-primary" />
        </button>
      </div>
      <div className="flex gap-x-4 self-end">
        <OutlinedButton
          onClick={() => {
            setIsImmigrantDialogOpen(true);
          }}
          className=""
        >
          Migration irrégulière Immigrant
          <ImmigrantIcon className="ml-2 fill-primary" />
        </OutlinedButton>
        <FilledButton
          disabled={selected.length === 0}
          onClick={handlePrint}
          className="disabled:bg-gray"
        >
          Imprimer
          <svg
            width="20"
            height="18"
            viewBox="0 0 20 18"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-white"
          >
            <path
              d="M6.3335 17.25C5.82933 17.25 5.39773 17.0705 5.0387 16.7115C4.67968 16.3524 4.50016 15.9208 4.50016 15.4167V13.5833H2.66683C2.16266 13.5833 1.73107 13.4038 1.37204 13.0448C1.01301 12.6858 0.833496 12.2542 0.833496 11.75V8.08333C0.833496 7.30417 1.10086 6.65104 1.63558 6.12396C2.1703 5.59688 2.81961 5.33333 3.5835 5.33333H16.4168C17.196 5.33333 17.8491 5.59688 18.3762 6.12396C18.9033 6.65104 19.1668 7.30417 19.1668 8.08333V11.75C19.1668 12.2542 18.9873 12.6858 18.6283 13.0448C18.2693 13.4038 17.8377 13.5833 17.3335 13.5833H15.5002V15.4167C15.5002 15.9208 15.3206 16.3524 14.9616 16.7115C14.6026 17.0705 14.171 17.25 13.6668 17.25H6.3335ZM2.66683 11.75H4.50016C4.50016 11.2458 4.67968 10.8142 5.0387 10.4552C5.39773 10.0962 5.82933 9.91667 6.3335 9.91667H13.6668C14.171 9.91667 14.6026 10.0962 14.9616 10.4552C15.3206 10.8142 15.5002 11.2458 15.5002 11.75H17.3335V8.08333C17.3335 7.82361 17.2456 7.6059 17.07 7.43021C16.8943 7.25451 16.6766 7.16667 16.4168 7.16667H3.5835C3.32377 7.16667 3.10607 7.25451 2.93037 7.43021C2.75468 7.6059 2.66683 7.82361 2.66683 8.08333V11.75ZM13.6668 5.33333V2.58333H6.3335V5.33333H4.50016V2.58333C4.50016 2.07917 4.67968 1.64757 5.0387 1.28854C5.39773 0.929514 5.82933 0.75 6.3335 0.75H13.6668C14.171 0.75 14.6026 0.929514 14.9616 1.28854C15.3206 1.64757 15.5002 2.07917 15.5002 2.58333V5.33333H13.6668ZM15.5002 9.45833C15.7599 9.45833 15.9776 9.37049 16.1533 9.19479C16.329 9.0191 16.4168 8.80139 16.4168 8.54167C16.4168 8.28194 16.329 8.06424 16.1533 7.88854C15.9776 7.71285 15.7599 7.625 15.5002 7.625C15.2404 7.625 15.0227 7.71285 14.847 7.88854C14.6713 8.06424 14.5835 8.28194 14.5835 8.54167C14.5835 8.80139 14.6713 9.0191 14.847 9.19479C15.0227 9.37049 15.2404 9.45833 15.5002 9.45833ZM13.6668 15.4167V11.75H6.3335V15.4167H13.6668Z"
              fill="parent"
            />
          </svg>
        </FilledButton>
      </div>
      <table className=" mt-8 w-full text-center text-lg">
        <thead className="">
          <tr className="font-bold text-gray">
            <th className="text-medium  py-3 text-base">
              <input
                checked={
                  data !== null &&
                  data.length > 0 &&
                  selected.length === data?.length
                }
                onChange={(e) => {
                  if (!data) return;
                  if (e.target.checked) {
                    setSelected(data.map((_, i) => i));
                  } else {
                    setSelected([]);
                  }
                }}
                type="checkbox"
                className="h-5 w-5"
              />
            </th>
            <th className="text-medium  py-3 text-base">Numéro</th>
            <th className="text-medium  py-3 text-base">Agent</th>
            <th className="text-medium py-3 text-base">Nb d'immigrés</th>
            <th className="text-medium py-3 text-base">Marque</th>
            <th className="text-medium py-3 text-base">Matière</th>
            <th className="text-medium py-3 text-base">Nationalité</th>
            <th className="text-medium py-3 text-base">Lieu de départ</th>
            <th className="text-medium py-3 text-base">Destination</th>
          </tr>
        </thead>
        {!data ? (
          <TableBodySquelette columnCount={9} />
        ) : (
          <tbody>
            {data.map((pirogue, i) => (
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
              </Tr>
            ))}
          </tbody>
        )}
      </table>
      {data && (
        <div className="hidden print:block" ref={printRef}>
          <PrintPage
            text={`J'ai l'honneur de vous faire parvenir ci-dessous la situation de la
            pirogue arraisonnée par la GCM dans le cadre de la lutte contre la
            migration irrégulière par voie maritime du
            ${selectedDate.getDate().toString().padStart(2, "0")} au 
            ${new Date(selectedDate.getTime() + 1000 * 60 * 60 * 24)
              .getDate()
              .toString()
              .padStart(2, "0")} 
            ${" " + MONTHS[selectedDate.getMonth()]} ${" " + selectedDate.getFullYear()}.`}
          >
            {data && (
              <table className="font-semibold">
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
                  {data
                    .filter((_, i) => selected.includes(i))
                    .map((pirogue, i) => (
                      <tr key={i}>
                        <td className="border px-2 py-1">{pirogue.id}</td>
                        <td className="border px-2 py-1">
                          {pirogue.material
                            ? MATERIAL_NAME[pirogue.material]
                            : "-"}
                        </td>
                        <td className="border px-2 py-1">
                          {
                            new Date(pirogue.created_at)
                              .toISOString()
                              .split("T")[0]
                          }
                        </td>
                        <td className="border px-2 py-1">{pirogue.fuel}</td>
                        <td className="   border px-2 py-1">
                          <ul className="list-disc gap-y-1">
                            {pirogue.motor_numbers.join().length === 0
                              ? "-"
                              : pirogue.motor_numbers
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
                            {pirogue.gps.join().length === 0
                              ? "-"
                              : pirogue.gps
                                  .filter((e) => e.length > 0)
                                  .map((gps) => (
                                    <li className="max-w-52 overflow-x-hidden whitespace-pre-wrap break-words">
                                      {gps.length > 0 ? gps : "-"}
                                    </li>
                                  ))}
                          </ul>
                        </td>
                        <td className="border px-2 py-1">
                          {pirogue.immigrants_count}
                        </td>
                        <td className="border px-2 py-1">{pirogue.extra}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </PrintPage>
        </div>
      )}
    </div>
  );
}
