// screens/BookingDetailsScreen.js
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    Text,
    useColorScheme,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import BookingDetailsStyle from '../Public/css/BookingDetailsStyle';
import Colors from '../../../Utility/Colors';
import { useTheme } from '../../../Contexts/ThemeContext';
import moment from 'moment';
import { xorBy } from 'lodash'
import Loader from '../../../Utility/Components/Loader';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { bookingDetails } from '../Controller/BookingController'
import Utility from '../../../Utility/Utility'

function BookingDetailsScreen({ navigation }) {
    const { isDarkTheme, toggleTheme } = useTheme();
    const theme = BookingDetailsStyle(isDarkTheme);
    const [loading, setLoading] = useState(false);
    const [itemDetails, setitemDetails] = useState({});

    const route = useRoute();

    // console.log("itemDetails=========", itemDetails)

    const backToBookingList = () => {
        navigation.navigate("Home")
    }

    const bookingListApi = async () => {
        const bookingMasterId = route.params?.bookingMasterId;
        setLoading(true);
        bookingDetails(bookingMasterId).then(async (response) => {
            if (response.success) {
                setitemDetails(response.data);
            }
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
        });
    }

    useEffect(() => {
        bookingListApi();
    }, []);

    const paymentPriceDistributionUi = () => {
        let room_type_data_arr = [];
        if ((itemDetails.hasOwnProperty('room_type_booking_details') && itemDetails.room_type_booking_details && Object.keys(itemDetails.room_type_booking_details).length > 0) || (itemDetails.hasOwnProperty('previous_booking_hash') && itemDetails.previous_booking_hash && Object.keys(itemDetails.previous_booking_hash).length > 0)) {
            let paymentDetailsRoomTypeData = itemDetails.room_type_booking_details;
            let previousPaymentDetailsRoomTypeData = itemDetails.hasOwnProperty('previous_booking_hash') && itemDetails.previous_booking_hash ? itemDetails.previous_booking_hash : {};

            room_type_data_arr.push(
                <View key={0}>
                    <View>
                        <Text>Room Type</Text>
                        <Text>Room NUmber</Text>
                    </View>
                    <View >
                        {Object.keys(previousPaymentDetailsRoomTypeData).length > 0 && roomTypePerdayWisePrice(previousPaymentDetailsRoomTypeData, false)}
                        {Object.keys(paymentDetailsRoomTypeData).length > 0 && roomTypePerdayWisePrice(paymentDetailsRoomTypeData, true)}
                    </View>
                </View>
            );
        }
        return room_type_data_arr;
    }

    const roomTypePerdayWisePrice = (data, is_new = true) => {
        var room_type_amount_wise_price = {}
        let arrUi = []
        Object.keys(data).map((room_type_id, idx) => {
            Object.keys(data[room_type_id]).map((amount, i) => {
                let room_type_details = data[room_type_id][amount];
                room_type_amount_wise_price[room_type_id + '_' + amount] = room_type_details.room_rate;
                let roomNumber = `${room_type_details.hasOwnProperty('room_no') && room_type_details.room_no != null && Utility.hasNonZeroValues(room_type_details.room_no) ? room_type_details.room_no : '-'}`
                arrUi.push(<View style={[is_new ? styles.paymentDetailsDataBox : styles.paymentDetailsDataBox, styles.previusValue]} key={idx}>
                    <View style={[styles.paymentDetailsValue, styles.roomType]}>

                        <Text>{room_type_details.room_type_name}</Text>

                    </View>
                    <View style={[styles.paymentDetailsValue, styles.roomType]}>

                        <Text>{roomNumber}</Text>

                    </View>


                </View>)

            })
        })

        return arrUi
    }

    const guestDetailsFn = () => {
        navigation.navigate("GuestDetails")
    }

    return (
        <SafeAreaView style={theme.mainContainer}>
            <Loader loading={loading} />
            <View style={theme.listBoxContainer}>
                <TouchableOpacity onPress={backToBookingList}>
                    <Ionicons name="arrow-back" size={25} color={Colors.primary} />
                </TouchableOpacity>
                <View style={theme.detailsListBox}>
                    <View style={theme.detailsRow}>
                        <Text style={theme.detBranchName}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {itemDetails?.BookingMasterBranchData?.branch_name}
                        </Text>
                        <Text style={[theme.detBookingStatus, itemDetails?.booking_master_details?.book_status === "Checked-In" ? theme.checkInColor : theme.ConfirmedColor]}>
                            {itemDetails?.booking_master_details?.book_status} 
                        </Text>
                    </View>
                    <View style={theme.detailsRow}>
                        <Text style={theme.boxLabel}>
                            <Text style={theme.boxLabelText}>Booking ID:</Text> {itemDetails?.booking_master_details?.booking_id}
                        </Text>
                    </View>
                    <View style={theme.detailsRow}>
                        {paymentPriceDistributionUi()}
                    </View>
                    <View style={theme.detailsRow}>
                        <View style={theme.boxLeftView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Check-In:</Text>  {itemDetails.hasOwnProperty("checked_in") && itemDetails.checked_in && itemDetails.checked_in != "" ? itemDetails.checked_in : ""}
                            </Text>
                        </View>
                        <View style={theme.boxRightView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Check-Out:</Text> {moment(itemDetails.original_checked_datetime.toString()).format("DD-MM-YYYY HH:mm")}
                            </Text>
                        </View>
                    </View>
                    <View style={theme.detailsRow}>
                        <View style={theme.boxLeftView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Adult(s):</Text> {itemDetails.hasOwnProperty("adult") && itemDetails.adult && itemDetails.adult != "" ? itemDetails.adult : ""}
                            </Text>
                        </View>
                        <View style={theme.boxRightView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Children:</Text> {itemDetails.hasOwnProperty("child") && itemDetails.child && itemDetails.child != "" ? itemDetails.child : "0"}
                            </Text>
                        </View>
                    </View>
                    <View style={theme.detailsRow}>
                        <View style={theme.boxLeftView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Booking Amt:</Text> {Utility.getCurrencySymbol(itemDetails.hasOwnProperty("currency") && itemDetails.currency && itemDetails.currency != "" ? itemDetails.currency : "INR")} {Number(itemDetails.total_amount).toFixed(2)}
                            </Text>
                        </View>
                        <View style={theme.boxRightView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Billing Amt:</Text> {Utility.getCurrencySymbol(itemDetails.hasOwnProperty("currency") && itemDetails.currency && itemDetails.currency != "" ? itemDetails.currency : "INR")} {Number(itemDetails.billing_amount).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    <View style={theme.detailsRow}>
                        <View style={theme.boxLeftView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Paid Amt:</Text> {Utility.getCurrencySymbol(itemDetails.hasOwnProperty("currency") && itemDetails.currency && itemDetails.currency != "" ? itemDetails.currency : "INR")} {Number(itemDetails.total_paid).toFixed(2)}
                            </Text>
                        </View>
                        <View style={theme.boxRightView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Due Amt:</Text> {Utility.getCurrencySymbol(itemDetails.hasOwnProperty("currency") && itemDetails.currency && itemDetails.currency != "" ? itemDetails.currency : "INR")} {Number(itemDetails.due_amt).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    <View style={theme.detailsRow}>
                        <View style={theme.guestDetailsRow}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Guest Details: </Text>
                                {/* Uploaded */}
                                Not Uploaded
                            </Text>
                            <Text style={theme.uploadedStatusIcon}>
                                {/* <Feather name="check-circle" size={18} color={Colors.green} /> */}
                                <Ionicons name="close-circle-outline" size={18} color={Colors.red} />
                            </Text>
                        </View>
                    </View>
                    <View style={theme.guestDetailsBtnInner}>
                        <TouchableOpacity style={theme.guestDetailsUploadBtn} onPress={guestDetailsFn}>
                            <Text style={theme.uploadBtnText}>Upload Guest Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

})


export default BookingDetailsScreen;
