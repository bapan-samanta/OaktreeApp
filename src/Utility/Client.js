// Client.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'; 
import Config from './Config';
import { store } from "../Store/configureStore"

// Regular Apollo Client without authentication
const client = new ApolloClient({
  uri: Config.baseURL, // Use your API URL from the config
  cache: new InMemoryCache(),
});

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
  if(tokenExpiryDate!=null && accesToken!=null)
  {
    let tokenExpiryDate1=parseInt(tokenExpiryDate);
    

    if(tokenExpiryDate1 > currentTime){
      // console.log("in auth not expired");
      // token not expird
    }else{
      // Log out
      // console.log( "in auth before await change;")
      // const loggedInEmail = getUserEmail();

      // let getdata =await fetchDataApi(loggedInEmail,refreshToken);
      //   accesToken = localStorage.getItem("accesToken");
      // console.log( "in auth after wawait;")
      //call refershToken
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

export { client, clientAuth }