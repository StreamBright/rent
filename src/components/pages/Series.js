import React, { Component } from 'react';
import  {
    View,
    Text,
    Alert,
    TextInput,
    Image,
    TouchableHighlight,
    StyleSheet,
    ListView,
    RefreshControl
} from 'react-native';

import { Card, Button } from 'react-native-elements';
import SeriesStyle from './SeriesStyle';

const Series = React.createClass({
    getInitialState() {
      return {
        refreshing: false,
        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})
      }
  },

  loadData () {
    return this.props.dataManager.get('serie');
  },

  handleApiResponse (response) {
    console.info('Serie page - Response from API arrived.');
    let self = this;
    if(response.ok) {
      response.json()
        .then((resumeItems) => {
          console.info('Serie page - Parsed data to JSON.');
          self.setState({
            refreshing: false,
            dataSource: self.state.dataSource.cloneWithRows(resumeItems.items)
          });
        });
    }
    else {
      console.error('Serie page - Fetching from API failed, status:' + response.status);
    }
  },

  componentWillMount () {
    console.info('Serie page - componentWillMount() invoked.');
    console.info('Serie page - fetching menu details from API.');
    this.loadData().then(this.handleApiResponse);
  },
  render: function() {
   return (
     <ListView contentContainerStyle={SeriesStyle.list}
       dataSource={this.state.dataSource}
       renderRow={this._renderRow}
     />
   );
  },

  _renderRow: function(rowData: string, sectionID: number, rowID: number) {
    var self = this;
    return (
      <TouchableHighlight onPress={() => console.log(rowID)} >
          <View style={SeriesStyle.row} >
            <Image
                style={SeriesStyle.logo}
                source={{uri: self.props.dataManager.getApiBaseUrl() + rowData.logoSrc}} />
            <Text
                style={SeriesStyle.text}>
                  {rowData.title}
            </Text>
          </View>
      </TouchableHighlight>
    );
  }
});

export default Series;
