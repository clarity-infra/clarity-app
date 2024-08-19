import { ClassicPreset } from "rete";

export class ApplicationNode extends ClassicPreset.Node {
    height = 140;
    width = 200;
  
    constructor(options: {
        name: string
        // socket: ClassicPreset.Socket
    }) {
      super(options.name);
  
      this.addControl("a", new ClassicPreset.InputControl("text", {}));
      // this.addOutput("a", new ClassicPreset.Output(options.socket));
    }
}