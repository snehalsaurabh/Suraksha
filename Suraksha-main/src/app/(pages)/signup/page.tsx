import { SignupFormDemo } from "@/app/components/signupComp"
import { Flex } from "antd"

export default function SignUp() {
    return(
        <Flex justify="center" align="center" style={{ backgroundColor : "black" , height : "100vh" , paddingTop : "20px"}}>
            <SignupFormDemo />
        </Flex>
    )
}