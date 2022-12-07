import { StyleSheet, View, Text, Button } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';

const GEOFENCE_TASK = "geofence-task";
const LOCATION_API_TASK = "location-api-task";


TaskManager.defineTask(GEOFENCE_TASK, ({ data:{eventType, region}, error }) => {
  if (error) {
    console.log(`Task - ${GEOFENCE_TASK} - error`, error);
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

TaskManager.defineTask(LOCATION_API_TASK, ({ data: { locations }, error }) => {
  if (error) {
    console.log(`Task - ${LOCATION_API_TASK} - error`, error);
    return;
  }
 // console.log('Received new locations', locations);
 });

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  const configureGeoFence = async() => {
    let getAllTasks = await TaskManager.getRegisteredTasksAsync();
    console.log("getAllTasks", JSON.stringify(getAllTasks[0]));
    console.log("TaskManager.isTaskDefined('GEOFENCE_TASK')", TaskManager.isTaskDefined(GEOFENCE_TASK));
    
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        let region = [{identifier: "Hudson Street", latitude:40.7354, longitude:-74.0059, radius:100,  notifyOnEnter: true,
        notifyOnExit: true,}];      
        if (TaskManager.isTaskDefined(GEOFENCE_TASK)) {
            console.log("Task registered");
          await Location.startGeofencingAsync(GEOFENCE_TASK, region);
        }
        if (TaskManager.isTaskDefined(LOCATION_API_TASK)) {            
          await Location.startLocationUpdatesAsync(LOCATION_API_TASK, {
            accuracy: Location.Accuracy.BestForNavigation
          }); 
        }
        setIsLoading(false);
      }               
    }
  };
   
  const PermissionsButton = () => (
    <View style={styles.buttonContainer}>
      <Button onPress={configureGeoFence} title="Enable background location" />
    </View>
  );

  return (
    <View style={styles.container}>
      
      <PermissionsButton />
      {
        isLoading ? <></>
        : 
        <View>
          <View>
            <Text>geo-fence started</Text>
          </View>         
        </View>
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
  buttonContainer: {
    flex: 0.5
  }
});
