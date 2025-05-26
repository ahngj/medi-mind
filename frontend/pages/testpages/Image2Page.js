import ImageTemplatePage from './ImageTemplatePage';
export default function Image2Page({ navigation }) {
  return (
    <ImageTemplatePage
      sentence="그림 설명하기"
      imageSource={require('../assets/Family.jpg')}
      nextScreen="Fluency1"
      navigation={navigation}
    />
  );
}
