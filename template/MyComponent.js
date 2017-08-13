import React, { Component } from 'react';

const styles = css`
  .container {
    margin: 16px;
    font-family: sans-serif;
    font-size: 24px;
    font-weight: bold;
    color: #443b5d;
  }
`;

export default class MyComponent extends Component {
  render() {
    return <div className={styles.container}>Hello world!</div>;
  }
}
