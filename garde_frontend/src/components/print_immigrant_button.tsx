import { useReactToPrint } from "react-to-print";
import { getImmigrantGenre, getImmigrantSejour } from "../models/utils";
import { ImmigrantInterface } from "../ROUTES/admin/agent&admin_immigrants_page";
import { useRef } from "react";

function getImmigrantCriminalRecord(imm: ImmigrantInterface) {
  const vv = {
    killer: "Tueur",
    thief: "Voleur",
    danger: "Dangereux",
    theft: "Vol",
    homocide: "Homicide",
    torture: "Torture",
    human_trafficking: "Traite des êtres humains",
    other: "Autre",
  };

  if (!imm.criminal_record) {
    return "-";
  }
  return vv[imm.criminal_record] ?? "-";
}

function getImmigrantEtats(imm: ImmigrantInterface) {
  const vv = {
    alive: "Vivant",
    dead: "Mort",
    sick_evacuation: "Evacuation Sanitaire",
    pregnant: "Enceinte",
  };

  if (!imm.etat) {
    return "-";
  }
  return vv[imm.etat as keyof typeof vv] ?? "-";
}

function InfoTable({
  title,
  data,
}: {
  title: string;
  data: { [key: string]: string };
}) {
  return (
    <table className="w-full text-center text-lg">
      <thead>
        <tr className=" border bg-slate-200 text-center">
          <th colSpan={2} className="px-2 py-1 text-center">
            {title}
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([key, value]) => {
          let isNote = false;
          if (key.startsWith("__")) {
            key = key.substring(2);
            isNote = true;
          }
          if (isNote) {
            return (
              <>
                <tr key={key} className="border-x border-t font-semibold">
                  <td colSpan={2} className="px-2 py-1 text-left">
                    {key}
                  </td>
                </tr>
                <tr key={key + "__"} className="border-x border-b">
                  <td colSpan={2} className="px-2 py-1 text-left">
                    {value}
                  </td>
                </tr>
              </>
            );
          } else {
            return (
              <tr key={key} className="border">
                <td className="px-2 py-1 text-left font-semibold">{key}</td>
                <td className="px-2 py-1 text-left">{value}</td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}

export default function PrintImmigrantButton({
  immigrant,
}: {
  immigrant: ImmigrantInterface;
}) {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    onBeforeGetContent() {},
    content: () => {
      return printRef.current;
    },
    onAfterPrint: () => {},
  });

  return (
    <button
      onClick={() => {
        handlePrint();
      }}
      className=" transition-all duration-100 active:scale-90"
    >
      <div ref={printRef} className="hidden px-12 pt-12 print:block">
        <div className="flex flex-col gap-y-6">
          <h2 className="mb-4 text-center text-3xl font-semibold">
            {immigrant.name}
          </h2>
          {immigrant.image && (
            <img
              onClick={() => {}}
              className=" mb-4 h-24 w-24 self-center rounded-full"
              src={immigrant.image.replace("http://", "https://")}
              //   src={
              //     "https://play-lh.googleusercontent.com/jA5PwYqtmoFS7StajBe2EawN4C8WDdltO68JcsrvYKSuhjcTap5QMETkloXSq5soqRBqFjuTAhh28AYrA6A=w240-h480-rw"
              //   }
            />
          )}
          <InfoTable
            title="Informations Personnelles"
            data={{
              Nom: immigrant.name,
              "Date de naissance":
                immigrant.date_of_birth?.replaceAll("-", "/") ?? "-",
              Âge: immigrant.age?.toString() ?? "-",
              Sexe: getImmigrantGenre(immigrant),
              Nationalité: immigrant.nationality_name,
              "Pays de naissance": immigrant.birth_country_name,
              État: getImmigrantEtats(immigrant),
              "NNI/NP": immigrant.cin ?? "-",
              "Numero de telephone": immigrant.phone ?? "-",
            }}
          />
          <InfoTable
            title="Informations sur la Pirogue et Séjour"
            data={{
              "Numéro de la pirogue": immigrant.pirogue_number ?? "-",
              Séjour: getImmigrantSejour(immigrant),
            }}
          />
          <InfoTable
            title="Statut Légal"
            data={{
              "Casier judiciaire": getImmigrantCriminalRecord(immigrant),
              __Note: immigrant.criminal_note ?? "-",
            }}
          />
          <InfoTable
            title="Détails Administratifs"
            data={{
              "Créer par": immigrant.created_by_name,
              "Date de création": immigrant.created_at
                .split("T")[0]
                .replaceAll("-", "/"),
            }}
          />
        </div>
      </div>
      <svg
        width="20"
        height="18"
        viewBox="0 0 20 18"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 fill-[#888888]"
      >
        <path
          d="M6.3335 17.25C5.82933 17.25 5.39773 17.0705 5.0387 16.7115C4.67968 16.3524 4.50016 15.9208 4.50016 15.4167V13.5833H2.66683C2.16266 13.5833 1.73107 13.4038 1.37204 13.0448C1.01301 12.6858 0.833496 12.2542 0.833496 11.75V8.08333C0.833496 7.30417 1.10086 6.65104 1.63558 6.12396C2.1703 5.59688 2.81961 5.33333 3.5835 5.33333H16.4168C17.196 5.33333 17.8491 5.59688 18.3762 6.12396C18.9033 6.65104 19.1668 7.30417 19.1668 8.08333V11.75C19.1668 12.2542 18.9873 12.6858 18.6283 13.0448C18.2693 13.4038 17.8377 13.5833 17.3335 13.5833H15.5002V15.4167C15.5002 15.9208 15.3206 16.3524 14.9616 16.7115C14.6026 17.0705 14.171 17.25 13.6668 17.25H6.3335ZM2.66683 11.75H4.50016C4.50016 11.2458 4.67968 10.8142 5.0387 10.4552C5.39773 10.0962 5.82933 9.91667 6.3335 9.91667H13.6668C14.171 9.91667 14.6026 10.0962 14.9616 10.4552C15.3206 10.8142 15.5002 11.2458 15.5002 11.75H17.3335V8.08333C17.3335 7.82361 17.2456 7.6059 17.07 7.43021C16.8943 7.25451 16.6766 7.16667 16.4168 7.16667H3.5835C3.32377 7.16667 3.10607 7.25451 2.93037 7.43021C2.75468 7.6059 2.66683 7.82361 2.66683 8.08333V11.75ZM13.6668 5.33333V2.58333H6.3335V5.33333H4.50016V2.58333C4.50016 2.07917 4.67968 1.64757 5.0387 1.28854C5.39773 0.929514 5.82933 0.75 6.3335 0.75H13.6668C14.171 0.75 14.6026 0.929514 14.9616 1.28854C15.3206 1.64757 15.5002 2.07917 15.5002 2.58333V5.33333H13.6668ZM15.5002 9.45833C15.7599 9.45833 15.9776 9.37049 16.1533 9.19479C16.329 9.0191 16.4168 8.80139 16.4168 8.54167C16.4168 8.28194 16.329 8.06424 16.1533 7.88854C15.9776 7.71285 15.7599 7.625 15.5002 7.625C15.2404 7.625 15.0227 7.71285 14.847 7.88854C14.6713 8.06424 14.5835 8.28194 14.5835 8.54167C14.5835 8.80139 14.6713 9.0191 14.847 9.19479C15.0227 9.37049 15.2404 9.45833 15.5002 9.45833ZM13.6668 15.4167V11.75H6.3335V15.4167H13.6668Z"
          fill="parent"
        />
      </svg>
    </button>
  );
}
