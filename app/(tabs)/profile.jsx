import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { client } from '../../utils/KindeConfig';
import services from '../../utils/services';
import { supabase } from '../../utils/supabase';

const Profile = () => {
  const [user, setUser] = useState(); // State variable to store user data
  const [bloodtype, setBloodtype] = useState(); // State variable to store user's blood type
  const [donationsdate, setDonationsdate] = useState();
  const [donations, setDonations] = useState();
  const [phoneNum, setPhoneNum] = useState();
  const [location, setLocation] = useState(); // State variable to store user's location
  const fullname = `${user?.given_name}  ${user?.family_name}`; // Full name of the user

  const router = useRouter(); // Router for navigation

  // useEffect to fetch user data when component mounts
  useEffect(() => {
    getData(); // Fetch user data
    
  },[]);

  // Function to fetch user data
  const getData = async () => {
    try {
      const userData = await client.getUserDetails(); // Fetch user data from client
      setUser(userData); // Set user data in state
      const userId = userData.id; // Extract user ID
      await getUserData(userId); 
      await getUserLocation(userId);
      await getLastDonation(userId); 
      getDonationData(userId);
      getUserPhoneNum(userId)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  const getUserPhoneNum =  async (userId) =>{
    try {
      const { data: number, error } = await supabase
      .from('user details')
      .select('phone_number')
      .eq('kinde_uuid', userId)
      .single();

      if(error) {
        console.log(error);
      }

      if(number){
        setPhoneNum(number.phone_number);
      }

    } catch (error) {
      console.log('Error fetching phone number',error);
    }
  } 




  // Function to fetch additional user data from Supabase
  const getUserData = async (userId) => {
    try {
      const { data: userDetails, error } = await supabase
        .from('user details')
        .select('user_bloodtype')
        .eq('kinde_uuid', userId)
        .single();

      if (error) {
        console.error('Error fetching user details:', error.message);
        return;
      }

      if (userDetails) {
        setBloodtype(userDetails.user_bloodtype); // Set user's blood type in state
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };



  const getLastDonation = async (userId) => {
    try {
      const { data: userDetails, error } = await supabase
        .from('user donations')
        .select('last_donation')
        .eq('kinde_uuid', userId)
        .single();
  
      if (error) {
        console.error('Error fetching user details:', error.message);
        return;
      }
  
      if (userDetails) {
        // Set user's blood type in state
        setDonationsdate(userDetails.last_donation);
      } else {
        // Handle the case when there is no donation data for the user
        console.log('No donation data found for the user');
      }
    } catch (error) {
      return
      console.error('Error fetching user details:', error.message);
    }
  };
  

  const getDonationData = async (userId) => {
    try {
      const { data: userDetails, error } = await supabase
        .from('user donations')
        .select('donations')
        .eq('kinde_uuid', userId)
        .single();

      if (error) {
        console.error('Error fetching user details:', error.message);
        return;
      }

      if (userDetails) {
         setDonations(userDetails.donations);
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };



  const getUserLocation = async (userId) => {
    try {
      const { data: userDetails, error } = await supabase
        .from('user details')
        .select('user_location')
        .eq('kinde_uuid', userId)
        .single();

      if (error) {
        console.error('Error fetching user details:', error.message);
        return;
      }

      if (userDetails) {
        setLocation(userDetails.user_location); // Set user's location in state
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const loggedOut = await client.logout(); // Logout user from client
      if (loggedOut) {
        await services.storeData('login', 'false'); // Set login status to false
        router.replace('/login'); // Redirect to login screen
      }
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // JSX to render user profile information
  return (
    <View style={styles.container}>
      <View style={{ marginTop: 50 }}>
        <View style={styles.header}>
          <Image source={{ uri: user?.picture }} style={styles.profileImage} />
          <Text style={styles.name}>{fullname}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.details}>
          <Text style={styles.detailLabel}>Blood Type:</Text>
          <Text style={styles.detail}>{bloodtype}</Text>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detail}>{location}</Text>
          <Text style={styles.detailLabel}>Donations:</Text>
          <Text style={styles.detail}>{donations ? donations : 'You havent donated yet'}</Text>
          <Text style={styles.detailLabel}>Last Donation:</Text>
          <Text style={styles.detail}>{donationsdate == null ? 'You havent donated yet': donationsdate}</Text>
          <Text style={styles.detailLabel}>Phone Number:</Text>
          <Text style={styles.detail}>{phoneNum}</Text>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  details: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#db0202',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Profile;

