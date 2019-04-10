import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, TouchableHighlight} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {AsyncStorage} from 'react-native';


export default class Home extends Component {

    state = {
        successList: [],
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
        this.state.successList = require('../success.json');
        this.state.backupSuccessList = this.state.successList;
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
                storedSuccess.unlocktime = achieved != 0 ? date.toDateString() : 'Never complete';
            }
        }
    }

    getSuccessByName = (name) => {
        for(let success of this.state.successList){
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

    
    updateFilter = (success) => {

        console.log("updating list...")

        // update conditions
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

        this.setState(previousState => { 
            let newSuccessList = previousState.backupSuccessList.filter(success => this.successMatching(success));
            return {successList: newSuccessList};
        });
    }



    // Pour recup les datas qu'une fois et au démarrage (sinon constructor)
    componentWillMount(){
        this.getLocalAchievmentsDatas();
        this.putApiInfos();
    }

    render(){
    

        console.log('render');
        console.log(this.state.successList);

        return(
            <React.Fragment >
                <FlatList
                    style = {flex = 1}
                    keyExtractor = {(item, index) => item.name}
                    data={this.state.successList}
                    renderItem={({item}) => (
                        <TouchableHighlight
                            onPress={() => this.updateFilter(item)}
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
    successContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#fafafa',
      marginBottom: 5,
      marginTop: 5,
    },
    successDescription: {
        flex: 3,
        marginTop: 2,
        marginBottom: 2,
        marginLeft: 2,
        marginRight: 2,
    },
    successChecked: {
        flex: 1,
        marginTop: 2,
        marginBottom: 2,
        marginLeft: 2,
        marginRight: 2,
    }

});