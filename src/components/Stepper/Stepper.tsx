import React from 'react';
import { createMuiTheme } from '@material-ui/core';
import './Stepper.scss';
import '../../styles/variables.scss';
import { MATERIAL_FORM_THEME } from '../../config/constants';

const theme = createMuiTheme(MATERIAL_FORM_THEME);

export class Stepper extends React.Component {
    public state: any;

    constructor(props: any) {
        super(props);

        this.state = {};
    }

    render() {
        return <p>Hello</p>;
    }
}