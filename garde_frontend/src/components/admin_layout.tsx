import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import React from "react";
import {
  AgentsIcon,
  ImmigrantIcon,
  LeftArrow,
  LoadingIcon,
  MigrationIrregulierIcon,
  PiroguesIcon,
  PlusIcon,
  StatsIcon,
} from "./icons";
import { DisconnectButton, FilledButton, OutlinedButton } from "./buttons";
import { MDialog } from "./dialog";
import { Input, Textarea } from "./comps";
import { PrintPage } from "./print_page";
import { useReactToPrint } from "react-to-print";
import { ImmigrantInterface } from "../ROUTES/admin/agent&admin_immigrants_page";
import { rootUrl } from "../models/constants";
import axios from "axios";

function NavItem({
  to,
  children,
  icon,
  isOpen,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
}) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <li>
      <Link
        className={`flex flex-row gap-x-2 overflow-x-clip text-ellipsis rounded-md p-3 text-sm font-semibold transition-all duration-100 ${isActive ? "bg-[#E5EEFF] text-primary" : "bg-transparent text-gray"}`}
        to={to}
      >
        <span className={` ${isActive ? "fill-primary " : "fill-gray"}`}>
          {icon}
        </span>
        {isOpen && children}
      </Link>
    </li>
  );
}

interface BulkImmigrnatInterface {
  name: string;
  date_of_birth: string;
  birth_place: string;
  nationality: string;
  is_male: boolean;
}

function formatNationalities(data: string) {
  const lines = data.split("\n");
  let nats: { id: number; name: string }[] = [];
  for (const line of lines) {
    if (line.split(" ").length > 1) {
      const splited = line.split(" ");
      const id = parseInt(splited.pop()!);
      const name = splited.join(" ").trim().toUpperCase();
      nats.push({ id: id, name: name });
    }
  }

  return nats;
}
function formartData(data: string) {
  const lines = data.split("\n");
  let immigrantList: BulkImmigrnatInterface[] = [];
  for (const line of lines) {
    if (line.split("\t").length === 5) {
      let [name, dateOfBirth, placeOfBirth, nationality, sexe] =
        line.split("\t");
      if (dateOfBirth.length === 4) {
        dateOfBirth = dateOfBirth + "-01-01";
      }
      sexe = sexe.toUpperCase();
      if (sexe === "H" || sexe === "F") {
        immigrantList.push({
          name: name,
          birth_place: placeOfBirth,
          date_of_birth: dateOfBirth,
          nationality: nationality.toUpperCase(),
          is_male: sexe === "H",
        });
      }
    }
  }

  return immigrantList;
}

function SuperAdminBulkDialog() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [date, setDate] = React.useState<{
    year: number | null;
    month: number | null;
    day: number | null;
  }>({
    year: null,
    month: null,
    day: null,
  });
  const [data, setData] = React.useState("");
  const [nats, setNats] = React.useState("");

  const immigrantList = formartData(data);
  const nationalities = formatNationalities(nats);

  const token = React.useContext(AuthContext).authData?.token;

  async function createPirogue() {
    const pirogueNat = "rim";
    const nat = nationalities.find(
      (v) => v.name === pirogueNat.toUpperCase(),
    )?.id!;
    const res = await axios.post(
      rootUrl + "me/pirogues/",
      {
        departure: "-",
        destination: "-",
        port: "nouadhibou",
        number: "-",
        nationality: nat,
        // lat: "20°55 N",
        // long: "016°55 W",
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    const id = res.data.id;
    console.log("created pirogue", id);
    await axios.patch(
      rootUrl + `pirogues/${id}/`,
      {
        created_at: date.year! + "-" + date.month! + "-" + date.day!,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    console.log("update the pirogue created_at", id);
    return id;
  }
  async function createImmigrant(
    immigrant: BulkImmigrnatInterface,
    pirogue_id: number,
  ) {
    let nat = nationalities.find((v) => v.name === immigrant.nationality)?.id;
    if (!nat) {
      alert("nationality not found : " + immigrant.nationality);
      return;
    }
    const res = await axios.post(
      rootUrl + "me/immigrants/",
      {
        name: immigrant.name,
        date_of_birth: immigrant.date_of_birth,
        birth_place: immigrant.birth_place,
        nationality: nat,
        pirogue: pirogue_id,
        is_male: immigrant.is_male,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    const id = res.data.id;
    console.log("created immigrant", id);
    await axios.patch(
      rootUrl + `immigrants/${id}/`,
      {
        created_at: date.year! + "-" + date.month! + "-" + date.day!,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    console.log("update the immigrnat created_at", id);
  }

  async function submit() {
    if (date.year === null || date.month === null || date.day === null) {
      alert("please enter the date");
      return;
    }
    if (immigrantList.length === 0) {
      alert("no data");
      return;
    }
    if (nationalities.length === 0) {
      alert("no nationalities");
      return;
    }
    for (const imm of immigrantList) {
      if (nationalities.find((v) => v.name === imm.nationality) === undefined) {
        alert("nationality not found : " + imm.nationality);
        return;
      }
    }
    setIsSubmitting(true);

    const pirogueId = await createPirogue();
    let promises = immigrantList.map((imm) => {
      return createImmigrant(imm, pirogueId);
    });
    try {
      await Promise.all(promises);
    } catch (e) {
      alert("error");
      console.log(e);
    }

    setIsSubmitting(false);
  }

  return (
    <div className="flex w-[600px] flex-col gap-y-4">
      <Textarea
        value={data}
        placeholder="data"
        onChange={(e) => {
          setData(e.target.value);
        }}
      />

      <div className="flex gap-x-2">
        <Input
          className="w-[100px]"
          placeholder="0000"
          value={date.year ?? ""}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (isNaN(value)) {
              setDate({ ...date, year: null });
              return;
            }

            setDate({ ...date, year: value });
          }}
        />
        <Input
          className="w-[50px]"
          placeholder="00"
          value={date.month ?? ""}
          onChange={(e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value)) {
              setDate({ ...date, month: null });
              return;
            }
            setDate({ ...date, month: value });
          }}
        />
        <Input
          className="w-[50px]"
          placeholder="00"
          value={date.day ?? ""}
          onChange={(e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value)) {
              setDate({ ...date, day: null });
              return;
            }
            setDate({ ...date, day: value });
          }}
        />
      </div>
      <div className="h-[400px] overflow-y-scroll bg-blue-50">
        {immigrantList.map((immigrant) => {
          return (
            <div className="flex gap-x-2">
              {immigrant.name} - {immigrant.date_of_birth} -
              <span
                className={
                  nationalities.find((v) => v.name === immigrant.nationality)
                    ? ""
                    : "text-red-500"
                }
              >
                {immigrant.nationality}
              </span>
              -
              <span
                className={
                  immigrant.is_male ? "text-blue-500" : " text-purple-400"
                }
              >
                {immigrant.is_male ? "H" : "F"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-x-6">
        <span className="font-bold">{immigrantList.length}</span>
        <span className="font-bold text-red-600">
          {data.split("\n").length - immigrantList.length}
        </span>
      </div>

      {/* <div className="bg-red-50 ">
        {nationalities.map((nat) => {
          return (
            <div className="flex gap-x-2">
              {nat.id} : {nat.name}
            </div>
          );
        })}
      </div> */}
      <Textarea
        value={nats}
        placeholder="1 Senegal"
        onChange={(e) => {
          setNats(e.target.value);
        }}
      />
      <FilledButton
        className="self-end"
        onClick={() => {
          submit();
        }}
      >
        {isSubmitting ? <LoadingIcon /> : "Submit"}
      </FilledButton>
    </div>
  );
}

function LetterDialog() {
  const [leftSignature, setLeftSignature] = React.useState("");
  const [rightSignature, setRightSignature] = React.useState("");
  const [contenu, setContenu] = React.useState("");
  const [title, setTitle] = React.useState("");

  const printRef = React.useRef<HTMLDivElement>(null);
  const token = React.useContext(AuthContext).authData?.token;

  const handlePrint = useReactToPrint({
    onBeforeGetContent() {},
    content: () => {
      return printRef.current;
    },
    onAfterPrint: () => {},
  });

  return (
    <>
      <div className="flex w-[600px] flex-col gap-y-6">
        <Input
          placeholder="Titre"
          className="font-semibold"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <Textarea
          placeholder="Contenu"
          className="h-[200px]"
          value={contenu}
          onChange={(e) => {
            setContenu(e.target.value);
          }}
        />
        <div className="flex w-full items-center">
          <Textarea
            placeholder="Sign gauche"
            value={leftSignature}
            onChange={(e) => {
              setLeftSignature(e.target.value);
            }}
          />
          <span className="mx-auto h-[3px] w-8 rounded-full bg-gray" />
          <Textarea
            placeholder="Sign droit"
            value={rightSignature}
            onChange={(e) => {
              setRightSignature(e.target.value);
            }}
          />
        </div>
        <FilledButton
          onClick={() => {
            handlePrint();
          }}
          className="self-end"
        >
          Imprimer
        </FilledButton>
      </div>
      <div ref={printRef} className="absolute opacity-0 print:opacity-100">
        <PrintPage
          signatureLeft={leftSignature}
          signatureRight={rightSignature}
          text={""}
          isOnePage
          objectText={null}
          topTitle={title}
        >
          {contenu}
        </PrintPage>
      </div>
    </>
  );
}

export function AdminProtectedLayout() {
  const authContext = React.useContext(AuthContext);
  const [isOpen, setIsOpen] = React.useState(true);
  const [isLetterDialogOpen, setIsLetterDialogOpen] = React.useState(false);

  if (!authContext.authData || !authContext.authData.user.is_admin) {
    return <Navigate to="/" />;
  }
  const token = authContext.authData.token;

  return (
    <div className="flex h-screen flex-row">
      <MDialog
        isOpen={isLetterDialogOpen}
        title={"Créer une lettre"}
        // title="Créer une pirogue"
        onClose={() => {
          setIsLetterDialogOpen(false);
        }}
      >
        <LetterDialog />
        {/* <SuperAdminBulkDialog /> */}
      </MDialog>
      <ul
        className={
          "relative flex flex-col gap-y-2 border-r-2 border-r-primaryBorder bg-white px-6 pt-20 transition-all duration-150 " +
          (isOpen ? "w-[14%]" : "w-[100px]")
        }
      >
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={`absolute right-0 flex h-10 w-10 translate-x-1/2 items-center justify-center rounded-full bg-primaryBorder p-3 transition-all ${isOpen ? "" : "rotate-180"}`}
        >
          <LeftArrow className="h-3 w-3 fill-black" />
        </button>
        <h3
          onClick={() => {
            // authContext.logOut();
          }}
          className="mb-2 font-semibold text-gray"
        >
          Menu
        </h3>
        {/* <OutlinedButton
          onClick={() => {
            setIsLetterDialogOpen(true);
          }}
          className="mb-10 flex items-center gap-x-2 "
        >
          <PlusIcon className="" />
          <span>Lettre</span>
        </OutlinedButton> */}
        <NavItem isOpen={isOpen} to="/admin" icon={<StatsIcon />}>
          Statistiques
        </NavItem>
        <NavItem isOpen={isOpen} to="/admin/agents" icon={<AgentsIcon />}>
          Agents
        </NavItem>
        <NavItem isOpen={isOpen} to="/admin/pirogues" icon={<PiroguesIcon />}>
          Pirogues
        </NavItem>
        <NavItem
          isOpen={isOpen}
          to="/admin/immigrants"
          icon={<ImmigrantIcon />}
        >
          Migrants
        </NavItem>
        <NavItem
          isOpen={isOpen}
          to="/admin/migration_irreguliere"
          icon={<MigrationIrregulierIcon />}
        >
          Migration Irrégulière
        </NavItem>
        {/* <NavItem
          isOpen={isOpen}
          to="/admin/general_rapports"
          icon={<StatsIcon />}
        >
          Rapports Généraux
        </NavItem> */}
        <NavItem isOpen={isOpen} to="/admin/rapports" icon={<StatsIcon />}>
          Rapports
        </NavItem>
        <NavItem isOpen={isOpen} to="/admin/comparaison" icon={<StatsIcon />}>
          Comparaison
        </NavItem>
        <NavItem
          isOpen={isOpen}
          to="/admin/liberation"
          icon={<ImmigrantIcon />}
        >
          Libération
        </NavItem>
        <NavItem
          isOpen={isOpen}
          to="/admin/criminals"
          icon={
            <svg
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              className=" fill-inherit stroke-inherit"
              height={24}
              width={24}
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g id="Handcuffs">
                  <path d="M21.34,31.87a1,1,0,0,0,1-1V29.28a1,1,0,0,0-2,0v1.59A1,1,0,0,0,21.34,31.87Z"></path>
                  <path d="M48.45,29.59,48.91,28a2.79,2.79,0,0,0-2.67-3.57h-.81V15.11A8.12,8.12,0,0,0,37.32,7H26.7a8.12,8.12,0,0,0-8.12,8.11v9.33h-.82A2.79,2.79,0,0,0,15.09,28l.46,1.58A14.3,14.3,0,0,0,11.21,52.8,14.3,14.3,0,0,0,32,52.22,14.31,14.31,0,1,0,48.45,29.59ZM20.58,15.11A6.12,6.12,0,0,1,26.7,9H37.32a6.12,6.12,0,0,1,6.11,6.11v9.33H41.91V15.11a4.6,4.6,0,0,0-4.59-4.59H26.7a4.6,4.6,0,0,0-4.6,4.59v9.33H20.58ZM36.4,28l.46,1.58A14.38,14.38,0,0,0,32,33.14a14.35,14.35,0,0,0-4.85-3.56L27.6,28a2.79,2.79,0,0,0-2.68-3.57H24.1V15.11a2.6,2.6,0,0,1,2.6-2.59H37.32a2.59,2.59,0,0,1,2.59,2.59v9.33h-.83A2.79,2.79,0,0,0,36.4,28ZM9,42.67a12.39,12.39,0,0,1,8.1-11.56,1,1,0,0,0,.61-1.22L17,27.45a.83.83,0,0,1,.12-.7.78.78,0,0,1,.63-.31h7.16a.78.78,0,0,1,.63.31.8.8,0,0,1,.13.7L25,29.89a1,1,0,0,0,.62,1.22,12.41,12.41,0,0,1,5.18,3.62,14.24,14.24,0,0,0-1.68,3.41,9,9,0,0,0-7.74-4.45h0A9,9,0,0,0,18.4,51.14a3.61,3.61,0,0,0-.74,2.18,3.53,3.53,0,0,0,.22,1.18A12.31,12.31,0,0,1,9,42.67Zm12.33,7h0a7,7,0,1,1,0-14h0a7,7,0,1,1,0,14Zm0,5.36a1.68,1.68,0,1,1,0-3.36,9,9,0,0,0,7.73-4.43,14.21,14.21,0,0,0,1.67,3.41A12.23,12.23,0,0,1,21.34,55Zm30-3.61a12.3,12.3,0,0,1-5.26,3.11,3.53,3.53,0,0,0,.22-1.18,3.61,3.61,0,0,0-.74-2.18,9,9,0,0,0-2.94-17.45h0a9,9,0,1,0,0,18,1.68,1.68,0,1,1,0,3.36,12.32,12.32,0,0,1-4.24-23.89A1,1,0,0,0,39,29.89l-.72-2.44a.8.8,0,0,1,.13-.7.78.78,0,0,1,.63-.31h7.16a.78.78,0,0,1,.63.31.83.83,0,0,1,.12.7l-.71,2.44a1,1,0,0,0,.61,1.22,12.31,12.31,0,0,1,4.49,20.28Zm-15.7-8.73a7,7,0,0,1,7-7h0a7,7,0,1,1,0,14h0A7,7,0,0,1,35.68,42.66Z"></path>
                  <path d="M42.66,28.28a1,1,0,0,0-1,1v1.59a1,1,0,1,0,2,0V29.28A1,1,0,0,0,42.66,28.28Z"></path>
                </g>
              </g>
            </svg>
          }
        >
          Criminels
        </NavItem>
        <div className="text-medium  font- mb-20 mt-auto flex flex-col gap-y-6 self-center text-gray">
          <DisconnectButton
            className="text-semibold "
            onClick={() => {
              // open this link http://127.0.0.1:8000/immigrants/pdf?created_by=1 in a new tab
              // window.open("http://127.0.0.1:8000/immigrants/pdf?created_by=1");
              authContext.logOut();
            }}
          />
        </div>
      </ul>
      <section className="h-screen flex-1 overflow-y-auto px-10  pt-10">
        <Outlet />
      </section>
    </div>
  );
}
