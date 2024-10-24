// Mutation.js
import { gql } from '@apollo/client';

export const USER_LOGIN_MUTATION = gql`
  mutation UserLogin($email: String!, $password: String!) {
    UserLogin(
      resource: {
        resourceType: User,
        email: $email,
        password: $password,
        loginType: "Patient"
      }
    ) {
      status
      message
      details
      code
      tokenresult
    }
  }
`;

export const POMS_PATIENT_ACTIVITY_CREATE = gql`
  mutation PomsPatientActivityCreate($patientId: String!) {
    PomsPatientActivityCreate(
      resource: {
        resourceType: PomsPatientActivity,
        managingPatient: $patientId
      }
    ) {
      id
    }
  }
`;

export const PATIENT_QUERY = gql`
  query PatientQuery($patientId: ID!) {
    Patient(_id: $patientId) {
      patientMisc {
        gilikCompleted
      }
    }
  }
`;

export const APPOINTMENT_LIST = gql`
    query getAppointmentList($id: token) {
  PomsAppointmentList(_id: $id, _tag: "2") {
    id
    practitionerName
    practitionerId
    practitionerSpeciality
    appointmentDate
    appointmentTime
    slotId
    appointmentCreatedOn
    appointmentFor
    appointmentNumber
    appointmentBookedBy
    appointmentBookedId
    appointmentBookedDOB
    appointmentType
    appointmentMode
    appointmentDuration
    appointmentBookedByTitle
    appointmentBookedByFirstName
    appointmentBookedBySurName
    appointmentBookedByGender
    appointmentBookedByEmail
    appointmentBookedByPhoneNumber
    appointmentBookedForTitle
    appointmentBookedForFirstName
    appointmentBookedForSurName
    appointmentBookedForGender
    appointmentBookedForEmail
    appointmentBookedForPhoneNumber
    appointmentBookedForRelationship
    appointmentNeedLanguageSupport
    appointmentSpecialNotes
    appointmentPrice
    appointmentPayType
    appointmentPMIName
    appointmentPMIResponsibleParty
    appointmentPMIFirstName
    appointmentPMISurName
    appointmentGroupId
    appointmentMemberPolicyNumber
    appointmentExpiresOn
    appointmentPMIAuthorisationCode
    appointmentPMIAuthorisationSession
    appointmentThirdPartyName
    appointmentThirdPartyId
    appointmentThirdPartyComments
    appointmentPatientTechAbility
    appointmentPatientMentalAbility
    appointmentPatientConsent
    appointmentStatus
    videoSessionId
    videoSessionToken
    videoAPIKey
    videoAPISecret
    videoStartTime
    videoEndTime
    currentVideoTime
    isStartVideoClicked
    selfPayPaymentType
    appointmentSingleMulitple
    installmentDate
    multipleAppointmentDetails {
      installmentDate
      installmentAmount
      installmentPaidStatus
    }
  }
}
`;

export const Questionnaire = gql`
  query getPatientQuestionnaire($id: String) {
    PatientQuestionnaireList(patientId: $id) {
      id
      resourceType
      patientId
      assignedId
      assignedName
      assignedType
      assignedSpeciality
      questitionerId
      status
      assignedOn
      questionnaire {
        id
        questionnaireName
        questionnaireDescription
        administeredType
        totalScore
        questions {
          question
          selectedOptionId
          selectedOptionText
          comments
          options {
            option
            optionId
            optionScore
          }
          optionType
          showCommentBox
          isCommentBoxRequired
        }
      }
    }
  }
`

export const PatientQuestionnaireUpdate = gql`
  mutation completeQuestionnaireBuilder($id: id, $questionnaire: QuestionnaireBuilder_Input, $status: String) {
  PatientQuestionnaireUpdate(
    resource: {resourceType: PatientQuestionnaire, id: $id, questionnaire: $questionnaire, status: $status}
  ) {
    id
  }
}`
