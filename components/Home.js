import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {AsyncStorage} from 'react-native';


export default class LoginScreen extends Component {

    getAchievment = async () => {

    }

    //TODO Revoir
    storeData = async (userID, successList) => {
        try {
          await AsyncStorage.setItem(userID, JSON.stringify(successList));
        } catch (error) {
          console.log(error);
        }
      };

    

    render(){
        const inCommingData = this.props.data || 'no data!';
        
        if(inCommingData == 'no data!'){
            console.log(inCommingData);
            return(
                <View>
                    <Text>No Data Found :o</Text>
                </View>
            )
        }


        //Traitement de la Data
        let successList = inCommingData.playerstats.achievements;
        let id = 0;
        for (let success of successList) {
            const {achieved, apiname, unlocktime} = success;

            //traitement du nom
            let name = apiname.substring(12);
            name = name.replace(/_/g, " ");
            success.name = name.charAt(0).toUpperCase() + name.slice(1);

            //la date
            const date = new Date(unlocktime * 1000);
            success.unlock = achieved ? date.toDateString() : ' ';

            //suppression des trucs en trop
            delete success['apiname'];
            //delete success['unlocktime'];
        }
        
        console.log(successList);
        this.storeData(this.props.userID, successList);



        return(
            <React.Fragment >
                <FlatList
                    style = {flex = 1}
                    keyExtractor = {(item, index) => item.name}
                    data={successList}
                    renderItem={({item}) => (
                        <View style = {styles.container}>
                            <Text style = {styles.successDescription}> {item.name} </Text>
                            <Text style = {styles.successChecked}> {item.unlock} </Text>
                        </View>
                    )}
                />
            </React.Fragment>
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: 'red'
    },
    successDescription: {
        flex: 3,
        borderWidth: 1,
        borderColor: 'yellow'
    },
    successChecked: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'cyan'
    }

});