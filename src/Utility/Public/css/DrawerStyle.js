import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import Colors from "../../Colors";

const lightTheme = {
    leftHeader: {
        padding: 16,
        backgroundColor: Colors.green02,
        alignItems: 'center',
        paddingBottom: 8
    },
    leftLogo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    leftHeaderText: {
        color: Colors.white,
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        lineHeight: 16
    },
    userMailText: {
        color: Colors.white,
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        lineHeight: 16
    },
    drawerItems: {
        flexGrow: 1,
        marginTop: 16,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 16,
        borderRadius: 5,
        // backgroundColor: Colors.lightGray,
        marginVertical: 5,
    },
    drawerItemText: {
        fontSize: 16,
        marginLeft: 10,
        color: Colors.white,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 16,
        borderRadius: 5,
        backgroundColor: 'transparent',
        marginVertical: 5,
        marginBottom: 10
    },
    toggleText: {
        color: Colors.white,
        fontSize: 16,
    },
    logoutBtn: {
        marginTop: 10,
        marginBottom: 0
    },
    drawerContainer: {
        flex: 1,
        backgroundColor: Colors.green01,
        paddingTop: 24,
        position: 'relative',
    },
    closeDrawerButton: {
        backgroundColor: Colors.lightBlack,
        padding: 4,
        color: Colors.white,
        width: 30,
        height: 30,
        borderRadius: 50,
        position: 'absolute',
        right: 5,
        top: 40,
        zIndex: 1000,
        textAlign: 'center',
        cursor: 'pointer',

    },
    closeButton: {
        color: 'white',
        fontSize: 16,
    },
    activeDrawerItem: {
        backgroundColor: Colors.green03, // Highlight color for active item
    },


};

const darkTheme = {
    leftHeader: {
        padding: 16,
        backgroundColor: Colors.gray99,
        alignItems: 'center',
        paddingBottom: 8
    },
    leftLogo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    leftHeaderText: {
        color: Colors.white,
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        lineHeight: 16
    },
    userMailText: {
        color: Colors.white,
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        lineHeight: 16
    },
    drawerItems: {
        flexGrow: 1,
        marginTop: 16,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 16,
        borderRadius: 5,
        backgroundColor: 'transparent',
        marginVertical: 5,
    },
    drawerItemText: {
        fontSize: 16,
        marginLeft: 10,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 16,
        borderRadius: 5,
        backgroundColor: 'transparent',
        marginVertical: 5,
        marginBottom: 10
    },
    toggleText: {
        color: Colors.lightBlack,
        fontSize: 16,
    },
    logoutBtn: {
        marginTop: 10,
        marginBottom: 0
    },
    drawerContainer: {
        flex: 1,
        backgroundColor: Colors.lightBlack,
        paddingTop: 24,
        position: 'relative',
    },
    closeDrawerButton: {
        backgroundColor: Colors.white,
        padding: 4,
        color: Colors.white,
        width: 30,
        height: 30,
        borderRadius: 50,
        position: 'absolute',
        right: 5,
        top: 40,
        zIndex: 1000,
        textAlign: 'center',
        cursor: 'pointer',

    },
    closeButton: {
        color: 'white',
        fontSize: 16,
    },
    activeDrawerItem: {
        backgroundColor: Colors.gray99, // Highlight color for active item
    },
};

const DrawerStyle = (isDarkMode) => {
    return StyleSheet.create(isDarkMode ? darkTheme : lightTheme);
};

export default DrawerStyle