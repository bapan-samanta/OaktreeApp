import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../Contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventEmitter from '../../Contexts/EventEmitter';
import { useDispatch, useSelector } from 'react-redux';
import DrawerStyle from '../Public/css/DrawerStyle';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused
import Colors from '../Colors';



function CustomDrawerContent(props) {
  const { isDarkTheme, toggleTheme } = useTheme();
  const theme = DrawerStyle(isDarkTheme);
  const [profilePicture, setprofilePicture] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userContact, setUserContact] = useState("");
  const isFocused = useIsFocused(); // Hook to track if the screen is focused
  const dispatch = useDispatch();
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const reduxAuthJson = useSelector((state) => state);

  const DrawerItemWithIcon = ({ label, icon, onPress, isActive }) => (
    <TouchableOpacity
      style={[theme.drawerItem, isActive && theme.activeDrawerItem]}
      onPress={onPress}
    >
      <Icon name={icon} size={24} color={isDarkTheme ? Colors.white : Colors.white} />
      <Text style={[theme.drawerItemText, { color: isDarkTheme ? Colors.white : Colors.white }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const drawerItems = [
    { label: 'Appointment', icon: 'calendar', route: 'Appointment' },
    { label: 'My Therapy Tasks', icon: 'new-message', route: 'Questionnaire' },
    { label: 'Profile', icon: 'user', route: 'Profile' },
    // Add more items here
  ];

  const logoutApp = async () => {
    await AsyncStorage.setItem('finalIdToken', "");
    await AsyncStorage.setItem('i18nextLng', "en");
    await AsyncStorage.setItem('accessToken', "");
    await AsyncStorage.setItem('refreshToken', "");
    await AsyncStorage.setItem('loginCredentials', "");
    await AsyncStorage.setItem('loginTime', "");
    await AsyncStorage.setItem('attachOrganization', "");
    await AsyncStorage.setItem('chooseOrganization', "");
    EventEmitter.emit("broadcustMessage", {
      "logoutSuccess": true
    })
    dispatch({ type: 'SET_TOKEN', payload: "" });
  }

  const getProfilePictureValue = async () => {
    let profileImage = "";
    let profilePictureValue = JSON.parse(await AsyncStorage.getItem('loginCredentials'));
    if (profilePictureValue && profilePictureValue.user_details && profilePictureValue.user_details.hasOwnProperty('profile_img_url')) {
      let parseObject = profilePictureValue.user_details.profile_img_url ? JSON.parse(profilePictureValue.user_details.profile_img_url) : "";
      if (parseObject != "" && parseObject.hasOwnProperty('img_url') && parseObject.img_url != "") {
        profileImage = parseObject.img_url
      }
    }
    setprofilePicture(profileImage)
  };

  useEffect(() => {
    getProfilePictureValue();
  }, [])

  const getUserFullName = async () => {
    try {
      const userNameValue = JSON.parse(await AsyncStorage.getItem('loginCredentials'));
      if (userNameValue?.user_details?.first_name && userNameValue?.user_details?.last_name) {
        const userFullName = `${userNameValue.user_details.first_name} ${userNameValue.user_details.last_name}`;
        setUserName(userFullName);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    getUserFullName();
  }, []);

  const currentRoute = props.state?.routeNames[props.state.index] || ''; // Get the current route name

  const getUserEmail = async () => {
    let userMailIdValue = JSON.parse(await AsyncStorage.getItem('loginCredentials'));
    //console.log("userMailIdValue========", userMailIdValue)
    if (userMailIdValue && userMailIdValue.user_details && userMailIdValue.user_details.hasOwnProperty('user_email')) {
      setUserEmail(userMailIdValue.user_details.user_email)
    }
  };

  useEffect(() => {
    getUserEmail();
  }, [])

  const getUserPhone = async () => {
    let userContactValue = JSON.parse(await AsyncStorage.getItem('loginCredentials'));
    //console.log("userContactValue========", userContactValue)
    if (userContactValue && userContactValue.user_details && userContactValue.user_details.hasOwnProperty('contact_number')) {
      setUserContact(userContactValue.user_details.contact_number)
    }
  };

  useEffect(() => {
    getUserPhone();
  }, [])

  return (
    <View style={[theme.drawerContainer, style = { paddingTop: statusBarHeight }]}>
      <TouchableOpacity onPress={() => props.navigation.closeDrawer()} style={[theme.closeDrawerButton]}>
        <MaterialIcons name="close" size={20} color={isDarkTheme ? Colors.secondary : Colors.white} />
      </TouchableOpacity>
      <View style={theme.leftHeader}>
        <Image
          source={profilePicture ? { uri: profilePicture } : require('../Public/images/usericon.png')}
          style={theme.leftLogo}
        />
        <Text style={theme.leftHeaderText}>{reduxAuthJson.currentUserDetails.firstName} {reduxAuthJson.currentUserDetails.lastName}</Text>
        <Text style={theme.userMailText}>{userEmail}</Text>
        <Text style={theme.userMailText}>{userContact}</Text>
      </View>

      <FlatList
        data={drawerItems}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <DrawerItemWithIcon
            label={item.label}
            icon={item.icon}
            onPress={() => props.navigation.navigate(item.route)}
            isActive={item.route === currentRoute} // Set active state based on the current route
          />
        )}
        contentContainerStyle={theme.drawerItems}
      />
      <TouchableOpacity style={[theme.drawerItem, theme.logoutBtn]} onPress={logoutApp}>
        <Icon name="log-out" size={24} color={isDarkTheme ? Colors.white : Colors.white} />
        <Text style={[theme.drawerItemText, { color: isDarkTheme ? Colors.white : Colors.white }]}>
          Logout
        </Text>
      </TouchableOpacity>
      <View style={{ marginBottom: 30 }}></View>
      {/* <TouchableOpacity style={[theme.drawerItem, theme.toggleButton]} onPress={toggleTheme}>
        <MaterialIcons name="timelapse" size={24} color={isDarkTheme ? Colors.white : Colors.primary} />
        <Text style={[theme.drawerItemText, { color: isDarkTheme ? Colors.white : Colors.primary }]}>
          {isDarkTheme ? 'Switch to Light Mode ' : 'Switch to Dark Mode'}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}

export default CustomDrawerContent;
