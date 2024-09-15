// "use client"

import { Flex } from "antd"
import { LoginFormDemo } from "@/app/components/loginComp"
// import { useEffect , useState } from "react";

export default function Login() {

    // const [latitude, setLatitude] = useState(0);
    // const [longitude, setLongitude] = useState(0);
    // const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     if (!navigator.geolocation) {
    //     setError('Geolocation is not supported by your browser');
    //     return;
    //     }

    //     const successHandler = (position : GeolocationPosition) => {
    //     setLatitude(position.coords.latitude);
    //     setLongitude(position.coords.longitude);
    //     };

    //     const errorHandler = (error : GeolocationPositionError) => {
    //     setError(error.message);
    //     };

    //     navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    // }, []);

    return(
        <Flex justify="center" align="center" style={{ backgroundColor : "black" , height : "100vh" , paddingTop : "20px"}}>
            <LoginFormDemo />
        </Flex>
    )
}