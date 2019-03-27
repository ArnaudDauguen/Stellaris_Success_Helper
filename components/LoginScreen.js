import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux';


export default class LoginScreen extends Component {

    state = {
        userID: '76561198198838989'
    };


    login = async () => {

        console.log("id : " + this.state.userID);
        const url = 'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=281990&key=49898A818CB116E44D6E82F5B1AC79E1&steamid=' + this.state.userID;
        
        const response = await fetch(url);
        const data = await response.json();
        const userID = this.state.userID;

        
        if(data.playerstats.success){
            Actions.home({data: data, userID: userID});
        }else{
            Actions.refresh({userID: userID});
        }

    }


    render(){

        const {userID} = this.state;

        return(
            <View style = {styles.container}>
                <TextInput
                    value = {userID}
                    placeholder = {"Insert your Steam ID here"}
                    placeholderTextColor = {"#FCFCFC"}
                    keyboardType = {'number-pad'}
                    autoCorrect = {false}
                    style = {styles.inputs}
                    onChangeText = {userID => this.setState({userID})}
                />
                <TouchableOpacity
                    onPress = {this.login}
                    style = {styles.buttons}
                >
                    <Text style={styles.buttonText}> Valider </Text>
                </TouchableOpacity>
            </View>
        );
    }
}




const styles = StyleSheet.create({
    inputs: {
        width: 300,
        height: 50,
        margin: 'auto',
        marginBottom: 30,
        backgroundColor: '#CFCFCF'
    },
    buttons: {
        width: 300,
        height: 50,
        margin: 'auto',
        backgroundColor: '#52AACA',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FCFCFC',
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    }
});