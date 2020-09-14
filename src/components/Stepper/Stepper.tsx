import React from 'react';
import { Button, createMuiTheme, Theme, ThemeProvider, Tooltip, withStyles } from '@material-ui/core';
import './Stepper.scss';
import '../../styles/variables.scss';
import { LIFE_ASPECTS, MATERIAL_FORM_THEME } from '../../config/constants';

const theme = createMuiTheme(MATERIAL_FORM_THEME);

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: 'black',
        color: 'white',
        fontSize: theme.typography.pxToRem(12)
    },
}))(Tooltip);

export class Stepper extends React.Component {
    public state: any;

    private readonly MAX_ASPECTS_PER_ROW = 3;

    constructor(props: any) {
        super(props);

        this.state = {
            activeStep: 0
        };        
    }

    get nextButtonDisabled() {
        return true;
    }

    get confirmButtonText() {
        return 'Next';
    }

    get aspectSelectionElementRows(): JSX.Element[] {
        const rows = [];

        for(let row = 0; row < Math.ceil(LIFE_ASPECTS.length / this.MAX_ASPECTS_PER_ROW); row++) {
            const startingIndex = row * this.MAX_ASPECTS_PER_ROW;
            const aspects = LIFE_ASPECTS.slice(startingIndex, startingIndex + this.MAX_ASPECTS_PER_ROW);
            const buttons: JSX.Element[] = [];

            aspects.forEach((aspect) => {
                buttons.push(
                    <HtmlTooltip
                        key={'tooltip' + aspect.name}
                        title={aspect.description}
                        placement="top-start"
                    >
                        <Button
                            key={aspect.name}
                            variant="contained"
                            color="primary"
                            className="aspect-button"
                        >
                            {aspect.name}
                        </Button>
                    </HtmlTooltip>
                );
            });

            while ( buttons.length < this.MAX_ASPECTS_PER_ROW ) {
                buttons.push(
                    <span key={'faux' + buttons.length.toString()} className="faux-button"></span>
                );
            }

            rows.push(
                <div key={'row' + row.toString()} className="button-row">
                    {buttons}
                </div>
            );
        }

        return rows;
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div>
                    <div>
                        {
                            this.state.activeStep === 0
                            ?
                                <div id="aspect-rows-container">
                                    {this.aspectSelectionElementRows}
                                </div>
                                
                            : <p>Not on first page</p>
                        }

                        <div>
                            <Button disabled={this.state.activeStep === 0} onClick={this.handleBack}>
                                Back
                            </Button>
                            <Button disabled={this.nextButtonDisabled} variant="contained" color="primary" onClick={this.handleNext}>
                                {this.confirmButtonText}
                            </Button>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        );
    }

    handleBack(event: any): void {
        event.preventDefault();

        this.setState({ activeStep: this.state.activeStep - 1 });
    }

    handleNext(event: any): void {
        event.preventDefault();

        this.setState({ activeStep: this.state.activeStep + 1 });
    }
}