import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import Colors from "../../../../Utility/Colors";

const lightTheme = {
    profileContainer: {
        flex: 1
    },
    backContainer: {
        paddingTop: 5,
        paddingHorizontal: 15 
    },
    contentContainer: {
        paddingHorizontal: 15
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 10
    },
    userImage: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderColor: Colors.white
    },
    contentContainerBox: {
        alignItems: 'center',
        paddingTop: 10
    },
    contentContainerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 6,
        marginBottom: 6,
        minHeight: 45
    },
    userNameRow: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: Colors.secondary,
        paddingLeft: 5,
        paddingTop: 5
    },
    otherDetailsRow: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: Colors.secondary,
        paddingLeft: 5
    },
    userIcon: {
        lineHeight: 17
    },

    enableMfaBtn: {
        backgroundColor: Colors.white,
        borderColor: Colors.secondary,
        borderWidth: 1.5,
        lineHeight: 16,
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        width: '50%'
    },
    enableMfaBtnText: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: Colors.secondary,
        alignItems: 'center',
    },

};

const darkTheme = {
    profileContainer: {
        flex: 1
    },
    backContainer: {
        paddingTop: 5,
        paddingHorizontal: 15
    },
    contentContainer: {
        paddingHorizontal: 15
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 10
    },
    userImage: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderColor: Colors.white
    },
    contentContainerBox: {
        alignItems: 'center',
        paddingTop: 10
    },
    contentContainerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 6,
        marginBottom: 6,
        minHeight: 45
    },
    userNameRow: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: Colors.secondary,
        paddingLeft: 5,
        paddingTop: 5
    },
    otherDetailsRow: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: Colors.secondary,
        paddingLeft: 5
    },
    userIcon: {
        lineHeight: 17
    },
    enableMfaBtn: {
        backgroundColor: Colors.white,
        borderColor: Colors.secondary,
        borderWidth: 1.5,
        lineHeight: 16,
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        width: '50%'
    },
    enableMfaBtnText: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: Colors.secondary,
        alignItems: 'center',
    },
    /* enableMFAModaLBody: {
         flex: 1,
         justifyContent: 'space-between',
         //paddingBottom: 10,
         paddingTop: 10
     },
     enableMFAModaLContent: {
         flexDirection: 'row',
         paddingHorizontal: 15,
         justifyContent: 'flex-start'
     },
     enableMfaBtn: {
         backgroundColor: Colors.white,
         borderColor: Colors.secondary,
         borderWidth: 1.5,
         lineHeight: 16,
         paddingHorizontal: 15,
         paddingVertical: 7,
         borderRadius: 6,
         alignItems: 'center',
         justifyContent: 'center'
     },
     enableMfaBtnText: {
         fontSize: 14,
         fontFamily: 'Poppins-Medium',
         color: Colors.secondary,
         alignItems: 'center',
     },
     radioButtonContainer: {
         flexDirection: 'row',
         alignItems: 'center',
         paddingRight: 20
     },
     radioCircle: {
         height: 22,
         width: 22,
         borderRadius: 11,
         borderWidth: 2,
         borderColor: Colors.secondary,
         alignItems: 'center',
         justifyContent: 'center',
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
     enableSubmitMfaBtn: {
         backgroundColor: Colors.secondary,
         lineHeight: 16,
         paddingHorizontal: 10,
         paddingVertical: 12,
         alignItems: 'center'
     },
     enableSubmitMfaBtnText: {
         fontSize: 15,
         fontFamily: 'Poppins-Medium',
         color: Colors.white,
     },
     //QR Generator===========
     qrContainer: {
         alignItems: 'center',
         justifyContent: 'space-between',
         flex: 1,
     },
     containerTopSection: {
         width: '100%',
         justifyContent: 'center',
         alignItems: 'center'
     },
     qrTitle: {
         fontSize: 14,
         paddingHorizontal: 15,
         marginTop: 10,
         marginBottom: 15,
         color: Colors.secondary,
         fontFamily: 'Poppins-Regular',
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'center',
         textAlign: 'center'
     },
     touchableWrapper: {
         alignItems: 'center',
         position: 'relative',
         top: 0
     },
     authenticatorHighlighterText: {
         color: Colors.lightBlue,
         fontFamily: 'Poppins-Medium',
         textDecorationLine: 'underline',
         position: 'relative',
         top: 9,
         paddingHorizontal: 6
     },
     qrInputBox: {
         width: 45,
         height: 45,
         backgroundColor: Colors.white,
         borderColor: Colors.secondary,
         borderWidth: 1.5,
         borderRadius: 0,
         textAlign: 'center',
         fontSize: 18,
         color: Colors.secondary,
         marginHorizontal: 5,
     },
     qrInputGroup: {
         flexDirection: 'row',
         justifyContent: 'space-between',
         marginTop: 25,
         marginBottom: 0,
     },
     qrSubmitBtnContainer: {
         alignItems: 'flex-end',
         justifyContent: 'flex-end',
         width: '100%',
     },
     qrSubmitBtn: {
         backgroundColor: Colors.secondary,
         borderColor: Colors.secondary,
         borderWidth: 1.5,
         lineHeight: 16,
         paddingHorizontal: 15,
         paddingVertical: 12,
         borderRadius: 0,
         alignItems: 'center',
         justifyContent: 'center',
         width: '100%'
     },
     qrSubBtnText: {
         fontSize: 14,
         fontFamily: 'Poppins-Medium',
         color: Colors.white,
         alignItems: 'center',
     },
     authenticatorText: {
         paddingTop: 0,
         fontSize: 13,
         color: Colors.gray99,
         fontFamily: 'Poppins-Regular',
         borderRadius: 5,
     },
     secretText: {
         marginTop: 10,
         paddingTop: 6,
         paddingBottom: 3,
         paddingRight: 40,
         fontSize: 13,
         color: Colors.black,
         fontFamily: 'Poppins-Medium',
         borderRadius: 5,
         backgroundColor: 'rgb(242, 242, 242)',
         paddingHorizontal: 4,
         textDecorationLine: 'underline'
     },
     copyTopContainer: {
         paddingHorizontal: 15,
         paddingTop: 12
     },
     copySecretCodeBtn: {
         position: 'absolute',
         right: 6,
         top: 15
     }*/
};

const ProfileStyle = (isDarkMode) => {
    return StyleSheet.create(isDarkMode ? darkTheme : lightTheme);
};

export default ProfileStyle