import rim from "../assets/rim.png";
import joumhouria from "../assets/joumhouria_image.png";
import { useEffect, useState } from "react";

export function PrintPage({
  text,
  children,
  objectText,
  isArabic = false,
  isOnePage = null,
  ...divProps
}: {
  text: string;
  isArabic?: boolean;
  objectText: string | null;
  isOnePage?: boolean | null;
  children: React.ReactNode;
} & React.HTMLProps<HTMLDivElement> & {
    divProps?: React.HTMLProps<HTMLDivElement>;
  }) {
  // const [height, setHeight] = useState<number | null>(null);

  const handleResize = () => {
    const PAGE_HEIGHT = 29.7 * 37.7952755906;
    const printElement = document.getElementById("print-component");
    if (printElement) {
      printElement.style.height = `auto`;
      let height = printElement.clientHeight;
      const numberOfPage = Math.ceil(height / PAGE_HEIGHT);
      const heightWithSingleHeader = numberOfPage * PAGE_HEIGHT;
      let requiredHeight = heightWithSingleHeader;
      if (numberOfPage > 1) {
        const headerHeight =
          printElement.getElementsByTagName("thead")?.[0]?.clientHeight;
        const footerHeight =
          printElement.getElementsByTagName("tfoot")?.[0]?.clientHeight;
        requiredHeight -= (numberOfPage - 1) * (headerHeight + footerHeight);
      }

      // printElement.style.height = `${numberOfPage * PAGE_HEIGHT}px`;
      printElement.style.height = `${requiredHeight}px`;
    }
  };

  useEffect(() => {
    handleResize();
  }, [children, objectText, text, isArabic, divProps]);

  return (
    <table
      id="print-component"
      dir={isArabic ? "rtl" : "ltr"}
      className={` table w-[793px] flex-col overflow-x-clip  ${isOnePage ? "h-[1122.51968504082px]" : ""}  ${divProps.className}}`}
    >
      <thead className="">
        <div className="px-6 pt-10">
          <div dir="ltr" className="flex flex-col">
            <img src={joumhouria} className="w-96 self-end pr-36" />

            <div className="relative my-2 flex w-full flex-col self-center">
              <hr className="-mx-6 w-full self-center border-[1.5px]  border-[#006400]" />
              <hr className="-mx-6 w-full self-center border-[1.5px] border-[#FFD700]" />

              <hr className="-mx-6 w-full self-center border-[1.5px] border-[#FF0000] " />
              <img
                src={rim}
                className="absolute inset-y-0 right-4 h-24 w-24 -translate-y-12 "
              />
            </div>
            <div className="mb-6 flex w-full flex-row justify-between pl-4 pr-36 text-xs">
              <div className="flex w-fit flex-col  items-center  font-semibold leading-4">
                <h1>وزارة الصيد والبحري الإقتصاد</h1>
                <h1>Ministère des Pêche et de l'Economie</h1>
                <h1 className="mt-2 border-b border-b-black">Maritime</h1>

                <h1> خفر السواحل الموريتاني</h1>
                <h1>Garde-côtes Mauritaniennnes</h1>
              </div>
              <div className="ml-2 mt-1 flex w-fit  flex-col  items-center text-sm font-medium leading-4">
                <h1 className=" font-semibold">
                  RÉPUBLIQUE ISLAMIQUE DE MAURITANIE
                </h1>
                <h1 className=" text-xs">Honeur - Fraternité - Justice</h1>
              </div>
            </div>
            <div className="2 flex flex-col self-end text-xs">
              {/* after en arbae */}
              <span>
                {" "}
                Nouadhibou le : .............................................
                نواذيبو في{" "}
              </span>
              <span>
                {" "}
                Numéro :
                ...........................................................الرقم
              </span>
            </div>
          </div>

          <div
            dir="ltr"
            className="self- mr-20 mt-10 self-end text-center font-medium rtl:self-start"
          >
            <div className="relative mb-10 ml-auto flex items-center justify-end gap-x-32 self-end ">
              {!isArabic && <h1 className="text-xl font-semibold">A</h1>}
              <h1 className=" text-xl font-semibold text-green-800">
                Le Commandant
              </h1>
              <h1 className=" text-xl font-semibold text-green-800">القائد</h1>
            </div>
          </div>
          <span className="self-center font-medium">
            {isArabic
              ? "السيد المدير الجهوي لأمن داخلة نواذيبو"
              : "Monsieur le Directeur Régional de la Sureté de Dakhlet Nouadhibou"}
          </span>
        </div>
      </thead>
      <tbody>
        <tr>
          <td>
            <div className="px-6">
              {objectText && (
                <div className=" mt-10 self-start">
                  <h4 className="inline text-xl font-semibold">Objet: </h4>
                  <span className="inline">{objectText}</span>
                </div>
              )}
              <span className="t mb-3 mt-3">{text}</span>
              <div className="">{children}</div>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot className=" text-center">
        <tr>
          <td>
            <div className="px-6">
              <div className="mt-10 flex w-full justify-between px-10 text-sm font-semibold">
                {isArabic ? (
                  <div className="flex flex-col">
                    توزيع <br /> والي داخلت نواذيبو
                    <br /> الأرشيف
                    <br /> محامي خفر السواحل
                  </div>
                ) : (
                  <div className="flex flex-col items-start">
                    <span>Ampliations :</span>
                    <span>-DSP</span>
                    <span>-Avocat de la GCM (Maître Zeini)</span>
                    <span>-ARC</span>
                  </div>
                )}
                {isArabic ? (
                  <div>
                    العقيد البحري <br /> الشيخ حتمي لحمود <br /> وبالنيابة{" "}
                    <br />
                    المقدم البحري <br /> أحمد مولاي{" "}
                  </div>
                ) : (
                  <div className="flex flex-col items-start">
                    <span>CV Cheikh HAMETYLEHMOUD</span>
                    <span>Et par délégation</span>
                    <span>CF Ahmed MOULAYE</span>
                  </div>
                )}
              </div>

              <hr className="border-1 mt-10 w-full" />
              <span className="mx-auto w-full self-center text-center">
                Tél: +222 22 08 49 11 - Mail : gcm@gcm.mr - BP : 260 Nouadhibou
                - Mauritania
              </span>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
