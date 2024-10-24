import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput
} from 'react-native';
import Colors from '../../../Utility/Colors'
import LoginStyle from '../Public/css/LoginStyle'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-simple-toast';
import { forcePasswordChange } from '../Controller/LoginController'
const ChangePasswordModalContent = ({ email, challangeName, updatedPasswordSession, setNewPasswordRequiredModal, navigation }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);
    const [updatePassword, setUpdatePassword] = useState("");
    const [updateConfirmPassword, setUpdateConfirmPassword] = useState("");
    const [updatePasswordError, setUpdatePasswordError] = useState("");
    const [updateConfirmPasswordError, setUpdateConfirmPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    const toggleRepeatPasswordVisibility = () => {
        setIsRepeatPasswordVisible(!isRepeatPasswordVisible);
    };

    const updatedPassword = () => {
        let valid = validPasswordMatch();
        if (valid) {
            setLoading(true);
            let header = {};
            header["session"] = updatedPasswordSession;
            let data = {
                "username": email,
                "password": updatePassword,
                "challengeName": challangeName
            }
            //console.log("data==", data);
            //console.log("header==", header);
            forcePasswordChange(data, header).then((response) => {
                //console.log("====updatedPassword====", response)
                //console.log("====data====",data)
                if (response) {
                    setLoading(false);
                    if (response.success) {
                        Toast.show(`Password Changed Successfully`)
                        setNewPasswordRequiredModal(false)
                        navigation.navigate('Login');
                    } else {
                        setLoading(false);
                    }
                }
            }).catch((error) => {
                setLoading(false);
                //Toast.show(`${this.props.t('sessionexpiredmsg')}`);
            });
        }


    }

    const validPasswordMatch = () => {
        let valid = true;
        if (updatePassword == "") {
            valid = false;
            setUpdatePasswordError("Input valid password")
        } else {
            setUpdatePasswordError("")
        }

        if (updateConfirmPassword == "") {
            valid = false;
            setUpdateConfirmPasswordError("Input valid confirm password")
        } else {
            setUpdateConfirmPasswordError("")
        }

        if (updatePassword == updateConfirmPassword && updatePassword != "" && updateConfirmPassword != "") {
            setUpdatePasswordError("")
            setUpdateConfirmPasswordError("")
        } else {
            valid = false;
            Toast.show(`Password and Confirm password does not match`);

        }
        return valid;
    }

    return (
        <View style={LoginStyle.changePassModalContent}>
            <View style={LoginStyle.changeInputInner}>
                <EvilIcons name="lock" size={30} color={Colors.secondary} style={LoginStyle.passwordLineHeight} />
                <TextInput
                    style={[LoginStyle.changeInput, { flex: 1 }]}
                    placeholder="Update Password"
                    placeholderTextColor={Colors.gray99}
                    secureTextEntry={!isPasswordVisible}
                    returnKeyLabel='Done'
                    returnKeyType='done'
                    value={updatePassword}
                    // onChangeText={(text) => setUpdatePassword(text)}

                    onChangeText={(text) => {
                        setUpdatePassword(text);
                        setUpdatePasswordError("");
                    }}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Feather
                        name={isPasswordVisible ? 'eye' : 'eye-off'}
                        size={20}
                        color={Colors.secondary}
                    />
                </TouchableOpacity>
                {updatePasswordError != "" ? <Text style={LoginStyle.errorMsg}>{updatePasswordError}</Text> : null}
            </View>
            <View style={LoginStyle.changeInputInner}>
                <EvilIcons name="lock" size={30} color={Colors.secondary} style={LoginStyle.passwordLineHeight} />
                <TextInput
                    style={[LoginStyle.changeInput, { flex: 1 }]}
                    placeholder="Confirm Update Password"
                    placeholderTextColor={Colors.gray99}
                    secureTextEntry={!isRepeatPasswordVisible}
                    returnKeyLabel='Done'
                    returnKeyType='done'
                    value={updateConfirmPassword}
                    //onChangeText={(text) => setUpdateConfirmPassword(text)}

                    onChangeText={(text) => {
                        setUpdateConfirmPassword(text);
                        setUpdateConfirmPasswordError("");
                    }}
                />
                <TouchableOpacity onPress={toggleRepeatPasswordVisibility}>
                    <Feather
                        name={isRepeatPasswordVisible ? 'eye' : 'eye-off'}
                        size={20}
                        color={Colors.secondary}
                    />
                </TouchableOpacity>
                {updateConfirmPasswordError != "" ? <Text style={LoginStyle.errorMsg}>{updateConfirmPasswordError}</Text> : null}
            </View>
            <View style={LoginStyle.changePassButtonInner}>
                <TouchableOpacity
                    style={[LoginStyle.changePassButton, LoginStyle.changeElevation]}
                    onPress={updatedPassword}
                >
                    <Text style={LoginStyle.changeButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChangePasswordModalContent;
