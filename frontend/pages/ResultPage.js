import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import useResultStore from './store/resultStore';

export default function ResultPage({ navigation }) {
  const results = useResultStore((state) => state.results);

  const totalRisk = Object.values(results).reduce((acc, cur) => acc + cur.confidence, 0) / Object.keys(results).length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧠 검사 결과 요약</Text>

      <View style={styles.overallBox}>
        <Text style={styles.overallText}>총 평균 위험도: {Math.round(totalRisk * 100)}%</Text>
      </View>

      {Object.entries(results).map(([page, result]) => (
        <View key={page} style={styles.resultCard}>
          <Text style={styles.pageTitle}>{page}</Text>
          <Text style={styles.prediction}>예측: {result.prediction}</Text>
          <Text style={styles.confidence}>신뢰도: {Math.round(result.confidence * 100)}%</Text>
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
    backgroundColor: '#FAFAF0',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  overallBox: {
    backgroundColor: '#FFE8CC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  overallText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#cc6600',
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
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
