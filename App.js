import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { AppLoading } from 'expo'
import Todo from './components/Todo'

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginTop: 50,
    marginBottom: 30,
    fontWeight: '400',
  },
  card: {
    backgroundColor: 'white',
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50, 50, 50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      },
    }),
  },
  input: {
    padding: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 25,
  },
  toDos: {
    alignItems: 'center'
  },
});

class App extends Component {
  state = {
    newTodo: '',
    loadToDos: false
  };

  componentDidMount() {

  }

  _controllNewTodo = text => {
    this.setState({ newTodo: text })
  };

  _loadToDos = () => {
    this.setState({ loadToDos: true })
  };

  render() {
    const { newTodo, loadToDos } = this.state;

    if (!loadToDos) {
      return <AppLoading/>
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content'/>
        <Text style={styles.title}>Kawai To do</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={'New To Do'}
            value={newTodo}
            onChangeText={this._controllNewTodo}
            placeholderTextColor={'#999'}
            returnKeyType={'done'}
            autoCorrect={false}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            <Todo text={'Hello i`m a to do'}/>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default App;

