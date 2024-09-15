"use client"

import { FollowingPointerDemo } from "@/app/components/cardCall"
import { Flex } from "antd"

export default function Explore() {
    return(
        <div>
            <h1 style={{ color : "white" }}>Explore</h1>
            <Flex gap={30} vertical>
                <FollowingPointerDemo/>
            </Flex>
        </div>
    )
}