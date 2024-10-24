// Config.js
const Config = ({
    // baseURL: "https://ti1tk0ryn4.execute-api.ap-south-1.amazonaws.com/devv4/",
    baseURL: "https://stapi.oaktreeconnect.co.uk/graphql",
    // Office
    // baseURL: "http://192.168.1.125:8080/graphql",
    // baseURL: "http://122.160.113.252:8080/graphql",
    extendedUrl: 'api/',
    extendedUrlAuth: 'api/v1/auth/',
    thumbnailSize: {
        size_width: 200,
        size_height: 200
    },
    forgotPasswordLink: "https://stag-patient.oaktreeconnect.co.uk/forgot-password",
    signUp: "https://stag-patient.oaktreeconnect.co.uk/signup",
    feedback: "https://www.oaktreeconnect.co.uk/feedback/",
});

export default Config;
