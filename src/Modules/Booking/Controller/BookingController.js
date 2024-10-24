import { get, post, put, del, patch } from '../../../Utility/Http';
import { bookingListGet, bookingDetailsGet, bookingCheckinPatch, userOrganisationListGet, uploadPersonDetailsFn, uploadCustomerIdentityProofPost, bookingIndividualDetailsGet, getGuestDetailsGet, updatePersonDetailsApi } from '../Model/BookingModel';
import Config from '../../../Utility/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

var currentVersion = "";
//HOME Screen function
export const bookingList = async (data) => {
    currentVersion = JSON.parse(await AsyncStorage.getItem('loginCredentials')).user_details.version;
    const response = await get(`${Config.extendedUrl}${currentVersion}/bookings`, data);
    return bookingListGet(response);
};

export const bookingDetails = async (id) => {
    currentVersion = JSON.parse(await AsyncStorage.getItem('loginCredentials')).user_details.version;
    const response = await get(`${Config.extendedUrl}${currentVersion}/bookings/individual/${id}`);
    return bookingDetailsGet(response);
};
export const bookingCheckin = async (data, id) => {
    currentVersion = JSON.parse(await AsyncStorage.getItem('loginCredentials')).user_details.version;
    const response = await patch(`${Config.extendedUrl}${currentVersion}/bookings/update/${id}`, data);
    return bookingCheckinPatch(response);
};

export const userOrganisationGet = async (data) => {
    const response = await get(`${Config.extendedUrl}admin/user_details`, data);
    return userOrganisationListGet(response);
};
export const uploadPersonDetails = async (data) => {
    currentVersion = JSON.parse(await AsyncStorage.getItem('loginCredentials')).user_details.version;
    const response = await post(`${Config.extendedUrl}${currentVersion}/customerDetails/add`, data);
    return uploadPersonDetailsFn(response);
};

export const uploadCustomerIdentityProof = async (data) => {
    currentVersion = JSON.parse(await AsyncStorage.getItem('loginCredentials')).user_details.version;
    const response = await post(`${Config.extendedUrl}${currentVersion}/customerDetails/upload_identity`, data);
    return uploadCustomerIdentityProofPost(response);
};

export const bookingIndividualDetails = async (id) => {
    currentVersion = JSON.parse(await AsyncStorage.getItem('loginCredentials')).user_details.version;
    const response = await get(`${Config.extendedUrl}${currentVersion}/bookings/individual/${id}/edit`);
    return bookingIndividualDetailsGet(response);
};

export const getGuestDetails = async (id) => {
    currentVersion = JSON.parse(await AsyncStorage.getItem('loginCredentials')).user_details.version;
    const response = await get(`${Config.extendedUrl}${currentVersion}/customerDetails/booking_customer/${id}`);
    return getGuestDetailsGet(response);
};

export const updatePersonDetails = async (id, data) => {
    currentVersion = JSON.parse(await AsyncStorage.getItem('loginCredentials')).user_details.version;
    const response = await patch(`${Config.extendedUrl}${currentVersion}/customerDetails/${id}`, data);
    return updatePersonDetailsApi(response);
};

