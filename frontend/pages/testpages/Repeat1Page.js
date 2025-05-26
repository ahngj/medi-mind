import RepeatTemplatePage from './RepeatTemplatePage';
export default function Repeat1Page({ navigation }) {
  return (
    <RepeatTemplatePage
      sentence="마당에 작은 꽃이 피었다"
      nextScreen="Repeat2"
      navigation={navigation}
    />
  );
}