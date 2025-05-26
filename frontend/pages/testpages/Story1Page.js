import StoryTemplatePage from './StoryTemplatePage';
export default function Story1Page({ navigation }) {
  return (
    <StoryTemplatePage
      sentence="가장 기뻤던 일을 이야기하세요"
      nextScreen="Story2"
      navigation={navigation}
    />
  );
}
