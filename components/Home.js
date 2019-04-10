import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, TouchableHighlight} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {AsyncStorage} from 'react-native';


export default class Home extends Component {

    state = {
        successAvailable: [],
        selectedSuccess: [],
        backupSuccessList: [],
        conditions: {
            "species": [],
            "government": [],
            "ethic": [],
            "ascension": []
          },
    };


    
    // TODO
    // on va tout refaire à l'envers,
    // on part du tableau dans success.JSON
    // on rajoute les datas dont on a besoin comme la date d'achievement
    // puis on fera le rendu avec un truc 'filter'

    getLocalAchievmentsDatas = async () => {
        this.state.successAvailable = require('../success.json');
        this.state.backupSuccessList = this.state.successAvailable;
    }

    putApiInfos = () => {
        const inCommingSuccessList = this.props.data.playerstats.achievements || null;
        //Traitement de la Data
        for (let success of inCommingSuccessList) {
            success.apiname = this.reformateName(success.apiname);
            let storedSuccess = this.getSuccessByName(success.apiname);
            if(storedSuccess){
                const {achieved, apiname, unlocktime} = success;

                //la date
                const date = new Date(unlocktime * 1000);
                storedSuccess.unlocktime = achieved != 0 ? date.toDateString() : 'Never completed';
            }
        }
    }

    getSuccessByName = (name) => {
        for(let success of this.state.successAvailable){
            if(success.name === name){
                return success;
            }
        }
        return false;
    }

    reformateName = (name) => {
        
        name = name.substring(12);
        name = name.replace(/_/g, " ");
        name = name.charAt(0).toUpperCase() + name.slice(1);

        return name;
    }

    successMatching = (success) => {
        for(let selectedSuccess of this.state.selectedSuccess){
            if(success === selectedSuccess){
                return false;
            }
        }
        if(success.conditions.ethic.length > 0){
            for (let ethic of success.conditions.ethic){
                for(let conditionEthic of this.state.conditions.ethic) {
                    if(ethic === conditionEthic){
                        return true;
                    }
                }
            }
        }
            
        return false;
    }


    addFilter = (success) => {
        this.state.selectedSuccess.push(success);

        this.updateConditions();
        this.updateList();
    }


    removeFilter = (success) => {
        this.state.selectedSuccess = this.state.selectedSuccess.filter(item => item != success);

        this.updateConditions();
        this.updateList();
    }

    updateConditions = () => {
        this.state.conditions = {"species": [], "government": [], "ethic": [], "ascension": []};
        for(let success of this.state.selectedSuccess){
            for (let species of success.conditions.species){
                this.state.conditions.species.push(species);
            }
            for (let government of success.conditions.government){
                this.state.conditions.government.push(government);
            }
            for (let ethic of success.conditions.ethic){
                this.state.conditions.ethic.push(ethic);
            }
            for (let ascension of success.conditions.ascension){
                this.state.conditions.ascension.push(ascension);
            }
        }
    }


    updateList = () => {
        this.setState(previousState => { 
            let newSuccessList = previousState.backupSuccessList.filter(success => this.successMatching(success));
            return {successAvailable: newSuccessList};
        });

    }



    // Pour recup les datas qu'une fois et au démarrage (sinon constructor)
    componentWillMount(){
        this.getLocalAchievmentsDatas();
        this.putApiInfos();
    }

    render(){

        return(
            <React.Fragment>
                <FlatList
                    keyExtractor = {(item, index) => item.name}
                    data={this.state.selectedSuccess}
                    renderItem={({item}) => (
                        <TouchableHighlight
                            onPress={() => this.removeFilter(item)}
                        >
                            <View style = {styles.successContainer}>
                                <Text style = {styles.successDescription}> {item.name + '\n' + item.description} </Text>
                                <Text style = {styles.successChecked}> {item.unlocktime} </Text>
                            </View>
                        </TouchableHighlight>
                    )}
                />


                <FlatList
                    keyExtractor = {(item, index) => item.name}
                    data={this.state.successAvailable}
                    renderItem={({item}) => (
                        <TouchableHighlight
                            onPress={() => this.addFilter(item)}
                        >
                            <View style = {styles.successContainer}>
                                <Text style = {styles.successDescription}> {item.name + '\n' + item.description} </Text>
                                <Text style = {styles.successChecked}> {item.unlocktime} </Text>
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </React.Fragment>
        );
    }
}


const styles = StyleSheet.create({
    global: {
        // flex: 1,
        // backgroundColor: '#282E36',
    },
    successContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#fafafa',
    //   backgroundColor: '#111923',
      marginBottom: 5,
      marginTop: 5,
    },
    successDescription: {
        // color: '#FCFCFC',
        flex: 3,
        marginTop: 2,
        marginBottom: 2,
        marginLeft: 5,
        marginRight: 5,
    },
    successChecked: {
        // color: '#FCFCFC',
        flex: 1,
        marginTop: 2,
        marginBottom: 2,
        marginLeft: 2,
        marginRight: 2,
    }

});