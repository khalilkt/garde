import React, { useContext, useEffect } from "react";
import { Select, Title } from "../../components/comps";
import { Td, Tr } from "../../components/table";
import { LeftArrow } from "../../components/icons";
import { rootUrl, START_YEAR } from "../../models/constants";
import axios from "axios";
import { AuthContext } from "../../App";

export function getYears(start : number, end : number )  {
  if (start == end){
    return [start]
  }
  let years = []
  for (let i = start; i <= end; i++){
    years.push(i)
  }
  return years
}

interface DataInterface {
  data: {
    [key: string]: {
      total_pirogues: number;
      total_immigrants: number;
      total_females: number;
      total_males: number;
      total_minors: number;
      nationalities: {
        [key: string]: {
          name: string;
          total: number;
        };
      };
    };
  };
  nationalities: {
    [key: string]: {
      name: string;
      total: number;
    };
  };
}

export default function AdminComparaisonPage() {
  const token = useContext(AuthContext).authData?.token;
  const [data, setData] = React.useState<DataInterface | null>(
    null,
    // {
    // "2023": {
    //   total_pirogues: 10,
    //   total_immigrants: 249,
    //   total_females: 100,
    //   total_males: 99,
    //   total_minors: 50,
    // },

    // "2024": {
    //   total_pirogues: 5,
    //   total_immigrants: 100,
    //   total_females: 20,
    //   total_males: 60,
    //   total_minors: 20,
    // },
    //   }
  );

  const [startYear , setStartYear] = React.useState(new Date().getFullYear() - 1)
  const [endYear , setEndYear] = React.useState(new Date().getFullYear())
  const currentYear = new Date().getFullYear()  

  async function load() {
    const res = await axios.get(rootUrl + "year_comparaison?"
      + new URLSearchParams({
        start_year: startYear.toString(),
        end_year: endYear.toString(),
      })
      
      , {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    setData(res.data);
  }
  React.useEffect(() => {
    setData(null);
    load();
  }, [startYear, endYear]);

  let top_nats = Object.entries(data?.nationalities ?? {}).sort((a, b) => {
    return b[1].total - a[1].total;
  });
  top_nats = top_nats;

  const startData = data?.data[startYear.toString()]
  const endData = data?.data[endYear.toString()]

  return (
    <div>
      <Title>Comparaison</Title>
      <div className="mt-12 flex w-max flex-row items-center gap-x-4">
        <Select value={startYear}
        onChange={(e) => {
          setStartYear(parseInt(e.target.value))
          setEndYear(parseInt(e.target.value) + 1)
        }}
        >
          {
            getYears(START_YEAR, currentYear - 1).map((year) => (
              <option value={year.toString()}>{year}</option>
            ))
          }
        </Select>
        <LeftArrow className="h-8 w-8 rotate-180 fill-black" />
        <Select value={endYear}
        onChange={(e) => setEndYear(parseInt(e.target.value))}
        >
          {
            getYears(startYear + 1, currentYear).map((year) => (
              <option value={year.toString()}>{year}</option>
            ))
          }
        </Select>
      </div>
      {/* horizontal table */}
      {data && startData && endData &&  (
        <table className="mt-10 w-full">
          <Tr>
            <th></th>
            <Td className="w-1/4 text-lg font-semibold">{startYear}</Td>
            <Td className="w-1/4 text-lg font-semibold">{endYear}</Td>
            <Td className="w-1/4 text-lg font-semibold">Marge</Td>
          </Tr>
          <Tr>
            <Td className="border-t border-t-primaryBorder">Total Pirogue</Td>
            <Td className="w-1/4">{startData?.total_pirogues}</Td>
            <Td className="w-1/4">{endData?.total_pirogues}</Td>
            <Td className="w-1/4 font-semibold">
              {(endData?.total_pirogues ?? 0) -
                (startData?.total_pirogues ?? 0)}
            </Td>
          </Tr>
          <Tr>
            <Td>Total Immigrants</Td>
            <Td>{startData?.total_immigrants}</Td>
            <Td>{endData?.total_immigrants}</Td>
            <Td className="w-1/4 font-semibold">
              {(endData?.total_immigrants ?? 0) -
                (startData?.total_immigrants ?? 0)}
            </Td>
          </Tr>
          <Tr>
            <Td>Total Hommes</Td>
            <Td>{startData?.total_males}</Td>
            <Td>{endData?.total_males}</Td>
            <Td className="w-1/4 font-semibold">
              {(endData?.total_males ?? 0) - (startData?.total_males ?? 0)}
            </Td>
          </Tr>
          <Tr>
            <Td>Total Femmes</Td>
            <Td>{startData?.total_females}</Td>
            <Td>{endData?.total_females}</Td>
            <Td className="w-1/4 font-semibold">
              {(endData?.total_females ?? 0) -
                (startData?.total_females ?? 0)}
            </Td>
          </Tr>
          <Tr>
            <Td>Total Mineurs</Td>
            <Td>{startData!.total_minors}</Td>
            <Td>{endData?.total_minors}</Td>
            <Td className="w-1/4 font-semibold">
              {endData!.total_minors - startData!.total_minors}
            </Td>
          </Tr>
          {top_nats.map(([id, value]) => {
            const start = startData!.nationalities[id]?.total ?? 0;
            const end = endData?.nationalities[id]?.total ?? 0;

            return (
              <Tr>
                <Td>{value.name}</Td>
                <Td>{start}</Td>
                <Td>{end}</Td>
                <Td className="w-1/4 font-semibold">
                  {start < end && "+"}
                  {end - start}
                </Td>
              </Tr>
            );
          })}
        </table>
      )}
    </div>
  );
}
