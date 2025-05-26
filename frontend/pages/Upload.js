import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import useRecordingsStore from './store/recordingsStore';
import useUserStore from './store/userStore';
import useResultStore from './store/resultStore';

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
      // 실제 업로드 구현 시 주석 해제
      // const response = await fetch('<서버주소>', { method: 'POST', body: data });
      // const result = await response.json();
      // setResults(result);

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
    const timer = setTimeout(() => {
      prepareUploadData();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  

  return (
    <View style={styles.container}>
    
      <ActivityIndicator size="large" color="#FFD54F" />
      <Text style={styles.text}>🔄 데이터 정리 중입니다...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDE7',
    padding: 24,
  },
  text: {
    fontSize: 18,
    color: '#555',
    marginTop: 20,
    textAlign: 'center',
  },
});
