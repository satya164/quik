import React, { Component } from 'react';
import Radium from 'radium';

const styles = {
    container: {
        margin: 16,
        fontFamily: 'sans-serif',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#443b5d'
    }
};

class MyComponent extends Component {
    render() {
        return <div style={styles.container}>Hello world!</div>;
    }
}

export default Radium(MyComponent);
