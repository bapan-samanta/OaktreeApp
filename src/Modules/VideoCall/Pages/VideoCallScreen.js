// screens/HomeScreen.js
import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet
} from 'react-native';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    webView: {
      flex: 1,
    },
  });

function VideoScreen({ navigation }) {
    const url = 'https://stag-patient.oaktreeconnect.co.uk/appointment/video-consultation';
    return (
        <SafeAreaView style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ uri: url }} // Load the URL here
                style={styles.webView}
            />
    </SafeAreaView>
    );
}

export default VideoScreen;
