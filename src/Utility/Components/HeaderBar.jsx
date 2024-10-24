import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';

const HeaderBar = ({ title, onBackPress, onFilterPress, filterHide }) => {
  return (
    <View style={styles.headerBar}>
      <AntDesign
        name="arrowleft"
        size={30}
        color="white"
        style={styles.arrowleftIcon}
        onPress={onBackPress}
      />
      <Text style={styles.headerText}>{title}</Text>
      {
        !filterHide &&
      
        <Fontisto
          name="filter"
          size={28}
          color="white"
          style={styles.filterIcon}
          onPress={onFilterPress}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
    headerBar: {
        backgroundColor: '#007667',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#fff',
        flex: 1,
    },
    arrowleftIcon: {
        height: 30,
    },
    filterIcon: {
        height: 30,
    },
});

export default HeaderBar;
