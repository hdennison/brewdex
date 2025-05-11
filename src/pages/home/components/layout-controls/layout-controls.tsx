import { ReactiveComponent } from "@/lib/reactive-component/reactive-component";
import { layoutModes, type LayoutStore } from "../../home.store";
import { Icon, type IconName } from "@/lib/icon/icon";

export class LayoutControls extends ReactiveComponent<LayoutStore> {
  constructor(props: { store: LayoutStore }) {
    super(props)
  }

  render(): Node {
    const currentMode = this.store.get()[0];

    return (
      // @ts-expect-error @TODO: Tell TS about Fragments
      <>
        {layoutModes.map(mode => (
          <button
            type="button"
            aria-pressed={currentMode === mode}
            aria-label={`"Switch to ${mode} view"`}
            title={`"Switch to ${mode} view"`}
            onClick={() => this.store.set([mode])}
          >
            <Icon name={mode as IconName} />
          </button>
        ))}
      </>
    )
  }
}