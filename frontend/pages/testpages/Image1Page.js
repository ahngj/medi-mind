import ImageTemplatePage from './ImageTemplatePage';
export default function Image1Page({ navigation }) {
  return (
    <ImageTemplatePage
      sentence="동물 이름 말하기 
      예) 호랑이, 강아지, 기린"
      imageSource={require('../assets/rhinoceros.png')}
      nextScreen="Image2"
      navigation={navigation}
    />
  );
}
