import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { Title } from "../../components/comps";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { MONTHS, rootUrl } from "../../models/constants";
import { TableBodySquelette, Td, Tr } from "../../components/table";
import { LeftArrow } from "../../components/icons";
import React from "react";
import { useReactToPrint } from "react-to-print";
import { FilledButton } from "../../components/buttons";

function Tab({
  children,
  active,
  ...buttonProps
}: {
  children: React.ReactNode;
  active: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...buttonProps}
      className={`rounded px-3 py-2 font-semibold ${active ? "bg-primary text-white" : "text-gray"} ${buttonProps.className}`}
    >
      {children}
    </button>
  );
}

// {
//     "pirogues": [
//         {
//             "created_at": "2024-05-01",
//             "immigrants_count": 1,
//             "nationalities": {
//                 "null": {
//                     "males": 0,
//                     "females": 0,
//                     "minors": 0,
//                     "NULL": 1
//                 }
//             },
//             "departure": "dsad",
//             "created_at_epoch": 1714521600000000
//         }
//     ],
//     "immigrants": {
//         "null": {
//             "name": null,
//             "males": 0,
//             "females": 0,
//             "minors": 0,
//             "NULL": 1
//         }
//     }
// }

interface NationalityDetails {
  name: string | undefined;
  males: number;
  females: number;
  minors: number;
}

interface PirogueReport {
  created_at: string;
  immigrants_count: number;
  nationalities: {
    [key: string]: NationalityDetails;
  };
  departure: string;
}

interface ReportInterface {
  pirogues: PirogueReport[];
  immigrants: { [key: string]: NationalityDetails };
}

interface ReportDateInterface {
  year: number;
  month: number;
}

function getPirogueGenre(repot: PirogueReport) {
  let ret = "";
  let hasMale = false;
  let hasFemale = false;
  let hasMinor = false;

  for (const [key, value] of Object.entries(repot.nationalities)) {
    if (value.males > 0) {
      hasMale = true;
    }
    if (value.females > 0) {
      hasFemale = true;
    }
    if (value.minors > 0) {
      hasMinor = true;
    }
  }
  ret =
    (hasMale ? "H," : "") + (hasFemale ? "F," : "") + (hasMinor ? "Mn," : "");
  return ret.slice(0, -1);
}

function getPirogueNat(report: PirogueReport) {
  let ret = "";
  for (const [key, value] of Object.entries(report.nationalities)) {
    const total = value.females + value.males + value.minors;
    ret += key + "=" + total;
    if (value.females > 0 || value.minors > 0) {
      ret += "(";
      if (value.males > 0) {
        ret += "H=" + value.males + " ";
      }
      if (value.females > 0) {
        ret += "F=" + value.females + " ";
      }
      if (value.minors > 0) {
        ret += "Mn=" + value.minors + " ";
      }
      ret = ret.slice(0, -1);
      ret += ")";
    }
    ret += "; ";
  }
  if (ret.endsWith("; ")) {
    ret = ret.slice(0, -2);
  }
  return ret;
}

export default function AdminReportPage() {
  const token = useContext(AuthContext).authData?.token;
  const [searchParams, setSearchParams] = useSearchParams();
  const [report, setReport] = useState<ReportInterface | null>(null);
  const [startDate, setStartDate] = useState<ReportDateInterface>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const printRef = React.createRef<HTMLDivElement>();

  const handlePrint = useReactToPrint({
    onBeforeGetContent() {},
    content: () => {
      return printRef.current;
    },
    onAfterPrint: () => {},
  });

  useEffect(() => {
    fetch();
  }, [startDate]);

  async function fetch() {
    const parms = {
      start: startDate.year + "-" + startDate.month.toString().padStart(2, "0"),
      end: endDate.year + "-" + endDate.month.toString().padStart(2, "0"),
    };
    try {
      const res = await axios.get(rootUrl + "report/", {
        headers: {
          Authorization: `Token ${token}`,
        },
        params: parms,
      });
      console.log(res.data);
      setReport(res.data);
    } catch (e) {
      console.log(e);
    }
  }
  const selectedRange: "monthly" | "trimestrial" | "yearly" =
    (searchParams.get("range") as any) ?? "monthly";
  const selectedTab: "pirogues" | "immigrants" =
    (searchParams.get("tab") as any) ?? "pirogues";
  let endDate: ReportDateInterface = {
    year: startDate.year,
    month: startDate.month,
  };
  if (selectedRange === "trimestrial") {
    endDate.month += 3;
    if (endDate.month > 12) {
      endDate.month -= 12;
      endDate.year += 1;
    }
  } else if (selectedRange === "yearly") {
    endDate.year += 1;
  }

  return (
    <div className="flex flex-col">
      <Title className="mb-9">Rapport</Title>
      <div className="flex flex-row items-center gap-x-2 text-sm">
        <Tab
          onClick={() => {
            setSearchParams((prev) => {
              prev.set("range", "monthly");
              return prev;
            });
          }}
          active={
            !searchParams.get("range") ||
            searchParams.get("range") === "monthly"
          }
        >
          Mensuelle
        </Tab>
        <Tab
          onClick={() => {
            setSearchParams((prev) => {
              prev.set("range", "trimestrial");
              return prev;
            });
          }}
          active={searchParams.get("range") === "trimestrial"}
        >
          Trimestrielle
        </Tab>
        <Tab
          onClick={() => {
            setSearchParams((prev) => {
              prev.set("range", "yearly");
              return prev;
            });
          }}
          active={searchParams.get("range") === "yearly"}
        >
          Annuelle
        </Tab>
      </div>
      <div className="mt-4 flex w-max items-center justify-center gap-x-6 self-center rounded border-2 border-primaryBorder p-2 px-2 font-semibold">
        <button
          onClick={() => {
            setStartDate((prev) => {
              if (prev.month === 1) {
                return { year: prev.year - 1, month: 12 };
              } else {
                return { year: prev.year, month: prev.month - 1 };
              }
            });
          }}
        >
          <LeftArrow className="h-4 w-4 fill-primary" />
        </button>
        <span
          className={` text-center ${selectedRange === "monthly" ? "w-[130px]" : "w-[260px]"}`}
        >
          {MONTHS[startDate.month - 1] + " " + startDate.year}
          {selectedRange !== "monthly" &&
            " - " + MONTHS[endDate.month - 1] + " " + endDate.year}
        </span>
        <button
          onClick={() => {
            setStartDate((prev) => {
              if (prev.month === 12) {
                return { year: prev.year + 1, month: 1 };
              } else {
                return { year: prev.year, month: prev.month + 1 };
              }
            });
          }}
        >
          <LeftArrow className="h-4 w-4 rotate-180 fill-primary" />
        </button>
      </div>
      <div className="mt-4 flex flex-row items-center gap-x-2">
        <Tab
          onClick={() => {
            setSearchParams((prev) => {
              prev.set("tab", "pirogues");
              return prev;
            });
          }}
          active={
            !searchParams.get("tab") || searchParams.get("tab") === "pirogues"
          }
        >
          Pirogues
        </Tab>
        <Tab
          onClick={() => {
            setSearchParams((prev) => {
              prev.set("tab", "immigrants");
              return prev;
            });
          }}
          active={searchParams.get("tab") === "immigrants"}
        >
          Immigrants
        </Tab>
      </div>
      <FilledButton
        onClick={handlePrint}
        className="col-span-2 mt-10 self-start"
      >
        Imprimer
      </FilledButton>
      <table
        className={`mt-10 w-full text-center text-lg ${selectedTab === "pirogues" ? "" : "hidden"}`}
      >
        <thead className="w-full">
          <tr className="font-bold text-gray">
            <th className="text-medium  py-3 text-base">Date</th>
            <th className="text-medium  py-3 text-base">Immigrants</th>
            <th className="text-medium py-3 text-base">Nationalités</th>
            <th className="text-medium py-3 text-base">Genres</th>
            <th className="text-medium py-3 text-base">Départ</th>
          </tr>
        </thead>
        {report ? (
          <tbody>
            {report!.pirogues.map((pirogueReport, i) => (
              <Tr>
                <Td>{pirogueReport.created_at.replaceAll("-", "/")}</Td>
                <Td>{pirogueReport.immigrants_count}</Td>
                <Td>{getPirogueNat(pirogueReport)}</Td>
                <Td>{getPirogueGenre(pirogueReport)}</Td>
                <Td>{pirogueReport.departure}</Td>
              </Tr>
            ))}
          </tbody>
        ) : (
          <TableBodySquelette columnCount={5} />
        )}
      </table>
      <table
        className={`mt-10 w-full text-center text-lg ${selectedTab === "immigrants" ? "" : "hidden"}`}
      >
        <thead className="w-full">
          <tr className="font-bold text-gray">
            <th className="text-medium  py-3 text-base">Nationalités</th>
            <th className="text-medium  py-3 text-base">Effectif global</th>
            <th className="text-medium py-3 text-base">Hommes</th>
            <th className="text-medium py-3 text-base">Femmes</th>
            <th className="text-medium py-3 text-base">Mineurs</th>
          </tr>
        </thead>
        {report ? (
          <tbody>
            {Object.entries(report!.immigrants).map(([nat, value], index) => (
              <Tr>
                <Td>{value.name ?? "-"}</Td>
                <Td>{value.females + value.males + value.minors}</Td>
                <Td>{value.males}</Td>
                <Td>{value.females}</Td>
                <Td>{value.minors}</Td>
              </Tr>
            ))}
          </tbody>
        ) : (
          <TableBodySquelette columnCount={5} />
        )}
      </table>
      {report && (
        <div
          ref={printRef}
          className="mt-20 flex flex-col items-center gap-y-10  px-10"
        >
          <span className={` text-center text-xl font-semibold `}>
            {MONTHS[startDate.month - 1] + " " + startDate.year}
            {selectedRange !== "monthly" &&
              " - " + MONTHS[endDate.month - 1] + " " + endDate.year}
          </span>
          <table className="w-full  text-center font-semibold">
            <thead>
              <tr>
                <th className="border px-2 py-1">Nationalités</th>
                <th className="border px-2 py-1">Effectif global</th>
                <th className="border px-2 py-1">Hommes</th>
                <th className="border px-2 py-1">Femmes</th>
                <th className="border px-2 py-1">Mineurs</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(report!.immigrants).map(([nat, value], index) => (
                <tr key={nat}>
                  <td className="border px-2 py-1">{value.name ?? "-"}</td>
                  <td className="border px-2 py-1">
                    {value.females + value.males + value.minors}
                  </td>
                  <td className="border px-2 py-1">{value.males}</td>
                  <td className="border px-2 py-1">{value.females}</td>
                  <td className="border px-2 py-1">{value.minors}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className=" w-full text-center font-semibold">
            <thead>
              <tr>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Immigrants</th>
                <th className="border px-2 py-1">Nationalités</th>
                <th className="border px-2 py-1">Genres</th>
                <th className="border px-2 py-1">Départ</th>
              </tr>
            </thead>
            <tbody>
              {report!.pirogues.map((pirogueReport, i) => (
                <tr>
                  <td className="border px-2 py-1">
                    {pirogueReport.created_at.replaceAll("-", "/")}
                  </td>
                  <td className="border px-2 py-1">
                    {pirogueReport.immigrants_count}
                  </td>
                  <td className="border px-2 py-1">
                    {getPirogueNat(pirogueReport) +
                      getPirogueNat(pirogueReport) +
                      getPirogueNat(pirogueReport) +
                      getPirogueNat(pirogueReport) +
                      getPirogueNat(pirogueReport)}
                  </td>
                  <td className="border px-2 py-1">
                    {getPirogueGenre(pirogueReport)}
                  </td>
                  <td className="border px-2 py-1">
                    {pirogueReport.departure}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
