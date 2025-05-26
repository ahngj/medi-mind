import FluencyTemplatePage from './FluencyTemplatePage';
export default function Fluency1Page({ navigation }) {
  return (
    <FluencyTemplatePage
      sentence="니은으로 시작하는 단어를 최대한 많이 말하세요"
      nextScreen="Fluency2"
      navigation={navigation}
    />
  );
}
