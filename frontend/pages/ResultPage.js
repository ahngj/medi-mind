import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import useResultStore from './store/resultStore';

export default function ResultPage({ navigation }) {
  const results = useResultStore((state) => state.results);

  const validConfidences = Object.values(results)
    .map((cur) => (typeof cur.confidence === 'number' ? cur.confidence : 0));
  const totalRisk = validConfidences.reduce((acc, cur) => acc + cur, 0) / validConfidences.length;

  const pageNameMap = {
  Repeat: '문장 말하기 과제',
  Image: '그림 판단 과제',
  Fluency: '언어 유창성 과제',
  Cal: '계산 과제',
  Story: '이야기 과제',
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧠 검사 결과 요약</Text>

      <View style={styles.overallBox}>
        <Text style={styles.overallText}>총 평균 위험도: {(totalRisk * 100).toFixed(1)}%</Text>
      </View>

      {Object.entries(results).map(([page, result]) => (
        <View key={page} style={styles.resultCard}>
          <Text style={styles.pageTitle}>{pageNameMap[page] || page}</Text>
          <Text style={styles.prediction}>예측: {result.prediction}</Text>
          <Text style={styles.confidence}>
            신뢰도: {typeof result.confidence === 'number' ? (result.confidence * 100).toFixed(1) : '0.0'}%
          </Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.buttonText}>처음으로 돌아가기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7',
    marginTop: 40,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111',
  },
  overallBox: {
    backgroundColor: '#FFE082',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  overallText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#B85C00',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  prediction: {
    fontSize: 16,
    color: '#333',
  },
  confidence: {
    fontSize: 14,
    color: '#888',
  },
  button: {
    backgroundColor: '#90CAF9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});
