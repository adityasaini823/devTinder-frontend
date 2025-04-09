import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-horizontal gap-y-2 footer-center bg-base-300 text-base-content rounded p-10  bottom-0">
      <nav className="grid grid-flow-col gap-4">
        {/* <a className="link link-hover">Home</a>
        <a className="link link-hover">Profile</a>
        <a className="link link-hover">Chats</a> */}
      </nav>
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by
          DevTinder
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
