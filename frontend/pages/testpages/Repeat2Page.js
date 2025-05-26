import RepeatTemplatePage from './RepeatTemplatePage';
export default function Repeat2Page({ navigation }) {
  return (
    <RepeatTemplatePage
      sentence="어제는 비가 와서 집에 있었다"
      nextScreen="Repeat3"
      navigation={navigation}
    />
  );
}