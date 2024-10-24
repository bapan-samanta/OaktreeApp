import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { useNavigationState } from '@react-navigation/native';
import GlobalBottomSheet from '../Components/GlobalBottomSheet'
import SwitchOrganizationModalContent from '../Components/SwitchOrganizationModalContent'
import CommonStyle from '../Public/css/CommonStyle';
import { useNavigation } from '@react-navigation/native';
import EventEmitter from '../../Contexts/EventEmitter';

const ScreenWrapper = ({ children }) => {
    const routeName = useNavigationState(state => state.routeNames[state.index]);
    const showHeader = routeName !== 'Login' && routeName !== 'Forgot' && routeName !== 'Verification';
    const showFooter = routeName !== 'Login' && routeName !== 'Forgot' && routeName !== 'Verification';
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
    const navigation = useNavigation();

    const [switchPopupFlag, setSwitchPopupFlag] = useState(false);
    const snapPoints = ['60%'];

    const switchOrganizationSheet = (status) => {
        if (status) {
            setSwitchPopupFlag(true)
        }
    }
    const switchPopupHide = () => {
        setSwitchPopupFlag(false)
    }
    const organizationChangeSuccess = (status) => {
        if (status) {
            switchPopupHide()
            //navigation.navigate("Home")
            EventEmitter.emit("broadcustMessage", {
                "organizationSwitch": true
            })
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: statusBarHeight }}>
            <View style={CommonStyle.screenWrapperContainer}>
                {showHeader && <CustomHeader pageName={routeName} switchOrganizationSheet={switchOrganizationSheet} />}
                {children}
                {showFooter && <CustomFooter pageName={routeName} />}

                <GlobalBottomSheet
                    isVisible={switchPopupFlag}
                    onClose={switchPopupHide}
                    snapPoints={snapPoints}
                    bodyContent={
                        <SwitchOrganizationModalContent
                            organizationChangeSuccess={organizationChangeSuccess}
                        />
                    }
                />
            </View>
        </SafeAreaView>
    );
};

export default ScreenWrapper;
