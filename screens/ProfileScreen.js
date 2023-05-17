import { StyleSheet, Text,Image, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { auth } from '../Firebase'
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => { 
    const user = auth.currentUser ;
    const navigation = useNavigation() ;
    const signOutUser =() => {
        signOut(auth).then(()=> {
            navigation.replace("Login");
        }).catch( err => {
            console.log(err);
        })
    }
  return (
    <View style={{backgroundColor: "#EFC7F3", flex :1 , justifyContent :"center" , alignItems : "center" }}>
      <TouchableOpacity style={{marginVertical:10}}>
      <Image
              style={{
                height : 150,
                width : 150 ,
                marginLeft : 70,
                marginTop : 45,
                marginBottom : 45,
              }}
              source={{
                uri: "https://asset-a.grid.id/crop/0x0:1186x951/x/photo/2022/06/10/webpnet-resizeimage-2022-06-0-20220610121849.jpg",
              }}/>
        <Text>Welcome {"   "} {user.email} </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signOutUser} >
        <Text>
            Sign Out 
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})