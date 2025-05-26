import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppMainPage from './AppMainPage';
import TutorialPage from './TutorialPage';
import ResultPage from './ResultPage';
import CalculationPage from './testpages/CalculationPage ';
import UploadPage from './Upload';
import Repeat1Page from './testpages/Repeat1Page';
import Repeat2Page from './testpages/Repeat2Page';
import Repeat3Page from './testpages/Repeat3Page';
import Image2Page from './testpages/Image2Page';
import Image1Page from './testpages//Image1Page';
import Fluency1Page from './testpages/Fluency1Page';
import Fluency2Page from './testpages/Fluency2Page';
import Story1Page from './testpages/Story1Page';
import Story3Page from './testpages/Story3Page';
import Story2Page from './testpages/Story2Page';


const Stack = createNativeStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={AppMainPage} />
        <Stack.Screen name="Tutorial" component={TutorialPage} />

        <Stack.Screen name="Repeat1" component={Repeat1Page} />
        <Stack.Screen name="Repeat2" component={Repeat2Page} />
        <Stack.Screen name="Repeat3" component={Repeat3Page} />


        
        <Stack.Screen name="Image1" component={Image1Page} />
        <Stack.Screen name="Image2" component={Image2Page} />

        
        <Stack.Screen name="Fluency1" component={Fluency1Page} />
        <Stack.Screen name="Fluency2" component={Fluency2Page} />
        

        
        <Stack.Screen name="Story1" component={Story1Page} />
        <Stack.Screen name="Story2" component={Story2Page} />
        <Stack.Screen name="Story3" component={Story3Page} />
        <Stack.Screen name="Cal" component={CalculationPage} />

        <Stack.Screen name="Upload" component={UploadPage} />
        <Stack.Screen name="Result" component={ResultPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
