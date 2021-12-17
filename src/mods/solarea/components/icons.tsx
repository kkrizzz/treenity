import React from 'react';

export const icons = {
  chevronRight: () => (
    <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.485283 1L4.97057 5.48528L0.485283 9.97057" stroke="#CCDDEE" />
    </svg>
  ),
  forward: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-arrow-forward"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M15 11l4 4l-4 4m4 -4h-11a4 4 0 0 1 0 -8h1"></path>
    </svg>
  ),
  refresh: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-refresh"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
    </svg>
  ),
  settings: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path
        d="M8.3 2.29995C8.7 0.499951 11.2 0.499951 11.6 2.29995C11.8 3.19995 12.8 3.79994 13.7 3.59994C13.9 3.59994 14 3.49993 14.2 3.39993C15.7 2.49993 17.5 4.19995 16.6 5.79995C16.1 6.59995 16.4 7.69994 17.2 8.19994C17.4 8.29994 17.5 8.39993 17.7 8.39993C19.5 8.79993 19.5 11.3 17.7 11.8C16.8 12 16.2 12.9999 16.4 13.8999C16.4 14.0999 16.5 14.1999 16.6 14.3999C17.5 15.8999 15.8 17.7 14.2 16.8C13.4 16.3 12.3 16.5999 11.8 17.3999C11.7 17.5999 11.6 17.6999 11.6 17.8999C11.2 19.6999 8.7 19.6999 8.2 17.8999C8 16.9999 7 16.3999 6.1 16.5999C5.9 16.5999 5.8 16.7 5.6 16.8C4.1 17.7 2.3 15.9999 3.2 14.3999C3.7 13.5999 3.4 12.4999 2.6 11.9999C2.4 11.8999 2.3 11.8 2.1 11.8C0.3 11.4 0.3 8.89993 2.1 8.39993C3 8.19993 3.6 7.19995 3.4 6.29995C3.4 6.09995 3.3 5.99995 3.2 5.79995C2.3 4.29995 4 2.49993 5.6 3.39993C6.8 3.89993 8 3.39995 8.3 2.29995ZM10 6.99993C11.7 6.99993 13 8.29993 13 9.99993C13 11.6999 11.7 12.9999 10 12.9999C8.3 12.9999 7 11.6999 7 9.99993C7 8.29993 8.3 6.99993 10 6.99993Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  save: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-cloud-upload"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"></path>
      <polyline points="9 15 12 12 15 15"></polyline>
      <line x1="12" y1="12" x2="12" y2="21"></line>
    </svg>
  ),
  close: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-x"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  rewind: (width = 24, height = 24) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-chevrons-left"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <polyline points="11 7 6 12 11 17"></polyline>
      <polyline points="17 7 12 12 17 17"></polyline>
    </svg>
  ),
  chevronDown: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-chevron-down"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  squareClose: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-square-x"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <rect x="4" y="4" width="16" height="16" rx="2"></rect>
      <path d="M10 10l4 4m0 -4l-4 4"></path>
    </svg>
  ),
  chevronUp: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-chevron-up"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <polyline points="6 15 12 9 18 15"></polyline>
    </svg>
  ),
  play: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-player-play"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M7 4v16l13 -8z"></path>
    </svg>
  ),
  info: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-info-circle"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx="12" cy="12" r="9"></circle>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
      <polyline points="11 12 12 12 12 16 13 16"></polyline>
    </svg>
  ),
  burger: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-menu"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  burger2: () => (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor">
      <path
        d="M0.5 13.5H15.5M0.5 0.5H15.5H0.5ZM0.5 7H15.5H0.5Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  solana: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.99996 18C5.75223 18 4.55561 17.5259 3.67334 16.682C2.79107 15.8381 2.29541 14.6935 2.29541 13.5C2.29541 12.3065 2.79107 11.1619 3.67334 10.318C4.55561 9.47411 5.75223 9 6.99996 9C7.29464 7.68718 8.15672 6.53348 9.39654 5.79271C10.0104 5.42592 10.6986 5.17155 11.4217 5.04411C12.1449 4.91668 12.8888 4.91868 13.6111 5.05C14.3333 5.18132 15.0198 5.43939 15.6312 5.80948C16.2427 6.17957 16.7672 6.65442 17.1747 7.20693C17.5823 7.75944 17.8649 8.37878 18.0065 9.0296C18.1481 9.68041 18.1459 10.35 18 11H19C19.9282 11 20.8185 11.3687 21.4748 12.0251C22.1312 12.6815 22.5 13.5717 22.5 14.5C22.5 15.4283 22.1312 16.3185 21.4748 16.9749C20.8185 17.6313 19.9282 18 19 18H18"
        stroke="url(#paint0_linear)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 15L12 12L15 15"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 12V21"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="12.3977"
          y1="4.95"
          x2="12.3977"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#DC1FFF" />
          <stop offset="1" stop-color="#00FFA3" />
        </linearGradient>
      </defs>
    </svg>
  ),
  upload: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-file-upload"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
      <line x1="12" y1="11" x2="12" y2="17"></line>
      <polyline points="9 14 12 11 15 14"></polyline>
    </svg>
  ),
  reload: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor">
      <path
        d="M1.1 8C1.7 3.6 5.7 0.500001 10.1 1.1C14.5 1.7 17.6 5.7 17 10.1C16.4 14.5 12.4 17.6 8 17C5.1 16.6 2.7 14.7 1.6 12M1.1 17V12H6.1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  back_arrow: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-arrow-back"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1"></path>
    </svg>
  ),
  mobile: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-device-mobile"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="7" y="4" width="10" height="16" rx="1" />
      <line x1="11" y1="5" x2="13" y2="5" />
      <line x1="12" y1="17" x2="12" y2="17.01" />
    </svg>
  ),
  tablet: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-device-tablet"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <circle cx="12" cy="17" r="1" />
    </svg>
  ),
  desktop: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-device-desktop"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <line x1="7" y1="20" x2="17" y2="20" />
      <line x1="9" y1="16" x2="9" y2="20" />
      <line x1="15" y1="16" x2="15" y2="20" />
    </svg>
  ),
  fullscreen: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-maximize"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
    </svg>
  ),
  graphql: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.3037 2.77131L19.8486 5.62067C20.0087 5.46992 20.1924 5.34054 20.394 5.23653C21.544 4.64813 23.0108 4.99748 23.6787 6.021C24.3399 7.04451 23.9473 8.34987 22.7973 8.94436C22.5972 9.04694 22.3815 9.12337 22.1569 9.17131V14.8721C22.379 14.9201 22.5924 14.996 22.7905 15.0975C23.9473 15.692 24.3399 16.9975 23.6719 18.021C23.0108 19.0444 21.5371 19.3938 20.3871 18.8055C20.1643 18.6917 19.9636 18.5467 19.7927 18.376L14.2815 21.2079C14.3622 21.4253 14.4032 21.653 14.4029 21.882C14.4029 23.0587 13.3288 24.021 11.9997 24.021C10.6706 24.021 9.59638 23.0648 9.59638 21.882C9.59638 21.6718 9.63031 21.4687 9.69359 21.2769L4.15016 18.4283C3.99183 18.5761 3.8107 18.7031 3.61222 18.8055C2.45535 19.3938 0.988533 19.0444 0.327408 18.021C-0.333623 16.9975 0.058908 15.692 1.20885 15.0975C1.40695 14.996 1.62027 14.9201 1.84241 14.872V9.17131C1.61782 9.12337 1.40214 9.04694 1.202 8.94436C0.0519705 8.35605 -0.340561 7.04451 0.320564 6.021C0.981689 4.99748 2.45525 4.64813 3.60528 5.23653C3.80582 5.33998 3.98863 5.46853 4.1481 5.61825L9.69463 2.76814C9.62924 2.57064 9.59615 2.36579 9.59638 2.15989C9.59638 0.977178 10.6706 0.0209961 11.9997 0.0209961C13.3288 0.0209961 14.4029 0.977095 14.4029 2.15989C14.4029 2.37249 14.3683 2.57766 14.3037 2.77131ZM13.726 3.64923L19.2841 6.50526C19.1956 6.78061 19.1702 7.06898 19.2095 7.35323C19.2487 7.63748 19.3518 7.91181 19.5126 8.15989C19.8509 8.6837 20.4021 9.03097 21.0138 9.1663V14.8742C20.9826 14.8809 20.9516 14.8884 20.9207 14.8962L13.6614 3.70638C13.6833 3.68769 13.7049 3.66867 13.726 3.64931V3.64923ZM10.3394 3.70764L3.08019 14.8973C3.0488 14.8892 3.01723 14.8817 2.9855 14.8748V9.1663C3.59722 9.03097 4.14838 8.6837 4.48672 8.15989C4.64782 7.91133 4.751 7.63643 4.79009 7.3516C4.82918 7.06677 4.80339 6.77785 4.71425 6.50209L10.2708 3.64689C10.2932 3.6675 10.3161 3.68778 10.3394 3.70755V3.70764ZM12.6712 4.21451L19.9287 15.4017C19.7625 15.5429 19.62 15.7046 19.5057 15.882C19.3916 16.0583 19.3063 16.2482 19.2523 16.4459H4.74716C4.69313 16.2482 4.60778 16.0583 4.49366 15.882C4.37891 15.7059 4.23668 15.5451 4.07122 15.4044L11.3302 4.21501C11.5478 4.27078 11.7732 4.29898 11.9997 4.29878C12.2328 4.29878 12.4581 4.26941 12.6712 4.21451ZM13.777 20.4411L19.299 17.6036C19.2825 17.5572 19.2677 17.5104 19.2547 17.4632H4.74406C4.73638 17.491 4.72803 17.5185 4.71913 17.546L10.2682 20.3974C10.4923 20.1901 10.7612 20.0252 11.0588 19.9127C11.3563 19.8003 11.6764 19.7426 11.9997 19.7431C12.3342 19.7426 12.6652 19.8044 12.9713 19.9246C13.2774 20.0448 13.5519 20.2208 13.777 20.4411V20.4411Z"
        fill="currentColor"
      />
    </svg>
  ),
  edit: () => (
    <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.775 3.41291L20.5333 7.11252C20.6917 7.26838 20.6917 7.52268 20.5333 7.67854L11.4333 16.6363L7.56667 17.0588C7.05 17.1162 6.6125 16.6856 6.67083 16.177L7.1 12.3707L16.2 3.41291C16.3583 3.25706 16.6167 3.25706 16.775 3.41291ZM23.525 2.47366L21.4917 0.472095C20.8583 -0.151343 19.8292 -0.151343 19.1917 0.472095L17.7167 1.92405C17.5583 2.07991 17.5583 2.3342 17.7167 2.49006L21.475 6.18967C21.6333 6.34553 21.8917 6.34553 22.05 6.18967L23.525 4.73772C24.1583 4.11018 24.1583 3.09709 23.525 2.47366V2.47366ZM16 14.2V18.3754H2.66667V5.25041H12.2417C12.375 5.25041 12.5 5.19709 12.5958 5.10686L14.2625 3.46623C14.5792 3.15452 14.3542 2.62541 13.9083 2.62541H2C0.895833 2.62541 0 3.50725 0 4.59416V19.0317C0 20.1186 0.895833 21.0004 2 21.0004H16.6667C17.7708 21.0004 18.6667 20.1186 18.6667 19.0317V12.5594C18.6667 12.1205 18.1292 11.9031 17.8125 12.2108L16.1458 13.8514C16.0542 13.9457 16 14.0688 16 14.2Z"
        fill="currentColor"
      />
    </svg>
  ),
};
