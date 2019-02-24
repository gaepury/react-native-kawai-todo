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
  AsyncStorage
} from 'react-native';
import { AppLoading } from 'expo';
import uuidv1 from 'uuid/v1';
import ToDo from './components/ToDo';

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
    loadToDos: false,
    toDos: {
    }
  };

  componentDidMount() {
    this._loadToDos();
  }

  _controllNewToDo = text => {
    this.setState({ newTodo: text });
  };

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem('toDos');
      this.setState({ loadToDos: true, toDos: JSON.parse(toDos) });
    } catch(err) {
      console.log(err)
    };
  };

  _addToDoo = () => {
    const { newTodo } = this.state;

    if (newTodo !== '') {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToOoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newTodo,
            createdAt: Date.now()
          }
        };

        const newState = {
          ...prevState,
          newTodo: '',
          toDos: {
            ...prevState.toDos,
            ...newToOoObject
          }
        };
        this._saveToDos(newState.toDos);
        return { ...newState }
      })
    }
  };

  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState }
    })
  };

  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false,
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState }
    })
  };

  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true,
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState }
    })
  };

  _updateToDo = (id, text) => {
    console.log(id, text);
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState }
    })
  };

  _saveToDos = newToDos => {
    console.log(JSON.stringify(newToDos));
    const saveToDos = AsyncStorage.setItem('toDos', JSON.stringify(newToDos))
  };

  render() {
    const { newTodo, loadToDos, toDos } = this.state;

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
            onChangeText={this._controllNewToDo}
            placeholderTextColor={'#999'}
            returnKeyType={'done'}
            autoCorrect={false}
            onSubmitEditing={this._addToDoo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).reverse().map(toDo => (
              <ToDo
                key={toDo.id}
                uncompleteToDo={this._uncompleteToDo}
                completeToDo={this._completeToDo}
                updateToDo={this._updateToDo}
                deleteToDo={this._deleteToDo}
                {...toDo}/>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default App;

