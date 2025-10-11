import { useParams } from "react-router-dom";

export default function Event() {
  const { _id: eventID } = useParams();

  return <div>Event {eventID}</div>;
}
