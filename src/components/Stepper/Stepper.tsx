import React from 'react';
import { Button, createMuiTheme, Theme, ThemeProvider, Tooltip, withStyles } from '@material-ui/core';
import './Stepper.scss';
import '../../styles/variables.scss';
import { LIFE_ASPECTS, MATERIAL_FORM_THEME } from '../../config/constants';
import { LifeAspect } from '../../models/LifeAspect';

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
    private readonly REQUIRED_SELECTION_COUNT = 8;

    constructor(props: any) {
        super(props);

        this.state = {
            activeStep: 0
        };

        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    get confirmButtonDisabled() {
        return !this.requiredAspectsSelected;
    }

    get confirmButtonText() {
        return 'Next';
    }

    get requiredAspectsSelected() {
        return this.state.selectedAspects && this.state.selectedAspects.length === this.REQUIRED_SELECTION_COUNT;
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
                            color={this.aspectIsSelected(aspect) ? 'secondary' : 'default'}
                            className="aspect-button"
                            onClick={(e) => { this.handleSelection(e, aspect) }}
                            disabled={this.requiredAspectsSelected && !this.aspectIsSelected(aspect)}
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
                    <h2>Wheel of Life</h2>
                    <div>
                        {
                            this.state.activeStep === 0
                            ?
                                <>
                                    <h3>Choose the top 8 life categories most important to you</h3>
                                    <div id="wol-aspect-rows-container">
                                        {this.aspectSelectionElementRows}
                                    </div>
                                </>
                            : <p>Not on first page</p>
                        }

                        <div id="wol-button-actions-row">
                            <Button disabled={this.state.activeStep === 0} onClick={this.handleBack}>
                                Back
                            </Button>
                            <Button disabled={this.confirmButtonDisabled} variant="contained" color="primary" onClick={this.handleNext}>
                                {this.confirmButtonText}
                            </Button>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        );
    }

    aspectIsSelected(aspect: LifeAspect) {
        return this.state.selectedAspects && this.state.selectedAspects.some((a: LifeAspect) => a.name === aspect.name);
    }

    handleBack(event: any): void {
        event.preventDefault();

        this.setState({ activeStep: this.state.activeStep - 1 });
    }

    handleNext(event: any): void {
        event.preventDefault();

        this.setState({ activeStep: this.state.activeStep + 1 });
    }

    handleSelection(event: any, aspect: LifeAspect) {
        event.preventDefault();

        let selectedAspects = this.state.selectedAspects;

        if ( selectedAspects ) {
            if ( this.aspectIsSelected(aspect) ) {
                selectedAspects = selectedAspects.filter((a: LifeAspect) => a.name !== aspect.name);
            } else {
                selectedAspects.push(aspect);
            }
        } else {
            selectedAspects = [ aspect ];
        }

        this.setState({ selectedAspects: selectedAspects });
    }
}