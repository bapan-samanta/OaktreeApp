import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RadioButton } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import { SelectList } from 'react-native-dropdown-select-list';
import { Picker } from '@react-native-picker/picker';
import moment from "moment";
import Colors from '../../../Utility/Colors';
import { updatePatientQuestionnaireUpdate } from '../Controller/QuestionnaireController';
import Toast from 'react-native-simple-toast';

const PatientQuestionList = ({ questionObj, handleBackPress, reloadQuestionnaireList }) => {
    var [selectedDocadmintype, setSelectedDocadmintype] = useState(questionObj?.questionnaire?.administeredType)
    var [selectedDocStatus, setSelectedDocStatus] = useState(questionObj?.status);
    const [selectedValue, setSelectedValue] = useState(null);
    const [setCheckedvalue, setChecked] = useState(null);
    const [questionsData, setQuestionsData] = useState(questionObj?.questionnaire?.questions);
    const [sumofData, setSumofData] = useState(0);
    var [showErrorMessage, setErrorMessages] = React.useState(false);

    const [isSelected, setSelection] = useState(false);
    useEffect(()=>{
        // console.log("------------------------|||", questionObj);
        handleSelectedDocument(questionsData)
    },[questionsData])

    const handleSelectedoptionTextAreaChanges = (
        idx,
        qidx,
        text
      ) => {
  
        if (text.length <= 1000) {
            let duplicateQuestionData = questionsData.map((obj) => ({
                ...obj,
            }));
  
            let duplicateQuestion = duplicateQuestionData[qidx];
  
            // console.log("questiondata1 before", duplicateQuestion);
            duplicateQuestion["selectedOptionId"] = idx.toString();
            duplicateQuestion.selectedOptionText = text;
            setQuestionsData([...duplicateQuestionData]);
        }else{
            alert("Max limit 1000");
        }
    };

    const handleSelectedoptionChanges = (e, idx, qidx, optiontext) => {
        let duplicateQuestionData = questionsData.map((obj) => ({
          ...obj,
        }));

        // console.log("optiontext:::::", optiontext);
  
        let duplicateQuestion = duplicateQuestionData[qidx];
  
        // console.log("questiondata1 before", duplicateQuestion);
        duplicateQuestion["selectedOptionId"] = idx.toString();
        duplicateQuestion.selectedOptionText = optiontext;
        setQuestionsData([...duplicateQuestionData]);
    };

    const handleSelectedDropdownChanges = (itemValue, qidx, optionsList) => {
        var optionsList1 = optionsList.filter(e => e.optionId === itemValue);
  
        var dropdownSelectedValue = optionsList1[0]?.option;
        var selectedOptionId1 = optionsList1[0]?.optionId;
        let duplicateQuestionData = questionsData.map((obj) => ({
          ...obj,
        }));
  
        let duplicateQuestion = duplicateQuestionData[qidx];
        duplicateQuestion["selectedOptionId"] = selectedOptionId1;
        duplicateQuestion.selectedOptionText = dropdownSelectedValue;
  
        setQuestionsData([...duplicateQuestionData]);
    };


    const handleSelectedCommentChanges = (comment, qidx) => {
        let duplicateQuestionData = questionsData.map((obj) => ({
          ...obj,
        }));
        let duplicateQuestion = duplicateQuestionData[qidx];
        duplicateQuestion.comments = comment;
  
        setQuestionsData([...duplicateQuestionData]);
    };

    const handleSelectedDocument = (doc) => {
        if (doc) {
            let questionslistData = doc;
            let optionScoreListData = [];
            if (questionslistData) {
                questionslistData?.forEach(function (data1, index) {
                    let questionsData2 = data1?.["options"];
                    questionsData2?.forEach(function (data, index) {
                        if (data1?.selectedOptionText == data?.option) {
                            optionScoreListData.push(data?.optionScore);
                        }
                    });
                });
                // console.log("optionScoreListData", optionScoreListData);
            }
            if (optionScoreListData.length > 0) {
                let totalScore = optionScoreListData.reduce((acc, current) => acc + current, 0);
                setSumofData(totalScore);
            }
        }
    };

    const handleSubmitForm = async(action) => {
        let submitdataFlag = true;
        questionsData.forEach(function (comment) {
            if (
                comment?.showCommentBox == "1" && comment.isCommentBoxRequired == "1" && comment?.comments == "" ||
                comment?.showCommentBox == "1" && comment.isCommentBoxRequired == "1" && comment?.comments == null ||
                comment?.showCommentBox == "1" && comment.isCommentBoxRequired == "1" && comment?.comments == undefined) {
                submitdataFlag = false;
                setErrorMessages(true);
            }
        });

        let finalData = {
            resourceType: "QuestionnaireBuilder",
            id: questionObj["questionnaire"]["id"],
            questionnaireName: questionObj["questionnaire"]["questionnaireName"],
            questionnaireDescription: questionObj["questionnaire"]["questionnaireDescription"],
            administeredType: questionObj["questionnaire"]["administeredType"],
            questions: questionsData,
        };
        if(submitdataFlag){
            let data = await updatePatientQuestionnaireUpdate({
                variables: {
                id: questionObj?.id,
                questionnaire: finalData,
                status: action
                },
            });
            if (data) {
                console.log("---------------------", data);
                Toast.show("Save successfully");
                reloadQuestionnaireList();
            }
        }else{
            Toast.show("Please fill in the required fields");
        }
    }


    return (
        <SafeAreaView style={styles.questionList}>
            <ScrollView>
                <View style={styles.mainView}>
                    {/* <MaterialIcons name="info-outline" size={30} color="black" /> */}
                    <Text>Instructions: {questionObj?.questionnaire?.questionnaireDescription}</Text>
                    <Text>Date: {moment(questionObj?.assignedOn).format("DD-MM-YYYY")}</Text>
                    {
                        questionsData.map((obj, index) => {
                            return (
                                <View style={styles.container}>
                                    <Text>{index + 1}.{" "}{obj.question}</Text>
                                    {
                                    obj.optionType == "4" ? 
                                    <>
                                        <TextInput
                                            style={styles.textArea}
                                            placeholder=""
                                            multiline={true}
                                            numberOfLines={4}  // Adjust the number of lines as needed
                                            value={obj.selectedOptionText}
                                            onChangeText={(text) => handleSelectedoptionTextAreaChanges(4, index, text)}
                                            editable={!( selectedDocadmintype == "1" 
                                                ||
                                                selectedDocStatus === "Completed")}                                            
                                        />
                                    </>
                                    :""
                                    }

                                    {
                                        
                                    <>
                                        {obj?.options?.map((optionObj, optionIndex) => {

                                            // console.log(optionObj, obj?.selectedOptionId," === ",optionIndex)
                                            return (
                                            <View key={optionIndex} style={styles.radioButtonContainer}>
                                                {/* Radio Buttin */}
                                                {obj.optionType === "1" && (
                                                <>
                                                    <RadioButton
                                                        value={optionIndex} 
                                                        status={obj?.selectedOptionId === optionIndex.toString() ? 'checked' : 'unchecked'}
                                                        onPress={() => handleSelectedoptionChanges(1,
                                                            optionIndex,
                                                            index,
                                                            optionObj.option
                                                        )}
                                                        disabled={
                                                            selectedDocadmintype == "1" 
                                                            ||
                                                            selectedDocStatus === "Completed"
                                                        }
                                                    />
                                                    <Text style={styles.label}>{optionObj.option}</Text>
                                                </>
                                                )}

                                                {/** Checkbox */}
                                                {
                                                obj.optionType == "2" ? (
                                                    <View style={styles.checkboxContainer}>
                                                        <CheckBox
                                                            value={obj.selectedOptionId == optionIndex}
                                                            style={styles.checkbox}
                                                            onValueChange={() => handleSelectedoptionChanges(1,
                                                                optionIndex,
                                                                index,
                                                                optionObj.option
                                                            )}
                                                            disabled={
                                                                selectedDocadmintype == "1" 
                                                                ||
                                                                selectedDocStatus === "Completed"
                                                            }
                                                        />
                                                        <Text style={styles.label}>{optionObj.option}</Text>
                                                    </View>
                                                )
                                                :
                                                (<></>)
                                                }
                                                </View>
                                            );
                                        })}
                                                {/* Select option */}
                                                {
                                                obj.optionType == "3" ? 
                                                (
                                                    
                                                    <View style={styles.pickerContainer}>
                                                        <Picker
                                                            selectedValue={obj.selectedOptionId}  // Set the default value
                                                            style={styles.picker}
                                                            onValueChange={(itemValue) => handleSelectedDropdownChanges(
                                                                itemValue,
                                                                index,
                                                                obj?.options
                                                            )}  // Update state on change

                                                            enabled={!( selectedDocadmintype == "1" 
                                                                ||
                                                                selectedDocStatus === "Completed")} 
                                                        >
                                                            {
                                                                obj?.options.map((optionObj) => {
                                                                    return (
                                                                        <Picker.Item label={optionObj.option} value={optionObj.optionId.toString()} />
                                                                    )
                                                                })
                                                            }
                                                            
                                                        </Picker>
                                                    </View>
                                                )
                                                :
                                                ("")
                                                }

                                                {
                                                obj.showCommentBox == "1" ? 
                                                (
                                                    <>
                                                    <View style={styles.container}>
                                                        <Text>Additional Comments</Text>
                                                        <TextInput
                                                            style={styles.textAreaAdditionalComments}
                                                            placeholder=""
                                                            multiline={true}
                                                            numberOfLines={1}  // Adjust the number of lines as needed
                                                            value={obj.comments}
                                                            onChangeText={(text) => handleSelectedCommentChanges(text, index)}
                                                            editable={!( selectedDocadmintype == "1" 
                                                                ||
                                                                selectedDocStatus === "Completed")} 
                                                        />
                                                    </View>

                                                    {obj.isCommentBoxRequired == "1" && selectedDocadmintype == 2 ? (
                                                      <>
                                                        {showErrorMessage &&
                                                          (obj?.comments == "" ||
                                                            obj?.comments == null ||
                                                            obj?.comments == undefined) ? (
                                                          <View className="errorMsg">
                                                            <Text style={styles.errorMsg}>Please enter comments</Text>
                                                          </View>
                                                        ) : (
                                                          ""
                                                        )}
                                                      </>
                                                    ) : ""}
                                                    {selectedDocadmintype == 3 ? (
                                                      <>
                                                        {showErrorMessage &&
                                                          (obj?.comments == "" ||
                                                            obj?.comments == null ||
                                                            obj?.comments == undefined) ? (
                                                          <View>
                                                            <Text style={styles.errorMsg}>Please enter comments</Text>
                                                          </View>
                                                        ) : (
                                                          ""
                                                        )}
                                                      </>
                                                    ) : ""}
                                                    </>
                                                )
                                                :
                                                ("")
                                                }
                                        
                                    </>
                                            
                                    }

                                    
                                </View>    
                            )
                        })
                    }
                    <Text>Total Score: {sumofData}</Text>
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => handleBackPress()}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        {
                        (selectedDocadmintype == 2) && selectedDocStatus == "Incomplete" &&
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.SendButton]} 
                                onPress={() => handleSubmitForm('Completed')}
                            >
                                <Text style={styles.buttonText}>Send</Text>
                            </TouchableOpacity>
                        }

                        {
                        (selectedDocadmintype == 3) && selectedDocStatus == "Incomplete" &&
                            <>
                                <TouchableOpacity style={[styles.actionButton, styles.SendButton]} onPress={() => handleSubmitForm('Incomplete') }>
                                    <Text style={styles.buttonText}>Save & Continue</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionButton, styles.SendButton]} onPress={() => handleSubmitForm('Completed') }>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    questionList: {
        backgroundColor: Colors.white,
    },
    backButtonContainer: {
      flexDirection: 'row',     // Align items in a row
      alignItems: 'center',     // Align arrow and text vertically
    },
    backText: {
      fontSize: 18,             // Adjust text size
      marginLeft: 10,           // Add some space between the arrow and text
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5, // Space between radio buttons
    },
    label: {
        marginLeft: 8, // Space between radio button and label
        fontSize: 16,
    },
    container:{
        padding: 10,
        
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        alignSelf: 'center',
    },
    textArea: {
        height: 150,  // You can set the height for the text area
        justifyContent: "flex-start",
        textAlignVertical: 'top',  // Ensure text starts at the top
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    textAreaAdditionalComments: {
        height: 80,  // You can set the height for the text area
        justifyContent: "flex-start",
        textAlignVertical: 'top',  // Ensure text starts at the top
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    mainView: {
        marginBottom: 80,
        paddingLeft: 10,
        paddingRight: 10
    },
    pickerContainer: {
        // borderBottomColor: 'red',  // Set the border bottom color
        // borderBottomWidth: 1,       // Set the border bottom width
        marginBottom: 20,           // Optional: add margin for spacing
    },
    picker: {
        height: 50,                 // Set the height of the picker
        width: '100%',              // Set the width of the picker
    },
    actionRow: {
        flexDirection: 'row', // Align children in a row
        alignItems: 'center',  // Center items vertically
        justifyContent: 'space-between',
        marginTop: 10
    },
    cancelButton: {
        backgroundColor: Colors.gray99,   // Replace Colors.green01 with actual color
    },
    SendButton: {
        backgroundColor: Colors.green01,
    },
    actionButton: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,            // Add padding for better spacing
        borderRadius: 5,             // Optional: Rounded corners
        alignItems: 'center',        // Center the text
    },
    buttonText: {
        color: '#fff',               // Replace Colors.white with actual color
        fontSize: 16,
    },
    errorMsg: {
        color: Colors.red,
        paddingLeft: 16
    }
});

export default PatientQuestionList;
