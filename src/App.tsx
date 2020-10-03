import React from 'react';
import { Stepper } from './components/Stepper/Stepper';
import './App.scss';


export class App extends React.Component {
    // eslint-disable-next-line
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div id="wol-app-container">
                <Stepper />
            </div>
        );
    }
}
