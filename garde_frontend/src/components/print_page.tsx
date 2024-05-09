import rim from "../assets/rim.png";
import joumhouria from "../assets/joumhouria_image.png";

export function PrintPage({
  text,
  children,
  ...divProps
}: {
  text: string;
  children: React.ReactNode;
} & React.HTMLProps<HTMLDivElement> & {
    divProps?: React.HTMLProps<HTMLDivElement>;
  }) {
  return (
    // <table className="print-component">
    //   <thead>
    //     <tr>
    //       <th>
    //         <div className="flex flex-col px-6 pb-10 pt-10">
    //           <img src={joumhouria} className="w-96 self-end pr-36" />

    //           <div className="relative my-2 flex w-full flex-col self-center">
    //             <hr className="-mx-6 w-full self-center border-[1.5px]  border-[#006400]" />
    //             <hr className="-mx-6 w-full self-center border-[1.5px] border-[#FFD700]" />

    //             <hr className="-mx-6 w-full self-center border-[1.5px] border-[#FF0000] " />
    //             <img
    //               src={rim}
    //               className="absolute inset-y-0 right-4 h-24 w-24 -translate-y-12 "
    //             />
    //           </div>
    //           <div className="mb-6 flex w-full flex-row justify-between pl-4 pr-36 text-xs">
    //             <div className="flex w-fit flex-col  items-center  font-semibold leading-4">
    //               <h1>وزارة الصيد والبحري الإقتصاد</h1>
    //               <h1>Ministère des Pêche et de l'Economie</h1>
    //               <h1 className="mt-2 border-b border-b-black">Maritime</h1>

    //               <h1> خفر السواحل الموريتاني</h1>
    //               <h1>Garde-côtes Mauritaniennnes</h1>
    //             </div>
    //             <div className="ml-2 mt-1 flex w-fit  flex-col  items-center text-sm font-medium leading-4">
    //               <h1 className=" font-semibold">
    //                 RÉPUBLIQUE ISLAMIQUE DE MAURITANIE
    //               </h1>
    //               <h1 className=" text-xs">Honeur - Fraternité - Justice</h1>
    //             </div>
    //           </div>
    //         </div>
    //       </th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     <tr>
    //       <td>
    //         <div className="2 flex flex-col self-end text-xs">
    //           <span>
    //             {" "}
    //             Nouadhibou le : .............................................
    //             نواذيبو في{" "}
    //           </span>
    //           <span>
    //             {" "}
    //             Numéro :
    //             ...........................................................الرقم
    //           </span>
    //         </div>
    //         <div className="mt-10 self-center text-center font-medium">
    //           <div className="relative flex items-center justify-center">
    //             <h1 className="text-xl font-semibold">A</h1>
    //             <h1 className="absolute right-0 top-0 text-xl font-semibold text-green-800">
    //               Le Commandant
    //             </h1>
    //             {/* en arabe */}
    //             <h1 className="absolute -right-24 top-0 text-xl font-semibold text-green-800">
    //               القائد
    //             </h1>
    //           </div>
    //           <span>
    //             Monsieur le Directeur Régional de la Sureté de Dakhlet
    //             Nouadhibou
    //           </span>
    //         </div>
    //         <div className=" mt-10 self-start">
    //           <h4 className="inline text-xl font-semibold">Objet: </h4>
    //           <span className="inline">Migration irrégulière</span>
    //         </div>
    //         <span className="mb-3 mt-3 self-start">{text}</span>
    //         <div className="self-center px-24">{children}</div>
    //         <div className="mt-10 flex w-full justify-between px-10 text-sm font-semibold">
    //           <div className="flex flex-col items-start">
    //             <span>Ampliations :</span>
    //             <span>-DSP</span>
    //             <span>-Avocat de la GCM (Maître Zeini)</span>
    //             <span>-ARC</span>
    //           </div>
    //           <div className="flex flex-col items-start">
    //             <span>CV Cheikh HAMETYLEHMOUD</span>
    //             <span>Et par délégation</span>
    //             <span>CF Ahmed MOULAYE</span>
    //           </div>
    //         </div>
    //       </td>
    //     </tr>
    //   </tbody>
    //   <tfoot className="table-footer ">
    //     <tr>
    //       <div className="w-full flex-col items-center">
    //         <hr className="border-1 w-full" />
    //         <span className="w-full text-center">
    //           Tél: +222 22 08 49 11 - Mail : gcm@gcm.mr - BP : 260 Nouadhibou -
    //           Mauritania
    //         </span>
    //       </div>
    //     </tr>
    //   </tfoot>
    // </table>

    <div className={`mx-6 flex flex-col pb-10 pt-10  ${divProps.className}`}>
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
          <h1 className=" font-semibold">RÉPUBLIQUE ISLAMIQUE DE MAURITANIE</h1>
          <h1 className=" text-xs">Honeur - Fraternité - Justice</h1>
        </div>
      </div>
      <div className="2 flex flex-col self-end text-xs">
        {/* after en arbae */}
        <span>
          {" "}
          Nouadhibou le : ............................................. نواذيبو
          في{" "}
        </span>
        <span>
          {" "}
          Numéro :
          ...........................................................الرقم
        </span>
      </div>
      <div className="mt-10 self-center text-center font-medium">
        <div className="relative flex items-center justify-center">
          <h1 className="text-xl font-semibold">A</h1>
          <h1 className="absolute right-0 top-0 text-xl font-semibold text-green-800">
            Le Commandant
          </h1>
          {/* en arabe */}
          <h1 className="absolute -right-24 top-0 text-xl font-semibold text-green-800">
            القائد
          </h1>
        </div>
        <span>
          Monsieur le Directeur Régional de la Sureté de Dakhlet Nouadhibou
        </span>
      </div>
      <div className=" mt-10 self-start">
        <h4 className="inline text-xl font-semibold">Objet: </h4>
        <span className="inline">Migration irrégulière</span>
      </div>
      <span className="mb-3 mt-3 self-start">{text}</span>
      <div className="self-center px-24">{children}</div>
      <div className="mt-10 flex w-full justify-between px-10 text-sm font-semibold">
        <div className="flex flex-col items-start">
          <span>Ampliations :</span>
          <span>-DSP</span>
          <span>-Avocat de la GCM (Maître Zeini)</span>
          <span>-ARC</span>
        </div>
        <div className="flex flex-col items-start">
          <span>CV Cheikh HAMETYLEHMOUD</span>
          <span>Et par délégation</span>
          <span>CF Ahmed MOULAYE</span>
        </div>
      </div>

      <hr className="border-1 mt-10 w-full" />
      <span className="mx-auto w-full self-center text-center">
        Tél: +222 22 08 49 11 - Mail : gcm@gcm.mr - BP : 260 Nouadhibou -
        Mauritania
      </span>
    </div>
  );
}
