import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import useRecordingsStore from '../store/recordingsStore';

export default function RepeatSentencePage({ navigation }) {
  const speechTasks = [
    "마당에 작은 꽃이 피었다",
    "어제는 비가 와서 집에 있었다",
    "낮말은 새가 듣고 밤말은 쥐가 듣는다"
  ];

  
  const [recordingIndex, setRecordingIndex] = useState(null);
  const [recordings, setRecordings] = useState(Array(speechTasks.length).fill(null));
  const addRecording = useRecordingsStore((state) => state.addRecording);

  const timerRef = useRef(null);
  const recordingRef = useRef(null);
  const startRecording = async (index) => {
    try {
      if (recordingRef.current) return;

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();

      recordingRef.current = newRecording;
      setRecordingIndex(index);

      if (timerRef.current) clearTimeout(timerRef.current);
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

      const newRecordings = [...recordings];
      newRecordings[recordingIndex] = uri;
      setRecordings(newRecordings);

      addRecording('Repeat', uri);
      recordingRef.current = null;
      setRecordingIndex(null);
       console.log('✅ repeat 저장됨:', uri);
    } catch (err) {
      console.error("녹음 중지 오류:", err);
      Alert.alert("녹음 중지 오류");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 문장 따라 읽기</Text>

      <FlatList
        data={speechTasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>• {item}</Text>
            <TouchableOpacity
              style={styles.recordButton}
              onPress={() => {
                if (recordingRef.current && recordingIndex === index) {
                  stopRecording();
                } else if (!recordingRef.current) {
                  startRecording(index);
                } else {
                  Alert.alert("다른 문제 녹음 중입니다.");
                }
              }}
            >
              <Text style={styles.buttonText}>
                {recordingRef.current && recordingIndex === index ? '⏹️ 중지' : '🎙️ 녹음'}
              </Text>
            </TouchableOpacity>

            {recordings[index] && (
              <Text style={styles.uriText}>녹음 완료 ✔️</Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: '#5DADE2' }]}
        onPress={() => navigation.navigate('Image')}
      >
        <Text style={styles.buttonText}>다음 페이지</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF0', padding: 24, marginTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#111' },
  taskContainer: { marginBottom: 30, backgroundColor: '#fff', borderRadius: 10, padding: 15, elevation: 2 },
  taskText: { fontSize: 18, marginBottom: 10, color: '#333' },
  recordButton: { backgroundColor: '#4A90E2', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  uriText: { fontSize: 14, color: 'green', marginTop: 8, textAlign: 'center' },
  nextButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 }
});
