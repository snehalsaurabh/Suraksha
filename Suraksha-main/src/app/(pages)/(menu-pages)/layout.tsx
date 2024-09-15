"use client";
import React, { useState, ReactNode, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import avatar from "../../assets/profile.jpg"
import {
  IconArrowLeft,
  IconBrandTabler,
  IconPencilPlus,
  IconInputSearch,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import logo from "../../assets/logo1.png"
import { cn } from "@/lib/utils";
import { Avatar , Image } from "antd";

type LayoutProps = {
  children: ReactNode;
};

export default function MenuPagesLayout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Explore",
      href: "/explore",
      icon: (
        <IconInputSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Created",
      href: "/created",
      icon: (
        <IconPencilPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/signup",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className={cn(
      "flex flex-col md:flex-row h-screen w-full overflow-hidden bg-gray-100 dark:bg-neutral-800",
      "border border-neutral-200 dark:border-neutral-700"
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Vibhor Phalke",
                href: "#",
                icon: (
                    <Avatar src={avatar.src}/>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard>
        {children}
      </Dashboard>
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src={logo.src} preview={false} style={{ height : "50px" , width : "70px" , marginTop : "10px"}}/>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Suraksha
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src={logo.src} preview={false} style={{ height : "40px" , width : "60px" , marginTop : "10px"}}/>
    </Link>
  );
};

const Dashboard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-2 md:p-10 rounded-tl-2xl bg-white dark:bg-neutral-900 h-auto">
        {children}
      </div>
    </div>
  );
};