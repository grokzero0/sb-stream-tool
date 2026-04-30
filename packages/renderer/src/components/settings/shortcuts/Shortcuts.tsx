import { Button } from "@renderer/components/ui/button";
import { sendToastMessage } from "@renderer/components/ui/toast";
import { ActionToName } from "@renderer/utils/helpers";
import { Shortcut } from "@renderer/zustand/slices/shortcutsSlice";
import { Action } from "@app/common";
import { useSettingsStore } from "@renderer/zustand/store";
import { formatForDisplay, useHotkeyRecorder } from "@tanstack/react-hotkeys";
import { useState } from "react";

function Shortcuts() {
  const savedShortcuts = useSettingsStore((state) => state.shortcuts);
  const update = useSettingsStore((state) => state.updateKeys);
  const [keybinds, setKeybinds] = useState(new Map(savedShortcuts));
  const [editedShortcuts, setEditedShortcuts] = useState<Shortcut[]>([]);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const recorder = useHotkeyRecorder({
    onRecord: (hotkey) => {
      if (editingAction) {
        setKeybinds((keys) => keys.set(editingAction, hotkey));
        setEditedShortcuts((prev) => [
          ...prev,
          { action: editingAction, hotkey: hotkey },
        ]);
      }
    },

    onCancel: () => {
      setEditingAction(null);
    },
  });
  return (
    <form
      className="flex flex-col gap-4 w-full p-2"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("reached");
        update(editedShortcuts);
        sendToastMessage("Keybinds", "Keybinds successfully updated!");
      }}
    >
      <h1 className="text-center">Keyboard shortcuts settings</h1>
      <div>
        {Array.from(keybinds).map(([action, hotkey]) => (
          <div key={action} className="flex justify-between">
            <span>{ActionToName[action]}</span>
            <div className="flex gap-2">
              <span>{formatForDisplay(hotkey)}</span>
              <Button
                type="button"
                onClick={() => {
                  setEditingAction(action);
                  recorder.startRecording();
                }}
                disabled={editingAction === action && recorder.isRecording}
              >
                {editingAction === action && recorder.isRecording
                  ? "Editing..."
                  : "Press Keys"}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button type="submit">Save keybind settings</Button>
      <Button
        type="button"
        onClick={() => {
          setKeybinds(new Map(savedShortcuts));
          sendToastMessage(
            "Keybinds",
            "Keybinds successfully reset to default!",
          );
        }}
      >
        Reset all keybinds
      </Button>
    </form>
  );
}

export default Shortcuts;
