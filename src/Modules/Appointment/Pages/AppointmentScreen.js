const screen = Dimensions.get("window");
const screenWidth = screen.width;
const screenheight = screen.height;
const bookingscreenWidth = screenWidth - 30
const bookingscreenWidthLeft = bookingscreenWidth - 50;
// const mainContainerWidth = screenWidth - 50;
// const mainContainerHeight = screenheight - 84;
// const boxHeight = mainContainerHeight / 3 - 5
// screens/HomeScreen.js
import React, { useState, useEffect, useCallback, memo } from 'react';
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
    ActivityIndicator,
    Linking,
    Dimensions
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SelectList } from 'react-native-dropdown-select-list';
import moment from 'moment';
import { getAppointmentList } from '../Controller/AppointmentController';
import Loader from '../../../Utility/Components/Loader';
import Config from '../../../Utility/Config';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderBar from '../../../Utility/Components/HeaderBar';
import Colors from '../../../Utility/Colors';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalBottomSheet from '../../../Utility/Components/GlobalBottomSheet';
import BottomSheetDesign from '../Components/BottomSheetDesign';
import InAppBrowser from 'react-native-inappbrowser-reborn';


const AppointmentItem = memo(({ item, index, bottomSheetShow, goToVideoScreen }) => {
    const navigationPage = useNavigation();
    let appointmentDate1 = item.appointmentDate.split("-");
    let todayDate = moment().format('DD-MM-YYYY').split("-");
    const backgroundColor = index % 2 === 0 ? '#ffffff' : '#ccccc';
    const redirectVideoScreen = () => {
        navigationPage.navigate('VideoScreen')
    }
    return (
        <>
            <View style={[styles.appointmentCard]}>
                <View style={styles.appointmentCardRow}>
                    <View style={styles.leftView}>
                        <View style={styles.rowPractitioner}>
                            <MaterialCommunityIcons
                                name="account"
                                size={30}
                                color={Colors.green01}
                                style={styles.noManIcon}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.practitionerName}>{item.practitionerName}</Text>
                                <Text style={styles.practitionerSpeciality}>{item.practitionerSpeciality}</Text>
                            </View>
                        </View>
                        <View style={[styles.row]}>
                            <Text style={[styles.marginLeftClass, styles.showText]}>{moment(item.appointmentDate, 'DD-MM-YYYY').format('MMM D, YYYY')} {item.appointmentTime.toUpperCase()}</Text>
                            {getStatusName(item.appointmentStatus.toLowerCase())}
                        </View>

                        <View style={[styles.row, styles.down]}>
                            <Image source={require('../Public/images/pound.png')} style={[styles.marginLeftClass, styles.poundHeight]} />
                            <Text style={styles.payMode}>{item.appointmentPayType.toUpperCase()}</Text>
                        </View>
                    </View>
                    <View style={styles.rightView}>
                        {

                            (item.appointmentStatus === "Approved" || item.appointmentStatus === "In Progress") && (appointmentDate1 !== undefined) && (new Date(appointmentDate1[2], parseInt(appointmentDate1[1]) - 1, appointmentDate1[0]) >= new Date(todayDate[2], parseInt(todayDate[1]) - 1, todayDate[0])) ? moment([appointmentDate1[2], appointmentDate1[1] - 1, appointmentDate1[0]]).diff(moment([todayDate[2], todayDate[1] - 1, todayDate[0]]), 'days') < 2 ? (
                                <TouchableOpacity style={styles.row} onPress={goToVideoScreen}>
                                    <Image source={require('../Public/images/ongoing.png')} style={[styles.videoIcon]} />
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.row}>
                                    <Image source={require('../Public/images/pending.png')} style={[styles.videoIcon]} />
                                </View>
                            )
                                :
                                (
                                    <View style={styles.row}>
                                        <Image source={require('../Public/images/pending.png')} style={[styles.videoIcon]} />
                                    </View>
                                )
                        }
                    </View>
                </View>

                {/* <View style={styles.blankView}>

            </View> */}

                <View style={styles.completeYourQuestionnaireTextRow}>
                    <Text style={styles.leftSide}>
                        <TouchableOpacity style={styles.completeYourQuestionnaireText} onPress={() => bookFollowUp()}>
                            <Text>Book Follow-up</Text>
                        </TouchableOpacity>
                    </Text>
                    <View style={styles.rightSide}>
                        <TouchableOpacity onPress={() => bottomSheetShow(item)} style={[styles.menu3dotsTouchableOpacity]}>
                            <Image source={require('../Public/images/menu.png')} style={[styles.menu3dotsIcon]} />
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity style={styles.completeYourQuestionnaireText} onPress={() => bookFollowUp()}>
                    <Text>Book Follow-up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => bottomSheetShow(item)} style={[styles.menu3dotsTouchableOpacity]}>
                    <Image source={require('../Public/images/menu.png')} style={[styles.menu3dotsIcon]} />
                </TouchableOpacity> */}
                </View>

            </View>

        </>
    );
});

const getStatusName = (status) => {
    switch (status) {
        case 'pending':
            return <Text style={[styles.statusText, styles.yetToConfirm]}>Yet to confirm</Text>;
        case 'completed':
            return <Text style={[styles.statusText, styles.completed]}>Completed</Text>;
        case 'cancelled':
            return <Text style={[styles.statusText, styles.cancelled]}>Cancelled</Text>;
        case 'in progress':
            return <Text style={[styles.statusText, styles.ongoing]}>Ongoing</Text>;
        default:
            return <Text style={[styles.statusText, styles.upcoming]}>Upcoming</Text>;
    }
}

const bookFollowUp = () => {
    console.log("bookFollowUp");
}

const renderEmptyComponent = () => {
    return (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>No records found</Text>
        </View>
    );
};

const handalContactUs = () => {
    console.log("handalContactUs");
    Linking.openURL(Config.feedback).catch((err) => console.error("Couldn't load page", err));
}
const handalFeedback = () => {
    console.log("handalFeedback");
    Linking.openURL(Config.feedback).catch((err) => console.error("Couldn't load page", err));
}
const handalPrescription = () => {
    console.log("handalPrescription");
    Linking.openURL(Config.feedback).catch((err) => console.error("Couldn't load page", err));
}
const handalSupport = () => {
    console.log("handalSupport");
    Linking.openURL(Config.feedback).catch((err) => console.error("Couldn't load page", err));
}

function AppointmentScreen({ props }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const reduxAuthJson = useSelector((state) => state);
    // console.log("reduxAuthJson", reduxAuthJson);
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [appointmentsDataAfterFilter, setAppointmentsDataAfterFilter] = useState([]);
    const ITEMS_PER_PAGE = 10;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filterFlag, setFilterFlag] = useState(false);
    const [isSheetVisible, setSheetVisible] = useState(false);
    const hideBottomSheet = () => setSheetVisible(false);
    const snapPoints = ['50%'];

    const [selectedTimeline, setSelectedTimeLine] = React.useState("");
    const SelectOptionForTimeLine = [
        { key: '', value: 'All' },
        { key: '30', value: 'Last 30 days' },
        { key: '90', value: 'Last three months' },
        { key: '180', value: 'Last six months' }
    ]

    const [selectedPaymentStatus, setSelectedPaymentStatus] = React.useState("");
    const SelectOptionForPaymentStatus = [
        { key: '', value: 'All' },
        { key: 'pending', value: 'Pending' },
        { key: 'approved', value: 'Approved' },
        { key: 'completed', value: 'Completed' },
        { key: 'cancelled', value: 'Cancelled' }
    ]

    const [selectedPaymentMode, setSelectedPaymentMode] = React.useState("");
    const SelectOptionForPaymentMode = [
        { key: '', value: 'All' },
        { key: 'pmi', value: 'PMI' },
        { key: 'selfpay', value: 'Self Pay' },
        { key: 'thirdPartyPayer', value: 'Third Party' }
    ]

    useEffect(() => {
        if (reduxAuthJson.currentUserDetails) {
            getAppointmentListFn();
        }
    }, [])

    useEffect(() => {
        if (appointmentsDataAfterFilter !== null && appointmentsDataAfterFilter !== undefined && appointmentsDataAfterFilter.length > 0) {
            // console.log("Call loadMoreData IF");
            loadMoreData();
        } else {
            console.log("Call loadMoreData Else");
            setData([]);
        }
    }, [page, appointmentsDataAfterFilter]);

    const getAppointmentListFn = () => {
        try {
            setPageLoading(true);
            getAppointmentList({ id: reduxAuthJson.token.loginUserId }).then(async (response) => {
                //console.log(response);
                setAppointmentsDataAfterFilter(response.PomsAppointmentList);
                setAppointmentsData(response.PomsAppointmentList);
                setPageLoading(false);
            })

        } catch (error) {
            console.error("Error fetching questionnaire list:", error);
            setPageLoading(false);
            // Handle error here (e.g., show a toast or alert)
        } finally {
            // setPageLoading(false); // Ensure loading state is reset
        }
    }

    const loadMoreData = () => {
        console.log("loadMoreData FN", page, loading, hasMore);
        if (!loading && hasMore && page > 0) {
            setLoading(true);
            const start = (page - 1) * ITEMS_PER_PAGE;
            const end = page * ITEMS_PER_PAGE;


            // Simulating a delay for fetching data
            setTimeout(() => {
                const newItems = appointmentsDataAfterFilter.slice(start, end);
                //console.log(newItems)
                setData(prevData => [...prevData, ...newItems]);
                setHasMore(newItems.length > 0);
                setLoading(false);
            }, 1000);
        }
    };

    const handleLoadMore = () => {
        if (appointmentsDataAfterFilter !== null && appointmentsDataAfterFilter !== undefined && appointmentsDataAfterFilter.length > 0) {
            if (!loading && hasMore) {
                setPage(page + 1);
            }
        }
    };

    const renderFooter = () => {
        return loading ? (
            <View style={{ padding: "30px 10px 10px 10px" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        ) : null;
    };

    const applyFilters = () => {
        console.log(selectedTimeline, selectedPaymentStatus, selectedPaymentMode);
        setPage(0);
        setData([]);
        // Make a copy of appointmentsData so that all filters can be applied sequentially
        let filteredData = [...appointmentsData]; // Ensure it's a new reference

        // Apply timeline filter
        if (selectedTimeline) {
            const pastDate = moment().subtract(selectedTimeline, 'days').format('YYYY-MM-DD');
            // console.log("pastDate",selectedTimeline, pastDate);
            filteredData = filteredData.filter(appointment =>
                moment(appointment.appointmentDate, 'DD-MM-YYYY').format('YYYY-MM-DD') >= pastDate
            );
        }

        // Filter by appointmentStatus
        if (selectedPaymentStatus) {
            filteredData = filteredData.filter(appointment => {
                return appointment.appointmentStatus.toLowerCase() === selectedPaymentStatus.toLowerCase();
            });
        }

        // Filter by appointmentPayType
        if (selectedPaymentMode) {
            filteredData = filteredData.filter(appointment => {
                // console.log(appointment.appointmentPayType.toLowerCase()+" === "+selectedPaymentMode.toLowerCase(), appointment.appointmentStatus.toLowerCase());
                return appointment.appointmentPayType.toLowerCase() === selectedPaymentMode.toLowerCase()
            });
        }

        // Only now update the state after all filtering is complete
        setAppointmentsDataAfterFilter(filteredData);
        setHasMore(filteredData.length >= 1); // For pagination
        setPage(1); // Reset page to 1
    };

    const handleBottomSheetShow = (item) => {
        // console.log("handleBottomSheetShow", item);
        setSheetVisible(true);
    }

    const goToVideoScreen = async () => {
        try {
            if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.open('https://stag-patient.oaktreeconnect.co.uk/appointment/video-consultation', {
                    // Optional settings
                    toolbarColor: '#6200EE',
                    secondaryToolbarColor: 'black',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    showInRecents: true,
                    forceCloseOnRedirection: false,
                });
            } else {
                Alert.alert('InAppBrowser is not available');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const renderItem = useCallback(({ item, index }) => {
        return <AppointmentItem
            item={item}
            index={index}
            bottomSheetShow={handleBottomSheetShow}
            goToVideoScreen={goToVideoScreen}
        />;
    }, []);

    const handleFilter = () => {
        setFilterFlag(!filterFlag);
    }

    const handleBackPress = () => {
        console.log("handleBackPress");
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            console.log("No previous screen to go back to.");
        }
    }

    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
    };



    return (

        <View style={styles.container}>

            {/* <Loader style={styles.loadingCss} loading={pageLoading} /> */}

            <HeaderBar
                title="My Consultations"
                onBackPress={handleBackPress}
                onFilterPress={handleFilter}
                filterHide={false}
            />


            <View style={[styles.styleListTopView, filterFlag ? styles.visibleFilter : styles.hiddenFilter]}>
                <View style={styles.styleListSecondTopView}>
                    <SelectList
                        style={{ marginTop: 60 }}
                        setSelected={(val) => setSelectedTimeLine(val)}
                        data={SelectOptionForTimeLine}
                        save="key"
                        dropdownStyles={{ position: 'absolute', top: 37, zIndex: 1000, width: '100%', backgroundColor: '#ccc', borderRadius: 8, padding: 10 }}
                        onSelect={() => applyFilters()}
                        placeholder="Timeline"
                    />
                </View>
                <View style={styles.styleListSecondTopView}>
                    <SelectList
                        setSelected={(val) => setSelectedPaymentStatus(val)}
                        data={SelectOptionForPaymentStatus}
                        save="key"
                        dropdownStyles={{ position: 'absolute', top: 37, zIndex: 1000, width: '100%', backgroundColor: '#ccc' }}
                        onSelect={() => applyFilters()}
                        placeholder="Payment Status"
                    />
                </View>
                <View style={styles.styleListSecondTopView}>
                    <SelectList
                        setSelected={(val) => setSelectedPaymentMode(val)}
                        data={SelectOptionForPaymentMode}
                        save="key"
                        dropdownStyles={{ position: 'absolute', top: 37, zIndex: 1000, width: '100%', backgroundColor: '#ccc' }}
                        onSelect={() => applyFilters()}
                        placeholder="Payment Mode"
                    />
                </View>
            </View>

            <View style={styles.appointmentScreenView}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.appointmentBookedId + item.id + "" + generateUniqueId()}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={!loading ? renderEmptyComponent : null} // This will show when the list is empty
                />
            </View>

            <GlobalBottomSheet
                isVisible={isSheetVisible}
                onClose={hideBottomSheet}
                snapPoints={snapPoints}
                bodyContent={
                    <BottomSheetDesign
                        handalContactUs={handalContactUs}
                        handalFeedback={handalFeedback}
                        handalPrescription={handalPrescription}
                        handalSupport={handalSupport}
                    />
                }
            />
        </View >
    );
}

export default AppointmentScreen;

const styles = StyleSheet.create({
    appointmentCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 15,
        backgroundColor: '#fff',
        marginLeft: 15,
        marginBottom: 15,
        shadowColor: '#000', // Change the shadow color as desired
        shadowOffset: { width: 1 }, // Move shadow more to the left and down
        shadowOpacity: 0.1, // Increase for a darker shadow
        shadowRadius: 4, // Adjust for more blurriness
        elevation: 3, // Adjust for Android

    },
    appointmentCardRow: {
        flexDirection: 'row', // Align children in a row
        alignItems: 'center',  // Center items vertically
        justifyContent: 'space-between',
        // backgroundColor:'red',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    leftView: {
        width: "85%",
    },
    rightView: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: "15%",
        padding: 10,
        borderRadius: 5,
        alignItems: 'flex-end'
    },
    // blankView: {
    //     borderBottomColor: '#ccc',  // Set the border bottom color
    //     borderBottomWidth: 1, 
    //     marginBottom: 7,
    //     marginTop: 7

    // },
    row: {
        flexDirection: 'row',
        alignItems: 'center', // Center items vertically
    },
    label: {

    },

    status: {
        color: '#ff5e57', // Color for status like "Cancelled"
        fontWeight: '600',
    },
    dropdownStyles: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
    },
    logoHeight: {
        height: '100%',
        width: '100%'
    },
    videoImg: {
        width: '18px',
        height: '16px',
        marginRight: '7px',
        marginTop: '2px',
        color: 'blue',
        textAlign: 'right'
    },

    callContainer: {

    },
    videoConsultContainer: {

    },
    videoIcon: {
        height: 48,
        width: 48
    },
    videoConsultText: {
        color: 'white', // White text color
        fontSize: 16,
        fontWeight: 'bold',
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
        //  marginBottom: 68
        paddingBottom: 68
    },
    styleListTopView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingLeft: 8,
        paddingRight: 3
    },
    styleListSecondTopView: {
        marginBottom: 5,
        width: '49%'
    },
    visibleFilter: {
        display: 'block'
    },
    hiddenFilter: {
        display: 'none'
    },
    appointmentScreenView: {
        // paddingLeft: 10,
        paddingRight: 15,
    },

    rowPractitioner: {
        flexDirection: 'row',
        alignItems: 'center', // Center items vertically
        marginBottom: 8,
    },
    noManIcon: {
        marginRight: 10, // Add spacing between icon and text
    },
    textContainer: {
        flexDirection: 'column', // Stack text vertically
        marginTop: 20
    },
    practitionerName: {
        fontSize: 14, // Adjust font size as needed
        fontWeight: 'bold',
        color: Colors.black
    },
    practitionerSpeciality: {
        fontSize: 12, // Adjust font size as needed
        color: '#747474', // Change color to differentiate from name if needed
    },
    marginLeftClass: {
        marginLeft: 40
    },
    showText: {
        color: Colors.black,
        fontSize: 14
    },
    statusText: {
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 1,
        paddingBottom: 1,
        borderRadius: 5,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        fontSize: 12
    },
    yetToConfirm: {
        backgroundColor: '#ffd66a',
        color: '#000'
    },
    completed: {
        backgroundColor: '#007667',
        color: '#fff'
    },
    cancelled: {
        backgroundColor: '#ff3535',
        color: '#fff'
    },
    ongoing: {
        backgroundColor: '#007FC6',
        color: '#fff',
    },
    upcoming: {
        backgroundColor: '#FAFF00',
        color: '#000'
    },
    poundHeight: {
        height: 20,
        width: 20,
        marginRight: 8
    },
    payMode: {
        color: Colors.black,
        fontSize: 12
    },
    completeYourQuestionnaireTextRow: {
        flexDirection: 'row',
        // justifyContent: 'flex-start',
        alignItems: 'center',
        //marginBottom: 5, 
        height: 50,
        //backgroundColor: '#666',
        display: 'flex',
        //marginTop:7,
        // marginBottom:7,
        paddingTop: 7,
        paddingBottom: 7,
        borderRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        width: bookingscreenWidth,
    },
    leftSide: {
        width: bookingscreenWidthLeft,
        height: 50,
        // backgroundColor: 'red',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign:'center',
        paddingTop:5,


    },
    rightSide: {
        width: 50,
        height: 50,
        // backgroundColor: '#f3f3f3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign:'center',


    },
    completeYourQuestionnaireText: {
        padding: 10,
        paddingLeft:15,
        paddingRight:15,
        borderRadius: 7,
        borderColor: '#007667',
        borderStyle: 'solid',
        borderWidth:1,
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 13,
        color: Colors.black,
       // backgroundColor:'blue',

    },
    menu3dotsTouchableOpacity: {
        position: 'absolute',
        right: 15,
        width: "15%",
        padding: 10,
        borderRadius: 5,
        alignItems: 'flex-end',
    },
    menu3dotsIcon: {
        height: 33,
        width: 31,
        marginLeft:5,
    },
    loadingCss: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 0
    },
    down:{
        paddingTop:5,
    }
});

