import { Pane } from "tweakpane";
import type { Parameters } from "./analyzer";

export function createGUI(parameters: Parameters) {
    const pane = new Pane()

    pane.addBinding(parameters, 'flou', {
        min: 0,
        max: 30,
        step: 0.1
    })

    pane.addBinding(parameters, 'glow', {
        min: 0,
        max: 100,
        step: 1
    })

    pane.addBinding(parameters, 'couleurCercle')

    pane.addBinding(parameters, 'steps', {
        min: 3,
        max: 130,
        step: 1
    })

    pane.addBinding(parameters, 'opaciteFond', {
        min: 0,
        max: 100,
        step: 1
    })

    pane.addBinding(parameters, 'modeFusion', {
        options: {
            normal: 'source-over',
            lighter: 'lighter',
            multiply: 'multiply',
            screen: 'screen',
            overlay: 'overlay',
            darken: 'darken',
            lighten: 'lighten',
            'color-dodge': 'color-dodge',
            'color-burn': 'color-burn',
            'hard-light': 'hard-light',
            'soft-light': 'soft-light',
            difference: 'difference',
            exclusion: 'exclusion',
            hue: 'hue',
            saturation: 'saturation',
            color: 'color',
            luminosity: 'luminosity',
            xor: 'xor'
        }
    })

    pane.addBinding(parameters, 'couleurParticules')
}