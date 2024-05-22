export function FilterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 17.25C8.74028 17.25 8.52257 17.1622 8.34688 16.9865C8.17118 16.8108 8.08333 16.5931 8.08333 16.3333V12.6667C8.08333 12.4069 8.17118 12.1892 8.34688 12.0135C8.52257 11.8378 8.74028 11.75 9 11.75C9.25972 11.75 9.47743 11.8378 9.65312 12.0135C9.82882 12.1892 9.91667 12.4069 9.91667 12.6667V13.5833H16.3333C16.5931 13.5833 16.8108 13.6712 16.9865 13.8469C17.1622 14.0226 17.25 14.2403 17.25 14.5C17.25 14.7597 17.1622 14.9774 16.9865 15.1531C16.8108 15.3288 16.5931 15.4167 16.3333 15.4167H9.91667V16.3333C9.91667 16.5931 9.82882 16.8108 9.65312 16.9865C9.47743 17.1622 9.25972 17.25 9 17.25ZM1.66667 15.4167C1.40694 15.4167 1.18924 15.3288 1.01354 15.1531C0.837847 14.9774 0.75 14.7597 0.75 14.5C0.75 14.2403 0.837847 14.0226 1.01354 13.8469C1.18924 13.6712 1.40694 13.5833 1.66667 13.5833H5.33333C5.59306 13.5833 5.81076 13.6712 5.98646 13.8469C6.16215 14.0226 6.25 14.2403 6.25 14.5C6.25 14.7597 6.16215 14.9774 5.98646 15.1531C5.81076 15.3288 5.59306 15.4167 5.33333 15.4167H1.66667ZM5.33333 11.75C5.07361 11.75 4.8559 11.6622 4.68021 11.4865C4.50451 11.3108 4.41667 11.0931 4.41667 10.8333V9.91667H1.66667C1.40694 9.91667 1.18924 9.82882 1.01354 9.65312C0.837847 9.47743 0.75 9.25972 0.75 9C0.75 8.74028 0.837847 8.52257 1.01354 8.34688C1.18924 8.17118 1.40694 8.08333 1.66667 8.08333H4.41667V7.16667C4.41667 6.90694 4.50451 6.68924 4.68021 6.51354C4.8559 6.33785 5.07361 6.25 5.33333 6.25C5.59306 6.25 5.81076 6.33785 5.98646 6.51354C6.16215 6.68924 6.25 6.90694 6.25 7.16667V10.8333C6.25 11.0931 6.16215 11.3108 5.98646 11.4865C5.81076 11.6622 5.59306 11.75 5.33333 11.75ZM9 9.91667C8.74028 9.91667 8.52257 9.82882 8.34688 9.65312C8.17118 9.47743 8.08333 9.25972 8.08333 9C8.08333 8.74028 8.17118 8.52257 8.34688 8.34688C8.52257 8.17118 8.74028 8.08333 9 8.08333H16.3333C16.5931 8.08333 16.8108 8.17118 16.9865 8.34688C17.1622 8.52257 17.25 8.74028 17.25 9C17.25 9.25972 17.1622 9.47743 16.9865 9.65312C16.8108 9.82882 16.5931 9.91667 16.3333 9.91667H9ZM12.6667 6.25C12.4069 6.25 12.1892 6.16215 12.0135 5.98646C11.8378 5.81076 11.75 5.59306 11.75 5.33333V1.66667C11.75 1.40694 11.8378 1.18924 12.0135 1.01354C12.1892 0.837847 12.4069 0.75 12.6667 0.75C12.9264 0.75 13.1441 0.837847 13.3198 1.01354C13.4955 1.18924 13.5833 1.40694 13.5833 1.66667V2.58333H16.3333C16.5931 2.58333 16.8108 2.67118 16.9865 2.84687C17.1622 3.02257 17.25 3.24028 17.25 3.5C17.25 3.75972 17.1622 3.97743 16.9865 4.15313C16.8108 4.32882 16.5931 4.41667 16.3333 4.41667H13.5833V5.33333C13.5833 5.59306 13.4955 5.81076 13.3198 5.98646C13.1441 6.16215 12.9264 6.25 12.6667 6.25ZM1.66667 4.41667C1.40694 4.41667 1.18924 4.32882 1.01354 4.15313C0.837847 3.97743 0.75 3.75972 0.75 3.5C0.75 3.24028 0.837847 3.02257 1.01354 2.84687C1.18924 2.67118 1.40694 2.58333 1.66667 2.58333H9C9.25972 2.58333 9.47743 2.67118 9.65312 2.84687C9.82882 3.02257 9.91667 3.24028 9.91667 3.5C9.91667 3.75972 9.82882 3.97743 9.65312 4.15313C9.47743 4.32882 9.25972 4.41667 9 4.41667H1.66667Z"
        fill="white"
      />
    </svg>
  );
}

export function LoadingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={" h-7 w-7 animate-spin stroke-white " + className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612"
          stroke="parent"
          stroke-width="3.55556"
          stroke-linecap="round"
        ></path>{" "}
      </g>
    </svg>
  );
}
export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={"fill-primary " + className}
    >
      <path
        d="M6.08325 7.91665H1.49992C1.2402 7.91665 1.02249 7.8288 0.846794 7.6531C0.671099 7.47741 0.583252 7.2597 0.583252 6.99998C0.583252 6.74026 0.671099 6.52255 0.846794 6.34685C1.02249 6.17116 1.2402 6.08331 1.49992 6.08331H6.08325V1.49998C6.08325 1.24026 6.1711 1.02255 6.34679 0.846855C6.52249 0.67116 6.7402 0.583313 6.99992 0.583313C7.25964 0.583313 7.47735 0.67116 7.65304 0.846855C7.82874 1.02255 7.91658 1.24026 7.91658 1.49998V6.08331H12.4999C12.7596 6.08331 12.9773 6.17116 13.153 6.34685C13.3287 6.52255 13.4166 6.74026 13.4166 6.99998C13.4166 7.2597 13.3287 7.47741 13.153 7.6531C12.9773 7.8288 12.7596 7.91665 12.4999 7.91665H7.91658V12.5C7.91658 12.7597 7.82874 12.9774 7.65304 13.1531C7.47735 13.3288 7.25964 13.4166 6.99992 13.4166C6.7402 13.4166 6.52249 13.3288 6.34679 13.1531C6.1711 12.9774 6.08325 12.7597 6.08325 12.5V7.91665Z"
        fill="inherit"
      />
    </svg>
  );
}

export function MoreIcon() {
  return (
    <svg
      width="4"
      height="16"
      viewBox="0 0 4 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14C0 13.45 0.195833 12.9792 0.5875 12.5875C0.979167 12.1958 1.45 12 2 12C2.55 12 3.02083 12.1958 3.4125 12.5875C3.80417 12.9792 4 13.45 4 14C4 14.55 3.80417 15.0208 3.4125 15.4125C3.02083 15.8042 2.55 16 2 16ZM2 10C1.45 10 0.979167 9.80417 0.5875 9.4125C0.195833 9.02083 0 8.55 0 8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6C2.55 6 3.02083 6.19583 3.4125 6.5875C3.80417 6.97917 4 7.45 4 8C4 8.55 3.80417 9.02083 3.4125 9.4125C3.02083 9.80417 2.55 10 2 10ZM2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4Z"
        fill="#888888"
      />
    </svg>
  );
}

export function AgentsIcon() {
  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      className=" fill-inherit"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V13.2ZM20 16H17.45C17.6333 15.7 17.7708 15.3792 17.8625 15.0375C17.9542 14.6958 18 14.35 18 14V13C18 12.2667 17.7958 11.5625 17.3875 10.8875C16.9792 10.2125 16.4 9.63333 15.65 9.15C16.5 9.25 17.3 9.42083 18.05 9.6625C18.8 9.90417 19.5 10.2 20.15 10.55C20.75 10.8833 21.2083 11.2542 21.525 11.6625C21.8417 12.0708 22 12.5167 22 13V14C22 14.55 21.8042 15.0208 21.4125 15.4125C21.0208 15.8042 20.55 16 20 16ZM8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM18 4C18 5.1 17.6083 6.04167 16.825 6.825C16.0417 7.60833 15.1 8 14 8C13.8167 8 13.5833 7.97917 13.3 7.9375C13.0167 7.89583 12.7833 7.85 12.6 7.8C13.05 7.26667 13.3958 6.675 13.6375 6.025C13.8792 5.375 14 4.7 14 4C14 3.3 13.8792 2.625 13.6375 1.975C13.3958 1.325 13.05 0.733333 12.6 0.2C12.8333 0.116667 13.0667 0.0625 13.3 0.0375C13.5333 0.0125 13.7667 0 14 0C15.1 0 16.0417 0.391667 16.825 1.175C17.6083 1.95833 18 2.9 18 4ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z" />
    </svg>
  );
}

// stats
export function StatsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className=" fill-inherit"
    >
      <path d="M5 9C4.71667 9 4.47917 9.09583 4.2875 9.2875C4.09583 9.47917 4 9.71667 4 10V13C4 13.2833 4.09583 13.5208 4.2875 13.7125C4.47917 13.9042 4.71667 14 5 14C5.28333 14 5.52083 13.9042 5.7125 13.7125C5.90417 13.5208 6 13.2833 6 13V10C6 9.71667 5.90417 9.47917 5.7125 9.2875C5.52083 9.09583 5.28333 9 5 9ZM13 4C12.7167 4 12.4792 4.09583 12.2875 4.2875C12.0958 4.47917 12 4.71667 12 5V13C12 13.2833 12.0958 13.5208 12.2875 13.7125C12.4792 13.9042 12.7167 14 13 14C13.2833 14 13.5208 13.9042 13.7125 13.7125C13.9042 13.5208 14 13.2833 14 13V5C14 4.71667 13.9042 4.47917 13.7125 4.2875C13.5208 4.09583 13.2833 4 13 4ZM9 11C8.71667 11 8.47917 11.0958 8.2875 11.2875C8.09583 11.4792 8 11.7167 8 12V13C8 13.2833 8.09583 13.5208 8.2875 13.7125C8.47917 13.9042 8.71667 14 9 14C9.28333 14 9.52083 13.9042 9.7125 13.7125C9.90417 13.5208 10 13.2833 10 13V12C10 11.7167 9.90417 11.4792 9.7125 11.2875C9.52083 11.0958 9.28333 11 9 11ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM2 16H16V2H2V16ZM9 9C9.28333 9 9.52083 8.90417 9.7125 8.7125C9.90417 8.52083 10 8.28333 10 8C10 7.71667 9.90417 7.47917 9.7125 7.2875C9.52083 7.09583 9.28333 7 9 7C8.71667 7 8.47917 7.09583 8.2875 7.2875C8.09583 7.47917 8 7.71667 8 8C8 8.28333 8.09583 8.52083 8.2875 8.7125C8.47917 8.90417 8.71667 9 9 9Z" />
    </svg>
  );
}

export function PiroguesIcon() {
  return (
    <svg
      width="17"
      height="23"
      viewBox="0 0 17 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=" fill-inherit"
    >
      <path d="M13.2998 22.3L11.2998 20.3C11.1998 20.2 11.1248 20.0875 11.0748 19.9625C11.0248 19.8375 10.9998 19.7083 10.9998 19.575V18.5L3.89981 11.4C3.7498 11.4333 3.5998 11.4583 3.44981 11.475C3.2998 11.4917 3.1498 11.5 2.9998 11.5V9.3C3.83314 9.33333 4.68314 9.15417 5.54981 8.7625C6.41647 8.37083 7.11647 7.88333 7.64981 7.3L9.04981 5.75C9.26647 5.5 9.52064 5.3125 9.81231 5.1875C10.104 5.0625 10.4165 5 10.7498 5C11.3831 5 11.9165 5.21667 12.3498 5.65C12.7831 6.08333 12.9998 6.61667 12.9998 7.25V13C12.9998 13.4333 12.9206 13.8292 12.7623 14.1875C12.604 14.5458 12.3831 14.8667 12.0998 15.15L8.49981 11.6V9.3C8.16647 9.58333 7.80814 9.84167 7.42481 10.075C7.04147 10.3083 6.63314 10.5167 6.19981 10.7L12.4998 17H13.5748C13.7081 17 13.8373 17.025 13.9623 17.075C14.0873 17.125 14.1998 17.2 14.2998 17.3L16.2998 19.3C16.4998 19.5 16.5998 19.7333 16.5998 20C16.5998 20.2667 16.4998 20.5 16.2998 20.7L14.6998 22.3C14.4998 22.5 14.2665 22.6 13.9998 22.6C13.7331 22.6 13.4998 22.5 13.2998 22.3ZM4.9998 16L2.2498 18.75C2.03314 18.9667 1.78314 19.075 1.4998 19.075C1.21647 19.075 0.966471 18.9667 0.749805 18.75C0.533138 18.5333 0.424805 18.2833 0.424805 18C0.424805 17.7167 0.533138 17.4667 0.749805 17.25L4.4998 13.5L6.99981 16H4.9998ZM10.9998 4C10.4498 4 9.97897 3.80417 9.58731 3.4125C9.19564 3.02083 8.99981 2.55 8.99981 2C8.99981 1.45 9.19564 0.979167 9.58731 0.5875C9.97897 0.195833 10.4498 0 10.9998 0C11.5498 0 12.0206 0.195833 12.4123 0.5875C12.804 0.979167 12.9998 1.45 12.9998 2C12.9998 2.55 12.804 3.02083 12.4123 3.4125C12.0206 3.80417 11.5498 4 10.9998 4ZM2.9998 11.5C2.6998 11.5 2.44147 11.3917 2.2248 11.175C2.00814 10.9583 1.8998 10.7 1.8998 10.4C1.8998 10.1 2.00814 9.84167 2.2248 9.625C2.44147 9.40833 2.6998 9.3 2.9998 9.3C3.2998 9.3 3.55814 9.40833 3.77481 9.625C3.99147 9.84167 4.09981 10.1 4.09981 10.4C4.09981 10.7 3.99147 10.9583 3.77481 11.175C3.55814 11.3917 3.2998 11.5 2.9998 11.5Z" />
    </svg>
  );
}

export function ImmigrantIcon({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="22"
      viewBox="0 0 15 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? " fill-inherit"}
    >
      <path d="M6.9001 14L5.2751 21.2C5.2251 21.4333 5.10426 21.625 4.9126 21.775C4.72093 21.925 4.5001 22 4.2501 22C3.91676 22 3.6501 21.875 3.4501 21.625C3.2501 21.375 3.18343 21.0917 3.2501 20.775L6.0751 6.45C6.1751 5.96667 6.4001 5.60417 6.7501 5.3625C7.1001 5.12083 7.46676 5 7.8501 5C8.23343 5 8.5876 5.08333 8.9126 5.25C9.2376 5.41667 9.5001 5.66667 9.7001 6L10.7001 7.6C11.0001 8.08333 11.3876 8.52083 11.8626 8.9125C12.3376 9.30417 12.8834 9.59167 13.5001 9.775V8.75C13.5001 8.53333 13.5709 8.35417 13.7126 8.2125C13.8543 8.07083 14.0334 8 14.2501 8C14.4668 8 14.6459 8.07083 14.7876 8.2125C14.9293 8.35417 15.0001 8.53333 15.0001 8.75V21.25C15.0001 21.4667 14.9293 21.6458 14.7876 21.7875C14.6459 21.9292 14.4668 22 14.2501 22C14.0334 22 13.8543 21.9292 13.7126 21.7875C13.5709 21.6458 13.5001 21.4667 13.5001 21.25V11.85C12.7001 11.6667 11.9584 11.375 11.2751 10.975C10.5918 10.575 10.0001 10.0833 9.5001 9.5L8.9001 12.5L10.7001 14.2C10.8001 14.3 10.8751 14.4125 10.9251 14.5375C10.9751 14.6625 11.0001 14.7917 11.0001 14.925V21C11.0001 21.2833 10.9043 21.5208 10.7126 21.7125C10.5209 21.9042 10.2834 22 10.0001 22C9.71676 22 9.47926 21.9042 9.2876 21.7125C9.09593 21.5208 9.0001 21.2833 9.0001 21V16L6.9001 14ZM2.4501 11.95L1.3001 11.725C1.03343 11.675 0.825098 11.5375 0.675098 11.3125C0.525098 11.0875 0.475098 10.8333 0.525098 10.55L1.2751 6.625C1.3751 6.05833 1.6751 5.62917 2.1751 5.3375C2.6751 5.04583 3.21676 4.95833 3.8001 5.075C4.08343 5.125 4.29593 5.2625 4.4376 5.4875C4.57926 5.7125 4.6251 5.96667 4.5751 6.25L3.6251 11.15C3.5751 11.4333 3.4376 11.65 3.2126 11.8C2.9876 11.95 2.73343 12 2.4501 11.95ZM9.5001 4.5C8.9501 4.5 8.47926 4.30417 8.0876 3.9125C7.69593 3.52083 7.5001 3.05 7.5001 2.5C7.5001 1.95 7.69593 1.47917 8.0876 1.0875C8.47926 0.695833 8.9501 0.5 9.5001 0.5C10.0501 0.5 10.5209 0.695833 10.9126 1.0875C11.3043 1.47917 11.5001 1.95 11.5001 2.5C11.5001 3.05 11.3043 3.52083 10.9126 3.9125C10.5209 4.30417 10.0501 4.5 9.5001 4.5Z" />
    </svg>
  );
}

export function MigrationIrregulierIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      className={className ?? " fill-inherit"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5.00011 19V6.775C3.61678 6.40833 2.48761 5.675 1.61261 4.575C0.737612 3.475 0.216778 2.225 0.0501116 0.825C0.0167783 0.591667 0.100112 0.395833 0.300112 0.2375C0.500112 0.0791667 0.733445 0 1.00011 0C1.26678 0 1.50011 0.0708333 1.70011 0.2125C1.90011 0.354167 2.01678 0.55 2.05011 0.8C2.23344 2 2.75011 3 3.60011 3.8C4.45011 4.6 5.50011 5 6.75011 5H9.25011C9.75011 5 10.2168 5.09167 10.6501 5.275C11.0834 5.45833 11.4751 5.725 11.8251 6.075L15.6501 9.9C15.8334 10.0833 15.9251 10.3167 15.9251 10.6C15.9251 10.8833 15.8334 11.1167 15.6501 11.3C15.4668 11.4833 15.2334 11.575 14.9501 11.575C14.6668 11.575 14.4334 11.4833 14.2501 11.3L11.0001 8.05V19C11.0001 19.2833 10.9043 19.5208 10.7126 19.7125C10.5209 19.9042 10.2834 20 10.0001 20C9.71678 20 9.47928 19.9042 9.28761 19.7125C9.09594 19.5208 9.00011 19.2833 9.00011 19V14H7.00011V19C7.00011 19.2833 6.90428 19.5208 6.71261 19.7125C6.52094 19.9042 6.28345 20 6.00011 20C5.71678 20 5.47928 19.9042 5.28761 19.7125C5.09595 19.5208 5.00011 19.2833 5.00011 19ZM8.00011 4C7.45011 4 6.97928 3.80417 6.58761 3.4125C6.19594 3.02083 6.00011 2.55 6.00011 2C6.00011 1.45 6.19594 0.979167 6.58761 0.5875C6.97928 0.195833 7.45011 0 8.00011 0C8.55011 0 9.02094 0.195833 9.41261 0.5875C9.80428 0.979167 10.0001 1.45 10.0001 2C10.0001 2.55 9.80428 3.02083 9.41261 3.4125C9.02094 3.80417 8.55011 4 8.00011 4Z" />
    </svg>
  );
}
export function SearchIcon(svgProps: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <path
        d="M6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L17.3 15.9C17.4833 16.0833 17.575 16.3167 17.575 16.6C17.575 16.8833 17.4833 17.1167 17.3 17.3C17.1167 17.4833 16.8833 17.575 16.6 17.575C16.3167 17.575 16.0833 17.4833 15.9 17.3L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z"
        fill="#888888"
      />
    </svg>
  );
}

export function EditIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.16667 13.8333H3.35417L11.5 5.6875L10.3125 4.5L2.16667 12.6458V13.8333ZM1.33333 15.5C1.09722 15.5 0.899306 15.4201 0.739583 15.2604C0.579861 15.1007 0.5 14.9028 0.5 14.6667V12.6458C0.5 12.4236 0.541667 12.2118 0.625 12.0104C0.708333 11.809 0.826389 11.6319 0.979167 11.4792L11.5 0.979167C11.6667 0.826389 11.8507 0.708333 12.0521 0.625C12.2535 0.541667 12.4653 0.5 12.6875 0.5C12.9097 0.5 13.125 0.541667 13.3333 0.625C13.5417 0.708333 13.7222 0.833333 13.875 1L15.0208 2.16667C15.1875 2.31944 15.309 2.5 15.3854 2.70833C15.4618 2.91667 15.5 3.125 15.5 3.33333C15.5 3.55556 15.4618 3.76736 15.3854 3.96875C15.309 4.17014 15.1875 4.35417 15.0208 4.52083L4.52083 15.0208C4.36806 15.1736 4.19097 15.2917 3.98958 15.375C3.78819 15.4583 3.57639 15.5 3.35417 15.5H1.33333ZM10.8958 5.10417L10.3125 4.5L11.5 5.6875L10.8958 5.10417Z"
        fill="#888888"
      />
    </svg>
  );
}
export function DeleteIcon() {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.8335 15.5C2.37516 15.5 1.9828 15.3368 1.65641 15.0104C1.33002 14.684 1.16683 14.2917 1.16683 13.8333V3C0.930718 3 0.732802 2.92014 0.573079 2.76042C0.413357 2.60069 0.333496 2.40278 0.333496 2.16667C0.333496 1.93056 0.413357 1.73264 0.573079 1.57292C0.732802 1.41319 0.930718 1.33333 1.16683 1.33333H4.50016C4.50016 1.09722 4.58002 0.899306 4.73975 0.739583C4.89947 0.579861 5.09738 0.5 5.3335 0.5H8.66683C8.90294 0.5 9.10086 0.579861 9.26058 0.739583C9.4203 0.899306 9.50016 1.09722 9.50016 1.33333H12.8335C13.0696 1.33333 13.2675 1.41319 13.4272 1.57292C13.587 1.73264 13.6668 1.93056 13.6668 2.16667C13.6668 2.40278 13.587 2.60069 13.4272 2.76042C13.2675 2.92014 13.0696 3 12.8335 3V13.8333C12.8335 14.2917 12.6703 14.684 12.3439 15.0104C12.0175 15.3368 11.6252 15.5 11.1668 15.5H2.8335ZM11.1668 3H2.8335V13.8333H11.1668V3ZM5.3335 12.1667C5.56961 12.1667 5.76752 12.0868 5.92725 11.9271C6.08697 11.7674 6.16683 11.5694 6.16683 11.3333V5.5C6.16683 5.26389 6.08697 5.06597 5.92725 4.90625C5.76752 4.74653 5.56961 4.66667 5.3335 4.66667C5.09738 4.66667 4.89947 4.74653 4.73975 4.90625C4.58002 5.06597 4.50016 5.26389 4.50016 5.5V11.3333C4.50016 11.5694 4.58002 11.7674 4.73975 11.9271C4.89947 12.0868 5.09738 12.1667 5.3335 12.1667ZM8.66683 12.1667C8.90294 12.1667 9.10086 12.0868 9.26058 11.9271C9.4203 11.7674 9.50016 11.5694 9.50016 11.3333V5.5C9.50016 5.26389 9.4203 5.06597 9.26058 4.90625C9.10086 4.74653 8.90294 4.66667 8.66683 4.66667C8.43072 4.66667 8.2328 4.74653 8.07308 4.90625C7.91336 5.06597 7.8335 5.26389 7.8335 5.5V11.3333C7.8335 11.5694 7.91336 11.7674 8.07308 11.9271C8.2328 12.0868 8.43072 12.1667 8.66683 12.1667Z"
        fill="#888888"
      />
    </svg>
  );
}
export function MdpIcon() {
  return (
    <svg
      width="14"
      height="19"
      viewBox="0 0 14 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.00016 18.3333C1.54183 18.3333 1.14947 18.1701 0.823079 17.8438C0.496691 17.5174 0.333496 17.125 0.333496 16.6667V8.33334C0.333496 7.87501 0.496691 7.48265 0.823079 7.15626C1.14947 6.82987 1.54183 6.66668 2.00016 6.66668H2.8335V5.00001C2.8335 3.84723 3.23975 2.86459 4.05225 2.05209C4.86475 1.23959 5.84738 0.833344 7.00016 0.833344C8.15294 0.833344 9.13558 1.23959 9.94808 2.05209C10.7606 2.86459 11.1668 3.84723 11.1668 5.00001V6.66668H12.0002C12.4585 6.66668 12.8509 6.82987 13.1772 7.15626C13.5036 7.48265 13.6668 7.87501 13.6668 8.33334V16.6667C13.6668 17.125 13.5036 17.5174 13.1772 17.8438C12.8509 18.1701 12.4585 18.3333 12.0002 18.3333H2.00016ZM2.00016 16.6667H12.0002V8.33334H2.00016V16.6667ZM7.00016 14.1667C7.4585 14.1667 7.85086 14.0035 8.17725 13.6771C8.50363 13.3507 8.66683 12.9583 8.66683 12.5C8.66683 12.0417 8.50363 11.6493 8.17725 11.3229C7.85086 10.9965 7.4585 10.8333 7.00016 10.8333C6.54183 10.8333 6.14947 10.9965 5.82308 11.3229C5.49669 11.6493 5.3335 12.0417 5.3335 12.5C5.3335 12.9583 5.49669 13.3507 5.82308 13.6771C6.14947 14.0035 6.54183 14.1667 7.00016 14.1667ZM4.50016 6.66668H9.50016V5.00001C9.50016 4.30557 9.25711 3.71529 8.771 3.22918C8.28488 2.74307 7.69461 2.50001 7.00016 2.50001C6.30572 2.50001 5.71544 2.74307 5.22933 3.22918C4.74322 3.71529 4.50016 4.30557 4.50016 5.00001V6.66668Z"
        fill="#888888"
      />
    </svg>
  );
}

export function LeftArrow(svgProps: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="7"
      height="12"
      viewBox="0 0 7 12"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
      className={`${svgProps.className ?? "fill-[#222222] "}`}
    >
      <path
        d="M0.0500972 6.00005C0.0500972 5.86672 0.0709307 5.74172 0.112597 5.62505C0.154264 5.50838 0.225097 5.40005 0.325097 5.30005L4.9251 0.700049C5.10843 0.516715 5.34176 0.425049 5.6251 0.425049C5.90843 0.425049 6.14176 0.516715 6.3251 0.700049C6.50843 0.883382 6.6001 1.11672 6.6001 1.40005C6.6001 1.68338 6.50843 1.91672 6.3251 2.10005L2.4251 6.00005L6.3251 9.90005C6.50843 10.0834 6.6001 10.3167 6.6001 10.6C6.6001 10.8834 6.50843 11.1167 6.3251 11.3C6.14176 11.4834 5.90843 11.575 5.6251 11.575C5.34176 11.575 5.10843 11.4834 4.9251 11.3L0.325097 6.70005C0.225097 6.60005 0.154264 6.49172 0.112597 6.37505C0.0709307 6.25838 0.0500972 6.13338 0.0500972 6.00005Z"
        fill="parent"
      />
    </svg>
  );
}
