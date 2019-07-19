/**
 * Cloudix App
 */

import React, {Component} from 'react';
import {View, Alert} from 'react-native';
import {Card, Text, Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator, createAppContainer } from "react-navigation";

import {startNodeProcess} from './BridgeAPI/Main';
import {connectSSH} from './BridgeAPI/Actions';

// Screens
import {MainScreen} from './Screens/MainScreen';

class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            host: "",
            user: "",
            pass: "",
            port: ""
        }
    }

    componentDidMount() {
        startNodeProcess();
    }

    async callConnectSSH() {
        let status = await connectSSH(this.state.host, this.state.port, this.state.user, this.state.pass);
        if(true) {
            this.props.navigation.navigate('MainScreen')
        } else {
            Alert.alert('Error', 'Could not connect to the Server...');
        }
    }

    render() {
        return (
            <View style={containerStyle}>
                <Card>
                    <Text h4>Placeholder Text</Text>
                    <Input
                        placeholder='Host'
                        leftIcon={{ type: 'font-awesome', name: 'server' }}
                        onChangeText={(host) => this.setState({host})}
                        value={this.state.host}
                    />

                    <Input
                        placeholder='Port'
                        leftIcon={{ type: 'font-awesome', name: 'globe' }}
                        onChangeText={(port) => this.setState({port})}
                        value={this.state.port}
                    />


                    <Input
                        placeholder='Username'
                        leftIcon={{ type: 'font-awesome', name: 'user' }}
                        onChangeText={(user) => this.setState({user})}
                        value={this.state.user}
                    />

                    <Input
                        placeholder='Password'
                        secureTextEntry={true}
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={(pass) => this.setState({pass})}
                        value={this.state.pass}
                    />
                    <Text> </Text>
                    <Button
                        title="Connect"
                        style={{width: '100%'}}
                        onPress={() => this.callConnectSSH()}
                    />
                </Card>
            </View>
        );
    }
}

const containerStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
};

/* React Navigation */
const AppNavigator = createStackNavigator(
    {
        LoginScreen: LoginScreen,
        MainScreen: MainScreen
    },
    {
        initialRouteName: "LoginScreen"
    }
);
const AppContainer = createAppContainer(AppNavigator);
export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}
