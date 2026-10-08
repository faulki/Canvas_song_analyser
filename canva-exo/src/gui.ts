import { Pane } from "tweakpane";
import type { Parameters } from "./main";

export function createGUI(parameters: Parameters) {
    const pane = new Pane()

    pane.addBinding(parameters, 'pointerDamping', {
        step: 0.0001
    })
}