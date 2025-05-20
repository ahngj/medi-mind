import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import useRecordingsStore from '../store/recordingsStore';

export default function CalculationPage({ navigation }) {
  const task = "100에서 3을 계속 빼서 말하세요 (100, 97, 94 ...)";
  const recordingRef = useRef(null);
  const timerRef = useRef(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [, forceRender] = useState(false); // ✅ UI 강제 리렌더용
  const addRecording = useRecordingsStore((state) => state.addRecording);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("권한 필요", "마이크 접근을 허용해주세요.");
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
      forceRender((prev) => !prev); // ✅ 녹음 시작 시 UI 갱신

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        Alert.alert(
          "⏱️ 녹음 완료",
          "1분이 지났습니다",
          [{ text: "확인", onPress: () => stopRecording() }]
        );
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
      setRecordingUri(uri);
      addRecording('Cal', uri);

      console.log('✅ cal 저장됨:', uri);

      recordingRef.current = null;
      forceRender((prev) => !prev); // ✅ 녹음 중지 후 UI 갱신
    } catch (err) {
      console.error('녹음 중지 오류:', err);
      Alert.alert("녹음 중지 오류");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧮 연산 테스트</Text>

      <View style={styles.taskContainer}>
        <Text style={styles.taskText}>• {task}</Text>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => {
            if (recordingRef.current) {
              stopRecording();
            } else {
              startRecording();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {recordingRef.current ? '⏹️ 중지' : '🎙️ 녹음'}
          </Text>
        </TouchableOpacity>

        {recordingUri && (
          <Text style={styles.uriText}>녹음 완료 ✔️</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: '#5DADE2' }]}
        onPress={() => navigation.navigate('Story')}
      >
        <Text style={styles.buttonText}>다음으로</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF0', padding: 24, marginTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#111' },
  taskContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 15, elevation: 2 },
  taskText: { fontSize: 18, marginBottom: 10, color: '#333' },
  recordButton: { backgroundColor: '#4A90E2', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  uriText: { fontSize: 14, color: 'green', marginTop: 8, textAlign: 'center' },
  nextButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 }
});
