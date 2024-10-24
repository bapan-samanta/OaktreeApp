import { get, post, put, del, patch } from '../../../Utility/Http';
import { login, currentUser, forcePasswordChangeGet, forgotPasswordGet, changePasswordGet, updatedPasswordPatchApi, userOrganisationListGet, verifyMFAPost, associateSoftwareTokenPut, verifySoftwareTokenPut, usrMfaAssignPut } from '../Model/LoginModel';
import Config from '../../../Utility/Config';
import { client } from "../../../Utility/Client"

import { USER_LOGIN_MUTATION } from "../../../GraphQL/Mutation"

export const loginGetApi = async (data) => {
    console.log("Calling loginGetApi:", data)
    let response = {}
    try {
        const result = await client.mutate({
            mutation: USER_LOGIN_MUTATION,
            variables: { email: data.email, password: data.password },
        });
        //console.log("Mutation result:", result);
        response = result.data;  // Assuming the API response is inside `data`
    } catch (err) {
        console.error("Mutation error:", err);
    }
    return login(response);
};
export const getCurrentUser = async () => {
    const response = await get(`${Config.extendedUrl}currentuser`, null);
    return currentUser(response);
};

export const forcePasswordChange = async (data, headers) => {
    const response = await post(`${Config.extendedUrl}users/userforcepasswordchange`, data, headers);
    return forcePasswordChangeGet(response);
};
export const forgotPassword = async (data) => {
    const response = await put(`${Config.extendedUrl}users/forgotpassword`, data, null);
    return forgotPasswordGet(response);
};
export const changePassword = async (data) => {
    const response = await put(`${Config.extendedUrl}users/confirmforgotpassword`, data, null);
    return changePasswordGet(response);
};
export const updatedPassword = async (data, headers) => {
    const response = await patch(`${Config.extendedUrlAuth}users/changepassword`, data, headers);
    return updatedPasswordPatchApi(response);
};
export const userOrganisationGet = async (data) => {
    const response = await get(`${Config.extendedUrl}admin/user_details`, data);
    return userOrganisationListGet(response);
};
export const verifyMFA = async (data, header) => {
    const response = await post(`${Config.extendedUrl}users/mfa/verify`, data, header);
    return verifyMFAPost(response);
};

export const associateSoftwareToken = async (headers) => {
    const response = await put(`${Config.extendedUrl}users/associate_software_token`, null, headers);
    return associateSoftwareTokenPut(response);
};
export const verifySoftwareToken = async (data, header) => {
    const response = await put(`${Config.extendedUrl}users/verify_software_token`, data, header);
    return verifySoftwareTokenPut(response);
};
export const usrMfaAssign = async (data, header) => {
    const response = await put(`${Config.extendedUrl}users/usr_mfa_assign`, data, header);
    return usrMfaAssignPut(response);
};
