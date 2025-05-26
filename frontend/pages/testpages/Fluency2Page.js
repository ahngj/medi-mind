import FluencyTemplatePage from './FluencyTemplatePage';
export default function Fluency2Page({ navigation }) {
  return (
    <FluencyTemplatePage
      sentence="생각나는 과일 이름을 최대한 말하세요"
      nextScreen="Cal"
      navigation={navigation}
    />
  );
}
