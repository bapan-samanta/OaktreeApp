import { questionnaireListData } from '../Model/QuestionnaireModel';
import { Questionnaire, PatientQuestionnaireUpdate } from "../../../GraphQL/Mutation"
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Config from '../../../Utility/Config';
// import { client, clientAuth } from "../../../Utility/Client"

import { store } from "../../../Store/configureStore"

let state = store.getState();
let token = state.token;

let accesToken = token?.accesToken || "";

// Create an HTTP link for the API
const apolloHttpLink = createHttpLink({
  uri: Config.baseURL, // Your GraphQL API URL
});

// Create an authentication link that sets the Authorization header
const apolloAuthLink = setContext(async (_, { headers }) => {
  accesToken = token?.accesToken || "";

    let now = new Date();
    let utc_timestamp = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
    );

    let currentTime = Math.floor(utc_timestamp / 1000);

    let tokenExpiryDate  = token?.tokenExpiryDate || null;
    if(tokenExpiryDate!=null && accesToken!=null){
        let tokenExpiryDate1=parseInt(tokenExpiryDate);
        if(tokenExpiryDate1 > currentTime){
            console.log("in auth not expired");
            // token not expird
        }
    }

    if (!accesToken) {
        console.log('No access token found or token needs refreshing.');
    } 

    return {
        headers: {
            ...headers,
            authorization: accesToken,
        },
    };
});


// Apollo Client with authentication
const clientAuth = new ApolloClient({
    link: apolloAuthLink.concat(apolloHttpLink), // Combine auth link and HTTP link
    cache: new InMemoryCache({
        addTypename: false,
    }),
});

//Questionnaire Screen function
export const getQuestionnaireList = async (data) => {
    console.log("getQuestionnaireList", data);
    let response = {}
    try {
        const result = await clientAuth
        .mutate({
            mutation: Questionnaire,
            variables: { id: data.id}, 
        })
        response = result;          
    } catch (err) {
        console.error("Mutation error:", err);
    }
    return questionnaireListData(response);
};

//Questionnaire Screen function
export const updatePatientQuestionnaireUpdate = async (data) => {
    console.log("getQuestionnaireList", data);
    
    let response = {}
    try {
        const result = await clientAuth
        .mutate({
            mutation: PatientQuestionnaireUpdate,
            variables: data.variables, 
        })
        response = result;          
    } catch (err) {
        console.error("Mutation error:", err);
    }
    return response;
};
