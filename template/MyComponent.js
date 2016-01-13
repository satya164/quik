import React, { Component } from 'react';
import Radium from 'radium';

import CSS from './styles.scss';

const styles = {
    container: {
        maxWidth: 900,
        margin: '0 auto'
    }
};

class MyComponent extends Component {
    render() {
        return (
            <div style={styles.container}>
                <h1>Hello world!</h1>
            </div>
        );
    }
}

export default Radium(MyComponent);
