import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function TutorialPage({navigation}) {
  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState(null);

  useEffect(() => {
    const getPermission = async () => {
      const response = await Audio.requestPermissionsAsync();
      if (!response.granted) {
        alert('마이크 접근 권한이 필요합니다!');
      }
    };
    getPermission();
  }, []);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (err) {
      console.error('녹음 시작 실패', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedURI(uri);
      setRecording(null);
      console.log('녹음된 파일:', uri);
    } catch (err) {
      console.error('녹음 중지 실패', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎤 예시 문장을 따라 말해보세요</Text>
      <Text style={styles.sample}>“오늘은 날씨가 맑습니다.”</Text>

      <TouchableOpacity
        style={styles.recordButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? '⏹️ 녹음 중지' : '🎙️ 녹음 시작'}
        </Text>
      </TouchableOpacity>

      {recordedURI && (
        <Text style={styles.result}>✅ 녹음 완료!</Text>
      )}

<TouchableOpacity style={styles.recordButton} 
onPress={function(){navigation.navigate('Repeat')}}>
      <Text style={styles.buttonText}>
        테스트 시작
      </Text>
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF0',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111',
    textAlign: 'center',
  },
  sample: {
    fontSize: 20,
    marginBottom: 40,
    color: '#333',
  },
  recordButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  result: {
    fontSize: 14,
    marginTop: 10,
    color: '#444',
  },
});
