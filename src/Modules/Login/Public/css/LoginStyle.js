import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import Colors from "../../../../Utility/Colors";

const LoginStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    oaktreeCircleImage2: {
        position: 'absolute',
        right: 35,  // Aligns the image to the right edge
        top: -220,    // Aligns the image to the top, can adjust depending on where you want it vertically
        width: '50%', // Makes the image take up 50% of the screen width
        height: undefined, // Automatically scales height to maintain the aspect ratio
        aspectRatio: 1,  // Ensures the image maintains its aspect ratio
        resizeMode: 'contain',
    },
    oaktreeCircleImage: {
        position: 'absolute',
        right: -120,  // Aligns the image to the right edge
        top: -200,    // Aligns the image to the top, can adjust depending on where you want it vertically
        width: '70%', // Makes the image take up 50% of the screen width
        height: undefined, // Automatically scales height to maintain the aspect ratio
        aspectRatio: 1,  // Ensures the image maintains its aspect ratio
        resizeMode: 'contain',
        transform: [{ rotate: '90deg' }]
    },
    loginBox: {
        width: '100%',
        height: '100%',
        paddingTop: 20,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: Colors.white,
        borderRadius: 3,
        alignItems: 'left',
        marginTop: 240

    },
    logoPosition: {
        marginBottom: 30,
        
    },
    loginText: {
        fontSize: 18,
        color: '#676666'
    },
    logoHeight: {
        height: 100,
        width: 100
    },
    authenticationLogoHeight: {
        width: 105,
        height: 115
    },
    mailIconPosition: {
        lineHeight: 22,
        position: 'relative',
        height: 25,
        width: 25
    },
    angelImage: {
        flex: 1
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: Colors.white,
        borderBottomColor: Colors.secondary,
        borderBottomWidth: 2,
        borderRadius: 0,
        paddingRight: 10,
        paddingLeft: 0,
        position: 'relative'
    },
    input: {
        flex: 1,
        height: 45,
        fontSize: 18,
        color: Colors.secondary,
        paddingLeft: 5,
        fontFamily: 'Poppins-Regular',
        paddingVertical: 0
    },
    errorMsg: {
        position: 'absolute',
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        left: 0,
        zIndex: 9,
        bottom: -22,
        color: Colors.red
    },
    loginBtnInner: {
        flexDirection: 'row', // Change column to row for horizontal alignment
        width: '100%',
        paddingTop: 20,
        justifyContent: 'flex-end'
    },
    ForgetYourPassword: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 5
    },
    ForgetYourPasswordText: {
        fontSize: 16,
        color: '#4D4D4D'
    },
    signUpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signUpText: {
        position: 'absolute',
        bottom: 190,
        color: Colors.black,
        fontSize: 16
    },
    signUpTouchableOpacity: {
        marginTop: 10
    },
    signUpLink: {
        color: Colors.blue,
        fontWeight: 'bold',
        
    },
    signUpUnderline: {
        position: 'absolute',
        bottom: 180,
        width: 93, // Adjust the width
        height: 4, // Adjust the thickness
        backgroundColor: Colors.green01,
    },
    blankSpace: {
        width: '40%',
    },
    loginBtnWidth: {
        width: '100%',
        flexDirection: 'column'
    },
    rememberContainer: {
        flexDirection: 'row',
        // justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    checkbox: {
        margin: 0,
        padding: 0,
        position: 'relative',
        left: -5,
        alignSelf: 'flex-start',
    },
    rememberText: {
        color: Colors.secondary,
    },
    loginButton: {
        width: '50%',
        height: 50,
        backgroundColor: '#1f8997',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderColor: '#1f8997',
        borderWidth: 2,
    },
    loginButtonText: {
        color: Colors.white,
        fontSize: 20,
        fontFamily: 'Poppins-Regular',
    },
    forgotBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        paddingTop: 20
    },
    backToBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        marginBottom: 20
    },
    resendBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10
    },
    forgotPassword: {
        width: '100%',
        color: Colors.secondary,
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textDecorationLine: 'underline',
    },
    rememberText: {
        fontSize: 16,
        color: Colors.secondary,
        fontFamily: 'Poppins-Regular',
        paddingTop: 5
    },
    emailLineHeight: {
        lineHeight: 22
    },
    verifiedLineHeight: {
        lineHeight: 22
    },
    passwordLineHeight: {
        lineHeight: 28
    },
    infoIcon: {
        paddingTop: 2,
        paddingLeft: 6
    },

    //Otp Verification===========
    otpVerificationLabel: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: Colors.secondary,
        marginBottom: 20,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    otpInput: {
        width: 45,
        height: 45,
        backgroundColor: Colors.white,
        borderBottomColor: Colors.secondary,
        borderBottomWidth: 2,
        borderRadius: 0,
        textAlign: 'center',
        fontSize: 18,
        color: Colors.secondary,
        marginHorizontal: 5,
    },
    //=================
    customizeModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 200,
        flex: 1
    },
    modalHeaderTitle: {
        color: Colors.secondary,
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        textAlign: 'left',
        alignSelf: 'center'
    },
    infoIconPosition: {
        position: 'relative',
        top: -3
    },

    //Force password hints==========
    forceModalOverlay: {
        flex: 1,
        justifyContent: 'flex-end', // Position the modal at the bottom
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    forceModalView: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    forceModalIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    forceHintsContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    forceHintsHeaderText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        marginBottom: 6,
        color: Colors.secondary,
    },
    forceHintText: {
        fontSize: 14,
        color: Colors.secondary,
        marginBottom: 6,
        fontFamily: 'Poppins-Regular',
    },
    forceHintContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 0,
    },
    forceBullet: {
        fontSize: 35,
        color: Colors.secondary,
        marginRight: 6,
        lineHeight: 33
    },

    //password hints design
    infoIcon: {
        paddingTop: 2,
        paddingLeft: 6
    },
    hintsContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    hintsHeaderText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        marginBottom: 6,
        color: Colors.secondary,
    },
    hintText: {
        fontSize: 14,
        color: Colors.secondary,
        marginBottom: 6,
        fontFamily: 'Poppins-Regular',
    },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 0,
    },
    bullet: {
        fontSize: 35,
        color: Colors.secondary,
        marginRight: 6,
        lineHeight: 33
    },

    //Change Password Content
    changePassModalContent: {
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
        paddingTop: 0,
        borderRadius: 15,
        flexWrap: 'wrap',
        flexDirection: 'column',
    },

    changeInputInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: Colors.white,
        borderBottomColor: Colors.secondary,
        borderBottomWidth: 2,
        borderRadius: 0,
        paddingRight: 10,
        paddingLeft: 0,
        position: 'relative'
    },
    changeInput: {
        flex: 1,
        height: 45,
        fontSize: 14,
        color: Colors.secondary,
        paddingLeft: 5,
        fontFamily: 'Poppins-Regular',
        paddingVertical: 0
    },
    errorMsg: {
        position: 'absolute',
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        left: 0,
        zIndex: 9,
        bottom: -22,
        color: Colors.red
    },
    changePassButtonInner: {
        marginTop: 15,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
    },
    changePassButton: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.secondary,
        borderRadius: 3,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeElevation: {
        elevation: 20,
        shadowColor: Colors.primary,
    },
    changeButtonText: {
        color: Colors.white,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    changeError: {
        width: '100%',
        color: 'red',
        fontSize: 10,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    passwordLineHeight: {
        lineHeight: 28
    },

    //Url type work===============
    urlTpeModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center'
    },
    urlTpeModalBody: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%'
    },
    urlTypeModalContainer:{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    authenticatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 8,
        borderRadius: 6,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioCircle: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4
    },
    selected: {
        backgroundColor: Colors.secondary,
    },
    radioLabel: {
        marginLeft: 4,
        fontSize: 14,
        color: Colors.secondary,
        fontFamily: 'Poppins-Medium',
    },

})

export default LoginStyle