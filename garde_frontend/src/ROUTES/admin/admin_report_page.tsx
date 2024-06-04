import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { Select, Title } from "../../components/comps";
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
  // let hasMale = false;
  // let hasFemale = false;
  // let hasMinor = false;

  // for (const [key, value] of Object.entries(repot.nationalities)) {
  //   if (value.males > 0) {
  //     hasMale = true;
  //   }
  //   if (value.females > 0) {
  //     hasFemale = true;
  //   }
  //   if (value.minors > 0) {
  //     hasMinor = true;
  //   }
  // }
  // ret =
  //   (hasMale ? "H," : "") + (hasFemale ? "F," : "") + (hasMinor ? "Mn," : "");
  // return ret.slice(0, -1);
  let totalMales = 0;
  let totalFemales = 0;
  let totalMinors = 0;
  for (const [key, value] of Object.entries(repot.nationalities)) {
    totalMales += value.males;
    totalFemales += value.females;
    totalMinors += value.minors;
  }
  ret = "";
  if (totalMales > 0) {
    ret += "H=" + totalMales + " ";
  }
  if (totalFemales > 0) {
    ret += "F=" + totalFemales + " ";
  }
  if (totalMinors > 0) {
    ret += "Mn=" + totalMinors + " ";
  }
  if (ret.endsWith(" ")) {
    ret = ret.slice(0, -1);
  }
  return ret;
}

function getReportFromData(data: any) {
  const immgrantReport = data["immigrant_report"];
  let immigrantReportByMonth = [];
  let pirogueReportByMonth = [];

  let mm = 1;
  while (mm <= 12) {
    let monthReport: {
      [city: string]: NationalityDetails;
    } = {};
    for (const [key, value] of Object.entries(immgrantReport)) {
      monthReport[key] = (value as { [month: string]: NationalityDetails })[
        mm.toString()
      ];
    }

    immigrantReportByMonth.push(monthReport);

    //------

    let pirogueReport: {
      [city: string]: {
        [nat_id: string]: {
          saisie: number;
          casse: number;
          abandonnee: number;
        };
      };
    } = {};
    for (const [key, value] of Object.entries(data["pirogue_report"])) {
      pirogueReport[key] = (value as { [month: string]: any })[mm.toString()];
    }

    pirogueReportByMonth.push(pirogueReport);

    mm = mm + 1;
  }

  return [immigrantReportByMonth, pirogueReportByMonth];
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
  // const [report, setReport] = useState<ReportInterface | null>(null);
  const [users, setUsers] = useState<
    { id: number; city_name: string }[] | null
  >(null);

  const [immigrantsReport, setImmigrantsReport] = useState<{
    [month: string]: { [nat_id: string]: NationalityDetails };
  } | null>(null);

  const [piroguesReport, setPiroguesReport] = useState<{
    [month: string]: {
      saisie: number;
      casse: number;
      abandonnee: number;
    };
  } | null>(null);

  const [dd, setDd] = useState<
    | [
        { [city: string]: { [nat_id: string]: NationalityDetails } }[],
        {
          [city: string]: {
            saisie: number;
            casse: number;
            abandonnee: number;
          };
        }[],
      ]
    | null
  >(null);

  const printRef = React.createRef<HTMLDivElement>();

  const handlePrint = useReactToPrint({
    onBeforeGetContent() {},
    content: () => {
      return printRef.current;
    },
    onAfterPrint: () => {},
  });

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await axios.get(rootUrl + "users/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        let ret = [];
        for (const user of res.data.data) {
          if (user.city_name) {
            ret.push({ id: user.id, city_name: user.city_name });
          }
        }
        setUsers(ret);
      } catch (e) {
        console.log(e);
      }
    }
    fetchCities();
  }, []);

  useEffect(() => {
    // fetch();
    fetchV2();
  }, [searchParams.get("year"), searchParams.get("city")]);

  const selectedYear =
    searchParams.get("year") ?? new Date().getFullYear().toString();

  async function fetchV2() {
    const params = {
      year: selectedYear.toString(),
      user: searchParams.get("city") ?? undefined,
    };
    setImmigrantsReport(null);
    setPiroguesReport(null);
    try {
      const res = await axios.get(rootUrl + "general_report_v2/", {
        headers: {
          Authorization: `Token ${token}`,
        },
        params: params,
      });
      console.log(res.data);
      setImmigrantsReport(res.data["immigrants_report"]);
      setPiroguesReport(res.data["pirogue_report"]);
    } catch (e) {
      console.log(e);
    }
  }
  async function fetch() {
    const parms = {
      // start: selectedYear + "-" + "01",
      // end: parseInt(selectedYear) + 1 + "-" + "01",
      year: selectedYear.toString(),
    };

    try {
      const res = await axios.get(rootUrl + "general_report/", {
        headers: {
          Authorization: `Token ${token}`,
        },
        params: parms,
      });
      console.log(res.data);
      const ret = getReportFromData(res.data);
      // console.log(ret);
      setDd(ret as any);

      // setReport(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  const selectedTab: "pirogues" | "immigrants" =
    (searchParams.get("tab") as any) ?? "pirogues";

  let totalImmigrantReport: { [nat: string]: NationalityDetails } = {};
  if (immigrantsReport) {
    for (const monthReport of Object.values(immigrantsReport)) {
      for (const [nat, det] of Object.entries(monthReport)) {
        if (totalImmigrantReport[nat] === undefined) {
          totalImmigrantReport[nat] = { ...det };
        } else {
          totalImmigrantReport[nat].males += det.males;
          totalImmigrantReport[nat].females += det.females;
          totalImmigrantReport[nat].minors += det.minors;
        }
      }
    }
  }

  let totalPirogueReport: {
    saisie: number;
    casse: number;
    abandonnee: number;
  } = { saisie: 0, casse: 0, abandonnee: 0 };
  if (piroguesReport) {
    for (const monthReport of Object.values(piroguesReport)) {
      totalPirogueReport.saisie += monthReport.saisie;
      totalPirogueReport.casse += monthReport.casse;
      totalPirogueReport.abandonnee += monthReport.abandonnee;
    }
  }

  return (
    <div className="flex flex-col">
      <Title className="mb-9">Rapports</Title>
      <div className="mt-4 flex w-max items-center justify-center gap-x-6 self-center rounded border-2 border-primaryBorder p-2 px-2 font-semibold">
        <button
          onClick={() => {
            setSearchParams((prev) => {
              prev.set("year", (parseInt(selectedYear) - 1).toString());
              return prev;
            });
          }}
        >
          <LeftArrow className="h-4 w-4 fill-primary" />
        </button>
        <span className={` w-[130px] text-center`}>{selectedYear}</span>
        <button
          onClick={() => {
            setSearchParams((prev) => {
              prev.set("year", (parseInt(selectedYear) + 1).toString());
              return prev;
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
          Migrants
        </Tab>
      </div>
      <FilledButton
        onClick={handlePrint}
        className="col-span-2 mt-10 self-start"
      >
        Imprimer
      </FilledButton>
      <div className="flow-row flex">
        <Select
          className="mt-10 w-max self-start"
          value={searchParams.get("city") ?? "all"}
          onChange={(e) => {
            setSearchParams((prev) => {
              if (e.target.value === "all") {
                prev.delete("city");
                return prev;
              }
              prev.set("city", e.target.value);
              return prev;
            });
          }}
        >
          <option value="all">Tous</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.city_name.toUpperCase()}
            </option>
          ))}
        </Select>
      </div>
      {immigrantsReport &&
        selectedTab === "immigrants" &&
        [...Object.values(immigrantsReport), totalImmigrantReport!].map(
          (monthReport, i: number) => (
            <div className="items-centesr flex flex-col">
              <span className="mt-10 text-lg font-semibold text-primary">
                {i > 11 ? "TOTAL" : MONTHS[i]}
              </span>
              <table className="mt-10">
                <thead>
                  <Tr>
                    <Td className="text-medium  py-3 text-base font-semibold">
                      Nationalités
                    </Td>
                    <Td className="text-medium  py-3 text-base font-semibold">
                      Effectif global
                    </Td>
                    <Td className="text-medium py-3 text-base font-semibold">
                      Hommes
                    </Td>
                    <Td className="text-medium py-3 text-base font-semibold">
                      Femmes
                    </Td>
                    <Td className="text-medium py-3 text-base font-semibold">
                      Mineurs
                    </Td>
                  </Tr>
                </thead>

                <tbody>
                  {Object.entries(monthReport).map(([nat, det], index) => (
                    <Tr>
                      <Td>{det.name ?? "-"}</Td>
                      <Td>{det.males + det.females + det.minors}</Td>
                      <Td>{det.males}</Td>
                      <Td>{det.females}</Td>
                      <Td>{det.minors}</Td>
                    </Tr>
                  ))}
                  {Object.entries(monthReport).length === 0 && (
                    <Tr>
                      <Td colSpan={1} className="text-center">
                        -
                      </Td>
                      <Td>0</Td>
                      <Td>0</Td>
                      <Td>0</Td>
                      <Td>0</Td>
                    </Tr>
                  )}
                </tbody>
              </table>
            </div>
          ),
        )}
      {dd &&
        selectedTab === "immigrants" &&
        dd[0].map(
          (monthReport, i: number) =>
            Object.values(monthReport).reduce(
              (acc, value) => acc + Object.entries(value).length,
              0,
            ) > 0 && (
              <div className="items-centesr flex flex-col">
                <span className="mt-10 text-lg font-semibold text-primary">
                  {MONTHS[i]}
                </span>
                {Object.entries(monthReport).map(
                  ([city, value], index) =>
                    Object.entries(value).length > 0 && (
                      <div className="flex flex-col">
                        <span className="mb-4 mt-10 text-lg font-semibold uppercase text-gray">
                          {city}
                        </span>
                        <table>
                          <thead>
                            <Tr>
                              <Td className="text-medium  py-3 text-base font-semibold">
                                Nationalités
                              </Td>
                              <Td className="text-medium  py-3 text-base font-semibold">
                                Effectif global
                              </Td>
                              <Td className="text-medium py-3 text-base font-semibold">
                                Hommes
                              </Td>
                              <Td className="text-medium py-3 text-base font-semibold">
                                Femmes
                              </Td>
                              <Td className="text-medium py-3 text-base font-semibold">
                                Mineurs
                              </Td>
                            </Tr>
                          </thead>
                          <tbody>
                            {Object.entries(value).map(([nat, det], index) => (
                              <Tr>
                                <Td>{det.name ?? "-"}</Td>
                                <Td>{det.males + det.females + det.minors}</Td>
                                <Td>{det.males}</Td>
                                <Td>{det.females}</Td>
                                <Td>{det.minors}</Td>
                              </Tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ),
                )}
              </div>
            ),
        )}
      {piroguesReport &&
        selectedTab === "pirogues" &&
        [...Object.values(piroguesReport), totalPirogueReport].map(
          (monthReport, i: number) => (
            <div className="flex flex-col items-center">
              <span className="mt-10 text-lg font-semibold text-gray">
                {i > 11 ? "TOTAL" : MONTHS[i]}
              </span>
              <table>
                <tbody>
                  <Tr>
                    <Td className="text-medium  py-3 text-base">
                      Pirogue Saisie
                    </Td>
                    <Td className="text-medium py-3 text-base font-bold ">
                      {monthReport.saisie}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td className="text-medium  py-3 text-base">
                      Pirogue Cassée
                    </Td>
                    <Td className="text-medium py-3 text-base font-bold">
                      {monthReport.casse}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td className="text-medium  py-3 text-base">
                      Pirogue Abandonnée
                    </Td>
                    <Td className="text-medium py-3 text-base font-bold">
                      {monthReport.abandonnee}
                    </Td>
                  </Tr>
                </tbody>
              </table>
            </div>
          ),
        )}
      {dd &&
        selectedTab === "pirogues" &&
        dd[1].map(
          (monthReport, i: number) =>
            Object.entries(monthReport).reduce(
              (acc, [city, value]) =>
                value.saisie + value.casse + value.abandonnee + acc,
              0,
            ) > 0 && (
              <div className="flex flex-col items-center">
                <span className="mt-10 text-lg font-semibold text-gray">
                  {MONTHS[i]}
                </span>
                <div className="flex flex-row gap-x-8">
                  {Object.entries(monthReport).map(
                    ([city, value], index) =>
                      Object.entries(value).length > 0 && (
                        <div className="flex flex-col">
                          <span className="mb-4 mt-10 text-lg font-semibold text-primary">
                            {city}
                          </span>
                          <table>
                            <tbody>
                              <Tr>
                                <Td className="text-medium  py-3 text-base">
                                  Pirogue Saisie
                                </Td>
                                <Td className="text-medium py-3 text-base font-bold ">
                                  {value.saisie}
                                </Td>
                              </Tr>
                              <Tr>
                                <Td className="text-medium  py-3 text-base">
                                  Pirogue Cassée
                                </Td>
                                <Td className="text-medium py-3 text-base font-bold">
                                  {value.casse}
                                </Td>
                              </Tr>
                              <Tr>
                                <Td className="text-medium  py-3 text-base">
                                  Pirogue Abandonnée
                                </Td>
                                <Td className="text-medium py-3 text-base font-bold">
                                  {value.abandonnee}
                                </Td>
                              </Tr>
                            </tbody>
                          </table>
                        </div>
                      ),
                  )}
                </div>
              </div>
            ),
        )}
      <div ref={printRef} className="hidden px-20 pt-10 print:block">
        <h2 className="text-center text-3xl font-semibold">
          LA LUTTE CONTRE LA MIGRATION IRREGULIERE PAR VOIE MARITIME{" "}
          {selectedYear}
        </h2>
        {searchParams.get("city") && (
          <h3 className="mt-10 text-center text-xl font-semibold">
            {users
              ?.find((user) => user.id === parseInt(searchParams.get("city")!))
              ?.city_name?.toUpperCase()}
          </h3>
        )}
        {immigrantsReport &&
          selectedTab === "immigrants" &&
          [...Object.values(immigrantsReport), totalImmigrantReport].map(
            (monthReport, i: number) => (
              <div className="items-centesr flex flex-col">
                <span className="mt-10 text-lg font-semibold text-primary">
                  {i > 11 ? "TOTAL" : MONTHS[i]}
                </span>
                e
                <table className="mt-10">
                  <thead>
                    <tr>
                      <td className="border px-2 py-1 font-semibold">
                        Nationalités
                      </td>
                      <td className="border px-2 py-1 font-semibold">
                        Effectif global
                      </td>
                      <td className="border px-2 py-1 font-semibold">Hommes</td>
                      <td className="border px-2 py-1 font-semibold">Femmes</td>
                      <td className="border px-2 py-1 font-semibold">
                        Mineurs
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(monthReport).map(([nat, det], index) => (
                      <tr>
                        <td className="border px-2 py-1 font-semibold">
                          {det.name ?? "-"}
                        </td>
                        <td className="border px-2 py-1 font-semibold">
                          {det.males + det.females + det.minors}
                        </td>
                        <td className="border px-2 py-1 font-semibold">
                          {det.males}
                        </td>
                        <td className="border px-2 py-1 font-semibold">
                          {det.females}
                        </td>
                        <td className="border px-2 py-1 font-semibold">
                          {det.minors}
                        </td>
                      </tr>
                    ))}
                    {Object.entries(monthReport).length === 0 && (
                      <Tr>
                        <td
                          className="border px-2 py-1 text-center font-semibold"
                          colSpan={1}
                        >
                          -
                        </td>
                        <td className="border px-2 py-1 font-semibold">0</td>
                        <td className="border px-2 py-1 font-semibold">0</td>
                        <td className="border px-2 py-1 font-semibold">0</td>
                        <td className="border px-2 py-1 font-semibold">0</td>
                      </Tr>
                    )}
                  </tbody>
                </table>
              </div>
            ),
          )}

        {piroguesReport &&
          selectedTab === "pirogues" &&
          [...Object.values(piroguesReport), totalPirogueReport].map(
            (monthReport, i: number) => (
              <div className="flex flex-col items-center">
                <span className="mt-10 text-lg font-semibold text-gray">
                  {i > 11 ? "TOTAL" : MONTHS[i]}
                </span>
                <table className="mt-2">
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1 font-semibold">
                        Pirogue Saisie
                      </td>
                      <td className="border px-2 py-1 font-bold ">
                        {monthReport.saisie}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-semibold">
                        Pirogue Cassée
                      </td>
                      <td className="border px-2 py-1 font-bold">
                        {monthReport.casse}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-semibold">
                        Pirogue Abandonnée
                      </td>
                      <td className="border px-2 py-1 font-bold">
                        {monthReport.abandonnee}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ),
          )}

        {dd &&
          selectedTab === "immigrants" &&
          dd[0].map(
            (monthReport, i: number) =>
              Object.values(monthReport).reduce(
                (acc, value) => acc + Object.entries(value).length,
                0,
              ) > 0 && (
                <div className="items-centesr flex flex-col">
                  <span className="mt-10 text-lg font-semibold text-primary">
                    {MONTHS[i]}
                  </span>
                  {Object.entries(monthReport).map(
                    ([city, value], index) =>
                      Object.entries(value).length > 0 && (
                        <div className="flex flex-col">
                          <span className="mb-4 mt-10 text-lg font-semibold uppercase text-gray">
                            {city}
                          </span>
                          <table>
                            <thead>
                              <tr>
                                <td className="border px-2 py-1 font-semibold">
                                  Nationalités
                                </td>
                                <td className="border px-2 py-1 font-semibold">
                                  Effectif global
                                </td>
                                <td className="border px-2 py-1 font-semibold">
                                  Hommes
                                </td>
                                <td className="border px-2 py-1 font-semibold">
                                  Femmes
                                </td>
                                <td className="border px-2 py-1 font-semibold">
                                  Mineurs
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(value).map(
                                ([nat, det], index) => (
                                  <tr>
                                    <td className="border px-2 py-1">
                                      {det.name ?? "-"}
                                    </td>
                                    <td className="border px-2 py-1">
                                      {det.males + det.females + det.minors}
                                    </td>
                                    <td className="border px-2 py-1">
                                      {det.males}
                                    </td>
                                    <td className="border px-2 py-1">
                                      {det.females}
                                    </td>
                                    <td className="border px-2 py-1">
                                      {det.minors}
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      ),
                  )}
                </div>
              ),
          )}
        {dd &&
          selectedTab === "pirogues" &&
          dd[1].map(
            (monthReport, i: number) =>
              Object.entries(monthReport).reduce(
                (acc, [city, value]) =>
                  value.saisie + value.casse + value.abandonnee + acc,
                0,
              ) > 0 && (
                <div className="flex flex-col items-start">
                  <span className="mt-10 text-lg font-semibold text-gray">
                    {MONTHS[i]}
                  </span>
                  <div className="flex flex-row gap-x-10">
                    {Object.entries(monthReport).map(
                      ([city, value], index) =>
                        Object.entries(value).length > 0 && (
                          <div className="flex flex-col">
                            <span className="mt-10 text-lg font-semibold text-primary">
                              {city}
                            </span>
                            <table>
                              <tbody>
                                <tr>
                                  <td className="border px-2 py-1">
                                    Pirogue Saisie
                                  </td>
                                  <td className="border px-2 py-1 font-bold ">
                                    {value.saisie}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border px-2 py-1">
                                    Pirogue Cassée
                                  </td>
                                  <td className="border px-2 py-1 font-bold">
                                    {value.casse}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border px-2 py-1">
                                    Pirogue Abandonnée
                                  </td>
                                  <td className="border px-2 py-1 font-bold">
                                    {value.abandonnee}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              ),
          )}
        {/* border px-2 py-1 */}
      </div>
      {/* <table
        className={`mt-10 w-full text-center text-lg ${selectedTab === "pirogues" ? "" : "hidden"}`}
      >
        <thead className="w-full">
          <tr className="font-bold text-gray">
            <th className="text-medium  py-3 text-base">Date</th>
            <th className="text-medium  py-3 text-base">Migrants</th>
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
      </table> */}

      {/* <table
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
          className="s mt-20 hidden flex-col gap-y-10 px-10 print:flex"
        >
          <span className={` text-center text-xl font-semibold `}>
            {selectedYear}
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
          <table className="text-center font-semibold">
            <thead>
              <tr>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Migrants</th>
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
          </table> */}
      {/* </div> */}
      {/* )} */}
    </div>
  );
}
