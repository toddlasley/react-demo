import React, { ChangeEvent, FormEvent } from 'react';
import { TextField, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Chart } from './Chart/Chart';
import './Form.scss';
import '../../styles/variables.scss';
import { MATERIAL_FORM_THEME } from '../../config/constants';

interface Input {
    type: string;
    name: string;
}

const theme = createMuiTheme(MATERIAL_FORM_THEME);

export class Form extends React.Component {
    private readonly MIN_CATEGORIES = 6;
    private readonly MIN_CATEGORY_VALUE = 0;
    private readonly MAX_CATEGORY_VALUE = 10;
    private readonly CATEGORY_INPUT_TYPE = 'category';
    private readonly VALUE_INPUT_TYPE = 'value';
    
    private formRef: React.RefObject<HTMLFormElement>;
    public inputs: Input[] = [];

    public state: any;

    constructor(props: any) {
        super(props);

        this.formRef = React.createRef();

        this.state = {};

        for ( let i = 0; i < this.MIN_CATEGORIES; i++ ) {
            this.inputs.push(
                {
                    type: this.CATEGORY_INPUT_TYPE,
                    name: this.CATEGORY_INPUT_TYPE + i.toString()
                },
                {
                    type: this.VALUE_INPUT_TYPE,
                    name: this.VALUE_INPUT_TYPE + i.toString()
                }
            );
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        const rows: JSX.Element[] = [];

        for ( let i = 0; i < this.inputs.length; i += 2 ) {
            const categoryInput = this.inputs[i];
            const valueInput = this.inputs[i + 1];

            rows.push(
                <div className="input-row">
                    <ThemeProvider theme={theme}>
                        <TextField
                            variant="filled"
                            type="text"
                            label="Category"
                            className="text-input"
                            key={categoryInput.name}
                            name={categoryInput.name}
                            onChange={(e) => this.handleValueChange(e, categoryInput)}
                            error={this.state[this.getErrorKey(categoryInput.name)]}
                        />
                        <TextField
                            variant="filled"
                            type="number"
                            label="Value"
                            className="number-input"
                            key={valueInput.name}
                            name={valueInput.name}
                            onChange={(e) => this.handleValueChange(e, valueInput)}
                            error={this.state[this.getErrorKey(valueInput.name)]}
                        />
                    </ThemeProvider>
                </div>
            );
        }

        this.inputs.forEach((input, index) => {
        });

        return (
            <form ref={this.formRef} onSubmit={this.handleSubmit}>
                {rows}
                <input type="submit" value="Submit" />
            </form>
        );
    }

    private handleValueChange(event: ChangeEvent<any>, input: Input) {
        event.preventDefault();
        const newState: any = {};

        if ( input.type === this.VALUE_INPUT_TYPE ) {
            newState[this.getErrorKey(input.name)] = this.fieldHasError(event.target.value);
        }

        this.setState(newState);
    }

    private handleSubmit(event: FormEvent<any>) {
        event.preventDefault();
        console.log(this.formRef);
    }

    private fieldHasError(value: number): boolean {
        const error = isNaN(value) || value < this.MIN_CATEGORY_VALUE || value > this.MAX_CATEGORY_VALUE;
        console.log(error);
        return error;
    }

    private getErrorKey(inputName: string) {
        return inputName + 'Error';
    }
}