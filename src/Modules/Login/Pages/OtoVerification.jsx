import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image
} from 'react-native';
import LoginStyle from '../Public/css/LoginStyle';
import { useRoute } from '@react-navigation/native';
import { verifyMFA, userOrganisationGet, getCurrentUser } from '../Controller/LoginController'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../Utility/Components/Loader'
import { StatusBar, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage, hideMessage } from "react-native-flash-message";
import EventEmitter from '../../../Contexts/EventEmitter'

const OtpVerification = ({ navigation }) => {
    const route = useRoute();
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [attempts, setAttempts] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Enter verification code sent to your register phone number");
    const maxAttempts = 3;
    const correctOtp = '123456';
    const dispatch = useDispatch();
    const inputRefs = useRef([]);

    useEffect(() => {
        if (route.params?.challengeName && route.params.challengeName == "SOFTWARE_TOKEN_MFA") {
            setMessage("Please enter the 6-digit code from your authenticator app. This code is time-sensitive and changes every 30 seconds. Ensure you enter the latest code before submitting.")
        }
    }, [route.params]);

    const handleChange = (value, index) => {
        if (isNaN(value)) return;
        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);
        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace' && otp[index] === '') {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleConfirm = async () => {
        const enteredOtp = otp.join('');
        //console.log("Entering", enteredOtp)
        if (enteredOtp.length === otp.length) {
            await verifyMFAFunction(enteredOtp);
        } else {
            setAttempts(attempts + 1);
            if (attempts + 1 >= maxAttempts) {
                navigation.navigate('Login');
            }
        }
    };

    const verifyMFAFunction = async (enteredOtp) => {
        //console.log("userResponse=============00000")
        let header = {
            "Session": route.params.session
        }
        let data = {
            "otp": enteredOtp,
            "username": route.params.username,
            "challengeName": route.params.challengeName
        }
        setLoading(true);
        verifyMFA(data, header).then(async (response) => {
            //console.log("response========", response)
            if (response.success) {
                await _storeData(response)
            }

            //setLoading(false);

        }).catch(err => {
            //console.log("LoginController.getCurrentUser err .....", err)
            setLoading(false);
        })
    }

    _storeData = async (response) => {
        try {
            const finalIdToken = "Bearer " + response.data.idToken;
            await AsyncStorage.setItem('finalIdToken', finalIdToken);
            await AsyncStorage.setItem('i18nextLng', "en");
            await AsyncStorage.setItem('accessToken', response.data.accessToken);
            await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
            const expiresIn = await getExpiryDetails(response.data.expiresIn)
            await AsyncStorage.setItem('loginTime', JSON.stringify(expiresIn));
            await getuserOrginazationFunction(finalIdToken);

        } catch (error) {
            // Error saving data
        }
    };

    const getuserOrginazationFunction = async (finalIdToken) => {
        //console.log("userResponse=============00000")
        let header = {
            "Authorization": finalIdToken
        }
        //setLoading(true);
        userOrganisationGet(header).then(async (response) => {
            //console.log("userResponse=============111111111", response)

            if (response.success) {
                if (response.data.hasOwnProperty("UserHotelBranchRoleRelation") && response.data.UserHotelBranchRoleRelation) {
                    await AsyncStorage.setItem('attachOrganization', JSON.stringify(response.data.UserHotelBranchRoleRelation));
                    await AsyncStorage.setItem('chooseOrganization', JSON.stringify(response.data.UserHotelBranchRoleRelation[0]));
                    await getCurrentUserFunction(finalIdToken);
                }
            }
        }).catch(err => {
            // console.log("LoginController.userOrganisationGet err .....", err)
            setLoading(false);
        })
    }

    getCurrentUserFunction = async (finalIdToken) => {
        let header = {
            "Authorization": finalIdToken
        }
        setLoading(true);
        getCurrentUser(header).then(async (userResponse) => {
            //console.log("userResponse=============111111111", userResponse)
            setLoading(false);
            if (userResponse.success) {
                showMessage({
                    message: "Login successfully ",
                    type: "info",
                    style: { marginTop: StatusBar.currentHeight, fontSize: 16 }
                });
                await AsyncStorage.setItem('loginCredentials', JSON.stringify(userResponse.data));
                //dispatch({ type: 'SET_TOKEN', payload: finalIdToken });
                EventEmitter.emit("broadcustMessage", {
                    "loginSuccess": true
                })
            }
        }).catch(err => {
            //console.log("LoginController.getCurrentUser err .....", err)
            setLoading(false);
        })
    }

    return (
        <View style={LoginStyle.container}>
            <ImageBackground
                source={require('../Public/images/loginbk.png')}
                style={LoginStyle.backgroundImage}
                resizeMode="cover"
            >
                <Loader loading={loading} />
                <View style={LoginStyle.loginBox}>
                    <View style={LoginStyle.logoPosition}>
                        <Image source={require('../../../Utility/Public/images/shield.png')} style={LoginStyle.authenticationLogoHeight} />
                    </View>
                    <Text style={LoginStyle.otpVerificationLabel}>{message}</Text>
                    <View style={LoginStyle.otpContainer}>
                        {otp.map((data, index) => (
                            <TextInput
                                key={index}
                                ref={(input) => (inputRefs.current[index] = input)}
                                style={LoginStyle.otpInput}
                                value={data}
                                onChangeText={(value) => handleChange(value, index)}
                                onKeyPress={(event) => handleKeyPress(event, index)}
                                maxLength={1}
                                keyboardType="numeric"
                            />
                        ))}
                    </View>
                    <View style={{ marginBottom: 20, marginTop: 15, width: '100%' }}>
                        <TouchableOpacity style={LoginStyle.loginButton} onPress={handleConfirm}>
                            <Text style={LoginStyle.loginButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default OtpVerification;

