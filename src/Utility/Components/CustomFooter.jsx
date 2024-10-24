import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CommonStyle from '../Public/css/CommonStyle';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../Colors';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const footerItems = [
  { label: 'Appointment', icon: 'calendar', route: 'Appointment' },
  { label: 'Profile', icon: 'user', route: 'Profile' },
];

const CustomFooter = ({ pageName }) => {
  let navigation = useNavigation();
  let currentRouteName = useNavigationState(state => state.routeNames[state.index]);
  return (
    <View style={CommonStyle.footer}>
      {footerItems.map((item, index) => {
        let isActive =
          currentRouteName === item.route ||
          (currentRouteName === 'GuestDetails' && item.route === 'Home');
        return (
          <View
            key={index}
            style={[
              CommonStyle.footerRow,
              isActive ? CommonStyle.footerRowActive : CommonStyle.footerRowInactive
            ]}
          >
            <TouchableOpacity onPress={() => navigation.navigate(item.route)}>
              <View style={CommonStyle.footerBox}>
                <View style={isActive ? CommonStyle.footerActiveItem : CommonStyle.footerInactiveItem}>
                  <Entypo
                    name={item.icon}
                    size={21}
                    color={isActive ? Colors.white : Colors.white}
                  />
                </View>
                <Text style={[CommonStyle.footerText, isActive ? CommonStyle.footerActiveText : null]}>
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default CustomFooter;
