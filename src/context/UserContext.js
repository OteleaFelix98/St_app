import React, { useState, createContext } from "react";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

const UserContext = createContext([{}, () => {}]);

const UserProvider = (props) => {
    const [state, setState] = useState({
        username: "",
        email: "",
        type:"",
        uid: "",
        isLoggedIn: null,
        profilePhotoUrl: "default",
    });

  getCameraPermission = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (status != "granted") {
                alert("We need permission to use your camera roll if you'd like to incude a photo.");
            }
        }
    };


    return <UserContext.Provider value={[state, setState]}>{props.children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
