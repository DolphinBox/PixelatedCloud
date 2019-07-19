import React, {Component} from 'react';
import {View} from 'react-native';
import {Card, Text, Button} from 'react-native-elements';
import {startSOCKS} from '../BridgeAPI/Actions';

export class MainScreen extends Component {
    constructor(props) {
        super(props);
    }

    async callStartSOCKS() {
        let status = await startSOCKS();
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Card>
                    <Text>Welcome to PixelatedClouds!</Text>
                    <Button
                        title="Start SOCKS Proxy"
                        onPress={() => this.callStartSOCKS()}
                    />
                </Card>
            </View>
        );
    }
}
