import { ClassicPreset, NodeEditor } from "rete";
import { AreaExtensions, AreaPlugin } from "rete-area-plugin";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import { Presets, VuePlugin, type VueArea2D } from "rete-vue-plugin";
import { ApplicationNode } from "./nodes/container";
import { ZoomHendler } from "./hendlers/zoom";

type AreaExtra = VueArea2D<any>;

export const useInfrastructureEditor = (elementRef: Ref) => {
    const editor = new NodeEditor<any>();
    const connection = new ConnectionPlugin<any, AreaExtra>();
    const render = new VuePlugin<any, AreaExtra>();
    const area = new AreaPlugin<any, AreaExtra>(elementRef.value);

    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl()
    });

    render.addPreset(Presets.classic.setup());
    connection.addPreset(ConnectionPresets.classic.setup());

    editor.use(area);
    area.use(connection);
    area.use(render);

    AreaExtensions.simpleNodesOrder(area);

    AreaExtensions.zoomAt(area, editor.getNodes());

    area.area.setZoomHandler(
        new ZoomHendler(0.5, 200, "cubicBezier(.45,.91,.49,.98)", area)
    );

    function addApplication() {
        const node = new ApplicationNode({ name: 'test' });
        editor.addNode(node);
    }

    return {
        backstage: {
            editor,
            connection,
            render,
            area
        },
        addApplication
    }
}