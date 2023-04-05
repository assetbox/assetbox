import { useState } from "react";

import { ReactComponent as Picture } from "./assets/icons/picture.svg";
import { ReactComponent as PictureActive } from "./assets/icons/picture-active.svg";
import { Gallery, Toggle } from "./components";

const App = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Toggle
        active={toggle}
        onClick={() => setToggle(!toggle)}
        component={<Picture height={56} />}
        activeComponent={<PictureActive height={56} />}
      />

      <div style={{ width: "100%" }}>{toggle ? <Gallery /> : null}</div>
    </div>
  );
};

export default App;
