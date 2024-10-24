import React from 'react';
import { View, Text } from 'react-native';
import LoginStyle from '../Public/css/LoginStyle';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Colors from '../../../Utility/Colors';

const PasswordHintsContent = ({ firstContent = true }) => (

  firstContent ? (
    <View style={LoginStyle.hintsContainer
    } >
      <Text style={LoginStyle.hintsHeaderText}>Password Hints:</Text>
      {
        [
          "Minimum length, which must be at least 8 characters but fewer than 99 characters",
          "Require numbers",
          "Require a special character from this set: = + - ^ $ * . [ ] { } ( ) ? ! @ # % & / , > < ' : ; | _ ~",
          "Require uppercase letters",
          "Require lowercase letters",
          "Do not allow users to reuse previous passwords",
          "This ensures that users change their passwords after a 90 days.",
        ].map((hint, index) => (
          <View key={index} style={LoginStyle.hintContainer}>
            <Text style={LoginStyle.bullet}>•</Text>
            <Text style={LoginStyle.hintText}>{hint}</Text>
          </View>
        ))
      }
    </View >
  )
    :
    (
      <View style={LoginStyle.forceModalOverlay}>
        <View style={LoginStyle.forceModalView}>
          <View style={LoginStyle.forceModalIcon}>
            <Fontisto
              name="minus-a"
              size={30}
              color={Colors.secondary}
            />
          </View>
          <Text style={LoginStyle.forceHintsHeaderText}>Password Hints:</Text>
          <View style={LoginStyle.forceHintContainer}>
            <Text style={LoginStyle.forceBullet}>•</Text>
            <Text style={LoginStyle.forceHintText}>
              Minimum length, which must be at least 8 characters but fewer than 99 characters
            </Text>
          </View>
          <View style={LoginStyle.forceHintContainer}>
            <Text style={LoginStyle.forceBullet}>•</Text>
            <Text style={LoginStyle.forceHintText}>
              Require numbers
            </Text>
          </View>
          <View style={LoginStyle.forceHintContainer}>
            <Text style={LoginStyle.forceBullet}>•</Text>
            <Text style={LoginStyle.forceHintText}>{`Require a special character from this set: = + - ^ $ * . [ ] { } ( ) ? ! @ # % & / , > < ' : ; | _ ~"`}
            </Text>
          </View>
          <View style={LoginStyle.forceHintContainer}>
            <Text style={LoginStyle.forceBullet}>•</Text>
            <Text style={LoginStyle.forceHintText}>Require uppercase letters</Text>
          </View>
          <View style={LoginStyle.forceHintContainer}>
            <Text style={LoginStyle.forceBullet}>•</Text>
            <Text style={LoginStyle.forceHintText}>Require lowercase letters</Text>
          </View>
          <View style={LoginStyle.forceHintContainer}>
            <Text style={LoginStyle.forceBullet}>•</Text>
            <Text style={LoginStyle.forceHintText}>Do not allow users to reuse previous passwords</Text>
          </View>
          <View style={LoginStyle.forceHintContainer}>
            <Text style={LoginStyle.forceBullet}>•</Text>
            <Text style={LoginStyle.forceHintText}>This ensures that users change their passwords after a 90 days.</Text>
          </View>
        </View>
      </View>
    )
);

export default PasswordHintsContent;
