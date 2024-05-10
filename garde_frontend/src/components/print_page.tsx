import rim from "../assets/rim.png";
import joumhouria from "../assets/joumhouria_image.png";

export function PrintPage({
  text,
  children,
  objectText,
  isArabic = false,
  ...divProps
}: {
  text: string;
  isArabic?: boolean;
  objectText: string | null;
  children: React.ReactNode;
} & React.HTMLProps<HTMLDivElement> & {
    divProps?: React.HTMLProps<HTMLDivElement>;
  }) {
  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`mx-6 flex flex-col pb-10 pt-10  ${divProps.className}`}
    >
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
      {objectText && (
        <div className=" mt-10 self-start">
          <h4 className="inline text-xl font-semibold">Objet: </h4>
          <span className="inline">{objectText}</span>
        </div>
      )}
      <span className="mb-3 mt-3 self-start">{text}</span>
      <div className="self-center px-24">{children}</div>
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
            العقيد البحري <br /> الشيخ حتمي لحمود <br /> وبالنيابة <br />
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
        Tél: +222 22 08 49 11 - Mail : gcm@gcm.mr - BP : 260 Nouadhibou -
        Mauritania
      </span>
    </div>
  );
}
