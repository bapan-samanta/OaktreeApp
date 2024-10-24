import { get, post, put, del, patch } from '../../../Utility/Http';
import { appointmentListData } from '../Model/AppointmentModel';
import Config from '../../../Utility/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clientAuth } from "../../../Utility/Client"

import { APPOINTMENT_LIST } from "../../../GraphQL/Mutation"

var currentVersion = "";
//HOME Screen function
export const getAppointmentList = async (data) => {
    console.log("getAppointmentList", data);
    let response = {}
    try {
        const result = await clientAuth
        .mutate({
            mutation: APPOINTMENT_LIST,
            variables: { id: data.id}, 
        })
       // console.log("Mutation result:", result);
        response = result;  // Assuming the API response is inside `data`
    } catch (err) {
        console.error("Mutation error:", err);
    }
    return appointmentListData(response);
};
