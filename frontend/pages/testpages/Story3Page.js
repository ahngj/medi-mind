import StoryTemplatePage from './StoryTemplatePage';
export default function Story3Page({ navigation }) {
  return (
    <StoryTemplatePage
      sentence="어제 있었던 일을 이야기하세요"
      nextScreen="Upload"
      navigation={navigation}
    />
  );
}
