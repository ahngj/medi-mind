import RepeatTemplatePage from './RepeatTemplatePage';
export default function Repeat3Page({ navigation }) {
  return (
    <RepeatTemplatePage
      sentence="낮말은 새가 듣고 밤말은 쥐가 듣는다"
      nextScreen="Image1"
      navigation={navigation}
    />
  );
}