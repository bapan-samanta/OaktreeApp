import React, { useEffect, useState } from 'react';
import { View, Text, Image, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
const styles = StyleSheet.create({
    Container: {
        paddingLeft: 20,
        paddingRight: 20
    },
    row: {
        flexDirection: 'row', // Align children in a row
        alignItems: 'center',  // Center items vertically
    },
    img: {
        height: 46,
        width: 51        
    },
    text: {
        fontSize: 20,
        color: 'black',
        paddingLeft: 20
    },
    blankBorder: {
        borderBottomColor: '#ccc',  // Set the border bottom color
        borderBottomWidth: 1, 
        marginBottom: 7,
        marginTop: 7
    }
});
const BottomSheetDesign = ({ handalContactUs, handalFeedback, handalPrescription, handalSupport }) => {
    
    return (
        <SafeAreaView style={styles.Container}>
            <TouchableOpacity  style={styles.row} onPress={() => handalContactUs()}>
                <Image source={require('../Public/images/ContactUs.png')} style={styles.img} />
                <Text style={styles.text}>Contact Us</Text>
            </TouchableOpacity>  
            <View style={styles.blankBorder}></View>  
            <TouchableOpacity  style={styles.row} onPress={() => handalFeedback()}>
                <Image source={require('../Public/images/feedback.png')} style={styles.img} />
                <Text style={styles.text}>Feedback</Text>
            </TouchableOpacity> 
            <View style={styles.blankBorder}></View>  
            <TouchableOpacity  style={styles.row} onPress={() => handalPrescription()}>
                <Image source={require('../Public/images/prescription.png')} style={styles.img} />
                <Text style={styles.text}>Prescription</Text>
            </TouchableOpacity> 
            <View style={styles.blankBorder}></View>  
            <TouchableOpacity  style={styles.row} onPress={() => handalSupport()}>
                <Image source={require('../Public/images/support.png')} style={styles.img} />
                <Text style={styles.text}>Support</Text>
            </TouchableOpacity>          
        </SafeAreaView>
    );
};


export default BottomSheetDesign;
