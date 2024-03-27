import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { client } from '../../utils/KindeConfig';
import { supabase } from '../../utils/supabase';

const Donor = () => {
  const router = useRouter();
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [location, setLocation] = useState('');
  const [isDonor, setIsDonor] = useState(false);
  const [donorId, setDonorId] = useState('');
  const [donorAccept, setDonorAccept] = useState(false); // Add donorAccept state
  const [donorBlood, setDonorBlood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [finderBlood, setFinderBlood] = useState('');
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const userData = await client.getUserDetails();
      const userId = userData?.id;
      await getUserLocation(userId);
      await getIsDonor(userId);
      await getDonorId(userId);

      if(isDonor && donorId !== userId){
        await getDonorBloodGroup(userId);
        await getFinderBloodType(userId);
        await updateIsMatch(userId);
        
      }

      if (isLoading) {
        supabase.from('user details').update({ is_searching: true }).eq('kinde_id',userId);
      }


    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  const getDonorId = async (userId) => {
    try {
      const { data: Uid, error } = await supabase
        .from('users')
        .select('kinde_id')
        .eq('kinde_id', userId)
        .single();

      if (error) {
        console.error('Error fetching donor ID:', error.message);
        return;
      }

      if (Uid) {
        setDonorId(Uid.kinde_id);
      }
    } catch (error) {
      console.error('Error fetching donor ID:', error.message);
    }
  }

  const getIsDonor = async (userId) => {
    try {
      const { data: donor, error } = await supabase
        .from('check if donor')
        .select('is_donor')
        .eq('kinde_uuid', userId)
        .single();

      if (error) {
        console.error('Error fetching isDonor data:', error.message);
        return;
      }

      if (donor) {
        setIsDonor(donor.is_donor);
      }
    } catch (error) {
      console.error('Error fetching isDonor data:', error.message);
    }
  }

  const getDonorBloodGroup = async (userId) => {
    try {
      const { data: blood, error } = await supabase
        .from('user details')
        .select('user_bloodtype')
        .eq('kinde_uuid', userId)
        .single();

      if (error) {
        console.error('Error fetching donor blood group:', error.message);
        return;
      }

      if (blood) {
        setDonorBlood(blood.user_bloodtype);
        // Handle blood group data if needed
      }
    } catch (error) {
      console.error('Error fetching donor blood group:', error.message);
    }
  }

  const updateIsMatch = async (userId) => {
    try {
      if (donorBlood === 'O-' && finderBlood === 'O+') {
        await supabase.from('user details').update({ is_match: true }).eq('kinde_uuid', userId);
      } else if (donorBlood === 'O+' && (finderBlood === 'O-' || finderBlood === 'O+')) {
        await supabase.from('user details').update({ is_match: true }).eq('kinde_uuid', userId);
      } else if (donorBlood === 'A-' && (finderBlood === 'A-' || finderBlood === 'AB-')) {
        await supabase.from('user details').update({ is_match: true }).eq('kinde_uuid', userId);
      } // Add more conditions for other blood types and their compatibility
      
      console.log('Database updated successfully');
    } catch (error) {
      console.error('Error updating database:', error.message);
    }
  }
  





  
  const getFinderBloodType = async (userId) => {
    try {
      const { data: finderblood, error } = await supabase
        .from('user details')
        .select('user_bloodtype')
        .eq('kinde_uuid', userId)
        .single();

      if (error) {
        console.error('Error fetching donor blood group:', error.message);
        return;
      }

      if (finderblood) {
        setFinderBlood(finderblood.user_bloodtype);
      }
    } catch (error) {
      console.error('Error fetching donor blood group:', error.message);
    }
  }





  const getUserLocation = async (userId) => {
    try {
      const { data: userDetails, error } = await supabase
        .from('user details')
        .select('user_location')
        .eq('kinde_uuid', userId)
        .single();

      if (error) {
        console.error('Error fetching user location:', error.message);
        return;
      }

      if (userDetails) {
        setLocation(userDetails.user_location);
      }
    } catch (error) {
      console.error('Error fetching user location:', error.message);
    }
  };

  const handleFindDonor = (isDonor, donorId, userId) => {
   
    if(isDonor && donorId == userId){
      alert('You have selected being a donor.Please deselect and continue');
      return
    }

  }

  const handleBloodGroupSelection = (bloodGroup) => {
    setSelectedBloodType(bloodGroup);
  };
  
  return (
    <View>
      <View  style={{ 
      marginTop: 60,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{  width: '80%' }}>
        <Text style={styles.selectBloodTypeText}>Select A Blood Type</Text>
        {/* <Button title="Push" onPress={()=> router.push('/register')}/> */}
        <View style={styles.bloodGroupsContainer}>
          {bloodTypes.map((bloodGroup, index) => (
           <TouchableOpacity
           key={index}
                onPress={() => handleBloodGroupSelection(bloodGroup)} // Pass the blood group to the function
                style={[
                  styles.bloodGroupButton,
                  selectedBloodType === bloodGroup ? styles.selectedBloodGroupButton : null,
                ]}
              >
           <Text style={[styles.bloodGroupText, selectedBloodType === bloodGroup && styles.selectedText]}>
             {bloodGroup}
           </Text>
         </TouchableOpacity>
         
          ))}
        </View>
        <View style={{
          alignItems: 'center',
        }}>
          <TouchableOpacity onPress={handleFindDonor} style={styles.findDonorButton}>
            <Text style={styles.findDonorButtonText}>{isLoading ? 'Searching...': 'Find A Donor'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
      
      {donorAccept && (
        <ScrollView style={styles.scrollView}>
          <View style={styles.acceptArea}>
            <Text style={styles.acceptText}>John Doe</Text>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.line}></View>
          <View style={styles.acceptArea}>
            <Text style={styles.acceptText}>John Doe</Text>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.line}></View>
          <View style={styles.acceptArea}>
            <Text style={styles.acceptText}>John Doe</Text>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.line}></View>
          {/* Add more dummy data here */}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  selectBloodTypeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bloodGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
  },
  bloodGroupButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    margin: 5,
    borderWidth: 2,
    borderColor: 'gray',
  },
  selectedBloodGroupButton: {
    borderColor: 'red',
  },
  bloodGroupText: {
    color: 'gray',
    fontSize: 20,
  },
  selectedText: {
    color: 'red',
  },
  findDonorButton: {
    backgroundColor: '#db0202',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 20,
    width: '70%',
    alignItems: 'center',
  },
  findDonorButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
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
    marginTop: 10,
  },
});

export default Donor;
