import React, { useEffect, useState } from "react";

function Header({ toggleDrawer, isOpen }) {
  const [IsDarkSelected, setIsDarkSelected] = useState(false);

  return (
    <div
      style={{
        padding: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          className="flex"
          style={{
            alignItems: "center",
          }}
        >
          <svg
            width="40px"
            height="40px"
            viewBox="0 -0.5 25 25"
            fill="none"
            style={{
              cursor: "pointer",
            }}
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              toggleDrawer();
            }}
          >
            <path
              d="M5.5 11.75C5.08579 11.75 4.75 12.0858 4.75 12.5C4.75 12.9142 5.08579 13.25 5.5 13.25V11.75ZM19.5 13.25C19.9142 13.25 20.25 12.9142 20.25 12.5C20.25 12.0858 19.9142 11.75 19.5 11.75V13.25ZM5.5 7.75C5.08579 7.75 4.75 8.08579 4.75 8.5C4.75 8.91421 5.08579 9.25 5.5 9.25V7.75ZM14.833 9.25C15.2472 9.25 15.583 8.91421 15.583 8.5C15.583 8.08579 15.2472 7.75 14.833 7.75V9.25ZM5.5 15.75C5.08579 15.75 4.75 16.0858 4.75 16.5C4.75 16.9142 5.08579 17.25 5.5 17.25V15.75ZM14.833 17.25C15.2472 17.25 15.583 16.9142 15.583 16.5C15.583 16.0858 15.2472 15.75 14.833 15.75V17.25ZM5.5 13.25H19.5V11.75H5.5V13.25ZM5.5 9.25H14.833V7.75H5.5V9.25ZM5.5 17.25H14.833V15.75H5.5V17.25Z"
              fill={IsDarkSelected ? "#fff" : "#000"}
            />
          </svg>
          {/* <p
            className="screen-name-title"
            style={{
              color: IsDarkSelected ? "#fff" : null,
            }}
          >
            IndiGo
          </p> */}
          <img
            src="https://seekvectorlogo.com/wp-content/uploads/2022/01/indigo-vector-logo-2022-small.png"
            style={{
              width: 100,
              height: 20,
              objectFit:"cover"
            }}
          />
        </div>
        {/* <Image
          src={"/menu.png"}
          // alt="dummy image"
          width={40}
          height={40}
          onClick={() => {
            toggleDrawer();
          }}
          // className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
        /> */}
        {/* <Avatar src="../../assets/ICONS/menu.png" /> */}
      </div>
    </div>
  );
}

export default Header;
