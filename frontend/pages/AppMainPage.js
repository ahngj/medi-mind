import React from "react";
import { TouchableOpacity,StyleSheet ,Text,View,Switch,TextInput,Alert} from "react-native";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import{ useState } from "react";
import useUserStore from "./store/userStore";

export default function AppMainPage({navigation}) {

  const setUser = useUserStore((state) => state.setUser);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [errGender, setErrGender] = useState(false);
  const [errAge, setErrAge] = useState(false);
  const [errName, setErrName] = useState(false);


    const [DarkMode,setDarkMode]=useState(false);
    const handleSubmit = () => {
      let hasError=false;

      if(!name.trim()){
        setErrName(true);
        hasError = true;
        Alert.alert("이름을 입력해주세요.");
      }
      else{
        setErrName(false);
        
      }

      if(!age.trim()){
        setErrAge(true);
        hasError = true;
        Alert.alert("나이를 입력해주세요.");
      }
      else{
        setErrAge(false);
        
      }

      if(!gender.trim()){
        setErrGender(true);
        hasError = true;
        Alert.alert("성별을 입력해주세요.");
      }
      else{
        setErrGender(false);
        
      }

      if (!hasError) {
        setUser({
      name,
      age,
      gender,
    });

    navigation.navigate('Tutorial'); 
    }
    
};


    const backgroundColor = DarkMode ? "#222" : "#F5F5F0";
    const textColor = DarkMode ? "#FFFFFF" : "#111111";
    return(
        <KeyboardAvoidingView style={{flex:1}}>
            <ScrollView contentContainerStyle={[styles.container,{backgroundColor}]}>
                <View style={styles.darkmode}>
                <Switch
                    value={DarkMode}
                    onValueChange={(value) => setDarkMode(value)}
                    trackColor={{ false: '#ccc', true: '#4A90E2' }}
                    thumbColor={DarkMode ? "#fff" : "#f4f3f4"}
                />
                </View>
              <View style={styles.MainView}>
              <Text style={[styles.MainTitle, { color: textColor }]}>기억한 데이</Text>
              <View style={[styles.warningBox, { backgroundColor: DarkMode ? '#444' : '#FFF3CD' }]}>
                <Text style={[styles.warningText1, { color: textColor }]}>※ 검사 전 유의사항</Text>
                <Text style={[styles.warningText, { color: textColor }]}>- 조용한 곳에서 진행해주세요.</Text>
                <Text style={[styles.warningText, { color: textColor }]}>- 질문을 빠지지 마고 꼭 끝까지 들은 후 반응해주세요.</Text>
                <Text style={[styles.warningText, { color: textColor }]}>- 검사 중 스마트폰은 움직이지 않도록 해주세요.</Text>
              </View>

              <View>
      <Text style={styles.title}>사용자 정보 입력</Text>

      <TextInput

      style={[
    styles.input,
    { borderColor: errName ? '#FF0000' : '#ccc' }
  ]}
        placeholder="이름"
        value={name}
        onChangeText={(text) => {
    setName(text);
    if (text.trim()) setErrName(false);
  }}
      />

      <TextInput
      
        style={[
          styles.input,
          {borderColor:errAge? '#FF0000' : '#ccc'}]}
        placeholder="나이"
        keyboardType="numeric"
        value={age}
        onChangeText={(text) => {
    setAge(text);
    if (text.trim()) setErrAge(false);
  }}
      />

      <View style={styles.genderContainer}>
  <TouchableOpacity
    style={[
      styles.genderButton,
      gender === '남' && styles.genderSelected
    ]}
    onPress={() => setGender('남')}
  >
    <Text style={styles.genderText}>남자</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.genderButton,
      gender === '여' && styles.genderSelected
    ]}
    onPress={() => setGender('여')}
  >
    <Text style={styles.genderText}>여자</Text>
  </TouchableOpacity>
</View>

{errGender && (//true일 때만 출력.
  <View style={{ alignItems: 'center', marginTop: 5 }}>
    <Text style={{ color: '#FF0000', fontSize: 14 }}>
      성별을 선택해주세요.
    </Text>
  </View>
)}

    </View>
              <TouchableOpacity style={[styles.testButton, { backgroundColor: DarkMode ? "#5DADE2" : "#4A90E2" }]}
               onPress={function(){

              
              handleSubmit();
               }}>
                  <Text style={styles.testButtonText}>
                      검사하기
                  </Text>
              </TouchableOpacity>
              </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        paddingVertical: 40,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    MainView:{
        marginTop: 120,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    MainTitle:{
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    warningBox:{
        width: '100%',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        marginTop: 20,
    },
    warningText1:{
        fontSize: 20,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    warningText:{
        fontSize: 18,
        marginBottom: 6,
        lineHeight: 26,
    },
    testButton: {
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 12,
        marginVertical: 30,
        alignItems: 'center',
    },
    testButtonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    darkmode: {
        position: 'absolute',
        top: 70,
        right: 16,
    },
    title: { 
      fontSize: 24, 
      fontWeight: 'bold', 
      marginBottom: 30 
    },
  input: { 
    width: 250, 
    height: 40, borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    marginBottom: 15, 
    paddingHorizontal: 10 
  },
  genderContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginVertical: 15,
},
genderButton: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  paddingVertical: 10,
  paddingHorizontal: 20,
  marginHorizontal: 5,
  backgroundColor: '#fff',
},
genderSelected: {
  borderColor: '#4A90E2',
  backgroundColor: '#E6F0FA',
},
genderText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#111',
},
  
  
});
