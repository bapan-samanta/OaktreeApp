import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import { bookingIndividualDetails, bookingCheckin } from '../Controller/BookingController'
import moment from 'moment';
import Loader from '../../../Utility/Components/Loader'
import Toast from 'react-native-simple-toast';
import Utility from '../../../Utility/Utility';
import { showMessage, hideMessage } from "react-native-flash-message";
import { StatusBar, AppState } from 'react-native';
import HomeStyleTheme from '../Public/css/HomeStyleTheme';
import { useTheme } from '../../../Contexts/ThemeContext';

const RoomNumberAssignContent = ({ closeRoomAssignModal, checkInbookingId, roomAssignSuccessFn, withoutRoomAssignToCheckIn }) => {
    //console.log("checkInbookingId=======", checkInbookingId)
    // State to hold selected values for each booking, indexed by booking id
    const { isDarkTheme, toggleTheme } = useTheme();
    const theme = HomeStyleTheme(isDarkTheme);
    const [selectedValues, setSelectedValues] = useState({});
    const [loading, setLoading] = useState(false);
    const [bookingDetailsData, setBookingDetailsData] = useState({})
    const [roomTypeBookingDetails, setRoomTypeBookingDetails] = useState([])
    const [roomNumberErrorMsg, setRoomNumberErrorMsg] = useState([])
    const [currencySymbol, setCurrencySymbol] = useState("")



    const handleSelectionChange = (id, selectedItems, fromDate, toDate, roomCount) => {
        // console.log("selectedItems========", selectedItems)
        setSelectedValues(prevState => {
            let currentRoomArray = prevState[id]?.room ? selectedItems : [];
            // console.log("currentRoomArray========", currentRoomArray);

            let updatedRoomArray = [...new Set([...currentRoomArray, ...selectedItems])];
            //console.log("updatedRoomArray========", updatedRoomArray)
            let newObj = {
                [id]: {
                    "room": updatedRoomArray,
                    "book_form": fromDate,
                    "book_to": toDate,
                    "room_count": updatedRoomArray.length,
                }
            };
            return {
                ...prevState,
                ...newObj
            };
        });
    };

    useEffect(() => {
        if (checkInbookingId != "") {
            bookingListApi()
        }
    }, [checkInbookingId])

    const bookingListApi = async () => {
        const bookingMasterId = checkInbookingId;
        setLoading(true);
        bookingIndividualDetails(bookingMasterId).then(async (response) => {
            if (response.success) {
                //console.log("response.data==========", response.data)
                setBookingDetailsData(response.data);

                let currency = response.data.hasOwnProperty('currency') ? response.data.currency : "INR"
                setCurrencySymbol(currency)

                let roomTypeBookingDetailsObj = response.data.room_type_booking_details
                let roomTypeBookingDetailsArr = []
                let tempRoomNumberErrorMsg = []
                if (Object.keys(roomTypeBookingDetailsObj).length > 0) {
                    Object.keys(roomTypeBookingDetailsObj).map((val, idx) => {
                        roomTypeBookingDetailsArr.push(roomTypeBookingDetailsObj[val])
                        tempRoomNumberErrorMsg.push({ "errorMsg": "" })
                    })
                }
                setRoomNumberErrorMsg(tempRoomNumberErrorMsg)
                setRoomTypeBookingDetails(roomTypeBookingDetailsArr)
            }
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
        });
    }

    useEffect(() => {
        //console.log("selectedValues==========", selectedValues)
    }, [selectedValues])

    const skipRoomNumberAssign = () => {
        closeRoomAssignModal(true)
        withoutRoomAssignToCheckIn(true)
    }

    const renderData = ({ item, index }) => {
        // console.log("item============", item)

        let itemKeys = Object.keys(item)
        //console.log("itemKeys============", itemKeys)
        let itemData = item[itemKeys]
        // console.log("itemData============", itemData)
        //return false
        let bookingFromDate = itemData.hasOwnProperty('book_from') && itemData.book_from;
        let bookingToDate = itemData.hasOwnProperty('book_to') && itemData.book_to;
        let formattedDateDifference = '-'
        if (bookingFromDate && bookingToDate) {
            formattedDateDifference = moment(bookingFromDate).format('DD-MM-YYYY') + ' - ' + moment(bookingToDate).format('DD-MM-YYYY');
        }
        let transformedData = Object.entries(itemData.available_room).map(([value, label]) => ({
            label: label,  // Room label
            value: value + "_" + label   // Room value
        }));
        //console.log("transformedData===========", transformedData)
        //console.log("selectedValues render===========", selectedValues)
        let uniqueId = itemKeys;
        let roomCount = itemData.room_count
        let symbol = Utility.getCurrencySymbol(currencySymbol)
        //console.log("CurrencySymbol============", symbol)
        return (
            <View style={theme.assignRoomSection} key={index}>
                <View style={theme.assignRoomRow}>
                    <Text style={theme.assignRoomRowLabel}>Booking Date: </Text>
                    <Text style={theme.assignRoomRowValue}>{formattedDateDifference}</Text>
                </View>
                <View style={theme.assignRoomRow}>
                    <Text style={theme.assignRoomRowLabel}>Room Type: </Text>
                    <Text style={theme.assignRoomRowValue}>{itemData.room_type_name}</Text>
                </View>
                <View style={theme.assignRoomRow}>
                    <Text style={theme.assignRoomRowLabel}>Room Count: </Text>
                    <Text style={theme.assignRoomRowValue}>{itemData.room_count}</Text>
                </View>
                <Text style={theme.assignRoomRowLabel}>Room(s)</Text>
                <View style={theme.assignRoomDropContainer}>
                    <MultiSelect
                        style={theme.assignRoomDropdown}
                        placeholderStyle={theme.placeholderStyle}
                        selectedTextStyle={theme.selectedTextStyle}
                        inputSearchStyle={theme.inputSearchStyle}
                        iconStyle={theme.iconStyle}
                        search
                        data={transformedData}
                        labelField="label"
                        valueField="value"
                        placeholder="Choose Room Number"
                        searchPlaceholder="Search..."
                        // value={selectedValues[uniqueId]?.room ? selectedValues[uniqueId].room : []}
                        value={selectedValues[uniqueId]?.room || []}
                        onChange={selectedItems => handleSelectionChange(uniqueId, selectedItems, bookingFromDate, bookingToDate, roomCount)}
                        selectedStyle={theme.selectedStyle}
                        itemTextStyle={theme.itemTextStyle}
                    />
                </View>
                {roomNumberErrorMsg[index]?.errorMsg &&
                    <Text style={theme.assignRoomDropErrorMsg}>{roomNumberErrorMsg[index].errorMsg}</Text>
                }
                <View style={theme.assignRoomRow}>
                    <Text style={theme.assignRoomRowLabel}>Price/Night: </Text>
                    <Text style={theme.assignRoomRowValue}>{symbol._j}{itemData.room_rate}</Text>
                </View>
            </View>
        );
    };

    function getDatesInRange(startDate, endDate) {
        const dateArray = [];
        let currentDate = new Date(startDate);
        while (currentDate <= new Date(endDate)) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    }

    const formatingRoomAssignData = () => {
        let dateObj = {}
        if (Object.keys(selectedValues).length > 0) {

            Object.keys(selectedValues).map((val, idx) => {
                let formDate = moment(selectedValues[val].book_form).format("YYYY-MM-DD")
                let toDate = moment(selectedValues[val].book_to).format("YYYY-MM-DD")
                let inputArray = selectedValues[val].room;

                const output = inputArray.reduce((acc, curr) => {
                    const [roomId, roomNo] = curr.split('_');

                    acc.room_id.push(roomId);
                    acc.room_no.push(roomNo);

                    return acc;
                }, { room_id: [], room_no: [] });


                const dates = getDatesInRange(formDate, toDate);
                const formattedDates = dates.map(date => date.toISOString().split('T')[0]);

                // console.log("dateArray===", formattedDates)
                formattedDates.map((date, didx) => {
                    dateObj[date] = {};
                    let roomTypeId = Object.keys(selectedValues)[idx].split('-')[0];
                    // console.log("roomTypeId===", roomTypeId)
                    dateObj[date] = {
                        [roomTypeId]: {
                            "room_id": output.room_id.join(','),
                            "room_no": output.room_no.join(',')
                        }
                    }
                })

            })
        }

        const keys = Object.keys(dateObj);
        // Find the last key and delete the corresponding object
        const lastKey = keys[keys.length - 1];
        delete dateObj[lastKey];

        let date_wise_room_details = {
            "date_wise_room_details": dateObj
        }
        return date_wise_room_details;
    }

    const validationFromData = () => {
        let valid = true;
        let tempRoomNumberErrorMsg = [...roomNumberErrorMsg]
        if (Object.keys(selectedValues).length == roomTypeBookingDetails.length) {
            if (roomTypeBookingDetails.length > 0) {
                roomTypeBookingDetails.map((val, idx) => {
                    let itemKeys = Object.keys(val)
                    let selectedValuesData = Object.keys(selectedValues)
                    let neededRoom = val[selectedValuesData[idx]].room_count
                    let assignRoom = selectedValues[itemKeys[0]].room_count

                    // console.log("neededRoom==========", neededRoom)
                    // console.log("assignRoom==========", assignRoom)
                    if (neededRoom == assignRoom) {
                        tempRoomNumberErrorMsg[idx].errorMsg = ""
                    } else {
                        if (neededRoom > assignRoom) {
                            valid = false
                            tempRoomNumberErrorMsg[idx].errorMsg = "You have selected fewer rooms than needed."
                        } else if (neededRoom < assignRoom) {
                            valid = false
                            tempRoomNumberErrorMsg[idx].errorMsg = "You have selected more rooms than needed."
                        } else {

                            valid = false
                            tempRoomNumberErrorMsg[idx].errorMsg = "You have selected more rooms than your adults count"
                        }
                    }
                })
                //console.log("errorMsg validation=======", tempRoomNumberErrorMsg)

                setRoomNumberErrorMsg(tempRoomNumberErrorMsg)
            }
        } else {
            valid = false
            Toast.show("Choose room number")
        }


        return valid;
    };



    const assignRoomNumber = async () => {
        let valid = validationFromData();
        //console.log("valid=========", valid)
        //return false
        if (valid) {
            let dataSet = formatingRoomAssignData();
            setLoading(true);
            //console.log("dataSet=======", JSON.stringify(dataSet))
            //return false;
            bookingCheckin(dataSet, checkInbookingId).then(async (response) => {
                if (response.success) {
                    showMessage({
                        message: response.message,
                        type: "info",
                        style: { marginTop: StatusBar.currentHeight }
                    });
                    //setAssignRoomConfirmationPopupFlag(false)
                    roomAssignSuccessFn(true)
                    _handleRefresh();
                }
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
            });
        }
    }

    return (
        <SafeAreaView style={theme.assignRoomContainer}>
            <Loader loading={loading} />
            <View style={theme.assignRoomOverlay}>
                <View style={theme.assignRoomContentContainer}>
                    <View style={theme.assignRoomHeader}>
                        <Text style={theme.assignRoomTitle}>Assign Room Number</Text>
                    </View>
                    <FlatList
                        data={roomTypeBookingDetails}
                        //renderItem={renderData}
                        renderItem={(item, index) => renderData(item, index)}
                        keyExtractor={(item, index) => index}
                        contentContainerStyle={{ flexGrow: 1 }} // Ensure FlatList can grow to fit content
                    />
                    <View style={theme.assignRoomButtonContainer}>
                        <TouchableOpacity style={theme.assignConfirmBtn} onPress={() => { assignRoomNumber() }}>
                            <Text style={theme.assignConfirmText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={theme.assignCancelBtn} onPress={() => { skipRoomNumberAssign() }}>
                            <Text style={theme.assignCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </SafeAreaView>
    );
};


export default RoomNumberAssignContent;
