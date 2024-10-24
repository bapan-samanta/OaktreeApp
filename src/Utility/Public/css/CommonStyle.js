import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import Colors from "../../Colors";

const CommonStyle = StyleSheet.create({
    //Global Modal Content
    modalDialog: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(52, 52, 52, 0.6)',
        flexDirection: 'column',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 4,
        flexDirection: 'column',
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeader: {
        width: '100%',
        textAlign: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        height: 50,
    },
    modalBodyContent: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
    },
    modalFooter: {
        height: 60,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: Colors.white,
        paddingBottom: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    modalCancelBox: {
        width: '50%',
        paddingRight: 5,
    },
    modalCancelBtn: {
        borderWidth: 1,
        borderColor: Colors.secondary,
        color: Colors.secondary,
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        borderRadius: 8,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        lineHeight: 40,
    },
    modalSaveBox: {
        width: '50%',
        paddingLeft: 5,
    },
    modalOkBtn: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        borderRadius: 8,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        color: Colors.white,
        flex: 1,
        lineHeight: 40,
    },
    modalCancelCrossBtn: {
        width: '10%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: "flex-start",
        marginTop: -6,
    },
    modalHeading: {
        color: Colors.secondary,
        fontFamily: 'Poppins-Medium',
        fontSize: 20,
        textAlign: 'left',
        alignSelf: 'center',
        width: '90%',
        paddingLeft: 23,
    },

    //Bottom sheet===========
    bottomSheetBackground: {
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: Colors.white,
    },
    bottomSheetHandle: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },

    //Search============
    headerSearchBox: {
        width: '75%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.grayF5,
        borderRadius: 30,
        paddingRight: 10,
        paddingLeft: 10,
    },
    headerSearchIcon: {
        lineHeight: 24
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 14,
        color: Colors.secondary,
        paddingLeft: 5,
        fontFamily: 'Poppins-Regular',
        paddingVertical: 0
    },
    //Header==========
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.white,
        justifyContent: 'space-between',
        minHeight: 65,
    },
    sidebarNavigationIcon: {
        height: 28,
        width: 22
    },
    pageTitleHeader: {
        width: '80%'
    },
    pageTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: Colors.secondary,
        paddingLeft: 6
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userImage: {
        height: 42,
        width: 42,
        borderWidth: 1,
        borderColor: Colors.grayDD,
        borderRadius: 40
    },
    popupMenuOption: {
        paddingHorizontal: 4,
        paddingVertical: 6
    },
    popupMenuOptionRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    popupMenuOptionText: {
        color: Colors.black7C,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        paddingLeft: 5
    },
    //Footer==========
    /*footer: {
        padding: 15,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: 8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    footerRow: {
        paddingHorizontal: 40,
        position: 'relative',
    },
    footerBox: {
        alignItems: 'center',
        padding: 0,
    },
    footerText: {
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        color: Colors.white,
        paddingTop: 0
    },
    footerActiveText: {
        color: Colors.white
    },
    footerActiveItem: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.white,
    },
    footerInactiveItem: {
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },*/
    footer: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    footerRow: {
        position: 'relative',
        backgroundColor: Colors.secondary,
        width: '50%',
        paddingTop: 8,
        paddingBottom: 8,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20
    },
    footerBox: {
        alignItems: 'center',
        padding: 0,
    },
    footerText: {
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        color: Colors.white,
        paddingTop: 0
    },
    footerActiveText: {
        color: Colors.white
    },
    footerActiveItem: {
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
    },
    footerInactiveItem: {
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
    },
    footerRowActive: {

    },
    footerRowInactive: {
        backgroundColor: Colors.gray99
    },
    //Force password hints==========
    forceModalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
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
        fontSize: 14,
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

    //Confirmation popup==============
    confirmationPopupContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    confirmationPopupTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmationPopupTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
        marginBottom: 6,
        color: Colors.secondary,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    confirmationPopupContent: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginBottom: 6,
        color: Colors.secondary,
        textAlign: 'center',
        paddingHorizontal: 15,
    },
    confirmationPopupButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: Colors.secondary,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
    },
    confirmationPopupConfirmButton: {
        paddingHorizontal: 10,
        width: '50%',
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: Colors.secondary,
    },
    confirmationPopupConfirmButtonText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: Colors.white
    },
    confirmationPopupCancelButton: {
        paddingHorizontal: 10,
        width: '50%',
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    confirmationPopupCancelButtonText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: Colors.primary
    },

    //Switch Organization
    organizationContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    organizationListRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayE7,
        minHeight: 70
    },
    orgLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        paddingRight: '12%',
    },
    orgImageContainer: {
        // width: 40,
        // height: 40,
        // borderRadius: 20,
        // backgroundColor: Colors.grayDD,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orgTextContainer: {
        marginLeft: 6,
    },
    orgNameText: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: Colors.secondary,
    },
    orgLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    orgLocation: {
        width: "93%",
        fontSize: 12,
        color: Colors.gray99,
        marginLeft: 5,
        fontFamily: 'Poppins-Regular',
    },
    orgRightSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    orgImg: {
        width: 40,
        height: 40,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.grayDD,
    },

    disabledRow: {
        backgroundColor: Colors.lightGray,
        borderBottomColor: Colors.grayB1
    },
    //Loader
    loadingOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    //ScreenWrapper
    screenWrapperContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    //Custom global bottom sheet modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        //backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingTop: 15
    },
    iconImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    iconDimension: {
        width: 105,
        height: 115
    },
    bottomSheetHeaderContainer: {
        alignItems: 'center',
        paddingBottom: 5,
        paddingHorizontal: 10
    },
    bottomSheetHeaderText: {
        paddingTop: 10,
        fontFamily: 'Poppins-Medium',
        color: Colors.primary,
        textAlign: 'center'
    },
    //Custom popup============
    customPopupOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(52, 52, 52, 0.7)',
        flexDirection: 'column',
    },
    customPopupBody: {
        height: 'auto',
        backgroundColor: Colors.white,
        borderRadius: 6
    },
    customPopupContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    customPopupContentText: {
        color: Colors.secondary,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    customPopupSecondContentText: {
        color: Colors.secondary,
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center'
    },

    //QR Code/MFA================
    authenticatorContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        borderColor: Colors.grayB1,
        borderWidth: 1.5,
        paddingHorizontal: 6,
        paddingVertical: 8,
        borderRadius: 6,
    },
    authenticatorTextContainer: {
        flexDirection: 'column',
        width: '82%'
    },
    authenticatorTextBox: {
        flexWrap: 'wrap',
        fontSize: 13,
        color: Colors.secondary,
        fontFamily: 'Poppins-Regular'
    },
    textHighlighter: {
        color: Colors.lightBlue,
    },
    authenticatorImgBox: {
        width: 30,
        height: 55
    },
    enableMFAModaLBody: {
        flex: 1,
        justifyContent: 'space-between',
        //paddingBottom: 10,
        paddingTop: 30,
    },
    enableMFAModaLContent: {
        flexDirection: 'column',
        paddingHorizontal: 15,
        justifyContent: 'center',
        paddingTop: 0,
    },

    radioButtonContainer: {
        alignItems: 'center',
        marginBottom: 10,
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
    enableSubmitMfaBtn: {
        backgroundColor: Colors.secondary,
        lineHeight: 16,
        paddingHorizontal: 10,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    enableSkipMfaBtn: {
        backgroundColor: Colors.white,
        lineHeight: 16,
        paddingHorizontal: 10,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    enableSkipMfaBtnText: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: Colors.secondary,
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
    }

})

export default CommonStyle