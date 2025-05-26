import StoryTemplatePage from './StoryTemplatePage';
export default function Story2Page({ navigation }) {
  return (
    <StoryTemplatePage
      sentence="가장 슬펐던 일을 이야기하세요"
      nextScreen="Story3"
      navigation={navigation}
    />
  );
}
