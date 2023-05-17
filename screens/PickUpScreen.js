import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  ScrollView,
  Alert ,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import HorizontalDatepicker from "@awrminkhodaei/react-native-horizontal-datepicker";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
const PickUpScreen = () => {
    const cart = useSelector((state) => state.cart.cart);
    // console.log(cart)
    const total = cart
      .map((item) => item.quantity * item.price)
      .reduce((curr, prev) => curr + prev, 0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setselectedTime] = useState([]);
  const [Delivery, setDelivery] = useState([]);
  var date = new Date().getDate();
  if (date <= 9) {
    var x = date;
    date = "0" + x;
  }
  var month = new Date().getMonth() + 1;
  if (month <= 9) {
    var x = month;
    month = "0" + x;
  }
  var year = new Date().getFullYear();
  var dateString = year + "-" + month + "-" + date;
  var finaldate = String(dateString).trim();
  var endDay = 28;
  var endmonth = month;
  if (endDay > 15) {
    endmonth = new Date().getMonth() + 2;
    if (endmonth <= 9) {
      var x = endmonth;
      endmonth = "0" + x;
    }
  }
  var endYear = year;
  if (month == 12) {
    endYear = endYear + 1;
  }

  var endDateStr = endYear + "-" + endmonth + "-" + endDay;
  var finalEndDate = String(endDateStr).trim();

  const navigation = useNavigation();
  const [displayCurrentAddress, setdisplayCurrentAddress] = useState(
    "We are Loading Your Location..."
  );
  const [locationServicesEnabled, setlocationServicesEnabled] = useState(false);

  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);

  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert(
        "Location Services are not Enabled ",
        "Please enable the location Services ",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]
      );
    } else {
      setlocationServicesEnabled(enabled);
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied ",
        "Allow the app to use the Location services  ",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]
      );
    }

    const { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      // console.log(coords)
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
    
      // console.log(response)

      for (let item of response) {
        let address = `${item.name} ${item.city} ${item.postalCode}`;
        setdisplayCurrentAddress(address);
      }
    }
  };
      

  const deliveryTime = [
    {
      id: "0",
      name: "2-3 Days",
    },
    {
      id: "1",
      name: "3-4 Days",
    },
    {
      id: "2",
      name: "4-5 Days",
    },
    {
      id: "3",
      name: "5-6 Days",
    },
    {
      id: "4",
      name: "Tommorrow",
    },
  ];

  const times = [
    {
      id: "0",
      time: "Antar Sendiri",
    },
    {
      id: "1",
      time: "Di Jemput Pegawai",
    },
  ];

  

  const proceedToCart = () => {
    if( !selectedDate || !selectedTime || !Delivery){
        Alert.alert(
            "Empty or Invalid",
            "Please select All the fields",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
    }
    if(selectedDate && selectedTime && Delivery) {
       navigation.replace("Cart",{
        pickUpDate : selectedDate,
        selectedTime: selectedTime,
        no_Of_days:Delivery,
       })
    }
  }

  return (
    <>
    
    <SafeAreaView
      style={{ backgroundColor: "#F7E0F6", flex: 1, marginTop: 22 }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          marginHorizontal: 17,
          marginVertical: 12,
        }}
      >
        Masukan alamat
      </Text>
      <Text 
      
        style={{
          backgroundColor: "#fce5cd",
          fontSize: 20,
          fontWeight: "500",
          marginHorizontal: 17,
          marginVertical: 12,
        }}>{displayCurrentAddress}</Text>

      <View>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "500",
            marginHorizontal: 17,
            marginVertical: 12,
          }}
        >
          Tanggal Pengiriman
        </Text>

        <HorizontalDatepicker
          mode="gregorian"
          startDate={new Date(finaldate)}
          endDate={new Date(finalEndDate)}
          initialSelectedDate={new Date(finaldate)}
          onSelectedDateChange={(date) => setSelectedDate(date)}
          selectedItemWidth={170}
          unselectedItemWidth={38}
          itemHeight={38}
          itemRadius={10}
          selectedItemTextStyle={styles.selectedItemTextStyle}
          unselectedItemTextStyle={styles.selectedItemTextStyle}
          selectedItemBackgroundColor="#222831"
          unselectedItemBackgroundColor="#ececec"
          flatListContainerStyle={styles.flatListContainerStyle}
        />
      </View>

      <View style={{ marginBottom: 395 }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "500",
            marginHorizontal: 17,
          }}
        >
          Pilih Pengiriman
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {times.map((item, index) => (
            <Pressable
              onPress={() => setselectedTime(item.time)}
              key={index}
              style={
                selectedTime.includes(item.time)
                  ? {
                      margin: 10,
                      borderRadius: 7,
                      padding: 15,
                      borderColor: "red",
                      borderWidth: 0.8,
                    }
                  : {
                      margin: 10,
                      borderRadius: 7,
                      padding: 15,
                      borderColor: "gray",
                      borderWidth: 0.8,
                    }
              }
            >
              <Text style={{ fontWeight: "bold" }}>{item.time}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={{
            fontSize: 17,
            fontWeight: "500",
            marginHorizontal: 17,
          }}>
            Estimasi Waktu loundry 
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator = {false}>
            {deliveryTime.map((item,index)=> (
                <Pressable key = {index} onPress = {()=> setDelivery(item.name)} 
                style={
                    Delivery.includes(item.name)
                      ? {
                          margin: 10,
                          borderRadius: 7,
                          padding: 15,
                          borderColor: "red",
                          borderWidth: 0.8,
                        }
                      : {
                          margin: 10,
                          borderRadius: 7,
                          padding: 15,
                          borderColor: "gray",
                          borderWidth: 0.8,
                        }
                  }>
                    <Text style = {{fontWeight:"bold"}}>{item.name}</Text>
                </Pressable>
            ))}
        </ScrollView>

      </View>
      


    </SafeAreaView>

    {total === 0 ? null : (
        <Pressable
          style={{
            backgroundColor: "#088F8F",
            padding: 10,
            marginBottom: 30,
            margin: 15,
            borderRadius: 7,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style ={{fontSize:15 , fontWeight:"800" , color: "white" }}>{cart.length} items | Rp. {total} </Text>
            <Text style={{fontSize:13, fontWeight:"400" , color : "white" ,marginVertical :6  }}>Tambahan item </Text>
          </View>
          <Pressable onPress={ proceedToCart
         }>
            <Text style ={{fontSize: 17 , fontWeight:"bold" , color : "white"}}>Proses Pemesanan</Text>
          </Pressable>
        </Pressable>
      )}

    </>
  );
};

export default PickUpScreen;

const styles = StyleSheet.create({});
