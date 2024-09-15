"use client"

import { MainDashboard } from "@/app/components/dashboardComp"
import { useEffect } from "react"
import { useAppSelector } from "@/lib/hooks"
export default function Dashboard() {
    
    return(
        <div>
            <MainDashboard />
        </div>
    )
}