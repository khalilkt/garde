import rim from "../assets/rim.png";
import joumhouria from "../assets/joumhouria_image.png";
import logo from "../assets/logo.jpeg";
import { useEffect, useState } from "react";

export function PrintPage({
  text,
  children,
  objectText,
  isArabic = false,
  isOnePage = null,
  signatureLeft = null,
  signatureRight = null,
  topTitle = null,
  ...divProps
}: {
  text: string;
  isArabic?: boolean;
  objectText: string | null;
  topTitle?: string | null;
  isOnePage?: boolean | null;
  signatureLeft?: string | null;
  signatureRight?: string | null;
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
        let headerHeight =
          printElement.getElementsByTagName("thead")?.[0]?.clientHeight;
        headerHeight = 0;
        const footerHeight =
          printElement.getElementsByTagName("tfoot")?.[0]?.clientHeight;
        requiredHeight -= (numberOfPage - 1) * (headerHeight + footerHeight);
        // requiredHeight = PAGE_HEIGHT * 2 - (headerHeight + footerHeight);
      }
      const headerHeight =
        printElement.getElementsByTagName("thead")?.[0]?.clientHeight;
      const footerHeight =
        printElement.getElementsByTagName("tfoot")?.[0]?.clientHeight;
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
            <div className="mb-6 flex w-full flex-row justify-between pl-4 text-xs">
              <div className="flex w-fit flex-col items-center  font-semibold leading-4">
                <h1>وزارة الصيد والبحري الإقتصاد</h1>
                <h1>Ministère des Pêche et de l'Economie Maritime</h1>

                <h1> خفر السواحل الموريتاني</h1>
                <h1>Garde-côtes Mauritaniennnes</h1>
                <img src={logo} className="mt-3 h-[60px] w-fit self-center " />
              </div>
              <div className="flex flex-col">
                <div className="ml-2 mt-1 flex w-fit flex-col  items-center pr-36 text-sm font-medium leading-4">
                  <h1 className=" font-semibold">
                    RÉPUBLIQUE ISLAMIQUE DE MAURITANIE
                  </h1>
                  <h1 className=" text-xs">Honeur - Fraternité - Justice</h1>
                </div>
                <div className="2 mt-10 flex flex-col self-end text-xs">
                  {/* after en arbae */}
                  <span>
                    {" "}
                    Nouadhibou le :
                    ............................................. نواذيبو في{" "}
                  </span>
                  <span>
                    {" "}
                    Numéro :
                    ...........................................................الرقم
                  </span>
                </div>
                {topTitle === null && (
                  <div
                    dir="ltr"
                    className="self- mt-10 self-end text-center font-medium rtl:self-start"
                  >
                    <div className="relative mb-10 ml-auto flex items-center justify-end gap-x-24  ">
                      <h1 className=" text-base font-semibold text-green-800">
                        Le Commandant
                      </h1>
                      <h1 className="text-base font-semibold text-green-800">
                        القائد
                      </h1>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`self-center  text-center font-medium`}>
            {topTitle === null &&
              (isArabic ? (
                "السيد المدير الجهوي لأمن داخلة نواذيبو"
              ) : (
                <div className="flex flex-col items-center gap-y-2">
                  <span className="text-xl font-semibold">A</span>
                  <span>
                    Monsieur le Directeur Régional de la Sureté de Dakhlet
                    Nouadhibou
                  </span>
                </div>
              ))}
          </div>
        </div>
      </thead>
      <tbody className="">
        <tr className="">
          <td className={`${topTitle !== null ? "pt-10 align-top" : ""}`}>
            <div className=" px-6">
              {(objectText || topTitle) && (
                <div
                  className={`mt-10  ${topTitle !== null ? "mb-10 self-center text-center text-2xl font-semibold" : "mb-4 self-start text-start"}`}
                >
                  {objectText && (
                    <h4 className="inline text-xl font-semibold">Objet: </h4>
                  )}
                  <span className="inline">{topTitle || objectText}</span>
                </div>
              )}
              <span className="mb-3 mt-3">{text}</span>
              <div className="">{children}</div>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot className=" text-center">
        <tr>
          <td>
            <div className="px-6">
              <div className="mt-10  flex w-full justify-between px-10 text-sm font-semibold">
                {signatureLeft !== null ? (
                  <div>
                    {signatureLeft.split("\n").map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                ) : isArabic ? (
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
                {signatureRight !== null ? (
                  <div>
                    {signatureRight.split("\n").map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                ) : isArabic ? (
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
