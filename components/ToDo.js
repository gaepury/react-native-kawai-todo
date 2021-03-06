import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput
} from 'react-native';
import PropTyeps from 'prop-types';
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 30,
  },
  completedCircle: {
    borderColor: '#bbb',
  },
  unCompletedCircle: {
    borderColor: '#F23657',
  },
  text: {
    fontWeight: '600',
    fontSize: 20,
    marginVertical: 20
  },
  completedText: {
    color: '#bbb',
    textDecorationLine: 'line-through',
  },
  unCompletedText: {
    color: '#353839',
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  input: {
    marginVertical: 20,
    width: width / 2,
  }
});

class ToDo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      todoValue: props.text
    };
  }

  static propTypes = {
    text: PropTyeps.string.isRequired,
    isCompleted: PropTyeps.bool.isRequired,
    deleteToDo: PropTyeps.func.isRequired,
    uncompleteToDo: PropTyeps.func.isRequired,
    completeToDo: PropTyeps.func.isRequired,
    updateToDo: PropTyeps.func.isRequired,
    id: PropTyeps.string.isRequired
  };

  _toggleComplete = event => {
    event.stopPropagation();
     const { id, isCompleted, completeToDo, uncompleteToDo } = this.props;

     if (isCompleted) {
       uncompleteToDo(id);
     } else {
       completeToDo(id);
     }
  };

  _startEditing = event => {
    event.stopPropagation();
    this.setState({isEditing: true});
  };

  _finishEditing = event => {
    event.stopPropagation();
    const { todoValue } = this.state;
    const { id, updateToDo } = this.props;
    updateToDo(id, todoValue);
    this.setState({isEditing: false});
  };

  _controlInput = text => {
    this.setState({ todoValue: text });
  };

  render() {
    const { isEditing, todoValue } = this.state;
    const { text, id, isCompleted, deleteToDo } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toggleComplete}>
            <View
              style={
                [styles.circle, isCompleted ? styles.completedCircle : styles.unCompletedCircle ]
              }
            />
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              style={[styles.text, styles.input, isCompleted ? styles.completedText : styles.unCompletedText]}
              value={todoValue}
              multiline={true}
              onChangeText={this._controlInput}
              returnKeyType={'done'}
              onBlur={this._finishEditing}
              underlineColorAndroid={'transparent'}
            />
          ) : (
            <Text
              style={[styles.text, isCompleted ? styles.completedText : styles.unCompletedText]}
            >
              {text}
            </Text>
          )}

        </View>
        {isEditing ? (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✅</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._startEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✏️</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPressOut={(event) => {
              event.stopPropagation();
              deleteToDo(id);
            }}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>❌</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

export default ToDo;
