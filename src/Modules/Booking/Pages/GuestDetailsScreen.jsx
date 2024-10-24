import React, { useState, useEffect, Suspense } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    ScrollView,
    Dimensions,
    Image,
    Modal,
    TouchableWithoutFeedback,
    PermissionsAndroid,
    Platform
} from 'react-native';
import GuestDetailsStyle from '../Public/css/GuestDetailsStyle';
import Colors from '../../../Utility/Colors';
import { useTheme } from '../../../Contexts/ThemeContext';
import Loader from '../../../Utility/Components/Loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useRoute } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { Country } from 'country-state-city';
import * as ImagePicker from "react-native-image-picker";
import DocumentPicker, { DirectoryPickerResponse, DocumentPickerResponse, isInProgress, types } from 'react-native-document-picker';
import { uploadPersonDetails, uploadCustomerIdentityProof, getGuestDetails, updatePersonDetails } from '../Controller/BookingController'
import Toast from 'react-native-simple-toast';
import EventEmitter from '../../../Contexts/EventEmitter';
import Utility from '../../../Utility/Utility';
import { AccordionList } from 'accordion-collapse-react-native';
import GlobalModalBottomSheet from '../../../Utility/Components/GlobalModalBottomSheet'
import { showMessage, hideMessage } from "react-native-flash-message";
import { StatusBar, AppState } from 'react-native';

const screenHeight = Dimensions.get('window').height;

function GuestDetailsScreen({ navigation }) {
    const route = useRoute();

    // console.log("route.params.type==========", route.params.type)
    const { isDarkTheme } = useTheme();
    const theme = GuestDetailsStyle(isDarkTheme);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [accordionData, setaccordionData] = useState([]);
    const [accordionDataError, setaccordionDataError] = useState([]);
    const [nationalityItem, setNationalityItem] = useState([
        { label: 'nationality', value: 'nationality' },
        { label: 'nationality 2', value: 'nationality 2' }
    ]);
    const [identityTypeItem, setIdentityTypeItem] = useState([
        { label: "Passport", value: "passport" },
        { label: "PAN Card", value: "pan_card" },
        { label: "Aadhaar card", value: "aadhar_card" },
        { label: "Identity card", value: "identity_card" },
        { label: "Driving licence", value: "driving_licence" },
    ]);
    const [countryList, setCountryList] = useState([]);
    const [uploadPopupFlag, setUploadPopupFlag] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const snapPoints = ['40%'];



    useEffect(() => {
        requestCameraPermission();
    }, [])

    useEffect(() => {
        //console.log("accordionData============update", accordionData)
        //console.log("Entry ==2", route.params)
        guestDataFunction();
    }, [route.params])

    useEffect(() => {
        //console.log("accordionData============update", accordionData)

    }, [accordionData])

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Cool Photo App Camera Permission',
                    message:
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };




    const toggleAccordion = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
    };

    const backToBookingList = () => {
        setaccordionDataError([]);
        setaccordionData([]);
        navigation.goBack()
    };





    const confirmPersonDetailsModalFn = (isSkip = false) => {
        if (!isSkip) {
            let valid = validationFromData();
            //let valid = true;
            // console.log(valid);
            // return false;
            if (valid) {
                let dataSet = formatingDataset();
                //console.log("dataSet===", dataSet);
                //return false;
                setLoading(true);
                uploadPersonDetails(dataSet).then(async (response) => {
                    //console.log("response=========", response);
                    //return false;
                    if (response.length > 0) {
                        let i = 0;
                        for (const res of response) {
                            if (res.hasOwnProperty('success') && res.success) {
                                let customerDetailsId = res?.data?.customer_details_id;
                                let index_no = res?.data?.index;
                                if (customerDetailsId !== undefined && index_no !== undefined) {
                                    let uploadImageCount = 0;
                                    for (const p of accordionData) {
                                        if (p.identity_image.length > 0) {
                                            uploadImageCount += 1
                                        }
                                    }
                                    if (i == response.length - 1) {
                                        await imageUploadApiCallFn(customerDetailsId, index_no, true);
                                    } else {
                                        await imageUploadApiCallFn(customerDetailsId, index_no, false);
                                    }
                                } else {
                                    console.error("Missing customerDetailsId or index in response:", res);
                                }
                            }
                            i++
                        }
                    }
                    setLoading(false);
                }).catch((error) => {
                    console.error("************error*************", error)
                    if (error) {
                        //Utility.toastNotifications(error.message, "Error", "error");
                    }
                    setLoading(false);
                    if (error.message == "Network Error") {

                    }
                });
            }
        } else {
            props.personDetailsSuccessCloseModalFn(props.callFrom);
        }
    }


    const updateformatingDataset = (index) => {
        let updatedPersonData = [...accordionData];

        //console.log("updatedPersonData======", updatedPersonData[index])

        let hash = {}
        hash = {}
        hash['booking_id'] = updatedPersonData[index].booking_id;
        hash['customer_name'] = updatedPersonData[index].name;
        hash['customer_age'] = Number(updatedPersonData[index].age);
        hash['identity_type'] = updatedPersonData[index].identyType;
        hash['identity_number'] = updatedPersonData[index].identyNumber;
        // hash['index'] = index + 1;
        hash['customer_type'] = updatedPersonData[index].childAgeDisable == true ? "child" : "adult";

        hash['nationality'] = getCountryByCode(updatedPersonData[index].nationality).name.toLowerCase()

        hash['coming_from'] = updatedPersonData[index].commingFrom && updatedPersonData[index].commingFrom != "" ? getCountryByCode(updatedPersonData[index].commingFrom).name.toLowerCase() : ""
        hash['going_to'] = updatedPersonData[index].goingto && updatedPersonData[index].goingto != "" ? getCountryByCode(updatedPersonData[index].goingto).name.toLowerCase() : ""




        return hash;
    }

    const updateGuestDetails = (id, index) => {
        let valid = updatevalidationFromData(index);

        //console.log("valid===", valid)

        if (valid) {
            let dataset = updateformatingDataset(index);
            //console.log('dataset------------->', dataset);
            //return false;
            setLoading(true);

            updatePersonDetails(id, dataset).then((response) => {
                //console.log("response--------------->", response)
                // if (response.success) {
                //     Toast.show(response.message);
                // } else {
                //     Toast.show(response.message);
                // }

                if (response.success) {
                    const identityImageArray = accordionData[index].identity_image;
                    const hasEditedImage = identityImageArray.some(image =>
                        image.hasOwnProperty('is_edit') && image.is_edit === true
                    );

                    //console.log('Entry------------>2', accordionData);

                    let deleteImage = accordionData[index].hasOwnProperty('deleted_index') && accordionData[index].deleted_index.length > 0 ? true : false;
                    //console.log('Entry------------>3', deleteImage);
                    if (hasEditedImage || deleteImage) {
                        // console.log('Entry------------>3');
                        updateImageApiFn(id, index);
                    } else {
                        setaccordionData(prevPersonData => {
                            const updatedPersonData = [...prevPersonData];
                            updatedPersonData[index] = {
                                ...updatedPersonData[index],
                                "is_edit": false,
                                "deleted_index": []
                            };
                            return updatedPersonData;
                        });
                        //Toast.show(response.message);
                        showMessage({
                            message: response.message,
                            type: "info",
                            style: { marginTop: StatusBar.currentHeight }
                        });
                    }
                } else {
                    //Toast.show(response.message);
                    showMessage({
                        message: response.message,
                        type: "error",
                        style: { marginTop: StatusBar.currentHeight }
                    });
                }
                setLoading(false);
            }).catch((error) => {

                if (error) {
                    //Utility.toastNotifications(error.message, "Error", "error");
                }
                setLoading(false);
                if (error.message == "Network Error") {

                }
            });



        }
    }


    const removeUplodedImage = (personIndex, imageIndex) => {
        const updatedPersonData = [...accordionData];
        if (!updatedPersonData[personIndex].deleted_index) {
            updatedPersonData[personIndex].deleted_index = [];
        }

        updatedPersonData[personIndex].deleted_index.push(imageIndex);
        if (imageIndex === 0) {
            // If deleting the image at index 0, set it to the default object
            if (updatedPersonData[personIndex].identity_image.length == 1) {
                updatedPersonData[personIndex].identity_image = [];
            } else {
                updatedPersonData[personIndex].identity_image = updatedPersonData[personIndex].identity_image.filter((_, idx) => idx !== imageIndex);
            }
        } else {
            // Otherwise, filter out the image at the specific index
            updatedPersonData[personIndex].identity_image = updatedPersonData[personIndex].identity_image.filter((_, idx) => idx !== imageIndex);
        }

        //console.log("updatedPersonData====", updatedPersonData)

        setaccordionData(updatedPersonData);
    };

    const updateImageApiFn = async (customerDetailsId, index) => {
        // console.log('Entry------------>4');
        let saveImageData = [];
        const identityImageArray = accordionData[index].identity_image;
        let updated_img_array = [];
        for (let i = 0; i < identityImageArray.length; i++) {
            if (identityImageArray[i].hasOwnProperty('is_edit') && identityImageArray[i].is_edit === true) {
                updated_img_array.push(i);
            }
        }

        let saveImageDataObj = {
            "type": 'customer_identity',
            "customer_details_id": customerDetailsId,
            "image_details": [{ 'customer_details_id': customerDetailsId, 'deleted_index': accordionData[index].hasOwnProperty('deleted_index') && accordionData[index].deleted_index ? accordionData[index].deleted_index : [], 'updated_index': updated_img_array }]
        }
        saveImageData.push(saveImageDataObj);

        const formData = new FormData();
        formData.append('formData', JSON.stringify(saveImageData));
        accordionData[index].identity_image.map((imgObj) => {
            if (imgObj != "" && imgObj.is_edit == true) {
                formData.append('file', {
                    uri: imgObj.uri,
                    type: imgObj.type,
                    name: imgObj.name
                });
            }
        })

        // console.log('Entry------------>5');
        setLoading(true);
        await uploadCustomerIdentityProof(formData).then((response) => {
            if (response[0].success) {
                setaccordionData(prevPersonData => {
                    const updatedPersonData = [...prevPersonData];
                    updatedPersonData[index] = {
                        ...updatedPersonData[index],
                        "is_edit": false,
                        "deleted_index": []
                    };
                    return updatedPersonData;
                });
                //Toast.show("Document updated successfully")
                showMessage({
                    message: "Document updated successfully",
                    type: "info",
                    style: { marginTop: StatusBar.currentHeight }
                });
                setLoading(false);
            } else {
                setLoading(false);
            }
            //loaderStateFalse();
        }).catch((error) => {
            setLoading(false);
        });
    }

    const updatevalidationFromData = (index) => {
        let person = [...accordionData];
        let errors = [...accordionDataError];

        //console.log("person=======", person[index].identity_image.length)

        let valid = true;
        const encounteredIdentityNumbers = {};

        if (person[index].name == "") {
            errors[index].name = "Required Field";
            valid = false;
        }
        if (person[index].age == "") {
            errors[index].age = "Required Field";
            valid = false;
        }
        if (person[index].nationality == "") {
            errors[index].nationality = "Required Field";
            valid = false;
        }

        if (person[index].nationality != "") {
            let branchnationality = route?.params?.branchNationality ? route.params.branchNationality : "";
            let branchnationalityCode = getCountryByName(branchnationality)
            if (person[index].nationality.toLowerCase() !== branchnationalityCode.isoCode.toLowerCase()) {
                if (person[index].commingFrom == "") {
                    errors[index].commingFrom = "Required Field";
                    valid = false;
                }
                if (person[index].goingto == "") {
                    errors[index].goingto = "Required Field";
                    valid = false;
                }
            }
        }

        // if (person[index].identity_image.length == 0) {
        //     errors[index].identity_image = "Required Field";
        //     valid = false;
        // }

        if (person[index].identyType == "" && !person[index].childAgeDisable) {
            errors[index].identyType = "Required Field";
            valid = false;
        }
        if (person[index].identity_image.length == 0 && !person[index].childAgeDisable) {
            errors[index].identity_image = "Required Field";
            valid = false;
        }
        if (person[index].identyNumber == "" && !person[index].childAgeDisable) {
            errors[index].identyNumber = "Required Field";
            valid = false;
        }
        if (person[index].identyType != "") {
            if (person[index].identyType && person[index].identyType == "pan_card") {
                let panValidate = Utility.validate_pan_Number((person[index].identyNumber).trim());
                if (panValidate) {
                    errors[index].identyNumber = ""
                } else {
                    errors[index].identyNumber = "Please enter a valid pan number"
                    valid = false;
                }
            }
            if (person[index].identyType && person[index].identyType == "aadhar_card") {
                var filter = /^\d{12}$/;
                let aadhaarValidate = filter.test((person[index].identyNumber).trim());
                if (aadhaarValidate) {
                    errors[index].identyNumber = ""
                } else {
                    valid = false;
                    errors[index].identyNumber = "Please enter a valid aadhar number"
                }
            }
            if (person[index].identyType && person[index].identyType == "identity_card") {
                let identityCardValidate = Utility.validate_identity_card_number((person[index].identyNumber).trim());
                if (identityCardValidate) {
                    errors[index].identyNumber = ""
                } else {
                    valid = false;
                    errors[index].identyNumber = "Please enter a valid identy number"
                }
            }
            if (person[index].identyType && person[index].identyType == "driving_licence") {
                let regex = /^[a-zA-Z0-9\-]+$/;
                let drivingLicenseValidate = regex.test((person[index].identyNumber).trim());
                if (drivingLicenseValidate) {
                    errors[index].identyNumber = ""
                } else {
                    valid = false;
                    errors[index].identyNumber = "Please enter a valid licence number"
                }
            }
            if (person[index].identyType && person[index].identyType == "passport") {
                let regex = /^(?!^0+$)[a-zA-Z0-9]{3,20}$/;
                let passportValidate = regex.test((person[index].identyNumber).trim());
                if (passportValidate) {
                    errors[index].identyNumber = ""
                } else {
                    valid = false;
                    errors[index].identyNumber = "Please enter a valid pasport number"
                }
            }



            if (valid) {
                if (encounteredIdentityNumbers[(person[index].identyNumber)]) {
                    valid = false;
                    errors[index].identyNumber = "ID already in use";
                } else {
                    encounteredIdentityNumbers[(person[index].identyNumber)] = true;
                }
            }
        }

        setaccordionDataError(errors);
        return valid;
    };

    const validationFromData = () => {
        let tepmaccordionData = [...accordionData];
        let tepmaccordionDataError = [...accordionDataError];

        let valid = true;
        const encounteredIdentityNumbers = {};
        const updatedPersonDataError = accordionData.map(person => {
            const errors = {};
            if (person.name == "") {
                errors.name = "Required Field";
                valid = false;
            }
            if (person.age == "") {
                errors.age = "Required Field";
                valid = false;
            }
            if (person.nationality == "") {
                errors.nationality = "Required Field";
                valid = false;
            }

            if (person.nationality != "") {

                //console.log("person.nationality111111111111", person.nationality)

                //console.log("person.nationality",person.nationality)

                let branchnationality = route?.params?.branchNationality ? route.params.branchNationality : "";


                let branchnationalityCode = getCountryByName(branchnationality)
                //console.log("person.nationality22222222222", branchnationalityCode.isoCode)

                if (person.nationality.toLowerCase() !== branchnationalityCode.isoCode.toLowerCase()) {
                    if (person.commingFrom == "") {
                        errors.commingFrom = "Required Field";
                        valid = false;
                    }
                    if (person.goingto == "") {
                        errors.goingto = "Required Field";
                        valid = false;
                    }
                }
            }

            // if (person.identity_image.length == 0) {
            //     errors.identity_image = "Required Field";
            //     valid = false;
            // }

            // if (Number(childCount) > 0) {
            //     if ((person.age).trim() != "" && person.type != "child" && Number(person.age) <= Number(childAgeLimit)) {
            //         errors.age = "Please Check Age";
            //         valid = false;
            //     }
            // } else {
            //     if ((person.age).trim() != "" && person.type != "child" && Number(person.age) <= 17) {
            //         errors.age = "Please Check Age";
            //         valid = false;
            //     }
            // }
            if (person.identyType == "" && !person.childAgeDisable) {
                errors.identyType = "Required Field";
                valid = false;
            }
            // console.log("1==============", person.identity_image.length)
            // console.log("2==============", person.childAgeDisable)
            if (person.identity_image.length == 0 && !person.childAgeDisable) {
                errors.identity_image = "Required Field";
                valid = false;
            }
            if (person.identyNumber == "" && !person.childAgeDisable) {
                errors.identyNumber = "Required Field";
                valid = false;
            }
            if (person.identyType != "") {
                if (person.identyType && person.identyType == "pan_card") {
                    let panValidate = Utility.validate_pan_Number((person.identyNumber).trim());
                    if (panValidate) {
                        errors.identyNumber = ""
                    } else {
                        errors.identyNumber = "Please enter a valid pan number"
                        valid = false;
                    }
                }
                if (person.identyType && person.identyType == "aadhar_card") {
                    var filter = /^\d{12}$/;
                    let aadhaarValidate = filter.test((person.identyNumber).trim());
                    if (aadhaarValidate) {
                        errors.identyNumber = ""
                    } else {
                        valid = false;
                        errors.identyNumber = "Please enter a valid aadhar number"
                    }
                }
                if (person.identyType && person.identyType == "identity_card") {
                    let identityCardValidate = Utility.validate_identity_card_number((person.identyNumber).trim());
                    if (identityCardValidate) {
                        errors.identyNumber = ""
                    } else {
                        valid = false;
                        errors.identyNumber = "Please enter a valid identy number"
                    }
                }
                if (person.identyType && person.identyType == "driving_licence") {
                    let regex = /^[a-zA-Z0-9\-]+$/;
                    let drivingLicenseValidate = regex.test((person.identyNumber).trim());
                    if (drivingLicenseValidate) {
                        errors.identyNumber = ""
                    } else {
                        valid = false;
                        errors.identyNumber = "Please enter a valid licence number"
                    }
                }
                if (person.identyType && person.identyType == "passport") {
                    let regex = /^(?!^0+$)[a-zA-Z0-9]{3,20}$/;
                    let passportValidate = regex.test((person.identyNumber).trim());
                    if (passportValidate) {
                        errors.identyNumber = ""
                    } else {
                        valid = false;
                        errors.identyNumber = "Please enter a valid pasport number"
                    }
                }



                if (valid) {
                    if (encounteredIdentityNumbers[(person.identyNumber).trim()]) {
                        valid = false;
                        errors.identyNumber = "ID already in use";
                    } else {
                        encounteredIdentityNumbers[(person.identyNumber).trim()] = true;
                    }
                }
            }

            return errors;
        });

        setaccordionDataError(updatedPersonDataError);
        return valid;
    };


    const getCountryByCode = (countryCode) => {
        const countryName = Country.getAllCountries().find((country) => country.isoCode === countryCode);
        //console.log(countryName);
        return countryName;
    };
    const getCountryByName = (cName) => {
        const countryName = Country.getAllCountries().find((country) => country.name.toLowerCase() === cName.toLowerCase());
        //console.log(countryName);
        return countryName;
    };

    const formatingDataset = () => {
        let updatedPersonData = [...accordionData];
        let dataset = [];
        let hash = {}

        updatedPersonData.map((person, index) => {
            // console.log("ggggggggggggggggggggggggg", getCountryByCode(person.nationality))
            // return false;
            hash = {}
            hash['booking_id'] = person.booking_id;
            hash['customer_name'] = person.name;
            hash['customer_age'] = Number(person.age);
            hash['identity_type'] = person.identyType;
            hash['identity_number'] = person.identyNumber;
            hash['index'] = index + 1;
            hash['customer_type'] = person.childAgeDisable == true ? "child" : "adult";
            hash['nationality'] = getCountryByCode(person.nationality).name.toLowerCase()

            hash['coming_from'] = person.commingFrom && person.commingFrom != "" ? getCountryByCode(person.commingFrom).name.toLowerCase() : ""
            hash['going_to'] = person.goingto && person.goingto != "" ? getCountryByCode(person.goingto).name.toLowerCase() : ""

            dataset.push(hash);
        })


        return dataset;
    }



    const imageUploadApiCallFn = async (customerDetailsId, index, is_last_doc = false) => {
        let saveImageData = [];
        let saveImageDataObj = {
            type: 'customer_identity',
            customer_details_id: customerDetailsId,
            image_details: [{ customer_details_id: customerDetailsId }]
        };

        saveImageData.push(saveImageDataObj);

        //console.log("saveImageData===", saveImageData)

        const formData = new FormData();
        formData.append('formData', JSON.stringify(saveImageData));

        accordionData[Number(index) - 1].identity_image.forEach((imgObj) => {
            //console.log("imgObj===", imgObj)
            if (imgObj.uri) {
                formData.append('file', {
                    uri: imgObj.uri,
                    type: imgObj.type,
                    name: imgObj.name
                });
            }
        });

        uploadCustomerIdentityProof(formData).then((response) => {

            if (response[0].success) {
                if (is_last_doc) {

                    //Toast.show("Person details updated successfully");
                    showMessage({
                        message: "Person details updated successfully",
                        type: "info",
                        style: { marginTop: StatusBar.currentHeight }
                    });
                    // EventEmitter.emit("broadcustMessage", {
                    //     "organizationSwitch": true
                    // })
                    //backToBookingList();
                    setaccordionDataError([]);
                    setaccordionData([]);
                    navigation.navigate("Home", { reander: true })

                }
            }
        })



    };

    const guestDataFunction = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const { adult = 0, child = 0, child_age = "[]", booking_id = "", branchNationality = "", type = false } = route.params || {};
        // console.log("entry===========1=====", type)
        if (type) {
            // console.log("entry===========2=====")
            await fetchGueastDetails(booking_id);
        } else {
            // console.log("entry===========3=====")


            if (Number(adult) > 0) {
                const newEntries = Array.from({ length: Number(adult) }, (_, index) => ({
                    name: "",
                    age: "",
                    nationality: "",
                    identyType: "",
                    identyNumber: "",
                    uploadIdentyProof: "",
                    commingFrom: "",
                    goingto: "",
                    id: "",
                    isIndian: true,
                    childAgeDisable: false,
                    identity_image: [],
                    booking_id: booking_id,
                    is_edit: false,
                    is_identity_image_Update: false,
                    deleted_index: [],
                    uniqueKey: `entry-${index}-${Date.now()}`
                }));

                setaccordionData(prevPersonDataac => [...prevPersonDataac, ...newEntries]);

                const newErrorEntries = Array.from({ length: Number(adult) }, (_, index) => ({
                    name: "",
                    age: "",
                    nationality: "",
                    identyType: "",
                    identyNumber: "",
                    uploadIdentyProof: "",
                    commingFrom: "",
                    goingto: "",
                    id: "",
                    isIndian: "",
                    childAgeDisable: "",
                    identity_image: "",
                    booking_id: "",
                    is_edit: false,
                    is_identity_image_Update: "",
                    deleted_index: [],
                    uniqueKey: `entry-${index}-${Date.now()}`
                }));

                setaccordionDataError(prevPersonDataError => [...prevPersonDataError, ...newErrorEntries]);
            }

            if (Number(child) > 0) {
                setaccordionData(prevPersonData => {
                    const parsedChildAge = JSON.parse(child_age);
                    const newEntries = Array.from({ length: Number(child) }, (_, index) => ({
                        'name': "",
                        "age": parsedChildAge[index] != undefined && parsedChildAge[index].age != undefined ? (parsedChildAge[index].age).toString() : "",
                        nationality: "",
                        identyType: "",
                        identyNumber: "",
                        uploadIdentyProof: "",
                        commingFrom: "",
                        goingto: "",
                        id: "",
                        isIndian: true,
                        childAgeDisable: true,
                        identity_image: [],
                        booking_id: booking_id,
                        is_edit: false,
                        is_identity_image_Update: false,
                        deleted_index: [],
                        uniqueKey: `entry-${index}-${Date.now()}`
                    }));
                    return [...prevPersonData, ...newEntries];
                });

                setaccordionDataError(prevPersonData => {

                    const newEntries = Array.from({ length: Number(child) }, (_, index) => ({
                        'name': "",
                        "age": "",
                        nationality: "",
                        identyType: "",
                        identyNumber: "",
                        uploadIdentyProof: "",
                        commingFrom: "",
                        goingto: "",
                        id: "",
                        isIndian: true,
                        childAgeDisable: "",
                        identity_image: "",
                        booking_id: "",
                        is_edit: false,
                        is_identity_image_Update: "",
                        deleted_index: [],
                        uniqueKey: `entry-${index}-${Date.now()}`
                    }));
                    return [...prevPersonData, ...newEntries];
                });
            }

            setLoading(false);
        }
    };

    const fetchGueastDetails = async (id) => {
        let tepmaccordionData = [...accordionData];
        let tepmaccordionDataError = [...accordionDataError];
        setLoading(true);

        getGuestDetails(id).then(async (response) => {
            //console.log("Guest responce=========", response.data)
            let guestArry = [];
            let guestArryError = [];
            if (response.success) {
                if (response.data.length > 0) {
                    response.data.map((value, idx) => {
                        let nationality = getCountryByName(value.nationality)
                        let commingFrom = "";
                        let goingTo = "";
                        //console.log("nationality=====", nationality)
                        if (value.coming_from && value.coming_from != "") {
                            let commingFromData = getCountryByName(value.coming_from)
                            commingFrom = commingFromData.isoCode
                        }

                        //console.log("nationality=====2", nationality)

                        if (value.going_to && value.going_to != "") {
                            let goingtomData = getCountryByName(value.going_to)
                            goingTo = goingtomData.isoCode
                        }

                        //console.log("nationality=====3", nationality)

                        let hash = {}
                        hash['name'] = value.customer_name
                        hash['age'] = value.customer_age
                        hash['nationality'] = nationality.isoCode;
                        hash['identyType'] = value.identity_type
                        hash['identyNumber'] = value.identity_number
                        hash['uploadIdentyProof'] = ""
                        hash['commingFrom'] = commingFrom
                        hash['goingto'] = goingTo
                        hash['childAgeDisable'] = value.customer_type == "adult" ? false : true
                        let images = value.customer_document && value.customer_document != "" ? JSON.parse(value.customer_document) : []
                        // console.log("hash images========", images)
                        if (images && images.length > 0) {
                            images.forEach((image, index) => {
                                image['uri'] = image.img_url;
                                image['type'] = image.img_url.split('.').pop();;
                                image['name'] = image.file_name;
                                //image['is_image_Change'] = false;
                            });
                        }
                        hash['identity_image'] = images
                        hash['id'] = value.id
                        hash['booking_id'] = value.booking_master_id
                        let errorhash = {}
                        errorhash['name'] = ""
                        errorhash['age'] = ""
                        errorhash['nationality'] = "";
                        errorhash['identyType'] = ""
                        errorhash['identyNumber'] = ""
                        errorhash['uploadIdentyProof'] = ""
                        errorhash['commingFrom'] = ""
                        errorhash['goingto'] = ""
                        errorhash['childAgeDisable'] = ""
                        errorhash['identity_image'] = ""
                        errorhash['id'] = ""
                        errorhash['booking_id'] = ""

                        guestArry.push(hash)
                        guestArryError.push(errorhash)

                    })
                }
            }

            // console.log("guestArry=====", guestArry)

            setaccordionData(guestArry);
            setaccordionDataError(guestArryError);

            setLoading(false);
        }).catch((error) => {
            setLoading(false);
        });

    }


    const getCountryOption = () => {
        if (countryList.length == 0) {
            setCountryList([]);
            Country.getAllCountries().map((countryObj) => {
                setCountryList(prevArray => [...prevArray, { label: countryObj.name, value: countryObj.isoCode }]);
            })
        }
    }

    useEffect(() => {
        getCountryOption();
    }, [])





    //console.log("loading==", loading)
    const onchangeData = (value, idx, type) => {
        // console.log("value==", value)
        // console.log("idx==", idx)
        let tepmaccordionData = [...accordionData];
        let tepmaccordionDataError = [...accordionDataError];

        if (type == "name") {
            tepmaccordionData[idx].name = value;
            tepmaccordionDataError[idx].name = "";
        }
        if (type == "age") {
            tepmaccordionData[idx].age = value;
            tepmaccordionDataError[idx].age = "";
        }
        if (type == "identyNumber") {
            tepmaccordionData[idx].identyNumber = value;
            tepmaccordionDataError[idx].identyNumber = "";
        }


        setaccordionData(tepmaccordionData);
        setaccordionDataError(tepmaccordionDataError);


    }

    const guestDetailsOnchange = (value, idx, type) => {


        let tepmaccordionData = [...accordionData];
        let tepmaccordionDataError = [...accordionDataError];

        if (type == "nationality") {
            tepmaccordionData[idx].nationality = value;
            tepmaccordionDataError[idx].nationality = "";
        }
        if (type == "identity_type") {
            tepmaccordionData[idx].identyType = value;
            tepmaccordionDataError[idx].identyType = "";
        }
        if (type == "coming_from") {
            tepmaccordionData[idx].commingFrom = value;
            tepmaccordionDataError[idx].commingFrom = "";
        }
        if (type == "going_to") {
            tepmaccordionData[idx].goingto = value;
            tepmaccordionDataError[idx].goingto = "";
        }

        setaccordionData(tepmaccordionData);
        setaccordionDataError(tepmaccordionDataError);
    }
    const removeStatus = (idx, type) => {


        let tepmaccordionData = [...accordionData];
        let tepmaccordionDataError = [...accordionDataError];

        if (type == "nationality") {
            tepmaccordionData[idx].nationality = "";
            tepmaccordionDataError[idx].nationality = "";
        }
        if (type == "identity_type") {
            tepmaccordionData[idx].identyType = "";
            tepmaccordionDataError[idx].identyType = "";
        }
        if (type == "coming_from") {
            tepmaccordionData[idx].commingFrom = "";
            tepmaccordionDataError[idx].commingFrom = "";
        }
        if (type == "going_to") {
            tepmaccordionData[idx].goingto = "";
            tepmaccordionDataError[idx].goingto = "";
        }

        setaccordionData(tepmaccordionData);
        setaccordionDataError(tepmaccordionDataError);
    }

    handleChooseFile = async (uploadType, idx) => {

        // if (Platform.OS === 'android') {
        //     const permissionGranted = await requestCameraPermission();
        //     console.log("permissionGranted", permissionGranted)

        //     if (!permissionGranted) return;
        // }

        let tepmaccordionData = [...accordionData];
        let tepmaccordionDataError = [...accordionDataError];

        const options = {
            //includeBase64: true,
            mediaType: 'mixed',
            maxWidth: 300,
            maxHeight: 300,
            selectionLimit: 5

        }
        if (uploadType === 'camera') {
            hideUploadPopup();
            ImagePicker.launchCamera(options, res => {
                // console.log("res============", res)
                if (res.hasOwnProperty('didCancel')) {

                } else {
                    let imageCount = [...tepmaccordionData[idx].identity_image, ...res.assets];
                    // console.log("imageCount======", imageCount.length)

                    if (imageCount.length <= 5) {
                        if (res.assets && res.assets.length > 0) {
                            let response = res.assets[0];

                            //console.log("response===", response);
                            let fileInfo = {
                                uri: response.uri,
                                type: response.type, // mime type
                                name: response.fileName || `photo_${Date.now()}.jpg`,
                                is_edit: true
                            }
                            setaccordionData(prevAccordionData => {
                                const updatedAccordionData = [...prevAccordionData];
                                updatedAccordionData[idx] = {
                                    ...updatedAccordionData[idx],
                                    identity_image: [
                                        ...(updatedAccordionData[idx].identity_image || []),  // Keep the previous identity_image array or initialize if not defined
                                        fileInfo  // Add the new fileInfo to the array
                                    ]
                                };
                                return updatedAccordionData;
                            });

                            setaccordionDataError(prevAccordionDataError => {
                                // Create a new array with updated error item
                                const updatedAccordionDataError = [...prevAccordionDataError];
                                updatedAccordionDataError[idx] = {
                                    ...updatedAccordionDataError[idx],
                                    identity_image: ""
                                };

                                return updatedAccordionDataError;
                            });


                        }
                    } else {
                        //Toast.show("Limit exceeded")
                        showMessage({
                            message: "Limit exceeded",
                            type: "warning",
                            style: { marginTop: StatusBar.currentHeight }
                        });
                    }
                }
            });

        }

        /**/
        if (uploadType == 'storage') {
            hideUploadPopup();
            //let eventFormData = this.state.eventFormData

            const pickerResult = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                copyTo: 'cachesDirectory',
                allowMultiSelection: true,
                type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
            })


            //console.log("pickerResult===1", pickerResult.length)

            let imageCount = [...tepmaccordionData[idx].identity_image, ...pickerResult]
            //console.log("pickerResult===2", imageCount.length)

            if (imageCount.length <= 5) {
                let imageArry = [];
                pickerResult.forEach(pickerResult => {
                    pickerResult["is_edit"] = true
                    imageArry.push(pickerResult)
                });

                setaccordionData(prevAccordionData => {
                    const updatedAccordionData = [...prevAccordionData];
                    imageArry = [...updatedAccordionData[idx].identity_image, ...imageArry]
                    updatedAccordionData[idx] = {
                        ...updatedAccordionData[idx],
                        identity_image: imageArry
                    };
                    return updatedAccordionData;
                });

                setaccordionDataError(prevAccordionDataError => {
                    const updatedAccordionDataError = [...prevAccordionDataError];
                    updatedAccordionDataError[idx] = {
                        ...updatedAccordionDataError[idx],
                        identity_image: ""
                    };
                    return updatedAccordionDataError;
                });
            } else {
                //Toast.show("Limit exceeded")
                showMessage({
                    message: "Limit exceeded",
                    type: "warning",
                    style: { marginTop: StatusBar.currentHeight }
                });
            }


        }
    }

    const renderHeader = (item, index, isExpanded) => {
        //console.log("item===renderHeader", item)
        return (
            <TouchableOpacity key={index} style={[theme.collapsibleHeader, activeIndex === index ? theme.removeRadius : ""]}
                onPress={() => setActiveIndex(isExpanded ? null : index)}
            >
                <Text style={theme.collapsibleTitle}>Guest {index + 1}</Text>
                <AntDesign name={isExpanded ? 'up' : 'down'} size={20} color={Colors.secondary} />
            </TouchableOpacity>
        );
    };



    const renderBody = (item, index) => {
        //console.log("item.identyType==", item.identyType)
        return (
            <View key={index} style={[theme.collapsibleBodyContainer, activeIndex === index ? theme.removeBodyRadius : ""]}>
                <View style={theme.inputGroupBox}>
                    <Text style={theme.groupInputLabel}> Name <Text style={theme.inputRequire}>*</Text>
                    </Text>
                    <View style={theme.collapsibleRow}>
                        <TextInput
                            style={[theme.collapsibleInput]}
                            placeholder="Please enter name"
                            placeholderTextColor={Colors.gray99}
                            //secureTextEntry={!isPasswordVisible}
                            value={item.name}
                            onChangeText={(text) => { onchangeData(text, index, "name") }}
                            returnKeyLabel='Done'
                            returnKeyType='done'
                        //onSubmitEditing={() => { loginSubmit() }}
                        />
                    </View>
                    {accordionDataError[index]?.name &&
                        <Text style={theme.errorMsgBox}>{accordionDataError[index].name}</Text>}
                </View>
                <View style={theme.inputGroupBox}>
                    <Text style={theme.groupInputLabel}> Age <Text style={theme.inputRequire}>*</Text>
                    </Text>
                    <View style={[theme.collapsibleRow, item.childAgeDisable ? theme.disabledInput : ""]}>
                        <TextInput
                            style={[theme.collapsibleInput]}
                            placeholder="Please enter age"
                            placeholderTextColor={Colors.gray99}
                            //secureTextEntry={!isPasswordVisible}
                            value={item.age}
                            onChangeText={(text) => { onchangeData(text, index, "age") }}
                            returnKeyLabel='Done'
                            returnKeyType='done'
                            //onSubmitEditing={() => { loginSubmit() }}
                            keyboardType="numeric"
                            editable={item.childAgeDisable ? false : true}
                        />
                    </View>
                    {accordionDataError[index]?.age &&
                        <Text style={theme.errorMsgBox}>{accordionDataError[index].age}</Text>}
                </View>
                <View style={theme.inputGroupBox}>
                    <View style={theme.guestDropDownContainer}>
                        <Text style={[theme.groupInputLabel, { paddingLeft: 6 }]}> Nationality <Text style={theme.inputRequire}>*</Text>
                        </Text>
                        <RNPickerSelect
                            onValueChange={(value) => guestDetailsOnchange(value, index, "nationality")}
                            items={countryList}
                            placeholder={{
                                label: "Choose nationality",
                                value: null,
                                color: Colors.gray99,
                            }}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    display: 'none'
                                },
                            }}
                            value={item.nationality}
                        />
                        {item.nationality && item.nationality != "" &&
                            <TouchableOpacity style={theme.natClearValue}
                                onPress={() => removeStatus(index, "nationality")}
                            >
                                <AntDesign name="close" size={18} color={Colors.primary} />
                            </TouchableOpacity>}
                    </View>
                    {accordionDataError[index]?.nationality &&
                        <Text style={theme.errorMsgBox}>{accordionDataError[index].nationality}</Text>}
                </View>
                <View style={theme.inputGroupBox}>
                    <View style={theme.guestDropDownContainer}>
                        <Text style={[theme.groupInputLabel, { paddingLeft: 6 }]}> Identity Type {!item.childAgeDisable ? <Text style={theme.inputRequire}>*</Text> : null}
                        </Text>
                        <RNPickerSelect
                            onValueChange={(value) => guestDetailsOnchange(value, index, "identity_type")}
                            // items={identityTypeItem}

                            items={item.nationality && item.nationality != "" && item.nationality != 'IN' ? [{ label: "Passport", value: "passport" }] : identityTypeItem}
                            placeholder={{
                                label: "Choose identity type",
                                value: null,
                                color: Colors.gray99,
                            }}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    display: 'none'
                                },
                            }}
                            value={item.identyType}
                        />
                        {item.identyType && item.identyType != "" &&
                            <TouchableOpacity style={theme.natClearValue}
                                onPress={() => removeStatus(index, "identity_type")}
                            >
                                <AntDesign name="close" size={18} color={Colors.primary} />
                            </TouchableOpacity>}
                    </View>
                    {accordionDataError[index]?.identyType &&
                        <Text style={theme.errorMsgBox}>{accordionDataError[index].identyType}</Text>}
                </View>
                <View style={theme.inputGroupBox}>
                    <Text style={theme.groupInputLabel}> Identity Number {!item.childAgeDisable ? <Text style={theme.inputRequire}>*</Text> : null}
                    </Text>
                    <View style={[theme.collapsibleRow, item.identyType == "" ? theme.disabledInput : ""]}>
                        <TextInput
                            style={[theme.collapsibleInput]}
                            placeholder="Enter identity number"
                            placeholderTextColor={Colors.gray99}
                            //secureTextEntry={!isPasswordVisible}
                            value={item.identyNumber}
                            onChangeText={(text) => { onchangeData(text, index, "identyNumber") }}
                            returnKeyLabel='Done'
                            returnKeyType='done'
                            editable={item.identyType == null || item.identyType == "" ? false : true}
                        //onSubmitEditing={() => { loginSubmit() }}
                        />
                    </View>
                    {accordionDataError[index]?.identyNumber &&
                        <Text style={theme.errorMsgBox}>{accordionDataError[index].identyNumber}</Text>}
                </View>
                <View style={theme.inputGroupBox}>
                    <View>
                        <TouchableHighlight onPress={() => { openUploadPopup() }}>
                            <View style={theme.uploadBtnContainer}>
                                <Feather name="upload" size={20} color={Colors.secondary} />
                                <Text style={theme.uploadBtnText}>Upload Identity</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <Text style={[theme.errorMsgBox, theme.uploadMsg]}></Text>
                </View>
                <GlobalModalBottomSheet
                    visible={uploadPopupFlag}
                    onRequestClose={() => {
                        setUploadPopupFlag(!uploadPopupFlag);
                    }}
                    headerTitle="Choose an action"
                    modalHeight={200}
                    contentBody={
                        <View style={theme.chooseFileContainer}>
                            <View>
                                <TouchableHighlight onPress={() => { handleChooseFile("storage", index) }}>
                                    <View style={theme.chooseFileBtn}>
                                        <Ionicons name="image-outline" size={30} color={Colors.white} />
                                        <Text style={theme.chooseFileText}>Gallery</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={{ marginLeft: 30 }}>
                                <TouchableHighlight onPress={() => { handleChooseFile("camera", index) }}>
                                    <View style={theme.chooseFileBtn}>
                                        <Entypo name="camera" size={30} color={Colors.white} />
                                        <Text style={theme.chooseFileText}>Camera</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    }
                />

                <View style={theme.uploadImagesContainer}>
                    {item.identity_image && item.identity_image.length > 0 && item.identity_image.map((image, image_idx) => (
                        <View style={theme.uploadImageBox} key={image_idx}>
                            <TouchableHighlight onPress={() => openImageModal(image.uri)}>
                                <Image source={{ uri: image.uri }} resizeMode="cover" style={theme.uploadImages} />
                            </TouchableHighlight>
                            <TouchableHighlight style={theme.removeUploadImage} onPress={() => removeUplodedImage(index, image_idx)}>
                                <AntDesign name="closecircle" size={20} color={Colors.red} />
                            </TouchableHighlight>
                        </View>
                    ))}
                    {accordionDataError[index]?.identity_image &&
                        <Text style={theme.errorMsgBox}>{accordionDataError[index].identity_image}</Text>}

                </View>
                <View style={theme.inputGroupBox}>
                    <Text style={[theme.groupInputLabel, { paddingLeft: 6 }]}>Coming From</Text>
                    <RNPickerSelect
                        onValueChange={(value) => guestDetailsOnchange(value, index, "coming_from")}
                        items={countryList}
                        placeholder={{
                            label: "Choose coming from",
                            value: null,
                            color: Colors.gray99,
                        }}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                display: 'none'
                            },
                            inputAndroid: {
                                backgroundColor: item.nationality == "" || item.nationality == null || item.nationality == 'IN' ? Colors.gray : Colors.white,
                                color: Colors.secondary
                            }
                        }}
                        value={item.commingFrom}
                        disabled={item.nationality == "" || item.nationality == null || item.nationality == 'IN' ? true : false}
                    />
                    {item.commingFrom && item.commingFrom != "" &&
                        <TouchableOpacity style={[theme.natClearValue, theme.diffClearValue]}
                            onPress={() => removeStatus(index, "coming_from")}
                        >
                            <AntDesign name="close" size={18} color={Colors.primary} />
                        </TouchableOpacity>}

                    {accordionDataError[index]?.commingFrom &&
                        <Text style={theme.errorMsgBox}>{accordionDataError[index].commingFrom}</Text>}
                </View>
                <View style={theme.inputGroupBox}>
                    <Text style={[theme.groupInputLabel, { paddingLeft: 6 }]}>Going To</Text>
                    <RNPickerSelect
                        onValueChange={(value) => guestDetailsOnchange(value, index, "going_to")}
                        items={countryList}
                        placeholder={{
                            label: "Choose going to",
                            value: null,
                            color: Colors.gray99,
                        }}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                display: 'none'
                            },
                            inputAndroid: {
                                backgroundColor: item.nationality == "" || item.nationality == null || item.nationality == 'IN' ? Colors.gray : Colors.white,
                                color: Colors.secondary
                            }
                        }}
                        value={item.goingto}
                        disabled={item.nationality == "" || item.nationality == null || item.nationality == 'IN' ? true : false}
                    />
                    {item.goingto && item.goingto != "" &&
                        <TouchableOpacity style={[theme.natClearValue, theme.diffClearValue]}
                            onPress={() => removeStatus(index, "going_to")}
                        >
                            <AntDesign name="close" size={18} color={Colors.primary} />
                        </TouchableOpacity>}

                    {accordionDataError[index]?.goingto &&
                        <Text style={theme.errorMsgBox}>{accordionDataError[index].goingto}</Text>}
                </View>
                {route?.params?.type && route.params.type &&
                    <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                        <TouchableOpacity onPress={() => updateGuestDetails(item.id, index)} style={theme.uploadSubmitBtn}>
                            <Text style={theme.uploadSubmitText}>Update</Text>
                        </TouchableOpacity>
                    </View>}

            </View>
        );
    };

    const isExpanded = (index) => activeIndex === index;

    const openUploadPopup = () => {
        setUploadPopupFlag(true)
    }
    const hideUploadPopup = () => {
        setUploadPopupFlag(false)
    }

    const openImageModal = (image) => {
        //console.log("image=========", image)
        setSelectedImage(image);
        setModalVisible(true);
    };

    const closeImageModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    return (
        <SafeAreaView style={theme.mainContainer}>
            <Loader loading={loading} />
            <View style={theme.listBoxContainer}>
                <TouchableOpacity onPress={() => backToBookingList()}>
                    <Ionicons name="arrow-back" size={25} color={Colors.primary} />
                </TouchableOpacity>
                <View style={{ marginTop: 6 }}>
                    <View style={{ height: screenHeight - 235, paddingBottom: 10 }}>
                        <Suspense fallback={<Text>Loading...</Text>}>
                            <View style={theme.collapsibleContainer}>
                                <AccordionList
                                    list={accordionData}
                                    header={(item, index) => renderHeader(item, index, isExpanded(index))}
                                    body={(item, index) => renderBody(item, index)}
                                    keyExtractor={(item, index) => `accordion-${index}`}

                                    // keyExtractor={(item, index) => {
                                    //     // Generate a unique key from id or fallback to index if id is unavailable
                                    //     return item?.uniqueKey ? `accordion-${item.uniqueKey}` : `accordion-${index}`;
                                    // }}

                                    expandedIndex={activeIndex}
                                />
                            </View>
                        </Suspense>


                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={closeImageModal}
                        >
                            <View style={theme.imageModalOverlay}>
                                <View style={theme.imageModalBody}>
                                    <View style={theme.imageModalCloseBtnContainer}>
                                        <TouchableOpacity onPress={closeImageModal} style={theme.imageModalCloseBtn}>
                                            <AntDesign name="close" size={20} color={Colors.white} />
                                        </TouchableOpacity>
                                    </View>
                                    <Image source={{ uri: selectedImage }} resizeMode="cover" style={theme.imageModalImage} />
                                </View>
                            </View>
                        </Modal>


                    </View>

                    {route.params.type == false ?
                        <View style={theme.guestDetailsBtnContainer}>
                            <TouchableOpacity onPress={() => confirmPersonDetailsModalFn()} style={theme.uploadSubmitBtn}>
                                <Text style={theme.uploadSubmitText}>Submit</Text>
                            </TouchableOpacity>
                        </View> : null}

                </View>

            </View>
        </SafeAreaView>
    );
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 40,
        paddingVertical: 0,
        paddingHorizontal: 0,
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
        height: 40,
        paddingVertical: 0,
        paddingHorizontal: 0,
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

export default GuestDetailsScreen;
