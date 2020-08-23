import React from 'react';
import { Form } from './components/Form/Form';
import logo from './logo.jpg';
import './App.scss';


export class App extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>
                <div id="app-nav-bar">
                    {/* <img src={logo} alt="Logo" /> */}
                    <h1>
                        React App
                    </h1>
                </div>
                <div id="app-container">
                    <h2>Complete Your Wheel of Life</h2>
                    <Form />
                </div>
            </>
        );
    }
}
