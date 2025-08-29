import Scenes from "./Scenes";
import WebsocketInputs from "./WebsocketInputs";

function Obs() {
  return (
    <div className="flex flex-col gap-4">
      <WebsocketInputs />
      <div className="border-2"></div>
      <Scenes />
    </div>
  );
}
export default Obs;