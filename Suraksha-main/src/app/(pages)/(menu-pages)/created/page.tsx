import { CreatedPosts } from "@/app/components/createdCardCall"
import { Flex } from "antd"

export default function Created() {
    return(
        <div>
            <h1 style={{ color : "white" }}>Your Reports</h1>
            <Flex gap={30} vertical>
                <CreatedPosts/>
            </Flex>
        </div>
    )
}