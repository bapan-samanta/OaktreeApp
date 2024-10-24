// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    FlatList,
    Text,
    useColorScheme,
    View,
    TouchableOpacity,
    Image,
    Button,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    BackHandler, Alert
} from 'react-native';
import HomeStyleTheme from '../Public/css/HomeStyleTheme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../../Utility/Colors';
import { useTheme } from '../../../Contexts/ThemeContext';
import { bookingList, bookingCheckin, } from '../Controller/BookingController';
import moment from 'moment';
import { xorBy } from 'lodash'
import EventEmitter from '../../../Contexts/EventEmitter';
import Loader from '../../../Utility/Components/Loader';
import CommonDatePicker from '../../../Utility/Components/CommonDatePicker';
import RNPickerSelect from 'react-native-picker-select';
import Utility from '../../../Utility/Utility';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GlobalBottomSheet from '../../../Utility/Components/GlobalBottomSheet'
import ConfirmationPopupContent from '../../../Utility/Components/ConfirmationPopupContent'
import Toast from 'react-native-simple-toast';
import Feather from 'react-native-vector-icons/Feather';
import RoomNumberAssignContent from '../Components/RoomNumberAssignContent'
import { showMessage, hideMessage } from "react-native-flash-message";
import GlobalModalBottomSheet from '../../../Utility/Components/GlobalModalBottomSheet'
import { StatusBar, AppState } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeGenerator from '../../../Utility/Components/QRCodeGenerator'
import CommonStyle from '../../../Utility/Public/css/CommonStyle';
import Entypo from 'react-native-vector-icons/Entypo';
import { navigationRef } from '../../../Utility/Components/navigationService';
import { associateSoftwareToken, verifySoftwareToken, usrMfaAssign } from '../../Profile/Controller/ProfileController'
import MFAModalContent from '../../../Utility/Components/MFAModalContent'

function HomeScreen({ navigation }) {
    const route = useRoute();
    const { isDarkTheme, toggleTheme } = useTheme();
    const theme = HomeStyleTheme(isDarkTheme);
    const [loading, setLoading] = useState(false);
    const [bookingListData, setBookingListData] = useState([]);
    const [limit, setlimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [onEndReachedCalledDuringMomentum, setonEndReachedCalledDuringMomentum] = useState(true);
    const [isLoadMore, setisLoadMore] = useState(false);
    const [refreshing, setrefreshing] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [bookingSearchId, setbookingSearchId] = useState("");
    const [selectedDate, setSelectedDate] = useState(""); // Start with null
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [bookingStatus, setBookingStatus] = useState([]);
    const [bookingStatusValue, setBookingStatusValue] = useState("");
    const [removeStatue, setremoveStatue] = useState(false);

    const [checkInPopupFlag, setCheckInPopupFlag] = useState(false);
    const [checkInbookingId, setCheckInbookingId] = useState("");
    const [checkRoomNumber, setCheckRoomNumber] = useState("");
    const snapPoints = ['40%'];
    const [assignRoomPopupFlag, setAssignRoomPopupFlag] = useState(false);
    const [withoutRoomAssignStatus, setWithoutRoomAssignStatus] = useState(false);
    const [assignRoomConfirmationPopupFlag, setAssignRoomConfirmationPopupFlag] = useState(false);

    //MFA Work==========================
    const [enablePopupFlag, setEnablePopupFlag] = useState(false);
    const [mfaActionType, setMfaActionType] = useState("enable_mfa")
    const [accountName, setaccountName] = useState("");
    // const [secretCode, setSecretCode] = useState("");
    // const [otpParent, setotpParent] = useState("");
    // const [selectedValue, setSelectedValue] = useState('');
    // const [disableMfaConfirmationFlag, setDisableMfaConfirmationFlag] = useState(false)
    const [userIsSubscribe, setUserIsSubscribe] = useState(false)
    const [isMfaRequiredFlag, setIsMfaRequiredFlag] = useState(false)
    // const enableMFAOptions = [
    //     { label: 'SMS', value: 'SMS' },
    //     { label: 'Authenticator App ', value: 'Software' },
    // ];




    useEffect(() => {
        if (route.params?.reander) {
            bookingListApi();
        }
    }, [route.params]);

    useEffect(() => {
        mfaMandatoryOrNotChecking();
        bookingListApi();
    }, []);

    mfaMandatoryOrNotChecking = async () => {
        let organizationList = JSON.parse(await AsyncStorage.getItem('attachOrganization'));
        const isMfaRequired = organizationList.some(hotel => hotel.is_mfa_required);
        const userMfa = JSON.parse(await AsyncStorage.getItem('loginCredentials'));
        const userIsSubscribe = userMfa.user_details.hasOwnProperty('is_subscribed') && userMfa.user_details.is_subscribed ? userMfa.user_details.is_subscribed : false;
        let isUserMfa = false;
        setUserIsSubscribe(userIsSubscribe);
        if (userMfa && userMfa.user_details && userMfa.user_details.hasOwnProperty('mfa') && (userMfa.user_details.mfa == null || userMfa.user_details.mfa == "null" || userMfa.user_details.mfa == "")) {
            isUserMfa = true
        }
        if (isMfaRequired && isUserMfa) {
            const useremail = `${userMfa.user_details.user_email}`;
            setaccountName(useremail);
            setEnablePopupFlag(true)
            setIsMfaRequiredFlag(true)
        }

        //Mfa enable true

    }

    useEffect(() => {
        const listener = EventEmitter.addListener("broadcustMessage", async (message) => {
            if (message.bookingSearchId == "" || message.bookingSearchId != "") {
                //console.log("Entry===")
                setbookingSearchId(message.bookingSearchId)
            }

        })
        return () => {
            listener.remove();
        }
    }, []);

    useEffect(() => {
        _handleRefresh();
    }, [bookingSearchId])



    const bookingListApi = async (type = "") => {

        let filters = await formattingBookingRoomListDataSetFn();
        setLoading(type == "" ? true : false);
        bookingList(filters).then(async (response) => {
            //console.log("response====data=======", response)
            //return false;
            setBookingListData((prevData) => [...prevData, ...response.data]);
            setLoading(false);
            setisLoadMore(false);
            setrefreshing(false)

        }).catch((error) => {
            //console.log("response====error=======", error)
            setLoading(false);
        });
    }

    const handleLoadMore = () => {
        //console.log("_handleLoadMore=============_handleLoadMore")
        if (!onEndReachedCalledDuringMomentum) {
            let tepmoffset = offset;
            let templimit = limit;
            tepmoffset = tepmoffset + templimit;
            ///console.log("offset==", offset)
            setOffset(tepmoffset)
            setonEndReachedCalledDuringMomentum(true)
            setisLoadMore(true);
            setrefreshing(false)
        }

    }

    const _onMomentumScrollBegin = () => {
        //console.log("onMomentumScrollBegin")
        setonEndReachedCalledDuringMomentum(false)
    }

    useEffect(() => {
        if (isLoadMore) {
            bookingListApi();
        }
    }, [isLoadMore])

    const formattingBookingRoomListDataSetFn = async () => {
        let filters = {};
        let filter_op = {};
        let globalQueryParamshash = {};


        if (selectedDate != "") {
            let startDate = moment(selectedDate).format('YYYY-MM-DD')
            let endDate = moment(selectedDate).format('YYYY-MM-DD')
            globalQueryParamshash['book_from'] = startDate + " " + "00:00:00"
            globalQueryParamshash['book_to'] = endDate + " " + "23:59:59";
            //filter_op = Object.assign(filter_op, { "book_from": "gte", "book_to": "lte" })
        }
        if (bookingSearchId && bookingSearchId !== "") {
            globalQueryParamshash['search_attr'] = bookingSearchId;
            filter_op = Object.assign(filter_op, { "search_attr": "substring" });
        }

        //globalQueryParamshash['book_status'] = ["confirmed", "checked-in"];

        if (bookingStatus.length > 0) {
            globalQueryParamshash['book_status'] = [];
            for (let i = 0; i < bookingStatus.length; i++) {
                globalQueryParamshash['book_status'].push(bookingStatus[i]);
            }
        } else {
            globalQueryParamshash['book_status'] = ["confirmed", "checked-in"]
        }
        globalQueryParamshash['limit'] = limit;
        globalQueryParamshash['offset'] = offset;

        // if (hotelBranchFilterSelectedValue && hotelBranchFilterSelectedValue != "") {
        //     globalQueryParamshash['branch_id'] = hotelBranchFilterSelectedValue.value
        // }
        if (Object.keys(filter_op).length > 0) {
            filters["filter_op"] = JSON.stringify(filter_op);
        }
        filters['filters'] = JSON.stringify(globalQueryParamshash);

        return filters;
    }

    const _handleRefresh = () => {
        //setrefreshing(true)
        setOffset(0)
        setBookingListData([])
        setisLoadMore(true);

    }
    const _handleRefreshForGridOnly = () => {
        setrefreshing(true)
        setOffset(0)
        setBookingListData([])
        bookingListApi("onlyRefresh");

    }


    const renderData = ({ item }) => {
        // Log the item object to the console

        //console.log("renderData", item)
        let itemDetails = item;
        let currencySymbol = itemDetails.hasOwnProperty('BookingMasterBranchData') && itemDetails.BookingMasterBranchData.hasOwnProperty('currency') ? itemDetails.BookingMasterBranchData.currency : 'INR'

        let syambol = Utility.getCurrencySymbol(currencySymbol)
        // console.log("currencySymbol=======", syambol._j);
        return (
            <View style={theme.cardBox} key={itemDetails.id}>
                {/* <View style={theme.infoContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ width: '75%' }}>
                            <Text
                                style={theme.title}
                                numberOfLines={1}
                                ellipsizeMode="tail">
                                {item.BookingMasterBranchData.branch_name}
                            </Text>
                        </View>
                        <View style={[theme.statusContainer, { width: '25%', alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                            <Text style={[theme.detailsButton, item.book_status === "Checked-In" ? theme.checkInColor : theme.ConfirmedColor]}>
                                {item.book_status}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <View style={{ width: '60%', alignItems: 'flex-start' }}>
                            <Text style={theme.bookingId}>
                                <Text style={theme.bookingText}>Booking ID:</Text> {item.booking_id}
                            </Text>
                        </View>
                        <View style={{ width: '40%', alignItems: 'flex-end' }}>
                            <Text>
                                <Text style={theme.bookingText}>Amount:</Text> {syambol._j}{item.total_amt}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 2 }}>
                        <Text>
                            <Text style={theme.bookingText}>Booking Date:</Text> {moment(item.booking_date).format('DD-MM-YYYY')}
                        </Text>
                    </View>
                    <View style={theme.locationContainer}>
                        <View style={theme.locationWithIcon}>
                            <Text style={theme.locationInner}>
                                <EvilIcons name="location" size={25} color={isDarkTheme ? Colors.primary : Colors.primary} />
                            </Text>
                            <Text style={theme.location}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {item.BookingMasterBranchData.address1} {item.BookingMasterBranchData.address2}
                            </Text>
                        </View>
                        <View style={theme.angleInner}>
                            <TouchableOpacity onPress={() => viewBookingDetails(item)}>
                                <FontAwesome name="angle-right" size={30} color={isDarkTheme ? Colors.primary : Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> */}
                <View>
                    <View style={theme.detailsRow}>
                        <Text style={theme.detBranchName}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {itemDetails?.BookingMasterBranchData?.branch_name}
                        </Text>
                        <Text style={[theme.detBookingStatus, itemDetails?.book_status === "Checked-In" ? theme.checkInColor : theme.ConfirmedColor]}>
                            {itemDetails?.book_status}
                        </Text>
                    </View>
                    <View style={theme.detailsRow}>
                        <Text style={theme.boxLabel}>
                            <Text style={theme.boxLabelText}>Booking ID:</Text> {itemDetails?.booking_id}
                        </Text>
                    </View>
                    <View style={[theme.detailsRow, style = { marginBottom: 0 }]}>
                        <Text style={theme.boxLabel}>
                            <Text style={theme.boxLabelText}>Booked By:</Text> {itemDetails?.customer_name}</Text>
                    </View>
                    <View style={[theme.detailsRow, style = { marginTop: 0 }]}>
                        <Text style={theme.boxLabel}>
                            <Text style={theme.boxLabelText}>Room No.:</Text> {itemDetails?.room_no != "-" ? itemDetails?.room_no : "-"}
                        </Text>
                    </View>
                    <View style={theme.detailsRow}>
                        <View style={theme.boxLeftView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Check-In:</Text>  <Text style={theme.checkInOutLabel}>{itemDetails.hasOwnProperty("book_from") && itemDetails.book_from && itemDetails.book_from != "" ? moment(itemDetails.book_from).format("DD-MM-YYYY") : ""}</Text>
                            </Text>
                        </View>
                        <View style={theme.boxRightView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Check-Out:</Text> <Text style={theme.checkInOutLabel}>{itemDetails.hasOwnProperty("book_to") && itemDetails.book_to && itemDetails.book_to != "" ? moment(itemDetails.book_to).format("DD-MM-YYYY") : ""}</Text>
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
                                <Text style={theme.boxLabelText}>Booking Amt.:</Text> {syambol._j}{Number(itemDetails.total_amt).toFixed(2)}
                            </Text>
                        </View>
                        <View style={theme.boxRightView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Billing Amt.:</Text> {syambol._j}{Number(itemDetails.billing_amt).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    <View style={theme.detailsRow}>
                        <View style={theme.boxLeftView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Paid Amt.:</Text> {syambol._j}{Number(itemDetails.paid_amt).toFixed(2)}
                            </Text>
                        </View>
                        <View style={theme.boxRightView}>
                            <Text style={theme.boxLabel}>
                                <Text style={theme.boxLabelText}>Due Amt.:</Text> {syambol._j}{Number(itemDetails.due_amt).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    {itemDetails?.book_status === "Checked-In" &&
                        <View style={theme.detailsRow}>
                            <View style={theme.guestDetailsRow}>
                                <Text style={theme.boxLabel}>
                                    <Text style={theme.boxLabelText}>Guest Details: </Text>
                                    {itemDetails?.is_guest_details_available && itemDetails.is_guest_details_available ? "Uploaded" : "Not Uploaded"}

                                </Text>
                                <Text style={theme.uploadedStatusIcon}>
                                    {itemDetails?.is_guest_details_available && itemDetails.is_guest_details_available ?
                                        <Feather name="check-circle" size={16} color={Colors.green} />
                                        :
                                        <Ionicons name="close-circle-outline" size={18} color={Colors.red} />}

                                </Text>
                            </View>
                        </View>
                    }
                    <View style={theme.guestDetailsBtnInner}>
                        {itemDetails?.book_status === "Checked-In" ?
                            <TouchableOpacity style={theme.guestDetailsUploadBtn} onPress={() => { guestDetailsFn(itemDetails.adult, itemDetails.child, itemDetails.child_age, itemDetails.id, itemDetails?.BookingMasterBranchData?.country, itemDetails?.is_guest_details_available ? itemDetails.is_guest_details_available : false) }} >
                                <Text style={theme.uploadBtnText}>{itemDetails?.is_guest_details_available && itemDetails.is_guest_details_available ? "Update Guest Details" : "Upload Guest Details"}</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity style={theme.guestDetailsUploadBtn} onPress={() => checkInPopup(itemDetails)}>
                                <Text style={theme.uploadBtnText}>Check-In</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        );
    };


    const handleDateChange = (selectedDate, type) => {
        setSelectedDate(selectedDate);
        setIsDatePickerOpen(false);
        _handleRefresh();
    };



    const openDatePicker = () => {
        setIsDatePickerOpen(true);
    };

    const closeDatePicker = () => {
        setIsDatePickerOpen(false);
    };

    //console.log("selectedDate=====", selectedDate)

    // const onMultiChange = () => {
    //     return (item) => setSelectedTeams(xorBy(selectedTeams, [item], 'id'))
    // }

    const bookingStatusOnchange = (value) => {
        //console.log("value======",value)
        setBookingStatusValue(value)
        setOffset(0)
        setBookingListData([])
    }

    const removeStatus = () => {
        //console.log("2222222222222222222222222")
        setBookingStatusValue("")
        setremoveStatue(true);
        setBookingStatus([])
        // _handleRefresh();
    }

    useEffect(() => {
        //console.log("3333333333333333333333")
        if (bookingStatusValue && bookingStatusValue != "") {
            setBookingStatus([bookingStatusValue])
        }
        _handleRefresh();

    }, [bookingStatusValue])

    useEffect(() => {
        //console.log("444444444444444444444444444444")
        if (removeStatue) {
            setBookingStatus([])
        }
        _handleRefresh();

    }, [removeStatue])


    const removeDate = () => {
        setSelectedDate("");
        _handleRefresh();
    }

    const viewBookingDetails = (item) => {
        navigation.navigate("BookingDetails", { bookingMasterId: item.id })
    }

    const guestDetailsFn = (adult, child, child_age, booking_id, branchNationality, type = "") => {
        //if (type === "") {
        navigation.navigate("GuestDetails", { adult: adult, child: child, child_age: child_age, "booking_id": booking_id, branchNationality: branchNationality, type: type })
        // } else {
        //     fetchGueastDetails();
        // }
    }

    const checkInPopup = (roomDetails) => {
        // console.log("roomDetails=========", roomDetails)
        //setCheckInPopupFlag(true)
        setCheckInbookingId(roomDetails.id)
        setCheckRoomNumber(roomDetails.room_no)

        let check_in_time = roomDetails.hasOwnProperty("check_in_time") ? moment(roomDetails.check_in_time).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss')

        let twoHoursBeforebook_from = moment(roomDetails.book_from).subtract(2, 'hours');
        if (moment(check_in_time).isAfter(moment(roomDetails.book_to))) {

            showMessage({
                message: 'Check In not possible for this booking as check in time was on ' + moment(roomDetails.book_from).format('YYYY-MM-DD HH:mm:ss'),
                type: "warning",
                style: { marginTop: StatusBar.currentHeight }
            });
        } else if (moment(roomDetails.check_in_time).isBefore(moment(twoHoursBeforebook_from))) {

            showMessage({
                message: 'Check In not possible for this booking as check in time is on ' + moment(roomDetails.book_from).format('YYYY-MM-DD HH:mm:ss') + '. Our policy permits check-in up to a maximum of two hours prior ' + 'or any time after ' + moment(roomDetails.book_from).format('YYYY-MM-DD HH:mm:ss'),
                type: "warning",
                style: { marginTop: StatusBar.currentHeight }
            });
        } else {
            if (roomDetails.room_no == "-" || roomDetails.room_no == "") {
                if (withoutRoomAssignStatus) {
                    setCheckInPopupFlag(true);
                } else {
                    setAssignRoomConfirmationPopupFlag(true);
                }
            } else {
                setCheckInPopupFlag(true);
            }
        }
    }

    const checkInPopupHide = () => {
        //console.log("entry==========cancel")
        setCheckInPopupFlag(false)
        setWithoutRoomAssignStatus(false)
    }

    const closeRoomAssignModal = (data) => {
        if (data) {
            setAssignRoomPopupFlag(false)
        }
    }


    const checkInFn = async () => {
        await bookingCheckinApi();
    }

    const bookingCheckinApi = async () => {
        const bookingMasterId = checkInbookingId;
        setLoading(true);
        let data = { "is_checked_in": 1 }
        //return false;
        bookingCheckin(data, bookingMasterId).then(async (response) => {
            if (response.success) {
                showMessage({
                    message: response.message,
                    type: "info",
                    style: { marginTop: StatusBar.currentHeight }
                });
                setCheckInPopupFlag(false)
                _handleRefresh();
            }
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
        });
    }

    useEffect(() => {
        const listener = EventEmitter.addListener("broadcustMessage", async (message) => {
            if (message.organizationSwitch === true) {
                setOffset(0)
                setbookingSearchId("")
                setBookingStatus([])
                setBookingStatusValue("")
                setSelectedDate("")
                bookingListApi();
            }
        })
        return () => {
            listener.remove();
        }
    }, []);

    useEffect(() => {
        //console.log("checkRoomNumber========", checkRoomNumber)
        //console.log("checkInbookingId========", checkInbookingId)
    }, [checkRoomNumber, checkInbookingId])

    const roomAssignSuccessFn = async () => {
        //await checkInFn();
        setCheckInPopupFlag(true)
        setAssignRoomPopupFlag(false);
        setOffset(0)
        setBookingListData([])
        bookingListApi();
    }

    const withoutRoomAssignToCheckIn = (data) => {
        if (data) {
            setCheckInPopupFlag(true)
            setWithoutRoomAssignStatus(data)
        }
    }

    const assignRoomConfirmationFn = () => {
        setAssignRoomPopupFlag(true)
        setAssignRoomConfirmationPopupFlag(false)
    }

    const closeAssignRoomConfirmationFn = () => {
        setAssignRoomConfirmationPopupFlag(false)
        setCheckInPopupFlag(true)
    }

    //MFA Work====================
    /*const verifySoftwareTokenFunction = async () => {
        //alert();
        if (otpParent != "" && otpParent.length == 6) {
            setLoading(true);
            let headers = {};
            headers['AccessToken'] = await AsyncStorage.getItem('accessToken');
            headers["Authorization"] = await AsyncStorage.getItem('finalIdToken');
            let data = {
                "mfaCode": otpParent.join("")
            }
            // console.log("headers===", headers, data)
            // console.log("headers===", headers, data)
            verifySoftwareToken(data, headers).then(async (response) => {
                console.log("verifySoftwareToken=========0", response);
                if (response.success) {
                    // console.log("verifySoftwareToken=========1", response);

                    await usrMfaAssignFunction();

                }

            }).catch((error) => {
                setLoading(false);
            });

        } else {
            showMessage({
                message: "Please enter your verification code.",
                type: "warning",
                style: { marginTop: StatusBar.currentHeight, fontSize: 16 }
            });
        }
    }*/

    /*const usrMfaAssignFunction = async (type = "") => {
        //alert();
        setLoading(true);
        let headers = {};
        headers['AccessToken'] = await AsyncStorage.getItem('accessToken');
        headers["Authorization"] = await AsyncStorage.getItem('finalIdToken');
        let data = {};
        if (type == "") {
            if (selectedValue == "Software") {
                data['mfa_type'] = "authenticator_app"
            } else {
                data['mfa_type'] = "sms"
            }
        } else {
            data['mfa_type'] = "disabled"
        }
        data['user_name'] = accountName
        //console.log("usrMfaAssignFunction data==========", data)
        //return false;
        usrMfaAssign(data, headers).then(async (response) => {
            console.log("usrMfaAssign=========2.0", response);

            if (response.success) {
                setEnablePopupFlag(false);
                if (type == "disabled") {
                    setDisableMfaConfirmationFlag(false)
                }
                // console.log("usrMfaAssign=========2", response);
                await getCurrentUserFunction(type);


            }

        }).catch((error) => {
            setLoading(false);
        });
    }*/

    /*getCurrentUserFunction = async (type = "") => {
        let header = {
            "Authorization": await AsyncStorage.getItem('finalIdToken')
        }
        setLoading(true);
        getCurrentUser(header).then(async (userResponse) => {
            console.log("userResponse=============111111111")
            setLoading(false);
            if (userResponse.success) {
                // console.log("usrMfaAssign=========2", userResponse);

                //Toast.show("MFA is enabled");
                showMessage({
                    message: "MFA is enabled",
                    type: "info",
                    style: { marginTop: StatusBar.currentHeight, fontSize: 16 }
                });


                await AsyncStorage.setItem('loginCredentials', JSON.stringify(userResponse.data));

                //console.log("userIsSubscribe==========", userIsSubscribe)

                if (!userIsSubscribe) {
                    navigation.navigate("NoSubscription")
                }
            }
        }).catch(err => {
            //console.log("LoginController.getCurrentUser err .....", err)
            setLoading(false);
        })
    }*/

    /*const submitMfa = async () => {
        if (selectedValue != "") {
            //console.log("selectedValue===========", selectedValue)
            if (selectedValue == "Software") {
                await associateSoftwareTokenFunction();
            }

            if (selectedValue == "SMS") {
                // console.log("Entry for sms")
                await usrMfaAssignFunction();
            }
        } else {
            Toast.show("Please Select one Mfa type")
        }

    }*/

    /* const associateSoftwareTokenFunction = async () => {
         //alert();
         setLoading(true);
         let headers = {};
         headers['AccessToken'] = await AsyncStorage.getItem('accessToken');
         headers["Authorization"] = await AsyncStorage.getItem('finalIdToken');
 
         associateSoftwareToken(headers).then((response) => {
             if (response.success) {
                 if (response.success) {
                     //setEnablePopupFlag(false)
                     let SecretCode = response.data.SecretCode;
                     setSecretCode(SecretCode);
                     //console.log("SecretCode======", SecretCode)
                 }
 
             }
             setLoading(false);
         }).catch((error) => {
             setLoading(false);
         });
     }*/

    const mfaActionSuccessFn = (data) => {
        if (data) {
            setEnablePopupFlag(false);
        }
    }

    const onRequestCloseModal = () => {
        setEnablePopupFlag(false)
    }

    //console.log("loading===", loading)
    return (
        <SafeAreaView style={theme.mainContainer}>
            <Loader loading={loading} />
            <View style={theme.filterContainer}>
                <View style={theme.dropDownContainer}>
                    <RNPickerSelect
                        onValueChange={(value) => bookingStatusOnchange(value)}
                        items={[
                            { label: 'Confirmed', value: 'confirmed' },
                            { label: 'Checked-In', value: 'checked-in' }
                        ]}
                        placeholder={{
                            label: "Status",
                            value: null,
                            color: Colors.gray99,
                        }}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                display: 'none'
                            },
                        }}
                        value={bookingStatusValue}
                    />
                    {bookingStatusValue && bookingStatusValue != "" &&
                        <TouchableOpacity style={theme.clearStatus} onPress={removeStatus}>
                            <AntDesign name="close" size={16} color={Colors.primary} />
                        </TouchableOpacity>}
                </View>
                <View style={theme.dateContainer}>
                    <View style={theme.dateInput}>
                        <TouchableOpacity onPress={openDatePicker} style={theme.dateInputContainer}>
                            <Text style={theme.dateLabel}>
                                {selectedDate ?
                                    Utility.formatDate(selectedDate) :
                                    <Text style={{ color: Colors.gray99 }}>Booking Date</Text>
                                }
                            </Text>
                            <FontAwesome name="calendar" size={16} color={Colors.primary} />
                        </TouchableOpacity>
                        {selectedDate &&
                            <TouchableOpacity style={theme.clearDate} onPress={removeDate}>
                                <AntDesign name="close" size={16} color={Colors.primary} />
                            </TouchableOpacity>
                        }
                    </View>
                    <CommonDatePicker
                        open={isDatePickerOpen}
                        date={selectedDate}
                        onDateChange={handleDateChange}
                        closeDatePicker={closeDatePicker}
                        type="Filter"
                        locale="en"
                    />
                </View>
            </View>
            <FlatList
                data={Object.values(
                    bookingListData.reduce((acc, item) => {
                        acc[item.id] = item; // Replace the object with the same id
                        return acc;
                    }, {})
                )}
                renderItem={renderData}
                keyExtractor={(item) => item.id}
                onEndReachedThreshold={0.1}
                initialNumToRender={10}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={theme.listContainer}
                onEndReached={handleLoadMore}
                onMomentumScrollBegin={_onMomentumScrollBegin}
                ListEmptyComponent={
                    <View style={theme.emptyData}>
                        <Text style={theme.emptyDataText}>
                            No booking data available at the moment.
                        </Text>
                    </View>
                }
                onRefresh={_handleRefreshForGridOnly}
                refreshing={refreshing}
            />

            <GlobalModalBottomSheet
                visible={checkInPopupFlag}
                onRequestClose={() => {
                    setCheckInPopupFlag(!checkInPopupFlag);
                }}
                header={false}
                modalHeight={230}
                contentBody={
                    <ConfirmationPopupContent
                        title="Want To Checkin?"
                        content="Are you sure, you want to checkin the booking? This action cannot be reversible."
                        confirm={checkInFn}
                        cancel={checkInPopupHide}
                    />
                }
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={assignRoomPopupFlag}
                onRequestClose={() => {
                    setAssignRoomPopupFlag(!assignRoomPopupFlag);
                }}
            >

                <RoomNumberAssignContent
                    closeRoomAssignModal={closeRoomAssignModal}
                    checkInbookingId={checkInbookingId}
                    roomAssignSuccessFn={roomAssignSuccessFn}
                    withoutRoomAssignToCheckIn={withoutRoomAssignToCheckIn}
                />
            </Modal>

            <GlobalModalBottomSheet
                visible={assignRoomConfirmationPopupFlag}
                onRequestClose={() => {
                    setAssignRoomConfirmationPopupFlag(!assignRoomConfirmationPopupFlag);
                }}
                header={false}
                modalHeight={230}
                contentBody={
                    <ConfirmationPopupContent
                        title="No room number is assigned !"
                        content="Would you like to assign room number now?"
                        confirm={assignRoomConfirmationFn}
                        cancel={closeAssignRoomConfirmationFn}
                    />
                }
            />
            <MFAModalContent
                enablePopupFlag={enablePopupFlag}
                accountName={accountName}
                userIsSubscribe={userIsSubscribe}
                mfaActionSuccessFn={mfaActionSuccessFn}
                mfaActionType={mfaActionType}
                userActionMfaType=""
                isMfaRequiredFlag={isMfaRequiredFlag}
                onRequestCloseModal={onRequestCloseModal}
            />
            {/* <GlobalModalBottomSheet
                visible={enablePopupFlag}
                onRequestClose={false}
                header={mfaActionType == "enable_mfa" ? (secretCode && secretCode != "" ? false : true) : true}
                modalHeight={mfaActionType == "enable_mfa" ? (secretCode && secretCode != "" ? 540 : 400) : 200}
                headerTitle={mfaActionType == "enable_mfa" ? "Your organization requires MFA for enhanced security. Please enable MFA to proceed further by selecting one of the following options:" : "Change MFA Type"}
                outsideClickClose={false}
                headerFontSize={16}
                headerFontLineHeight={28}
                showIcon={secretCode && secretCode != "" && mfaActionType == "enable_mfa" ? false : true}
                headerTextAlign="center"
                contentBody={
                    <>
                        {secretCode && secretCode != "" && mfaActionType == "enable_mfa" ?
                            <QRCodeGenerator secretCode={secretCode} accountName={accountName} setotpParent={setotpParent} verifySoftwareTokenFunction={verifySoftwareTokenFunction} />
                            :
                            <>
                                <View style={CommonStyle.enableMFAModaLBody}>
                                    <View style={CommonStyle.enableMFAModaLContent}>
                                        {enableMFAOptions.map((option) => {
                                            const isSelected = option.value === selectedValue;
                                            return (
                                                <TouchableOpacity
                                                    key={option.value}
                                                    onPress={() => setSelectedValue(option.value)}
                                                    style={CommonStyle.radioButtonContainer}
                                                >
                                                    <View style={[CommonStyle.radioCircle, isSelected && CommonStyle.selected]}>
                                                        {isSelected && <Entypo name="check" size={14} color="white" />}
                                                    </View>
                                                    <Text style={CommonStyle.radioLabel}>{option.label}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                    <View>
                                        <TouchableOpacity style={CommonStyle.enableSubmitMfaBtn} onPress={() => submitMfa()}>
                                            <Text style={CommonStyle.enableSubmitMfaBtnText}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        }
                    </>
                }
            /> */}

        </SafeAreaView>
    );
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 40,
        paddingVertical: 0,
        paddingHorizontal: 10,
        fontSize: 14,
        color: Colors.secondary,
        width: '100%',
        opacity: 1,
        fontFamily: 'Poppins-Regular',
        textAlignVertical: 'center',
        margin: 0,
        paddingBottom: 20,
        position: 'relative',
        top: -8

    },
    inputAndroid: {
        height: 35,
        paddingVertical: 0,
        paddingHorizontal: 10,
        fontSize: 14,
        color: Colors.secondary,
        width: '100%',
        opacity: 1,
        fontFamily: 'Poppins-Regular',
        textAlignVertical: 'center',
        margin: 0,
        paddingBottom: 20,
        position: 'relative',
        top: -8
    },
    placeholder: {
        color: Colors.gray99,
    },
});

export default HomeScreen;
