import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const Main = ({ children }: React.PropsWithChildren) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <main className="w-full h-full overflow-y-auto">{children}</main>
    </DndProvider>
  );
};
