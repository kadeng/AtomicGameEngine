
import EditorUI = require("../ui/EditorUI");
import UIEvents = require("../ui/UIEvents");
import AssetImport = require("../assets/AssetImport");

import EditorEvents = require("./EditorEvents");

class Editor extends Atomic.ScriptObject {

    project: ToolCore.Project;
    assetImport: AssetImport;

    static instance: Editor;

    constructor() {

        super();

        Editor.instance = this;

        EditorUI.initialize();

        Atomic.getResourceCache().autoReloadResources = true;

        this.assetImport = new AssetImport();

        this.parseArguments();

        this.subscribeToEvent(EditorEvents.LoadProject, (data) => this.handleEditorLoadProject(data));
        this.subscribeToEvent(EditorEvents.Quit, (data) => this.handleEditorEventQuit(data));

    }

    handleEditorLoadProject(event: EditorEvents.LoadProjectEvent): boolean {

        var system = ToolCore.getToolSystem();

        if (system.project) {

            this.sendEvent(UIEvents.MessageModalEvent,
                { type: "error", title: "Project already loaded", message: "Project already loaded" });

            return false;

        }

        return system.loadProject(event.path);

    }

    parseArguments() {

        var args = Atomic.getArguments();

        var idx = 0;

        while (idx < args.length) {

            if (args[idx] == "--project") {

                this.sendEvent(EditorEvents.LoadProject, {path: args[idx + 1]});

            }

            idx++;

        }

    }

    // event handling

    handleEditorEventQuit(data) {

      Atomic.getEngine().exit();

    }


}

export = Editor;
