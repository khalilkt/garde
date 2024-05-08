import { useContext, useEffect, useRef, useState } from "react";
import {
  Input,
  SearchSelect,
  Select,
  Textarea,
  Title,
} from "../../components/comps";
import { ImmigrantIcon, LeftArrow } from "../../components/icons";
import {
  MATERIAL_NAME,
  MONTHS,
  PaginatedData,
  rootUrl,
} from "../../models/constants";
import { PirogueInterface } from "./agent&admin_pirogues_page";
import { TableBodySquelette, Td, Tr } from "../../components/table";
import axios from "axios";
import { PrintPage } from "../../components/print_page";
import { FilledButton, OutlinedButton } from "../../components/buttons";
import { useReactToPrint } from "react-to-print";
import { MDialog } from "../../components/dialog";
import { CountryInterface } from "./pirogue_detail_page";
import { ImmigrantInterface } from "./agent&admin_immigrants_page";
import { AuthContext } from "../../App";

function LiberationDialog({
  onSubmit,
}: {
  onSubmit: (observation: string) => void;
}) {
  return (
    <div className="flex w-[500px] flex-col gap-y-2">
      <Textarea
        id="liberation_observation_textarea"
        placeholder="Ajouter une observation"
      />
      <FilledButton
        onClick={() => {
          const observation = (
            document.getElementById(
              "liberation_observation_textarea",
            ) as HTMLTextAreaElement | null
          )?.value;

          if (observation != null) onSubmit(observation);
        }}
      >
        Liberer et imprimer
      </FilledButton>
    </div>
  );
}

// create new interface, it is immigrantinterface but we add departure and destination

interface LiberationImmigrantInterface extends ImmigrantInterface {
  departure: string;
  destination: string;
}

export default function AdminLiberationPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [data, setData] = useState<LiberationImmigrantInterface[] | null>(null);
  const token = useContext(AuthContext).authData?.token;
  const [observation, setObservation] = useState<string>("");

  const printRef = useRef<HTMLDivElement>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  const handlePrint = useReactToPrint({
    onBeforeGetContent() {},

    content: () => {
      return printRef.current;
    },
    onAfterPrint: () => {},
  });

  async function load() {
    try {
      const response = await axios.get(`${rootUrl}immigrants/liberation`, {
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

  async function free() {
    try {
      await axios.post(
        `${rootUrl}immigrants/liberation/bulk/`,
        {
          ids: selected.map((i) => data![i].id),
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
      setObservation("");
    } catch (e) {
      console.log(e);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  }

  useEffect(() => {
    load();
  }, []);
  return (
    <div className="flex flex-col ">
      <MDialog
        isOpen={isPrintDialogOpen}
        title={"Libération"}
        onClose={function (): void {
          setIsPrintDialogOpen(false);
        }}
      >
        <div></div>
        <LiberationDialog
          onSubmit={(observation) => {
            setObservation(observation);
            setTimeout(() => {
              free();
            }, 500);
            setIsPrintDialogOpen(false);
          }}
        />
      </MDialog>
      <Title>Libération</Title>
      <div className="flex gap-x-4 self-end">
        <OutlinedButton
          disabled={selected.length === 0}
          className="disabled:cursor-not-allowed disabled:border-gray disabled:opacity-50"
          onClick={() => {
            setIsPrintDialogOpen(true);
          }}
        >
          Libérer
          <ImmigrantIcon className="ml-2 fill-primary" />
        </OutlinedButton>
      </div>
      <Select
        className="w-max"
        onChange={(e) => {
          let value = e.target.value;
          if (value === "") {
            return;
          }

          setSelected([]);

          if (data) {
            setSelected(data.slice(0, parseInt(value)).map((_, i) => i));
          }
        }}
      >
        <option value={""}>Selectionner</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={20}>30</option>
        <option value={20}>40</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={100}>200</option>
      </Select>
      <table className=" mt-8 w-full text-center text-sm">
        <thead className="">
          <tr className="font-bold text-gray">
            <th className="text-medium text-base">
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
            <th>N°</th>
            <th>NOM ET PRENOM</th>
            <th>DATE DE NAISS</th>
            <th>LIEU DE NAISS</th>
            <th>NATIONALITE</th>
            <th>GENRE</th>
            <th>DEPART</th>
            <th>REMIS</th>
            <th>SÉJOUR</th>
          </tr>
        </thead>
        {!data ? (
          <TableBodySquelette columnCount={9} />
        ) : (
          <tbody>
            {data.map((immigrant, i) => (
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
                <Td>{i + 1}</Td>
                <Td>{immigrant.name}</Td>
                <Td>{immigrant.date_of_birth?.split("T")[0] ?? "-`"}</Td>
                <Td>{immigrant.birth_country_name ?? "-"}</Td>
                <Td>{immigrant.nationality_name ?? "-"}</Td>
                <Td>{immigrant.is_male ? "M" : "F"}</Td>
                <Td>{immigrant.departure}</Td>
                <Td>DRS</Td>
                <Td>
                  {(
                    (new Date().valueOf() -
                      new Date(immigrant.created_at).valueOf()) /
                    8.64e7
                  ).toFixed(0) + " jour(s)"}
                </Td>
              </Tr>
            ))}
          </tbody>
        )}
      </table>
      {data && (
        <div className="hidden flex-col px-10 print:flex" ref={printRef}>
          <div className="my-12 flex flex-col items-end self-center">
            <h1 className="text-2xl font-bold">
              LA MIGRATION ILLEGALE PAR VOIE MARITIME
            </h1>
            <div className="flex flex-row">
              <span>Nouadhibou</span>
              <span>
                , le{" "}
                {new Date()
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}
              </span>
            </div>
          </div>
          <table className=" mt-8 w-full text-center text-sm">
            <thead className="">
              <tr className="font-bold text-gray">
                <th className="border-gray-300 border ">N°</th>
                <th className="border-gray-300 border ">NOM ET PRENOM</th>
                <th className="border-gray-300 border ">DATE DE NAISS</th>
                <th className="border-gray-300 border ">LIEU DE NAISS</th>
                <th className="border-gray-300 border ">NATIONALITE</th>
                <th className="border-gray-300 border ">GENRE</th>
                <th className="border-gray-300 border ">DEPART</th>
                <th className="border-gray-300 border ">REMIS</th>
                <th className="border-gray-300 border ">SÉJOUR</th>
                <th className="border-gray-300 border ">OBSERVATION</th>
              </tr>
            </thead>
            {
              <tbody>
                {data
                  .filter((imm, index) => selected.includes(index))
                  .map((immigrant, i) => (
                    <tr>
                      <td className="border-gray-300 border ">{i + 1}</td>
                      <td className="border-gray-300 border ">
                        {immigrant.name}
                      </td>
                      <td className="border-gray-300 border ">
                        {immigrant.date_of_birth?.split("T")[0] ?? "-`"}
                      </td>
                      <td className="border-gray-300 border ">
                        {immigrant.birth_country_name ?? "-"}
                      </td>
                      <td className="border-gray-300 border ">
                        {immigrant.nationality_name ?? "-"}
                      </td>
                      <td className="border-gray-300 border ">
                        {immigrant.is_male ? "M" : "F"}
                      </td>
                      <td className="border-gray-300 border ">
                        {immigrant.departure}
                      </td>
                      <td className="border-gray-300 border ">DRS</td>
                      <td className="border-gray-300 border ">
                        {(
                          (new Date().valueOf() -
                            new Date(immigrant.created_at).valueOf()) /
                          8.64e7
                        ).toFixed(0) + " jour(s)"}
                      </td>
                      <td className="border-gray-300 border ">{observation}</td>
                    </tr>
                  ))}
              </tbody>
            }
          </table>
        </div>
      )}
    </div>
  );
}
