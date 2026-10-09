import { Pane } from "tweakpane";
import type { Parameters } from "./analyzer";

export function createGUI(parameters: Parameters) {
    const pane = new Pane()

    const f1 = pane.addFolder({
        title: 'Particles',
    });

    const f2 = pane.addFolder({
        title: 'Circle/Bubble',
    });

    f1.addBinding(parameters, 'numberParticles', {
        min: 1,
        max: 10,
        step: 1
    })

    f1.addBinding(parameters, 'particlesSize', {
        min: 1,
        max: 50,
        step: 1
    })

    f1.addBinding(parameters, 'glowParticles', {
        min: 0,
        max: 30,
        step: 0.1
    })

    f1.addBinding(parameters, 'shadowSize', {
        min: 1,
        max: 50,
        step: 1
    })

    f2.addBinding(parameters, 'blur', {
        min: 0,
        max: 30,
        step: 0.1
    })

    f2.addBinding(parameters, 'glowCircle', {
        min: 0,
        max: 100,
        step: 1
    })

    f2.addBinding(parameters, 'circleColor')

    f2.addBinding(parameters, 'steps', {
        min: 3,
        max: 130,
        step: 1
    })

    pane.addBinding(parameters, 'bgOpacity', {
        min: 0,
        max: 100,
        step: 1
    })

    pane.addBinding(parameters, 'fusionMode', {
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
}