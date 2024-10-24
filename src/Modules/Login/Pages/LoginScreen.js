import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ImageBackground,
    Modal,
    Pressable,
    TouchableWithoutFeedback,
    Linking 
} from 'react-native';
import LoginStyle from '../Public/css/LoginStyle';
import Colors from '../../../Utility/Colors';
import Config from '../../../Utility/Config';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import CheckBox from '@react-native-community/checkbox';
import Cookies from 'js-cookie';
import { loginGetApi, getCurrentUser, userOrganisationGet } from '../Controller/LoginController'
import { showMessage, hideMessage } from "react-native-flash-message";
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../Utility/Components/Loader'
import GlobalModal from '../../../Utility/Components/GlobalModal'
import ChangePasswordModalContent from '../Components/ChangePasswordModalContent'
import { AuthContext } from '../../../Contexts/context';
import { useNavigation } from '@react-navigation/native';
import EventEmitter from '../../../Contexts/EventEmitter';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUserDetails } from '../Actions/LoginAction'
import { connect } from 'react-redux';
import { StatusBar, AppState } from 'react-native';
import { GestureHandlerRootView, LongPressGestureHandler } from 'react-native-gesture-handler';
import GlobalModalBottomSheet from '../../../Utility/Components/GlobalModalBottomSheet'
import CommonStyle from '../../../Utility/Public/css/CommonStyle'
import Entypo from 'react-native-vector-icons/Entypo';
// import { navigationRef } from './src/Utility/Components/navigationService';
import { navigationRef } from '../../../../src/Utility/Components/navigationService';

function LoginScreen(props) {
    const authContext = useContext(AuthContext);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    //console.log("navigation==", navigation)
    //rbladmin@yopmail.com

    //#GHb5lt3
    const chooseEnv = useSelector((state) => state.environment);
    const State = useSelector((state) => state);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    //const [email, setEmail] = useState(__DEV__ ? "app.admin@hotelmanage.com" : "");
    //const [password, setPassword] = useState(__DEV__ ? "Admin@123!" : "");
    const [email, setEmail] = useState(__DEV__ ? "atanu.mondal@mettletech.in" : "");
    const [password, setPassword] = useState(__DEV__ ? "Mettle1!2" : "");

    const [isRemember, setIsRemember] = useState(Cookies.get('rememberMe') == 'true' ? true : false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

    const [updatedPasswordSession, setupdatedPasswordSession] = useState("");
    const [challangeName, setchallangeName] = useState("");
    const [responseUserName, setresponseUserName] = useState("");
    const [newPasswordRequiredModal, setNewPasswordRequiredModal] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    //Url type==============
    const [urlTypeModalFlag, setUrlTypeModalFlag] = useState(false);
    const [selectedValue, setSelectedValue] = useState('dev');
    const urlTypeOptions = [
        {
            label: 'Dev',
            value: 'dev',
        },
        {
            label: 'Uat',
            value: 'uat',
        },
        {
            label: 'Production',
            value: 'production',
        },
    ];

    const rememberMe = (e) => {
        //console.log(e)
        if (e == true) {
            setIsRemember(e)
            Cookies.set('rememberMe', 'true', { expires: 30 });
            Cookies.set('email', email, { expires: 30 });
            Cookies.set('password', password, { expires: 30 });
        }

        if (e == false) {
            setIsRemember(e)
            Cookies.set('rememberMe', 'false', { expires: 0 });
            Cookies.set('email', "", { expires: 0 });
            Cookies.set('password', "", { expires: 0 });
        }
    }


    const validation = () => {
        let valid = true;

        if (email == "") {
            valid = false;
            setEmailError("Please enter a valid email");
        } else {
            var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            if (!expr.test(email)) {
                setEmailError("Please enter a valid email");
                valid = false;
            } else {
                setEmailError("");
            }
        }

        if (password.trim() === "") {
            valid = false;
            setPasswordError("Please enter password")
        } else if (password.length < 6) {
            valid = false;
            setPasswordError("Password must be at least 6 characters.")
        } else {
            setPasswordError("")
        }
        return valid;
    }

    // const loginSubmit = () => {
    //     let valid = validation();
    //     if (valid) {

    //     }
    //     //navigation.navigate('Home');
    // };
    const setTokenAndUserDetails = async (token, userDetails) => {
        await dispatch(setToken(token));
        await dispatch(setUserDetails(userDetails));
    };
    

    loginSubmit = () => {
        // console.log("loginSubmit");
        let valid = validation();
        if (valid) {
            let data = {}
            data["email"] = email
            data["password"] = password
            //data["userEnd"] = "customerEnd"
            // data["userEnd"] = "backOffice"
            setLoading(true);
            loginGetApi(data).then(async (response) => {
                setLoading(false);
                if (response.status === 1) {
                    
                    const tokenHash = { 
                        refreshToken: response.data.refreshToken, 
                        accesToken: response.data.accessToken, 
                        tokenExpiryDate: response.data.expiresIn,
                        loginUserId: response.data.loginUserDetails.identificationKey
                    };
                
                    dispatch(setToken(tokenHash));
                   // dispatch({ type: 'SET_TOKEN', payload: tokenHash });
                    let userRowData = response.data.loginUserDetails;
                    // dispatch({ type: 'SET_USER_DETAILS', payload: userRowData});
                    //console.log("userRowData", userRowData);
                    dispatch(setUserDetails(userRowData));
                    Toast.show(response.message);
                    await _storeData(response)
                  //  navigation.navigate("Appointment");
                    
                   
                }else if(response.status === 0){
                    Toast.show(response.message);
                }
            }).catch((error) => {
                //console.log("===error: " + error.response.data);

                setLoading(false);
                //Toast.show(`Session expired please login again`);
            });

        } else {
            setLoading(false);
        }
    }

    _storeData = async (response) => {
        try {
            const tokenHash = { 
                refreshToken: response.data.refreshToken, 
                accesToken: response.data.accessToken, 
                tokenExpiryDate: response.data.expiresIn,
                loginUserId: response.data.loginUserDetails.identificationKey
            };
            // const finalIdToken = "Bearer " + response.data.idToken;
            // await AsyncStorage.setItem('finalIdToken', finalIdToken);
            // await AsyncStorage.setItem('i18nextLng', "en");
            await AsyncStorage.setItem('token', response.data.accessToken);
            // await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
            // const expiresIn = await getExpiryDetails(response.data.expiresIn)
            // await AsyncStorage.setItem('loginTime', JSON.stringify(expiresIn));
            // await getuserOrginazationFunction(finalIdToken);

        } catch (error) {
            // Error saving data
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const passwordHintsPopup = () => {
        setModalVisible(true)
    };

    const goToVerification = () => {
        navigation.navigate('Verification')
    }


    useEffect(() => {
        const listener = EventEmitter.addListener("broadcustMessage", async (message) => {
            if (message.passwordExpire === true) {
                navigation.navigate('Forgot', { email: email });
            }


        })
        return () => {
            listener.remove();
        }

    }, []);

    const onLongPress = () => {
        console.log('Long press detected!');
        setUrlTypeModalFlag(true);
    };

    const closeUrlTypeModal = () => {
        setUrlTypeModalFlag(false)
    };

    const handleChangeUrlType = async (value) => {
        // console.log("value========", value)
        // await AsyncStorage.setItem('environment', value);
        setSelectedValue(value)

        dispatch({ type: 'ENVIRONMENT', payload: value });
    }

    // useEffect(() => {
    //     console.log("SelectedValue=========", selectedValue)
    // }, [selectedValue])

    const ForgetYourPassword = () =>{
        Linking.openURL(Config.forgotPasswordLink).catch((err) => console.error("Couldn't load page", err));
    }

    const gotoSignUpPage = () => {
        Linking.openURL(Config.signUp).catch((err) => console.error("Couldn't load page", err));
    }


    return (
        <GestureHandlerRootView>
            <View style={LoginStyle.container}>
                
                <View
                    // source={require('../Public/images/loginbk.png')}
                    style={LoginStyle.backgroundImage}
                    resizeMode="cover"
                >
                    <Loader loading={loading} />
                    
                    <View style={LoginStyle.loginBox}>
                        <View>
                            <Image source={require('../Public/images/circle2.png')} style={LoginStyle.oaktreeCircleImage2} />
                            <Image source={require('../Public/images/circle1.png')} style={LoginStyle.oaktreeCircleImage} />
                        </View>
                        <View style={LoginStyle.logoPosition}>
                            <LongPressGestureHandler
                                onActivated={onLongPress}
                                minDurationMs={800}
                            >
                                <Image source={require('../Public/images/oaktreeLogo.png')} style={LoginStyle.logoHeight} />
                            </LongPressGestureHandler>
                            <Image source={require('../Public/images/loginLogo.png')} />
                            <Text style={LoginStyle.loginText}>Please sign in to continue</Text>
                        </View>
                        <View style={LoginStyle.inputContainer}>
                            <Image source={require('../Public/images/emailIcon.png')} style={LoginStyle.mailIconPosition}/>
                            <TextInput
                                style={LoginStyle.input}
                                placeholder="Email"
                                placeholderTextColor={Colors.gray99}
                                value={email}
                                onChangeText={(text) => { setEmail(text); setEmailError("") }}
                                returnKeyLabel='Done'
                                returnKeyType='done'
                                //onSubmitEditing={() => { loginSubmit() }}
                                autoCapitalize="none"
                            />
                            {emailError != "" ? <Text style={LoginStyle.errorMsg}>{emailError}</Text> : null}
                        </View>
                        <View style={LoginStyle.inputContainer}>
                            <EvilIcons name="lock" size={35} color={Colors.secondary} style={LoginStyle.passwordLineHeight} />
                            <TextInput
                                style={[LoginStyle.input, { flex: 1 }]}
                                placeholder="Password"
                                placeholderTextColor={Colors.gray99}
                                secureTextEntry={!isPasswordVisible}
                                value={password}
                                onChangeText={(text) => { setPassword(text); setPasswordError(""); }}
                                returnKeyLabel='Done'
                                returnKeyType='done'
                            //onSubmitEditing={() => { loginSubmit() }}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility}>
                                <Feather
                                    name={isPasswordVisible ? 'eye' : 'eye-off'}
                                    size={22}
                                    color={Colors.secondary}
                                />
                            </TouchableOpacity>
                            {passwordError != "" ? <Text style={LoginStyle.errorMsg}>{passwordError}</Text> : null}
                        </View>
                        <TouchableOpacity  style={LoginStyle.ForgetYourPassword} onPress={ForgetYourPassword}>
                            <Text style={LoginStyle.ForgetYourPasswordText}>Forgot your password ?</Text>
                        </TouchableOpacity>
                        <View style={LoginStyle.loginBtnInner}>
                            <TouchableOpacity style={LoginStyle.loginButton} onPress={loginSubmit}>
                                <Text style={LoginStyle.loginButtonText}>Login</Text>
                            </TouchableOpacity>
                            
                        </View>
                        
                    </View >
                    <View style={LoginStyle.signUpRow}>
                        <Text style={LoginStyle.signUpText}>
                            Don't have an account?{' '}
                            <Text style={LoginStyle.signUpLink} onPress={gotoSignUpPage}>
                            Sign up
                            </Text>
                        </Text>
                        <View style={LoginStyle.signUpUnderline}></View>
                    </View>
                </View >

                <GlobalModal
                    visible={newPasswordRequiredModal}
                    onCancel={() => setNewPasswordRequiredModal(false)}
                    footer={false}
                    header={true}
                    headerTitle={
                        <View style={LoginStyle.customizeModalHeader}>
                            <Text style={LoginStyle.modalHeaderTitle}>Change Password</Text>
                            <TouchableOpacity style={[LoginStyle.infoIcon, LoginStyle.infoIconPosition]} onPress={passwordHintsPopup}>
                                <Feather name="info" size={18} color={Colors.secondary} />
                            </TouchableOpacity>
                        </View>
                    }
                    body={
                        <ChangePasswordModalContent
                            email={email}
                            challangeName={challangeName}
                            updatedPasswordSession={updatedPasswordSession}
                            setNewPasswordRequiredModal={setNewPasswordRequiredModal}
                            navigation={navigation}
                            modalContentWidth="100%"
                        />
                    }

                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)} style={{ backgroundColor: 'red' }}>
                        <View style={LoginStyle.forceModalOverlay}>
                            <View style={LoginStyle.forceModalView}>
                                <View style={LoginStyle.forceModalIcon}>
                                    <Fontisto
                                        name="minus-a"
                                        size={30}
                                        color={Colors.secondary}
                                    />
                                </View>
                                <Text style={LoginStyle.forceHintsHeaderText}>Password Hints:</Text>
                                <View style={LoginStyle.forceHintContainer}>
                                    <Text style={LoginStyle.forceBullet}>•</Text>
                                    <Text style={LoginStyle.forceHintText}>
                                        Minimum length, which must be at least 8 characters but fewer than 99 characters
                                    </Text>
                                </View>
                                <View style={LoginStyle.forceHintContainer}>
                                    <Text style={LoginStyle.forceBullet}>•</Text>
                                    <Text style={LoginStyle.forceHintText}>
                                        Require numbers
                                    </Text>
                                </View>
                                <View style={LoginStyle.forceHintContainer}>
                                    <Text style={LoginStyle.forceBullet}>•</Text>
                                    <Text style={LoginStyle.forceHintText}>{`Require a special character from this set: = + - ^ $ * . [ ] { } ( ) ? ! @ # % & / , > < ' : ; | _ ~"`}
                                    </Text>
                                </View>
                                <View style={LoginStyle.forceHintContainer}>
                                    <Text style={LoginStyle.forceBullet}>•</Text>
                                    <Text style={LoginStyle.forceHintText}>Require uppercase letters</Text>
                                </View>
                                <View style={LoginStyle.forceHintContainer}>
                                    <Text style={LoginStyle.forceBullet}>•</Text>
                                    <Text style={LoginStyle.forceHintText}>Require lowercase letters</Text>
                                </View>
                                <View style={LoginStyle.forceHintContainer}>
                                    <Text style={LoginStyle.forceBullet}>•</Text>
                                    <Text style={LoginStyle.forceHintText}>Do not allow users to reuse previous passwords</Text>
                                </View>
                                <View style={LoginStyle.forceHintContainer}>
                                    <Text style={LoginStyle.forceBullet}>•</Text>
                                    <Text style={LoginStyle.forceHintText}>This ensures that users change their passwords after a 90 days.</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={urlTypeModalFlag}
                    onRequestClose={closeUrlTypeModal}
                >
                    <TouchableWithoutFeedback onPress={closeUrlTypeModal} style={{ backgroundColor: 'red' }}>
                        <View style={LoginStyle.urlTpeModalOverlay}>
                            <View style={LoginStyle.urlTpeModalBody}>
                                <View style={LoginStyle.urlTypeModalContainer}>
                                    {urlTypeOptions.map((option) => {
                                        const isSelected = option.value === chooseEnv;
                                        return (
                                            <TouchableOpacity
                                                key={option.value}
                                                onPress={() => handleChangeUrlType(option.value)}
                                                style={LoginStyle.radioButtonContainer}
                                            >
                                                <View style={LoginStyle.authenticatorContainer}>
                                                    <View style={[LoginStyle.radioCircle, isSelected && LoginStyle.selected]}>
                                                        {isSelected && <Entypo name="check" size={14} color="white" />}
                                                    </View>
                                                    <Text style={LoginStyle.radioLabel}>{option.label}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

            </View >
        </GestureHandlerRootView>
    );
}

const mapStateToProps = (globalState) => {
    //console.log("globalState===========", globalState)
    return {
        //token: globalState.token

    };
}

// export default LoginScreen;
export default connect(mapStateToProps, { setToken, setUserDetails })(LoginScreen);