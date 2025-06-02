import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { RFPercentage } from 'react-native-responsive-fontsize';
import useRecordingsStore from '../store/recordingsStore';

export default function FluencyTemplatePage({ sentence, nextScreen, navigation }) {
  const recordingRef = useRef(null);
  const timerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const addRecording = useRecordingsStore((state) => state.addRecording);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("마이크 권한이 필요합니다");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();

      recordingRef.current = newRecording;
      setIsRecording(true);

      timerRef.current = setTimeout(() => {
        stopRecording();
        setTimeout(() => {
          Alert.alert("⏱️ 녹음 완료", "1분이 지나 자동으로 녹음이 종료되었습니다.");
        }, 100);
      }, 60000);
    } catch (err) {
      console.error("녹음 시작 오류:", err);
      Alert.alert("녹음 시작 오류");
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      addRecording("Fluency", uri);
      setRecorded(true);
      setIsRecording(false);
      recordingRef.current = null;
    } catch (err) {
      console.error("녹음 중지 오류:", err);
      Alert.alert("녹음 중지 오류");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5FAFF' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.inner}>
            <Text style={styles.title}>🗣️ 언어 유창성 테스트</Text>
            <View style={styles.inner2}>
              <View style={styles.taskContainer}>
              <Text style={styles.instruction}>🎧 녹음 버튼을 누른 후 아래 문장을 말해보세요</Text>
              <View style={styles.hr} />
              <Text style={styles.taskText}>{sentence}</Text>

              <TouchableOpacity
                style={styles.recordButton}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <Text style={styles.buttonText}>
                  {isRecording ? "⏹️ 중지" : "🎙️ 녹음"}
                </Text>
              </TouchableOpacity>

              {recorded && (
                <Text style={styles.uriText}>녹음 완료 ✔️</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                if (!recorded) {
                  Alert.alert("녹음 후 진행 가능합니다");
                  return;
                }
                navigation.navigate(nextScreen);
              }}
            >
              <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>
            
            </View>
            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#F5FAFF',
  },
  inner: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
  inner2: {
    marginTop: 130,
  },
  title: {
    fontSize: RFPercentage(3.2),
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0D47A1',
  },
  taskContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  instruction: {
    fontSize: 16,
    color: '#5C6BC0',
    marginBottom: 10,
    textAlign: 'center',
  },
  hr: {
    height: 1,
    backgroundColor: '#BBDEFB',
    marginVertical: 12,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 1,
  },
  taskText: {
    fontSize: RFPercentage(3),
    marginBottom: 30,
    color: '#0D47A1',
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: '#BAA5FF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#90CAF9',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  uriText: {
    fontSize: RFPercentage(2),
    marginTop: 10,
    color: '#0D47A1',
    textAlign: 'center',
  },
});
