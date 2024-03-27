import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { OPEN_WEATHER_KEY } from '@env';
import { client } from '../../utils/KindeConfig';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneInput from 'react-native-phone-input';

const Register = () => {
  const router = useRouter(); 
  const [location, setLocation] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Add any additional initialization logic here
  }, []);

  const locationData = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission not granted');
      }

      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

      fetchData(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.log('Error fetching location data:', error);
    }
  };

  const fetchData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_KEY}`
      );
      const data = await response.json();
      setLocation(data.name);
    } catch (error) {
      console.log('Error fetching weather data:', error);
    }
  };

  const handleBloodGroupSelection = (bloodGroup) => {
    setSelectedBloodGroup(bloodGroup);
  };

  const handleSubmit = async () => {
    try {
      const user = await client.getUserDetails();
      const userName = `${user?.given_name} ${user?.family_name}`;
      if (selectedBloodGroup && location && phoneNumber) {

      await supabase.from('users').insert({
        kinde_id: user?.id,
        username: userName,
        email: user?.email,
        image: user?.picture,
      });


        await supabase.from('user details').insert({
          kinde_uuid: user?.id,
          user_bloodtype: selectedBloodGroup,
          user_location: location,
          phone_number: phoneNumber,
          is_match: false,
          is_searching: false,
        });
        await supabase.from('donor accepting details').insert({
          kinde_uuid: user?.id,
          donor_accepting: false,
        })
        await supabase.from('finder accepting details').insert({
          kinde_uuid: user?.id,
          finder_accepting: false,
        })
        await supabase.from('check if donor').insert({
          kinde_uuid: user?.id,
          is_donor: false,
        })

        await supabase.from('user donations').insert({
          kinde_uuid: user?.id,
          donations: 0,
          last_donation: null,
        })

        await supabase.from('first donation').insert({
          kinde_uuid: user?.id,
          is_first: true,
        })

        await AsyncStorage.setItem('hasRegistered', 'true');
        router.replace('/');
      } else {
        alert('Select Blood Group and Location')
      }
    } catch (error) {
      console.log('Error submitting registration:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Register</Text>
      </View>

      <View style={styles.bloodGroupsContainer}>
        <Text style={styles.bloodGroupsLabel}>What is your blood group?</Text>
        <View style={styles.bloodGroups}>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bloodGroup, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleBloodGroupSelection(bloodGroup)}
              style={[
                styles.bloodGroup,
                selectedBloodGroup === bloodGroup && styles.selectedBloodGroup,
              ]}
            >
              <Text style={styles.bloodGroupText}>{bloodGroup}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>Enter your location:</Text>
        <TouchableOpacity style={styles.locationInput} onPress={locationData}>
          <Text style={styles.locationInputText}>{location || 'Select Location'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.phoneNumberContainer}>
        <Text style={styles.phoneNumberLabel}>Enter your phone number:</Text>
        <PhoneInput
          ref={(ref) => {
            this.phone = ref;
          }}
          initialCountry={'mv'}
          onChangePhoneNumber={(number) => setPhoneNumber(number)}
          style={styles.phoneNumberInput}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 30,
    color: '#db0202',
    fontWeight: 'bold',
  },
  bloodGroupsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bloodGroupsLabel: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  bloodGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bloodGroup: {
    width: 100,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#db0202',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  selectedBloodGroup: {
    backgroundColor: '#db0202',
  },
  bloodGroupText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  locationContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  locationInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  locationInputText: {
    fontSize: 18,
    color: '#333',
  },
  phoneNumberContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  phoneNumberLabel: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneNumberInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#db0202',
    borderRadius: 99,
    width: 200,
    paddingVertical: 15,
    alignSelf: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Register;