/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

import { Buffer } from "buffer";

if (typeof window !== "undefined") {
    (window as any).Buffer = Buffer;
}


render(() => <App />, document.getElementById("root") as HTMLElement);
