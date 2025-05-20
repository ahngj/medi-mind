import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import useRecordingsStore from './store/recordingsStore';
import useUserStore from './store/userStore';
import useResultStore from './store/resultStore'; // ✅ 결과 저장소

export default function UploadPage({ navigation }) {
  const recordings = useRecordingsStore((state) => state.recordings);
  const user = useUserStore((state) => state.user);
  const setResults = useResultStore((state) => state.setResults);

  const prepareUploadData = async () => {
    const data = new FormData();

    data.append('user_name', user.name);
    data.append('user_age', String(user.age));
    data.append('user_gender', user.gender);

    for (const [pageName, uriList] of Object.entries(recordings)) {
      uriList.forEach((uri, idx) => {
        data.append('files', {
          uri,
          name: `${pageName}_${idx}.m4a`,
          type: 'audio/m4a',
        });
        data.append('meta', pageName);
      });
    }

    try {
      // const response = await fetch('http://<YOUR_BACKEND>/upload', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'multipart/form-data' },
      //   body: data,
      // });

      // const result = await response.json();
      // console.log('✅ 백엔드 결과:', result);

      // setResults(result); // Zustand에 결과 저장

      // 백엔드 없이 더미 결과 사용
      const mockResult = {
        Repeat: { prediction: '정상', confidence: 0.94 },
        Image: { prediction: '주의', confidence: 0.72 },
        Fluency: { prediction: '경계', confidence: 0.58 },
        Cal: { prediction: '정상', confidence: 0.89 },
        Story: { prediction: '주의', confidence: 0.63 },
      };

      setResults(mockResult);
      navigation.replace('Result');
    } catch (error) {
      console.error('❌ 결과 전송 실패:', error);
      Alert.alert('서버 오류', '결과를 받아오지 못했습니다.');
    }
  };

  useEffect(() => {
    prepareUploadData();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4A90E2" />
      <Text style={styles.text}>데이터를 정리하고 있습니다...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAF0',
    padding: 24,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
});
