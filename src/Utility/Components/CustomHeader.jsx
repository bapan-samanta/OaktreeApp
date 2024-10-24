import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { useNavigation, DrawerActions  } from '@react-navigation/native';
import Colors from '../Colors'
import CommonStyle from '../Public/css/CommonStyle'
import EventEmitter from '../../Contexts/EventEmitter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useDispatch, useSelector } from 'react-redux';

const CustomHeader = ({ pageName, switchOrganizationSheet }) => {
  const navigation = useNavigation();
  const [searchbookingId, setsearchbookingId] = useState("");
  const [profilePicture, setprofilePicture] = useState("");
  const dispatch = useDispatch();
  const openDrawer = () => {
    // navigation.openDrawer();
    navigation.dispatch(DrawerActions.openDrawer());
  };


  useEffect(() => {
    const listener = EventEmitter.addListener("broadcustMessage", async (message) => {
      //console.log("message=========", message)
      if (message.organizationSwitch === true) {
        setsearchbookingId("")
      }
    })
    return () => {
      listener.remove();
    }
  }, []);

  const searchBookingSubmit = () => {
    EventEmitter.emit("broadcustMessage", {
      "bookingSearchId": searchbookingId
    })
  }

  const getProfilePictureValue = async () => {
    let profileImage = "";
    let profilePictureValue = JSON.parse(await AsyncStorage.getItem('loginCredentials'));
    //console.log("profilePictureValue===", profilePictureValue)

    if (profilePictureValue && profilePictureValue.user_details && profilePictureValue.user_details.hasOwnProperty('profile_img_url')) {
      let parseObject = profilePictureValue.user_details.profile_img_url ? JSON.parse(profilePictureValue.user_details.profile_img_url) : "";

      if (parseObject != "" && parseObject.hasOwnProperty('img_url') && parseObject.img_url != "") {
        profileImage = parseObject.img_url

      }
    }

    //console.log("profileImage===", profileImage)

    setprofilePicture(profileImage)


  };

  useEffect(() => {
    getProfilePictureValue();
  }, [])

  const formatPageName = (name) => {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  const switchOrganization = () => {
    switchOrganizationSheet(true)
  }

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

  return (
    <View style={CommonStyle.headerContainer}>
      <TouchableOpacity onPress={openDrawer}>
        {/* <Icon name="menu" size={24} color={Colors.black} /> */}
        <Image source={require('../Public/images/menu.png')} style={CommonStyle.sidebarNavigationIcon} />
      </TouchableOpacity>
      {(pageName == "BookingDetails" || pageName == "GuestDetails" || pageName == "Profile") && (
        <View style={CommonStyle.pageTitleHeader}>
          <Text style={CommonStyle.pageTitle}>{formatPageName(pageName)}</Text>
        </View>
      )}
      {pageName == "Home" &&
        <View style={[CommonStyle.headerSearchBox]}>
          <EvilIcons name="search" size={25} color={Colors.secondary} style={CommonStyle.headerSearchIcon} />
          <TextInput
            style={CommonStyle.searchInput}
            placeholder="Search Booking ID/Name"
            placeholderTextColor={Colors.gray99}
            value={searchbookingId}
            onChangeText={(text) => { setsearchbookingId(text) }}
            returnKeyLabel='Done'
            returnKeyType='done'
            onSubmitEditing={() => { searchBookingSubmit() }}
          />
        </View>
      }
      <View>
        <Menu>
          <MenuTrigger>
            <Image source={profilePicture && profilePicture != "" ? { uri: profilePicture } : require('../Public/images/usericon.png')} style={CommonStyle.userImage} />
          </MenuTrigger>
          <MenuOptions style={CommonStyle.popupMenuOption}>
            {/* <MenuOption onSelect={() => switchOrganization()} style={CommonStyle.popupMenuOptionRow}>
              <Octicons name="arrow-switch" size={17} color={Colors.black7C} />
              <Text style={CommonStyle.popupMenuOptionText}>Switch Organization</Text>
            </MenuOption> */}
            <MenuOption onSelect={() => logoutApp()} style={CommonStyle.popupMenuOptionRow}>
              <Icon name="logout" size={18} color={Colors.black7C} />
              <Text style={CommonStyle.popupMenuOptionText}>Logout</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
};

export default CustomHeader;
