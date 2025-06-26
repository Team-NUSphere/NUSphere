import { NavLink } from "react-router-dom";
import React from "react";
import clsx from "clsx";

type NavItemProps = {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
};

const NavItem = ({ to, icon: Icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      draggable={false}
      className={({ isActive }) =>
        clsx(
          "flex flex-col items-center justify-center p-2 aspect-square w-full rounded-md transition-colors select-none",
          {
            "bg-blue-100 text-blue-600": isActive,
            "text-gray-500 hover:bg-gray-100": !isActive,
          }
        )
      }
      end={false}
    >
      <Icon className="w-auto text-3xl h-auto mb-1" />
      <span className="text-xs text-center">{label}</span>
    </NavLink>
  );
};

export default NavItem;
