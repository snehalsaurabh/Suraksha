"use client"

import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push("/signup");
  }
  , []);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor : "black" }}>
      <Spin size="large" />
    </div>
  );
}