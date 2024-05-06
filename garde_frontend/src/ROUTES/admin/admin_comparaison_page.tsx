import React, { useContext } from "react";
import { Select, Title } from "../../components/comps";
import { Td, Tr } from "../../components/table";
import { LeftArrow } from "../../components/icons";
import { rootUrl } from "../../models/constants";
import axios from "axios";
import { AuthContext } from "../../App";

interface DataInterface {
  [key: string]: {
    total_pirogues: number;
    total_immigrants: number;
    total_females: number;
    total_males: number;
    total_minors: number;
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

  async function load() {
    const res = await axios.get(rootUrl + "year_comparaison", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    setData(res.data);
  }
  React.useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <Title>Comparaison</Title>
      <div className="mt-12 flex w-max flex-row items-center gap-x-4">
        <Select value="2023">
          <option value="2023">2023</option>
        </Select>
        <LeftArrow className="h-8 w-8 rotate-180 fill-black" />
        <Select value="2024">
          <option value="2024">2024</option>
        </Select>
      </div>
      {/* horizontal table */}
      {data && (
        <table className="mt-10 w-full">
          <Tr>
            <th></th>
            <Td className="w-1/4 text-lg font-semibold">2023</Td>
            <Td className="w-1/4 text-lg font-semibold">2024</Td>
            <th></th>
          </Tr>
          <Tr>
            <th>Total Pirogue</th>
            <Td className="w-1/4">{data["2023"].total_pirogues}</Td>
            <Td className="w-1/4">{data["2024"].total_pirogues}</Td>
            <Td className="w-1/4 font-semibold">
              {data["2024"].total_pirogues - data["2023"].total_pirogues}
            </Td>
          </Tr>
          <Tr>
            <th>Total Immigrants</th>
            <Td>{data["2023"].total_immigrants}</Td>
            <Td>{data["2024"].total_immigrants}</Td>
            <Td className="w-1/4 font-semibold">
              {data["2024"].total_immigrants - data["2023"].total_immigrants}
            </Td>
          </Tr>
          <Tr>
            <th>Total Hommes</th>
            <Td>{data["2023"].total_males}</Td>
            <Td>{data["2024"].total_males}</Td>
            <Td className="w-1/4 font-semibold">
              {data["2024"].total_males - data["2023"].total_males}
            </Td>
          </Tr>
          <Tr>
            <th>Total Femmes</th>
            <Td>{data["2023"].total_females}</Td>
            <Td>{data["2024"].total_females}</Td>
            <Td className="w-1/4 font-semibold">
              {data["2024"].total_females - data["2023"].total_females}
            </Td>
          </Tr>
          <Tr>
            <th>Total Mineurs</th>
            <Td>{data["2023"].total_minors}</Td>
            <Td>{data["2024"].total_minors}</Td>
            <Td className="w-1/4 font-semibold">
              {data["2024"].total_minors - data["2023"].total_minors}
            </Td>
          </Tr>
        </table>
      )}
    </div>
  );
}
