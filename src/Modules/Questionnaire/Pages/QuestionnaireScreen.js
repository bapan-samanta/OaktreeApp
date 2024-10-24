const screen = Dimensions.get("window");
const screenWidth = screen.width;
const screenheight = screen.height;


import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    FlatList,
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    Button,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SelectList } from 'react-native-dropdown-select-list';
import moment from 'moment';
import { getQuestionnaireList } from '../Controller/QuestionnaireController';
import Loader from '../../../Utility/Components/Loader';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../../../Utility/Components/HeaderBar';
import PatientQuestionList from '../Components/PatientQuestionList';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Colors from '../../../Utility/Colors';





const QuestionnaireItem = memo(({ item, index, onSelectDocument }) => {
    const navigationPage = useNavigation();
    return (
        <View style={[styles.appointmentCard]} key={index}>
            <View style={styles.rowBox}>
                <View style={styles.row}>
                    <Text style={styles.label}>Name of Questionnaire:</Text>
                    <Text style={styles.value}>{item.assignedType}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Sent By:</Text>
                    <Text style={styles.value}>{item.assignedName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Sent Date:</Text>
                    <Text style={styles.value}>
                        {moment(item.assignedOn, 'DD-MM-YYYY').format('MMM D, YYYY')}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Status:</Text>
                    {
                        item.status === "Incomplete" ?
                            <Text style={[styles.value, styles.statusIncomplete]}>{item.status}</Text>
                            :
                            <Text style={[styles.value, styles.statusComplete]}>{item.status}</Text>
                    }

                </View>
            </View>
            <View style={styles.completeYourQuestionnaireTextRow}>
                <View style= {item.questionnaire?.administeredType.toString() === "1" || item.status === "Completed" ? styles.completeYourQuestionnaireTextView : styles.completeYourQuestionnaireText }>
                    {item.questionnaire?.administeredType.toString() === "1" || item.status === "Completed" ? (
                        <TouchableOpacity onPress={() => onSelectDocument(item)} style={styles.questionnaireAction}>
                            <Text style={styles.questionnaireActionText}>View</Text>
                            <Image source={require('../Public/images/viewQ.png')} style={styles.fillUpQuestions} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => onSelectDocument(item)} style={styles.questionnaireAction}>
                            <Text style={styles.questionnaireActionText}>Please Complete Task</Text>
                            <Image source={require('../Public/images/fillUpQuestions.png')} style={styles.fillUpQuestions} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

        </View>
    );
});

//  const handleSelectedDocument = (questionsArray) => {
//     console.log("questionsArray------------", questionsArray);
//     setSelectedQuestions(questionsArray);
// }

const renderEmptyComponent = () => {
    return (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>No records found</Text>
        </View>
    );
};

function QuestionnaireScreen({ navigation }) {
    const dispatch = useDispatch();
    const reduxAuthJson = useSelector((state) => state);
    // console.log("reduxAuthJson", reduxAuthJson);
    const [questionnaireData, setQuestionnaireData] = useState([]);
    const [questionnaireDataAfterFilter, setQuestionnaireDataAfterFilter] = useState([]);
    const ITEMS_PER_PAGE = 10;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filterFlag, setFilterFlag] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [openQuestionList, setOpenQuestionList] = useState(false);
    const [dataReloadCount, setDataReloadCount] = useState(0);

    const [selectedTimeline, setSelectedTimeLine] = React.useState("");
    const SelectOptionForTimeLine = [
        { key: '', value: 'Timeline' },
        { key: '7', value: 'Week' },
        { key: '30', value: '1 month' },
        { key: '90', value: '3 months' },
        { key: '180', value: '6 months' }
    ]

    const [selectedPaymentStatus, setSelectedPaymentStatus] = React.useState("");
    const [SelectOptionForPaymentStatus, setSelectOptionForPaymentStatus] = useState([
        { key: '', value: 'All' }
    ]);

    const [selectedPaymentMode, setSelectedPaymentMode] = React.useState("");
    const SelectOptionForPaymentMode = [
        { key: '', value: 'All' },
        { key: 'pmi', value: 'PMI' },
        { key: 'selfpay', value: 'Self Pay' },
        { key: 'thirdPartyPayer', value: 'Third Party' }
    ]

    useEffect(() => {
        if (reduxAuthJson.currentUserDetails) {
            setQuestionnaireDataAfterFilter([]);
            setQuestionnaireData([]);
            setDataReloadCount(0)
            getQuestionnaireListFn();
        }
    }, [])

    useEffect(() => {
        if (questionnaireDataAfterFilter !== null && questionnaireDataAfterFilter !== undefined && questionnaireDataAfterFilter.length > 0) {
            // console.log("Call loadMoreData IF");
            loadMoreData();
        } else {
            console.log("Call loadMoreData Else");
            setData([]);
        }
    }, [page, questionnaireDataAfterFilter]);

    const getQuestionnaireListFn = () => {
        try {
            setPageLoading(true);
            getQuestionnaireList({ id: reduxAuthJson.token.loginUserId }).then(async (response) => {
                // console.log(response.PatientQuestionnaireList);
                setQuestionnaireDataAfterFilter(response.PatientQuestionnaireList);
                setQuestionnaireData(response.PatientQuestionnaireList);
                setPageLoading(false);
                setDataReloadCount(dataReloadCount + 1)

                // Get unique assigned name
                const uniqueAssignedNames = [...new Set(response.PatientQuestionnaireList.map(item => item.assignedName))];
                const transformedArray = [{ key: '', value: 'All' }];
                const nameObjects = uniqueAssignedNames.map(name => ({
                    key: name,
                    value: name
                }));

                transformedArray.push(...nameObjects);

                setSelectOptionForPaymentStatus(transformedArray)
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
                const newItems = questionnaireDataAfterFilter.slice(start, end);
                //console.log(newItems)
                setData(prevData => [...prevData, ...newItems]);
                setHasMore(newItems.length > 0);
                setLoading(false);
            }, 1000);
        }
    };

    const handleLoadMore = () => {
        if (questionnaireDataAfterFilter !== null && questionnaireDataAfterFilter !== undefined && questionnaireDataAfterFilter.length > 0) {
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
        // Make a copy of questionnaireData so that all filters can be applied sequentially
        let filteredData = [...questionnaireData]; // Ensure it's a new reference

        // Apply timeline filter
        if (selectedTimeline) {
            const pastDate = moment().subtract(selectedTimeline, 'days').format('YYYY-MM-DD');
            // console.log("pastDate",selectedTimeline, pastDate);
            filteredData = filteredData.filter(questionnaire =>
                moment(questionnaire.assignedOn, 'DD-MM-YYYY').format('YYYY-MM-DD') >= pastDate
            );
        }

        // Filter by appointmentStatus
        if (selectedPaymentStatus) {
            filteredData = filteredData.filter(questionnaire => {
                console.log("==============", questionnaire);
                return questionnaire.assignedName.toLowerCase() === selectedPaymentStatus.toLowerCase();
            });
        }

        // Only now update the state after all filtering is complete
        setQuestionnaireDataAfterFilter(filteredData);
        setHasMore(filteredData.length >= 1); // For pagination
        setPage(1); // Reset page to 1
    };


    // const renderItem = useCallback(({ item, index }) => {
    //     return <QuestionnaireItem item={item} index={index} />;
    // }, []);

    const handleFilter = () => {
        setFilterFlag(!filterFlag);
    }

    const handleBackPress = () => {
        console.log("handleBackPress");
        if (openQuestionList) {
            setOpenQuestionList(false);
        } else {
            navigation.goBack();
        }
    }

    const reloadQuestionnaireList = () => {
        setOpenQuestionList(false);
        getQuestionnaireListFn();
    }


    const handleSelectedDocument = (questionsArray) => {
        console.log(questionsArray);
        // if(questionsArray.length > 0){
        setSelectedQuestions(questionsArray);
        setOpenQuestionList(true);
        // }
    };

    const renderItem = useCallback(({ item, index }) => {
        return <QuestionnaireItem item={item} index={index} onSelectDocument={handleSelectedDocument} />;
    }, []);

    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
    };

    return (
        <View style={styles.container}>
            <Loader loading={pageLoading} />
            <HeaderBar
                title="Questionnaire"
                onBackPress={handleBackPress}
                onFilterPress={handleFilter}
                filterHide={openQuestionList}
            />
            {
                !openQuestionList ?
                    <>
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
                                    placeholder="Sent By"
                                />
                            </View>
                        </View>


                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.appointmentBookedId + item.id + "-" + generateUniqueId().toString()}
                            ListFooterComponent={renderFooter}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListEmptyComponent={!loading ? renderEmptyComponent : null} // This will show when the list is empty
                        />
                    </>
                    :
                    <PatientQuestionList
                        questionObj={selectedQuestions}
                        handleBackPress={handleBackPress}
                        reloadQuestionnaireList={reloadQuestionnaireList}
                    />
            }
        </View >
    );
}

export default QuestionnaireScreen;


const styles = StyleSheet.create({
    appointmentCard: {
        padding: 15,
        paddingLeft:0,
        paddingRight:0,
        paddingBottom:10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        marginLeft: 10,
        marginRight: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        flexWrap: 'wrap'
    },
    rowBox: {
        paddingLeft:15,
        paddingRight:15,
    },
    label: {
        fontWeight: 'bold',
        width: 180,
    },

    status: {
        color: '#ff5e57',
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    videoConsultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff', // Blue button background
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 2, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    videoConsultText: {
        color: 'white', // White text color
        fontSize: 16,
        fontWeight: 'bold',
    },

    container: {
        flex: 1,
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
    completeYourQuestionnaireTextRow: {
        flexDirection: 'row',
        // justifyContent: 'flex-end', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
        // backgroundColor:'blue'
        marginTop: 5,
        borderTopWidth:1,
        borderColor:'#ddd',
        paddingTop:10,

    },
    questionnaireAction: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    completeYourQuestionnaireText: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007667',
        borderStyle: 'solid',
        textAlign: 'center',
        alignSelf: 'center',
        // backgroundColor:'red',
        width: '60%'
    },
    completeYourQuestionnaireTextView:{
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007667',
        borderStyle: 'solid',
        textAlign: 'center',
        alignSelf: 'center',
        // backgroundColor:'red',
        width: '35%'
    },
    questionnaireActionText: {
        fontSize: 14,
        color: Colors.black,
        paddingRight: 10
    },
    statusIncomplete: {
        backgroundColor: '#ffd66a',
        color: '#000',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    statusComplete: {
        backgroundColor: '#007667',
        color: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    fillUpQuestions: {
        height: 20,
        width: 20
    }
});
