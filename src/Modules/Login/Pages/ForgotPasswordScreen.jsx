import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ImageBackground
} from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import LoginStyle from '../Public/css/LoginStyle';
import Colors from '../../../Utility/Colors'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import GlobalBottomSheet from '../../../Utility/Components/GlobalBottomSheet'
import PasswordHintsContent from '../Components/PasswordHintsContent'
import { forgotPassword, changePassword } from '../Controller/LoginController'
import Toast from 'react-native-simple-toast';
import { useRoute } from '@react-navigation/native';
import Loader from '../../../Utility/Components/Loader'
import { StatusBar, AppState } from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";

export default function ForgotPasswordScreen({ navigation }) {
    const route = useRoute();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);
    const [hideShowChangePasswordPanel, setHideShowChangePasswordPanel] = useState(false);
    const [isSheetVisible, setSheetVisible] = useState(false);
    const snapPoints = ['57%'];

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const toggleRepeatPasswordVisibility = () => setIsRepeatPasswordVisible(!isRepeatPasswordVisible);
    const backToLogin = () => navigation.navigate('Login');
    const passwordHintsPopup = () => setSheetVisible(true);
    const hideBottomSheet = () => setSheetVisible(false);
    const [resetEmail, setResetEmail] = useState(route?.params?.email ? route.params.email : "");
    const [resetEmailError, setResetEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const [varificationCode, setVarificationCode] = useState("");
    const [varificationCodeError, setVarificationCodeError] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const [newPasswordError, setnewPasswordError] = useState("");
    const [newConfirmPassword, setnewConfirmPassword] = useState("");
    const [newConfirmPasswordError, setnewConfirmPasswordError] = useState("");


    const resetPassword = () => {

        if (resetEmail == "") {
            setResetEmailError("Please enter a valid email")
        } else {
            var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            if (!expr.test(resetEmail)) {
                setResetEmailError("Please enter a valid email");
            } else {
                setResetEmailError("");
                forgotPasswordFunction();
            }
        }
        //setHideShowChangePasswordPanel(true)
    }

    const forgotPasswordFunction = async () => {
        let data = {}
        if (resetEmail != "") {
            data['username'] = resetEmail;
        }
        // if (username == "") {
        //     data['username'] = phone_number;
        // }
        data['application_platform'] = 'admin';
        setLoading(true);
        forgotPassword(data).then((response) => {
            //console.log("responseresponseresponse==>",response)
            if (response.success) {
                showMessage({
                    message: response.message,
                    type: "info",
                    style: { marginTop: StatusBar.currentHeight, fontSize: 16 }
                });
                if (response.message == "Username and a temporary password have been sent to your email. please log in using the credentials and change your password.") {
                    backToLogin();
                } else {
                    setHideShowChangePasswordPanel(true)
                }
            } else {
                showMessage({
                    message: response.message,
                    type: "info",
                    style: { marginTop: StatusBar.currentHeight, fontSize: 16 }
                });
            }
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
        });

    }


    const updatePasswordFunction = () => {
        let valid = validationForPasswordChange();
        if (valid) {
            let data = {}
            data['username'] = resetEmail;
            data['password'] = newPassword;
            data['confirmation_code'] = varificationCode;
            setLoading(true);
            changePassword(data).then((response) => {
                setLoading(false);
                if (response.success) {
                    showMessage({
                        message: response.message,
                        type: "info",
                        style: { marginTop: StatusBar.currentHeight, fontSize: 16 }
                    });
                    backToLogin();
                } else {
                    showMessage({
                        message: response.message,
                        type: "warning",
                        style: { marginTop: StatusBar.currentHeight, fontSize: 16 }
                    });
                }

            }).catch((error) => {
                setLoading(false);
            });

        }
    }


    const validationForPasswordChange = () => {
        let valid = true;

        if (newPassword == "") {
            valid = false;
            setnewPasswordError('Please enter password')
        } else {
            setnewPasswordError('')
        }
        if (newConfirmPassword == "") {
            valid = false;
            setnewConfirmPasswordError('Please enter confirm password')
        } else {
            setnewConfirmPasswordError('')
        }

        if ((newPassword != "" && newConfirmPassword != "") && newPassword != newConfirmPassword) {
            valid = false;
            setnewConfirmPasswordError("Password doesn't match")
        }
        if (varificationCode == "") {
            valid = false;

            setVarificationCodeError("Please enter verification code")
        } else {
            setVarificationCodeError("")
        }
        return valid;
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
                        <Image source={require('../Public/images/logo.png')} style={LoginStyle.logoHeight} />
                    </View>
                    <View style={LoginStyle.inputContainer}>
                        <EvilIcons name="envelope" size={25} color={Colors.secondary} style={LoginStyle.emailLineHeight} />
                        <TextInput
                            style={LoginStyle.input}
                            placeholder="Email"
                            placeholderTextColor={Colors.gray99}
                            returnKeyLabel='Done'
                            returnKeyType='done'
                            value={resetEmail}
                            onChangeText={(text) => { setResetEmail(text); setResetEmailError("") }}
                            autoCapitalize="none"
                        />
                        {resetEmailError != "" ? <Text style={LoginStyle.errorMsg}>{resetEmailError}</Text> : null}
                    </View>
                    {hideShowChangePasswordPanel && (
                        <>
                            <View style={LoginStyle.inputContainer}>
                                <Octicons name="verified" size={18} color={Colors.secondary} style={LoginStyle.verifiedLineHeight} />
                                <TextInput
                                    style={LoginStyle.input}
                                    placeholder="Verification code"
                                    placeholderTextColor={Colors.gray99}
                                    returnKeyLabel='Done'
                                    returnKeyType='done'
                                    value={varificationCode}
                                    onChangeText={(text) => { setVarificationCode(text); setVarificationCodeError("") }}
                                />
                                {varificationCodeError != "" ? <Text style={LoginStyle.errorMsg}>{varificationCodeError}</Text> : null}
                            </View>
                            <View style={LoginStyle.inputContainer}>
                                <EvilIcons name="lock" size={30} color={Colors.secondary} style={LoginStyle.passwordLineHeight} />
                                <TextInput
                                    style={[LoginStyle.input, { flex: 1 }]}
                                    placeholder="New password"
                                    placeholderTextColor={Colors.gray99}
                                    secureTextEntry={!isPasswordVisible}
                                    returnKeyLabel='Done'
                                    returnKeyType='done'
                                    value={newPassword}
                                    onChangeText={(text) => { setnewPassword(text); setnewPasswordError("") }}
                                />
                                <TouchableOpacity onPress={togglePasswordVisibility}>
                                    <Feather
                                        name={isPasswordVisible ? 'eye' : 'eye-off'}
                                        size={20}
                                        color={Colors.secondary}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={LoginStyle.infoIcon} onPress={passwordHintsPopup}>
                                    <Feather
                                        name="info"
                                        size={19}
                                        color={Colors.secondary}
                                    />
                                </TouchableOpacity>
                                {newPasswordError != "" ? <Text style={LoginStyle.errorMsg}>{newPasswordError}</Text> : null}
                            </View>
                            <View style={LoginStyle.inputContainer}>
                                <EvilIcons name="lock" size={30} color={Colors.secondary} style={LoginStyle.passwordLineHeight} />
                                <TextInput
                                    style={[LoginStyle.input, { flex: 1 }]}
                                    placeholder="Repeat new password"
                                    placeholderTextColor={Colors.gray99}
                                    secureTextEntry={!isRepeatPasswordVisible}
                                    returnKeyLabel='Done'
                                    returnKeyType='done'
                                    value={newConfirmPassword}
                                    onChangeText={(text) => { setnewConfirmPassword(text); setnewConfirmPasswordError("") }}

                                />
                                <TouchableOpacity onPress={toggleRepeatPasswordVisibility}>
                                    <Feather
                                        name={isRepeatPasswordVisible ? 'eye' : 'eye-off'}
                                        size={20}
                                        color={Colors.secondary}
                                    />
                                </TouchableOpacity>
                                {newConfirmPasswordError != "" ? <Text style={LoginStyle.errorMsg}>{newConfirmPasswordError}</Text> : null}
                            </View>
                        </>
                    )}
                    <View style={LoginStyle.loginBtnInner}>
                        {!hideShowChangePasswordPanel ? (
                            <TouchableOpacity style={LoginStyle.loginButton} onPress={resetPassword}>
                                <Text style={LoginStyle.loginButtonText}>Reset Password</Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity style={LoginStyle.loginButton} onPress={updatePasswordFunction}>
                                    <Text style={LoginStyle.loginButtonText}>Change Password</Text>
                                </TouchableOpacity>

                                <View style={LoginStyle.resendBox}>
                                    <TouchableOpacity onPress={forgotPasswordFunction}>
                                        <Text style={LoginStyle.forgotPassword}>Resend verification code</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                        {!hideShowChangePasswordPanel && (
                            <View style={LoginStyle.backToBox}>
                                <TouchableOpacity onPress={backToLogin}>
                                    <Text style={LoginStyle.forgotPassword}>Back to login screen</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
                <GlobalBottomSheet
                    isVisible={isSheetVisible}
                    onClose={hideBottomSheet}
                    snapPoints={snapPoints}
                    bodyContent={
                        <PasswordHintsContent />
                    }
                />
            </ImageBackground>
        </View>
    );
}
