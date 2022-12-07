import { StyleSheet, View, Text, Button, Alert } from 'react-native';
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
    Alert.alert(
      `You've entered region:${region.identifier}`,      
    )
  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log("You've left region:", region);
    //store.dispatch(regionOut(region));
    Alert.alert(
      `You've left region:${region.identifier}`,      
    )
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
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        let region = [{identifier: "Hudson Street", latitude:40.7354, longitude:-74.0059, radius:100,  notifyOnEnter: true,
        notifyOnExit: true,}];      
        await Location.startLocationUpdatesAsync(LOCATION_API_TASK, {
          accuracy: Location.Accuracy.BestForNavigation
        }); 
        await Location.startGeofencingAsync(GEOFENCE_TASK, region);
        setIsLoading(false);
      }               
    }
  };
   
  const PermissionsButton = () => (
    <View style={styles.buttonContainer}>
      <Button onPress={configureGeoFence} title="Start background location" />
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
            <Text style={styles.title} >geo-fence started</Text>
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
  },
  title: {
    fontSize: 20
  }
});
