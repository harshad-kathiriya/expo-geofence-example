import { StyleSheet, View, Text } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { GEOFENCE_TASK } from './constantList';
import React, { useEffect, useState } from 'react';


TaskManager.defineTask(GEOFENCE_TASK, ({ data:{eventType, region}, error }) => {
  if (error) {
    console.log("Geofence error", error);
    return;
  }
  if (eventType === Location.GeofencingEventType.Enter) {
    console.log("You've entered region:", region);
    //store.dispatch(regionIn(region));
  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log("You've left region:", region);
    //store.dispatch(regionOut(region));
  }
});


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const configureGeoFence = async() => {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus === 'granted') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === 'granted') {
          let region = [{identifier: "Hudson Street", latitude:40.7354, longitude:-74.0059, radius:20,  notifyOnEnter: true,
          notifyOnExit: true,}];      
          if (!TaskManager.isTaskDefined(GEOFENCE_TASK)) {
            console.log("Task registered");
            await Location.startGeofencingAsync(GEOFENCE_TASK, region);
          }
          setIsLoading(false);
        }
      }
    };
    configureGeoFence();
  },[]);

  
  return (
    <View style={styles.container}>
      {
        isLoading ? <Text>Configuring geo-fence</Text>
        : 
          <Text>geo-fence started</Text> 
      }
      </View>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
