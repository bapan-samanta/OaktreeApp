// App.js
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { StatusBar, AppState, LogBox } from 'react-native';
import { ThemeProvider } from './src/Contexts/ThemeContext';
import { MenuProvider } from 'react-native-popup-menu';
// import HomeScreen from './src/Modules/Booking/Pages/HomeScreen';
import ProfileScreen from './src/Modules/Profile/Pages/ProfileScreen';
import LoginScreen from './src/Modules/Login/Pages/LoginScreen';
import VideoCall from './src/Modules/VideoCall/Pages/VideoCallScreen';
import { enableScreens } from 'react-native-screens';
import CustomDrawerContent from './src/Utility/Components/CustomDrawer';
import ScreenWrapper from './src/Utility/Components/Wrapper';
import Colors from './src/Utility/Colors';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventEmitter from './src/Contexts/EventEmitter';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { refershToken } from './src/Utility/Http';
import { getCurrentUser } from './src/Controller/CommonController'
import NetInfo from "@react-native-community/netinfo";
import { showMessage, hideMessage } from "react-native-flash-message";

import { navigationRef } from './src/Utility/Components/navigationService';

import AppointmentScreen from './src/Modules/Appointment/Pages/AppointmentScreen';
import QuestionnaireScreen from './src/Modules/Questionnaire/Pages/QuestionnaireScreen';
import { Provider } from 'react-redux';
import { store } from "./src/Store/configureStore"

enableScreens();
const Drawer = createDrawerNavigator();
const DefaultLayout = createStackNavigator();
LogBox.ignoreAllLogs();

//export const navigationRef = createNavigationContainerRef();


const DefaultLayoutScreen = ({ navigation }) => (
  <DefaultLayout.Navigator>
    <DefaultLayout.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false
      }}
    />
    {/* <DefaultLayout.Screen
      name="Forgot"
      component={ForgotPasswordScreen}
      options={{
        headerShown: false
      }}
    />
    <DefaultLayout.Screen
      name="Verification"
      component={OtoVerification}
      options={{
        headerShown: false
      }}
    /> */}
    {/* <DefaultLayout.Screen
      name="NoSubscription"
      component={NoSubscriptionMessage}
      options={{
        headerShown: false
      }}
    /> */}

  </DefaultLayout.Navigator>
);

function App() {
  const dispatch = useDispatch();
  let [token, setToken] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);
  const tokenData = useSelector((state) => {
    // console.log("===========",state);
    return state.token?.accesToken || "";
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        showMessage({
          message: "You are offline",
          autoHide: false,
          type: 'danger',
          style: { marginTop: StatusBar.currentHeight }
        });
      } else {
        showMessage({
          message: "You are online",
          type: "info",
          style: { marginTop: StatusBar.currentHeight }
        });
      }
    });

    // Clean up the subscription when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []);

  const loginWithRefreshToken = async () => {
    if (appState == 'active') {
      let loginTime = await AsyncStorage.getItem('loginTime') != "" ? JSON.parse(await AsyncStorage.getItem('loginTime')) : "";
      //console.log("loginTime==========", loginTime)
      if (loginTime && loginTime != "") {
        let logingExpireTime = moment(loginTime.expiryTime);
        let currentDateTime = moment();
        //console.log("logingExpireTime======", logingExpireTime)
        //console.log("currentDateTime======", currentDateTime)
        if (currentDateTime.isAfter(logingExpireTime)) {
          refershToken();
          await getCurrentUserFunction(await AsyncStorage.getItem('finalIdToken'))
        } else {
          //console.log("The date and time have not expired yet.");
        }
      } else {
        //console.log("Login time blank")
      }
    }
  }

  getCurrentUserFunction = async (finalIdToken) => {
    let header = {
      "Authorization": finalIdToken
    }
    setLoading(true);
    getCurrentUser(header).then(async (userResponse) => {
      setLoading(false);
      if (userResponse.success) {
        await AsyncStorage.setItem('loginCredentials', JSON.stringify(userResponse.data));
      }
    }).catch(err => {
      setLoading(false);
    })
  }

  useEffect(() => {
    loginWithRefreshToken();
  }, [])

  useEffect(() => {

  });

  useEffect(() => {
    const listener = EventEmitter.addListener("broadcustMessage", async (message) => {
      //console.log("EventEmitter message===", message);
      if (message.loginSuccess === true) {
        //getTokenValue()
        //let idToken = await AsyncStorage.getItem('finalIdToken');
        //dispatch({ type: 'SET_TOKEN', payload: idToken });
      }
      if (message.logoutSuccess === true) {
        //console.log("Logout successful")
       // dispatch({ type: 'SET_TOKEN', payload: "" });
        // navigationRef.navigate({
        //   index: 0,
        //   routes: [{ name: 'Login' }], // Redirects to the login page after logout
        // });

        navigationRef.resetRoot({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }

    })
    return () => {
      listener.remove();
    }

  }, []);

  //console.log("token=======", token)

  return (
    <Provider store={store}>
    <SafeAreaProvider>
      <MenuProvider>
        <ThemeProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.primary}
            hidden={false}
            translucent={true}
          />
          <NavigationContainer ref={navigationRef}>
            {tokenData == null || tokenData == "" ?
              <DefaultLayoutScreen /> :

              <Drawer.Navigator
                initialRouteName="Appointment"
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{ headerShown: false }} // Hide default header
              >
                <Drawer.Screen name="Appointment">
                  {(props) => (
                    <ScreenWrapper>
                      <AppointmentScreen {...props} />
                    </ScreenWrapper>
                  )}
                </Drawer.Screen>
                <Drawer.Screen name="Profile">
                  {(props) => (
                    <ScreenWrapper>
                      <ProfileScreen {...props} />
                    </ScreenWrapper>
                  )}
                </Drawer.Screen>
                <Drawer.Screen name="Questionnaire">
                  {(props) => (
                    <ScreenWrapper>
                      <QuestionnaireScreen {...props} />
                    </ScreenWrapper>
                  )}
                </Drawer.Screen>
              </Drawer.Navigator>}
          </NavigationContainer>
        </ThemeProvider>
      </MenuProvider>
    </SafeAreaProvider>
    </Provider>
  );
}

export default App;
