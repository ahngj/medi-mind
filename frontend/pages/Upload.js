import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import useRecordingsStore from './store/recordingsStore';
import useUserStore from './store/userStore';
import useResultStore from './store/resultStore';

export default function UploadPage({ navigation }) {
  const recordings = useRecordingsStore((state) => state.recordings);
  const user = useUserStore((state) => state.user);
  const setResults = useResultStore((state) => state.setResults);

  const SERVER_URL = 'http://192.168.0.2:8000/predict/'; // ← 네트워크 환경에 맞게 수정

  const uploadSingleRecording = async (uri, pageName, index) => {
    const fieldName = 'file';
    const filename = `${pageName}_${index}.3gp`;

    const options = {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: fieldName,
      mimeType: 'audio/3gpp',
      parameters: {
        user_name: user.name,
        user_age: String(user.age),
        user_gender: user.gender,
        meta: pageName,
      },
      headers: {
        accept: 'application/json',
      },
    };

    try {
      const result = await FileSystem.uploadAsync(SERVER_URL, uri, options);
      return JSON.parse(result.body); // 예측 결과 리턴
    } catch (error) {
      console.error(`❌ ${filename} 업로드 실패:`, error);
      throw error;
    }
  };

  const prepareUploadData = async () => {
    try {
      const allResults = {};
      const classMap = {};
      const confMap = {};

      for (const [pageName, uriList] of Object.entries(recordings)) {
        classMap[pageName] = [];
        confMap[pageName] = [];

        for (let i = 0; i < uriList.length; i++) {
          const uri = uriList[i];
          const predictionResult = await uploadSingleRecording(uri, pageName, i);
          console.log(`[✅] ${pageName}_${i} 업로드 및 예측 결과`, predictionResult);

          const raw = predictionResult.result;
          classMap[pageName].push(raw.class);
          confMap[pageName].push(raw.probabilities[1]); // class 1의 softmax 확률
        }
      }

      // 평균 계산 및 판단 결과 구성
      for (const page in classMap) {
        const classAvg = classMap[page].reduce((a, b) => a + b, 0) / classMap[page].length;
        const confAvg = confMap[page].reduce((a, b) => a + b, 0) / confMap[page].length;

        let prediction = '';
        if (classAvg < 0.3) prediction = '정상';
        else if (classAvg < 0.6) prediction = '주의';
        else prediction = '고위험';

        allResults[page] = {
          prediction,
          confidence: confAvg,
        };
      }

      setResults(allResults);
      navigation.replace('Result');
    } catch (error) {
      Alert.alert('업로드 오류', '서버와의 통신에 실패했습니다.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      prepareUploadData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFD54F" />
      <Text style={styles.text}>🔄 데이터 전송 중입니다...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FAFF',
    padding: 24,
  },
  text: {
    fontSize: 18,
    color: '#0D47A1',
    marginTop: 20,
    textAlign: 'center',
  },
});
