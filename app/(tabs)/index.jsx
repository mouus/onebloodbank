import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { client } from '../../utils/KindeConfig';
import { supabase } from '../../utils/supabase';
import { Fontisto } from '@expo/vector-icons';
import services from '../../utils/services';
import { useRouter } from 'expo-router';

const Home = () => {
  const router = useRouter();
  const [countDonation, setCountDonation] = useState(0);
  const [isDonor, setIsDonor] = useState(false);
  const [toggleDonor, setToggleDonor] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUserId();
  });

  const getUserId = async () => {
    const userData = await client.getUserDetails();
    const userId = userData.id;
    setUserId(userId);
    getIsDonor(userId);
  };

  const getIsDonor = async (userId) => {
    try {
      const { data: donor, error } = await supabase
        .from('check if donor')
        .select('is_donor')
        .eq('kinde_uuid', userId)
        .single();

      if (error) {
        console.error('Error fetching donor data:', error.message);
        return;
      }

      if (donor) {
        setIsDonor(donor.is_donor);
      }
    } catch (error) {
      console.error('Error fetching donor data:', error.message);
    }
  };

  const updateIsDonor = async (userId) => {
    try {
      await supabase.from('check if donor').update({ is_donor: toggleDonor }).eq('kinde_uuid', userId);
    } catch (error) {
      console.error('Error updating is_donor status:', error.message);
    }
  };

  const handleDonorStatusToggle = () => {
    setToggleDonor(!toggleDonor);
    updateIsDonor(userId);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 2, marginTop: 100, marginBottom: 40 }}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleDonorStatusToggle} style={[styles.icon, isDonor && styles.donorIcon]}>
            <Fontisto name="blood-drop" size={40} color="white" />
          </TouchableOpacity>
          <Text style={styles.donorText}>{isDonor ? 'You are a donor' : 'Become a donor'}</Text>
        </View>
      </View>
      {isDonor && (
        <View style={{ flex: 2 }}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.acceptArea}>
              <Text style={styles.acceptText}>John Doe</Text>
              <TouchableOpacity onPress={() => setIsDonorAccept(true)} style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line}></View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    backgroundColor: 'gray',
    borderRadius: 50,
    padding: 15,
  },
  donorIcon: {
    backgroundColor: '#db0202',
  },
  donorText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#333',
  },
  scrollView: {
    flex: 2,
  },
  acceptArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  acceptText: {
    fontSize: 18,
  },
  acceptButton: {
    backgroundColor: '#db0202',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  line: {

    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 20,
    marginTop: 15,
  },
});

export default Home;
